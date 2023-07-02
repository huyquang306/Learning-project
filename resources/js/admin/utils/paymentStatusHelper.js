import moment from 'moment';

// Utils
import { currencyFormat } from 'js/utils/helpers/number';
import { PAYMENT_STATUS } from 'js/utils/components/Payment/paymentConst';

export const renderPaymentStatus = (billing, forMonthString = '') => {

  if (!billing || (Array.isArray(billing) && billing.length === 0)) {
    return '';
  }
  
  let totalPrice = 0;
  let paymentStatus = '未払い';
  if (Array.isArray(billing)) {
    billing.forEach(billingTmp => {
      if (billingTmp.status === PAYMENT_STATUS.SUCCESS_STATUS) {
        paymentStatus = '支払い済';
      }

      if (billingTmp.status === PAYMENT_STATUS.UNFIXED) {
        paymentStatus = '未確定'
      }

      totalPrice += parseInt(billingTmp?.price) ?? 0;
    });
  } else {
    totalPrice = parseInt(billing && billing.price ? billing.price : 0);
    if (billing.status === PAYMENT_STATUS.SUCCESS_STATUS) {
      paymentStatus = '支払い済';
    }

    if (billing.status === PAYMENT_STATUS.UNFIXED) {
      paymentStatus = '未確定'
    }
  }

  return `${paymentStatus}/${currencyFormat(totalPrice)}円`;
};
