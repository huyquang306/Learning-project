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
    requiredErrorMessage: '請求者名が未入力です',
    maxLength: 50,
    maxLengthErrorMessage: '請求者名が50文字以内に入力してください。',
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
    requiredErrorMessage: '郵便番号が未入力です',
    length: 7,
    lengthErrorMessage: ' 郵便番号が7文字で入力してください。',
    patternErrorMessage: '郵便番号が数字文字で入力してください。'
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
    requiredErrorMessage: '住所が未入力です',
    maxLength: 200,
    maxLengthErrorMessage: '住所は200文字を超えることはできません',
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
    requiredErrorMessage: '電話番号が未入力です',
    patternErrorMessage: '電話番号の形式が正しくありません',
    maxLength: 15,
    minLength: 10,
    maxLengthErrorMessage: '電話番号は15文字を超えてはなりません',
    
    minLengthErrorMessage: '電話番号の形式が正しくありません',
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
    requiredErrorMessage: 'メールアドレスが未入力です',
    patternErrorMessage: 'メールアドレスの形式が正しくありません。',
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
