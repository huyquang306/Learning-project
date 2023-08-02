import Utils from 'js/shared/utils';

const checkValidation = (registerInfo) => {
  let errors = [];
  errors = validateCustomerNumber(registerInfo.number_of_customers, errors);

  return errors;
}

const validateCustomerNumber = (numberOfCustomers, errors) => {
  const validateRules = {
    requiredErrorMessage: 'Chưa nhập số khách hàng',
    max: 999,
    min: 1,
    minMaxErrorMessage: 'Số khách hàng đã vượt quá giới hạn',
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
