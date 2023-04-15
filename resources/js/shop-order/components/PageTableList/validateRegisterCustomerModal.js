import Utils from 'js/shared/utils';

const checkValidation = (registerInfo) => {
  let errors = [];
  errors = validateCustomerNumber(registerInfo.number_of_customers, errors);

  return errors;
}

const validateCustomerNumber = (numberOfCustomers, errors) => {
  const validateRules = {
    requiredErrorMessage: '数が必須です。',
    max: 99,
    min: 1,
    minMaxErrorMessage: '人数は1~99まで入力可能です。',
  };
  if (Utils.isNil(numberOfCustomers) || numberOfCustomers.toString().trim() === '') {
    errors.push(validateRules.requiredErrorMessage);
  } else {
    if (numberOfCustomers < validateRules.min || numberOfCustomers > validateRules.max) {
      errors.push(validateRules.minMaxErrorMessage);
    }
  }

  return errors;
}

export {
  checkValidation,
  validateCustomerNumber
};
