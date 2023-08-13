import Utils from 'js/shared/utils';
import {
  MAX_NUMBER_CHARS_EMAIL,
  MIN_NUMBER_CHARS_EMAIL,
  EMAIL_RULE,
} from 'js/utils/helpers/emailHelper';

const checkRegisterForm = (paymentData) => {
  let errors = [];
  errors = validateName(paymentData, errors);
  errors = validateZipCode(paymentData, errors);
  errors = validateAddress(paymentData, errors);
  errors = validatePhoneNumber(paymentData, errors);
  errors = validateEmail(paymentData, errors);
  
  return errors;
};

const validateName = (paymentData, errors) => {
  const validate = {
    requiredErrorMessage: 'Vui lòng nhập tên',
    maxLength: 50,
    maxLengthErrorMessage: 'Vui lòng nhập tên dài không quá 50 kí tự',
  };
  
  if (!Utils.isNil(paymentData.name) && paymentData.name.trim() !== '') {
    if (paymentData.name.length > validate.maxLength) {
      errors.push(validate.maxLengthErrorMessage);
    }
  } else {
    errors.push(validate.requiredErrorMessage);
  }
  
  return errors;
};

const validateZipCode = (paymentData, errors) => {
  const zipCodeRegex = /^[0-9]*$/;
  const validate = {
    requiredErrorMessage: 'Bạn cần nhập postal code',
    length: 7,
    lengthErrorMessage: 'Vui lòng nhập postal code bao gồm 7 ký tự',
    patternErrorMessage: 'Vui lòng nhập postal code theo đúng định dạng'
  };
  
  if (!Utils.isNil(paymentData.zip_code) && paymentData.zip_code.trim() !== '') {
    if (paymentData.zip_code.length !== validate.length) {
      errors.push(validate.lengthErrorMessage);
    }
    if (!zipCodeRegex.test(paymentData.zip_code)) {
      errors.push(validate.patternErrorMessage);
    }
  } else {
    errors.push(validate.requiredErrorMessage);
  }
  return errors;
};

const validateAddress = (paymentData, errors) => {
  const addressValidate = {
    requiredErrorMessage: 'Vui lòng nhập địa chỉ',
    maxLength: 200,
    maxLengthErrorMessage: 'Vui lòng nhập địa chỉ không quá 200 kí tự',
  };
  
  if (!Utils.isNil(paymentData.address) && paymentData.address.trim() !== '') {
    if (paymentData.address.length > addressValidate.maxLength) {
      errors.push(addressValidate.maxLengthErrorMessage);
    }
  } else {
    errors.push(addressValidate.requiredErrorMessage);
  }
  return errors;
};

const validatePhoneNumber = (paymentData, errors) => {
  const phoneNumberValidate = {
    requiredErrorMessage: 'Vui lòng nhập số diện thoại',
    patternErrorMessage: 'Vui lòng nhập số điện thoại đúng định dạng',
    maxLength: 15,
    minLength: 10,
    maxLengthErrorMessage: 'Vui lòng nhập số điện thoại đúng định dạng',
    
    minLengthErrorMessage: 'Vui lòng nhập số điện thoại đúng định dạng',
  };
  const phoneNumberRegex = /^[0-9]*$/;
  
  if (!Utils.isNil(paymentData.phone) && paymentData.phone.trim() !== '') {
    if (paymentData.phone.length > phoneNumberValidate.maxLength) {
      errors.push(phoneNumberValidate.maxLengthErrorMessage);
    }
    if (paymentData.phone.length < phoneNumberValidate.minLength) {
      errors.push(phoneNumberValidate.minLengthErrorMessage);
    }
    if (!phoneNumberRegex.test(paymentData.phone)) {
      errors.push(phoneNumberValidate.patternErrorMessage);
    }
  } else {
    errors.push(phoneNumberValidate.requiredErrorMessage);
  }
  
  return errors;
};

const validateEmail = (paymentData, errors) => {
  const emailValidate = {
    requiredErrorMessage: 'Vui lòng nhập email',
    patternErrorMessage: 'Vui lòng nhập email đúng định dạng',
  };
  
  if (!Utils.isNil(paymentData.email) && paymentData.email.trim() !== '') {
    if (
      !EMAIL_RULE.test(paymentData.email) ||
      paymentData.email.length < MIN_NUMBER_CHARS_EMAIL ||
      paymentData.email.length > MAX_NUMBER_CHARS_EMAIL
    ) {
      errors.push(emailValidate.patternErrorMessage);
    }
  } else {
    errors.push(emailValidate.requiredErrorMessage);
  }
  
  return errors;
};

export { checkRegisterForm };
