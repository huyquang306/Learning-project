export default class Utils {
  constructor() {
  }
  
  static trimPhonePrefix(number, countryCode = 'VN') {
    if (countryCode !== 'VN') {
      return null;
    }
    return number.replace(/^\+84/, '0');
  }
}