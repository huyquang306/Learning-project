/*
  Utils Class
 */

export default class Utils {
  constructor() {
  }
  static REFRESH_CYCLE_TIME_AGO() {
    return 5000; /* 5000ms */
  }
  
  static REFRESH_CYCLE_DATA() {
    return 30000; /* 30000ms */
  }
  
  static REFRESH_SECOND() {
    return 1000; /* 1s */
  }
  
  static REFRESH_FIVE_SECONDS() {
    return 5000; /* 5s */
  }
  
  /**
   * 電話番号変換
   */
  static addPhonePrefix(number, countryCode = 'VN') {
    if (countryCode !== 'VN') {
      return null;
    }
    if (/^\+/.test(number) || !/^0/.test(number)) {
      if (/^\+84/.test(number)) {
        return number;
      }
      return null;
    }
    return '+84' + number.replace(/^0/, '');
  }
  
  static trimPhonePrefix(number, countryCode = 'VN') {
    if (countryCode !== 'VN') {
      return null;
    }
    return number?.replace(/^\+84/, '0');
  }
  
  static get VALIDATE_PATTERN() {
    return {
      EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      PASSWORD: /^[a-zA-Z0-9!@#$%^&*()_+\-=?[\]]{8,128}$/,
      DATE: /^\d{4}-\d{2}-\d{2}$/,
      TIME: /^\d{1,2}(:\d{2}){1,2}$/,
      POSTAL: /^\d{7}$/,
      MOBILE_JP: /^0[789]0[0-9]{8}$/,
      MOBILE_JP_HYPHEN: /^0[789]0-?[0-9]{4}-?[0-9]{4}$/,
    };
  }
  
  /**
   * @param {string}  checkType
   * @param {string}  target
   */
  static validatePattern(checkType, target) {
    const pattern = this.VALIDATE_PATTERN[checkType];
    if (!pattern) {
      console.error('pattern key no match');
      return false;
    }
    return pattern.test(target);
  }
  
  /**
   * userAgent
   */
  static isAndroid() {
    return /android/.test(this.ua);
  }
  
  static isIos() {
    return /ip(hone|(o|a)d)/.test(this.ua) || this.isIpadOs();
  }
  
  static isIpadOs() {
    return /macintosh/.test(this.ua) && 'ontouchend' in document;
  }
  
  /**
   * @param {number} 0 - 99
   * @returns {string} '00' - '99'
   */
  static to2digit(number = 0) {
    const digits = ('00' + String(number).trim()).slice(-2);
    return /^\d\d$/.test(digits) ? digits : '00';
  }
  
  /**
   * @param {string} 'HH:mm(:ss)'
   * @returns {number}  minutes
   */
  static hhmm2minutes(hhmm = '00:00') {
    if (!this.validatePattern('TIME', hhmm)) {
      return 0;
    }
    const [hh, mm] = hhmm.split(':');
    return parseInt(hh, 10) * 60 + parseInt(mm, 10);
  }
  
  /**
   * hasOwnProperty wrapper
   * Eslint no-prototype-builtins 対策
   * https://eslint.org/docs/rules/no-prototype-builtins
   */
  static hasProp(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  
  /**
   * @param {string} S3 File Path
   *
   */
  static getBucketPath(filePath, host = false) {
    if (!filePath) {
      return null;
    }
    
    const bucket = process.env.MIX_AWS_S3_BUCKET || false;
    if (!bucket && !host) {
      return null;
    }
    
    const path = bucket ? `https://${bucket}/${filePath}` : `${host}/${filePath}`;
    
    return path;
  }
  
  static isNil(data) {
    return data === null || data === undefined;
  }
  static cloneDeep(data) {
    return JSON.parse(JSON.stringify(data));
  }
  
  /**
   * isEmpty
   * @param {value, array, string, object} value
   */
  static isEmpty(value) {
    return (
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (typeof value === 'string' && value.trim().length === 0)
    );
  }
}
