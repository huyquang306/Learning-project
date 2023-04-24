import ApiBase, {HTTP_METHOD as METHOD} from "../shared/api-base";
/*
 * Endpoint情報
 *
 * [url, method, needAuth]
 * url {string}
 * method {string}
 * options {Object}
 */

export const ENDPOINTS = {
  // Api for shop auth
  POST_AUTH_FORGOT_PASSWORD: ['auth/forgot-password', METHOD.POST, true],
  GET_AUTH_VERIFY_FORGOT_PASSWORD: ['auth/forgot-password/verify', METHOD.GET, true],
  POST_AUTH_RESET_PASSWORD: ['auth/reset-password', METHOD.POST, true],
  POST_VERIFY_CREATE_SHOP: ['shop/verify', METHOD.POST, true],
  GET_SYSTEM_CONFIG: ['system/configurations', METHOD.GET, false],
}

class ShopAuthApiService extends ApiBase {
  constructor(param) {
    super(param);
  }
  
  /**
   * auth forgot password
   * @param {string} email
   * @returns
   */
  async authForgotPassword(email = '') {
    return await this.request(ENDPOINTS.POST_AUTH_FORGOT_PASSWORD, [], { email: email });
  }
  
  /**
   * auth verify forgot password
   * @param {string} token
   * @returns
   */
  async authVerifyForgotPassword(token = '') {
    return await this.request(ENDPOINTS.GET_AUTH_VERIFY_FORGOT_PASSWORD, [], { token: token });
  }
  
  /**
   * auth reset password
   * @param {string} token
   * @param {string} password
   * @returns
   */
  async authResetPassword(password = '', token = '') {
    return await this.request(ENDPOINTS.POST_AUTH_RESET_PASSWORD, [], {
      token: token,
      password: password,
    });
  }
  
  /*
   * Verify tmp shop and create shop
   * @param {string} token
   */
  async verifyCreateShop(token = '') {
    return await this.request(ENDPOINTS.POST_VERIFY_CREATE_SHOP, [], { token: token });
  }
  
  /*
   * get system config
   * @param {string} hash id
   * @returns
   */
  async getSystemConfiguration() {
    return await this.request(ENDPOINTS.GET_SYSTEM_CONFIG, [], null);
  }
}

export default new ShopAuthApiService();