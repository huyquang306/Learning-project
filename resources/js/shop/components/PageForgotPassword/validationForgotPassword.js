import Utils from 'js/shared/utils';
import {
  MAX_NUMBER_CHARS_PASSWORD,
  MIN_NUMBER_CHARS_PASSWORD,
  PASSWORD_POLICY_REGEX,
  PASSWORD_CONTAINS_ALLOW_SYMBOL
} from 'js/utils/helpers/passwordHelper';

const checkValidation = (passwordInfo) => {
  let errors = [];
  errors = validateNewPassword(passwordInfo, errors);
  errors = validatePasswordConfirmation(passwordInfo, errors);

  return errors;
};

const validateNewPassword = (passwordInfo, errors) => {
  const validateRules = {
    requiredErrorMessage: `${MIN_NUMBER_CHARS_PASSWORD}から${MAX_NUMBER_CHARS_PASSWORD}文字の長さのパスワードを入力してください。`,
    maxLength: MAX_NUMBER_CHARS_PASSWORD,
    minLength: MIN_NUMBER_CHARS_PASSWORD,
    passwordPolicyError: `英数字と記号を含めた半角${MIN_NUMBER_CHARS_PASSWORD}文字以上のパスワードを入力してください。`,
    containNotAllowSymbol: '使用できない記号が含まれています。'
  };

  if (!Utils.isNil(passwordInfo.password) && passwordInfo.password.trim() !== '') {
    if (passwordInfo.password.length < validateRules.minLength || passwordInfo.password.length > validateRules.maxLength) {
      errors.push(validateRules.requiredErrorMessage);
    } else if(!PASSWORD_CONTAINS_ALLOW_SYMBOL.test(passwordInfo.password)) {
        errors.push(validateRules.containNotAllowSymbol);
    } else if (!PASSWORD_POLICY_REGEX.test(passwordInfo.password)) {
        errors.push(validateRules.passwordPolicyError);
    }
  } else {
    errors.push(validateRules.requiredErrorMessage);
  }

  return errors;
};

const validatePasswordConfirmation = (passwordInfo, errors) => {
  const validateRules = {
    isNotPasswordErrorMess: '新しいパスワードと確認用のパスワードが一致していません。',
  };

  if (passwordInfo.password !== passwordInfo.password_confirmation) {
    errors.push(validateRules.isNotPasswordErrorMess);
  }

  return errors;
};

export {
  checkValidation
};
