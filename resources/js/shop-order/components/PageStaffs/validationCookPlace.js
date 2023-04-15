import Utils from 'js/shared/utils';
import moment from 'moment';
import 'moment-timezone';
moment.locale('ja');

const checkValidation = (staffData) => {
  let errors = [];
  errors = validateGivenName(staffData, errors);

  return errors;
};

const validateGivenName = (staffData, errors) => {
  const nameValidate = {
    requiredErrorMessage: 'スタッフ名が必須です。',
    maxLength: 32,
    maxLengthErrorMessage: 'スタッフ名は32文字以内に入力してください。',
  };

  if (!Utils.isNil(staffData.given_name) && staffData.given_name.trim() !== '') {
    if (staffData.given_name.length > nameValidate.maxLength) {
      errors.push(nameValidate.maxLengthErrorMessage);
    }
  } else {
    errors.push(nameValidate.requiredErrorMessage);
  }

  return errors;
};

export {
  checkValidation
};
