/*
  Utils Class
 */

export default class Utils {
  constructor() {
  }
  /*経過時間更新のインターバル*/
  static REFRESH_CYCLE_TIME_AGO() {
    return 5000; /* 5000ms */
  }
  
  /*画面データ更新のインターバル*/
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
  // 国際プレフィックス付加
  static addPhonePrefix(number, countoryCode = 'JP') {
    // TODO 国際対応
    if (countoryCode !== 'JP') {
      return null;
    }
    if (/^\+/.test(number) || !/^0/.test(number)) {
      if (/^\+81/.test(number)) {
        return number;
      }
      return null;
    }
    return '+81' + number.replace(/^0/, '');
  }
  // 国際プレフィックス除去
  static trimPhonePrefix(number, countoryCode = 'JP') {
    // TODO 国際対応
    if (countoryCode !== 'JP') {
      return null;
    }
    return number.replace(/^\+81/, '0');
  }
  
  /**
   * 文字列の形式パターン  (参考)http://emailregex.com/
   */
  static get VALIDATE_PATTERN() {
    return {
      EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      // 8文字以上（128文字以下）の半角英数字、記号! @ # $ % ^ & * ( ) _ + - = ? [ ]
      PASSWORD: /^[a-zA-Z0-9!@#$%^&*()_+\-=?[\]]{8,128}$/,
      // 日付形式
      DATE: /^\d{4}-\d{2}-\d{2}$/,
      // 時刻形式 HH:mm or HH:mm:ss
      TIME: /^\d{1,2}(:\d{2}){1,2}$/,
      // 郵便番号
      POSTAL: /^\d{7}$/,
      // 日本国内携帯電話(ハイフンなし)
      MOBILE_JP: /^0[789]0[0-9]{8}$/,
      // 日本国内携帯電話(ハイフン許容)
      MOBILE_JP_HYPHEN: /^0[789]0-?[0-9]{4}-?[0-9]{4}$/,
    };
  }
  
  /**
   * 文字列の形式チェック
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
   * userAgent から端末推定
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
   * 数字を2桁にする
   *
   * @param {number} 0 - 99
   * @returns {string} '00' - '99'
   */
  static to2digit(number = 0) {
    const digits = ('00' + String(number).trim()).slice(-2);
    return /^\d\d$/.test(digits) ? digits : '00';
  }
  
  /**
   * 時刻を分換算にする
   *
   * @param {string} 'HH:mm(:ss)' 秒は切り捨て
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
