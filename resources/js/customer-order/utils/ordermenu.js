const IS_SUSSES_ORDER_KEY = 'is_success_order_menu';

export const setSuccessOrderMenu = () => {
  localStorage.setItem(IS_SUSSES_ORDER_KEY, true);
};

export const isSuccessOrderMenu = () => {
  let isSuccess = localStorage.getItem(IS_SUSSES_ORDER_KEY) || false;

  return !!(isSuccess && (isSuccess === 'true' || isSuccess === true));
}

export const removeSuccessOrderMenu = () => {
  localStorage.removeItem(IS_SUSSES_ORDER_KEY);
}
