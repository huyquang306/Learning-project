import Utils from 'js/shared/utils';

const checkValidation = (servicePlanData) => {
  let errors = [];
  errors = validateName(servicePlanData, errors);
  errors = validateDescription(servicePlanData, errors);
  errors = validateInitialPrice(servicePlanData, errors);
  errors = validatePrice(servicePlanData, errors);
  errors = validateConditions(servicePlanData, errors);

  return errors;
}

const validateName = (servicePlanData, errors) => {
  const validateRules = {
    requiredErrorMessage: 'name max is required',
    maxLength: 50,
    maxLengthErrorMessage: `name max is 50 chars`,
  };

  if (!Utils.isNil(servicePlanData.name) && servicePlanData.name.trim() !== '') {
    if (servicePlanData.name.length > validateRules.maxLength) {
      errors.push(validateRules.maxLengthErrorMessage);
    }
  } else {
    errors.push(validateRules.requiredErrorMessage);
  }

  return errors;
};

const validateDescription = (servicePlanData, errors) => {
  const validateRules = {
    requiredErrorMessage: 'description max is required',
    maxLength: 300,
    maxLengthErrorMessage: `description max is 300 chars`,
  };

  if (!Utils.isNil(servicePlanData.description) && servicePlanData.description.trim() !== '') {
    if (servicePlanData.description.length > validateRules.maxLength) {
      errors.push(validateRules.maxLengthErrorMessage);
    }
  } else {
    errors.push(validateRules.requiredErrorMessage);
  }

  return errors;
};

const validateInitialPrice = (servicePlanData, errors) => {
  const validateRules = {
    max: 1000000000,
    maxErrorMessage: 'initial_price max is 1000000000',
  };

  if (Number(servicePlanData.initial_price) > validateRules.max) {
    errors.push(validateRules.maxLengthErrorMessage);
  }

  return errors;
};

const validatePrice = (servicePlanData, errors) => {
  const validateRules = {
    max: 1000000000,
    maxErrorMessage: 'price max is 1000000000',
  };

  if (Number(servicePlanData.price) > validateRules.max) {
    errors.push(validateRules.maxLengthErrorMessage);
  }

  return errors;
};

const validateConditions = (servicePlanData, errors) => {
  const validateRules = {
    nameRequiredErrorMessage: 'Name condition is required',
    nameMax: 50,
    nameMaxErrorMessage: 'Name condition max is 50 char',
    functionRequiredErrorMessage: 'Function condition is required',
    requiredErrorMessage: 'Condition is required',
    limitMax: 1000000000,
    limitMaxErrorMessage: 'limit max is 1000000000',
    extendPriceMax: 1000000000,
    extendMaxErrorMessage: 'extend price max is 1000000000',
  };
  if (servicePlanData.r_function_conditions.length === 0) {
    errors.push(validateRules.requiredErrorMessage);

    return errors;
  }

  servicePlanData.r_function_conditions.forEach(conditionTmp => {
    const {
      m_function_id,
      restricted_value,
      m_function: {
        name,
        m_service_plan_options,
      }
    } = conditionTmp;
    if (!m_function_id) {
      errors.push(validateRules.functionRequiredErrorMessage);
    }

    if (!name) {
      errors.push(validateRules.nameRequiredErrorMessage);
    } else if (name.length > validateRules.nameMax) {
      errors.push(validateRules.nameMaxErrorMessage);
    }

    if (restricted_value > validateRules.limitMax) {
      errors.push(validateRules.limitMaxErrorMessage);
    }

    if (Number(m_service_plan_options[0].additional_price) > validateRules.extendPriceMax) {
      errors.push(validateRules.extendMaxErrorMessage);
    }
  });

  return errors;
};

export {
  checkValidation
};
