import Utils from 'js/shared/utils';
import moment from 'moment';
import 'moment-timezone';
moment.locale('ja');

const checkValidation = (cookPlaceData) => {
  let errors = [];
  errors = validateName(cookPlaceData, errors);

  return errors;
};

const validateName = (cookPlaceData, errors) => {
  const nameValidate = {
    requiredErrorMessage: '調理場名が必須です。',
    maxLength: 32,
    maxLengthErrorMessage: '調理場名を32文字以内に入力してください。',
  };

  if (!Utils.isNil(cookPlaceData.name) && cookPlaceData.name.trim() !== '') {
    if (cookPlaceData.name.length > nameValidate.maxLength) {
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
