import PubSub from 'pubsub-js';
import {PUB_SUB_KEY} from 'js/utils/helpers/const';

export const HTTP_METHOD = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST_FORM_DATA: 'POST_FORM_DATA',
  POST_FILE: 'POST_FILE',
};

export const RESPONSE_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
};

export const API_ERROR_CODE = {
  NO_AUTH_SERVICE: 'no-auth-service',
};

function CustomError(message, data) {
  const customError = new Error(message);
  customError.data = data;

  return customError;
}
CustomError.prototype = Object.create(Error.prototype);

export default class ApiBase
{
  constructor(options) {
    this.isInitialized = false;
    this.host = '';
    this.baseUrl = '';
    this.authService = null;
    if (options) {
      console.log('init');
      this.init(options);
    }
  }

  /**
   * initialize
   * @param {Object} options
   * @param {string} options.protocol
   * @param {string} options.host
   * @param {string} options.port
   * @param {string} options.prefix
   * @param {ApiBase} options.authService
   */
  init (options = {}) {
    const protocol = /^https?:$/.test(options.protocol) ? options.protocol : location.protocol;
    const hostname = options.host || location.hostname;
    const port = /^\d{1,5}$/.test(options.port) ? options.port : location.port;
    const colon = port ? ':' : '';
    const prefix = options.prefix ? options.prefix : '';
    const separateSlash = /^\//.test(prefix) ? '' : '/';

    this.baseUrl = protocol + '//' + hostname + colon + port + separateSlash;
    this.host = this.baseUrl;

    if (prefix.length > 0) {
      const trailingSlash = /\/$/.test(prefix) ? '' : '/';
      this.baseUrl += prefix + trailingSlash;
    }

    this.authService = options.authService || null;
    this.isInitialized = true;
  }

  /**
   *
   * @param {Array} endpointArray - [url, method, needAuth]
   * @param {Array} pathBind - url param
   * @param {Object} data - request body
   * @returns {*}
   * @throws {CustomError} - {message, result}
   */
  request(endpointArray, pathBind = [], data) {
    if (!this.isInitialized) {
      throw new Error('not-initialized');
    }

    if (!Array.isArray(endpointArray) || endpointArray.length < 3) {
      throw new Error('invalid-endpoint');
    }

    const [path, method, needAuth] = endpointArray;
    const bindedPath = this.bindPath(path, pathBind);

    return ((x) => {
      switch (x) {
        case HTTP_METHOD.POST:
          return this.post(bindedPath, data, needAuth);
        case HTTP_METHOD.GET:
          return this.get(bindedPath, data, needAuth);
        case HTTP_METHOD.PUT:
          return this.put(bindedPath, data, needAuth);
        case HTTP_METHOD.DELETE:
          return this.delete(bindedPath, data, needAuth);
        case HTTP_METHOD.POST_FORM_DATA:
          return this.postFormData(bindedPath, data, needAuth);
        case HTTP_METHOD.POST_FILE:
          return this.postFile(bindedPath, data, needAuth);
        default:
          throw new Error('invalid-method');
      }
    })(method)
      .then(response => response.json())
      .then(dataJson => {
        if (dataJson.status !== RESPONSE_STATUS.SUCCESS) {
          throw CustomError(dataJson.message || 'unknown error', dataJson.data);
        }
        
        return dataJson.data !== undefined ? dataJson.data : dataJson.result;
      }).catch(error => {
        let message = error.message;
        if (error.data && Array.isArray(error.data) && error.data.length) {
          const firstError = error.data[0];
          const {errorCode, errorMessage} = firstError;
          message = errorCode || errorMessage;
        }

      if (error.result.errorCode === 'deactive_shop') {
        PubSub.publish(PUB_SUB_KEY.DEACTIVE_SHOP, null);
        throw CustomError('deactive_shop', error.result);
      }

        throw CustomError(message, error.data);
      })
  }

  bindPath(path, bind) {
    if (!path || !Array.isArray(bind)) {
      return path;
    }

    // bind is empty array ---> remove placeholder
    if (Array.isArray(bind) && bind.length === 0) {
      return path.replace(/\/\$\d/g, '');
    }

    return path.replace(/\$\d/g, (match) => {
      const idx = parseInt(match.replace('$', ''), 10);
      const param = bind[idx];
      if (typeof param === 'undefined') {
        return match;
      }

      return param;
    });
  }

  /**
   * @param {String} method
   * @param {Object} data
   * @param {Boolean} needAuth
   * @return {Promise<object>}
   */
  getFetchOptions(method, data = null, needAuth) {
    if (!method) {
      return null;
    }

    const options = {
      method: method,
      cache: 'no-cache',
      mode: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      referrer: 'no-referrer',
      redirect: 'follow',
    };

    if (method === HTTP_METHOD.POST_FORM_DATA || method === HTTP_METHOD.POST_FILE) {
      options.method = HTTP_METHOD.POST;
      options.headers = {
        Accept: 'application/json',
      };
      options.body = data;
    } else if (method !== HTTP_METHOD.GET) {
      // POST, PUT, DELETE
      options.body = JSON.stringify(data);
    }

    // Don't need to authenticate
    if (typeof needAuth === 'boolean' && !needAuth) {
      return Promise.resolve(options);
    }
    
    // User authentication
    if (typeof needAuth === 'string' && needAuth === 'user') {
      options.headers['OrderGroupId'] = localStorage.getItem('ordergroupHash');
      return Promise.resolve(options);
    }

    if (!this.authService) {
      return Promise.resolve(options);
    }

    // Shop authentication (using firebase)
    return this.authService.getIdToken().then((token) => {
      options.headers['Authorization'] = 'Bearer ' + token;

      return options;
    })
  }

  // Create
  post(path, data, needAuth = true) {
    const url = this.baseUrl + path;
    return this.getFetchOptions(HTTP_METHOD.POST, data, needAuth)
      .then((options) => {
        return fetch(url, options);
    })
  }

  postFormData(path, data, needAuth = true) {
    const url = this.baseUrl + path;
    let formData = new FormData();
    this.buildFormData(formData, data);

    return this.getFetchOptions(HTTP_METHOD.POST_FORM_DATA, formData, needAuth)
      .then((options) => {
        return fetch(url, options);
      });
  }

  buildFormData(formData, data, parentKey) {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach(key => {
        this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
      });
    } else {
      const value = data == null ? '' : data;
      formData.append(parentKey, value);
    }
  }

  postFile(path, file, needAuth = true) {
    const data = new FormData();
    data.append('file', file);
    const url = this.baseUrl + path;

    return this.getFetchOptions(HTTP_METHOD.POST_FILE, data, needAuth)
      .then((options) => {
        return fetch(url, options);
      });
  }

  // Retrieve
  get(path, data, needAuth = true) {
    const url = this.baseUrl + path + this.makeQueryString(data);
    return this.getFetchOptions(HTTP_METHOD.GET, data, needAuth)
      .then((options) => {
        return fetch(url, options);
      })
  }

  makeQueryString(data) {
    if (!data || Object.keys(data).length === 0) {
      return '';
    }
    return '?' + new URLSearchParams(data).toString();
  }

  // Update
  put(path, data, needAuth = true) {
    const url = this.baseUrl + path;
    return this.getFetchOptions(HTTP_METHOD.PUT, data, needAuth)
      .then((options) => {
        return fetch(url, options);
      });
  }

  // Delete
 delete(path, data, needAuth = true) {
   const url = this.baseUrl + path;
   return this.getFetchOptions(HTTP_METHOD.DELETE, data, needAuth)
     .then((options) => {
       return fetch(url, options);
     });
 }
}
