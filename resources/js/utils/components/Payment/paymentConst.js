export const PAYMENT_STATUS = {
  SUCCESS: 'succeeded',
  PROCESSING: 'processing',
  REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
  OPEN_STATUS: 0,
  SUCCESS_STATUS: 1,
  FAILED_STATUS: 2,
  UNFIXED: 3
};
export const CUSTOMER_TYPE = {
  staff: {
    param: 'staff',
    data: 'App\\Models\\MStaff',
  },
  user: {
    param: 'user',
    data: 'App\\Models\\MUser',
  },
};
export const PAYMENT_METHOD_TYPES = {
  card: '1',
  invoice: '2',
};
export const PAYMENT_METHOD_NAMES = {
  card: 'Credit Card',
  invoice: 'Invoice',
};

export const FUNCTIONS_CODE = {
  qr: 'qr',
  printer: 'printer',
};

export const formatNumberWithCommas = (number) => {
  if (number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  return 0;
};

export const getPlanCondition = (servicePlan, conditionCode) => servicePlan && servicePlan.r_function_conditions
  ? servicePlan.r_function_conditions.find(condition => {
    return condition.m_function && condition.m_function.code === conditionCode;
  })
  : null;

// at this point, show modal confirm change service plan
export const qrLimitPoints = [
  100,
  50,
  25,
  5,
];
