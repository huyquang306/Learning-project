import {
  MAX_NUMBER_CHARS_PASSWORD,
  MIN_NUMBER_CHARS_PASSWORD,
  PASSWORD_POLICY_REGEX,
  PASSWORD_CONTAINS_ALLOW_SYMBOL
} from 'js/utils/helpers/passwordHelper';
import {MAX_NUMBER_CHARS_EMAIL, MIN_NUMBER_CHARS_EMAIL, EMAIL_RULE} from 'js/utils/helpers/emailHelper';

const checkValidation = (account) => {
  let errors = [];
  errors = validateEmail(account, errors);
  errors = validatePassword(account, errors);
  errors = validatePasswordConfirmation(account, errors);
  
  return errors;
};

const validateEmail = (account, errors) => {
  const {email} = account;
  const validateRules = {
    errorMessage: 'Please enter your email address',
  };
  if (!EMAIL_RULE.test(email) || email.length < MIN_NUMBER_CHARS_EMAIL || email.length > MAX_NUMBER_CHARS_EMAIL) {
    errors.push(validateRules.errorMessage)
  }
  
  return errors;
};

const validatePassword = (account, errors) => {
  const {password} = account;
  const validateRules = {
    lengthErrorMessage: `Please enter a character length password from ${MIN_NUMBER_CHARS_PASSWORD} to ${MAX_NUMBER_CHARS_PASSWORD} characters`,
    containsAllowErrorMessage: 'Password contains symbols that cannot be used',
    passwordPolicyErrorMessage: `Please enter a password of at least ${MIN_NUMBER_CHARS_PASSWORD} characters`,
  };
  if (password.length < MIN_NUMBER_CHARS_PASSWORD || password.length > MAX_NUMBER_CHARS_PASSWORD) {
    errors.push(validateRules.lengthErrorMessage);
    
    return errors;
  } else if(!PASSWORD_CONTAINS_ALLOW_SYMBOL.test(password)) {
    errors.push(validateRules.containsAllowErrorMessage);
    
    return errors;
  } else if (!PASSWORD_POLICY_REGEX.test(password)) {
    errors.push(validateRules.passwordPolicyErrorMessage);
    
    return errors;
  }
  
  return errors;
};

const validatePasswordConfirmation = (account, errors) => {
  const {password, password_confirmation} = account;
  const validateRules = {
    errorMessage: 'The password does not match the confirmation password',
  };
  if (password_confirmation !== password) {
    errors.push(validateRules.errorMessage);
  }
  
  return errors;
};

export {
  checkValidation
};
