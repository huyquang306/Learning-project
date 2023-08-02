import ApiBase, { HTTP_METHOD as METHOD } from 'js/shared/api-base';

export const ENDPOINTS = {
  GET_CUSTOMER_PAYMENT: ['shop/$0/setting/payments/customer-payment', METHOD.GET, true],
  REGISTER_OR_UPDATE_CUSTOMER_PAYMENT: ['shop/$0/setting/payments/customer-payment', METHOD.POST, true],
  
  SETUP_PAYMENT_METHOD: ['shop/$0/setting/payments/setup-payment-method', METHOD.POST, true],
  REGISTER_PAYMENT_METHOD: ['shop/$0/setting/payments/register-payment-method', METHOD.POST, true],
  ACTIVE_CARD: ['shop/$0/setting/payments/active-card', METHOD.POST, true],
};

class PaymentApiService extends ApiBase {
  constructor(param) {
    super(param);
  }
  
  /**
   * GET customer payment
   * @param {string} shopHashId
   */
  async getCustomerPayment(shopHashId) {
    return await this.request(ENDPOINTS.GET_CUSTOMER_PAYMENT, [shopHashId], {});
  }
  
  /**
   * Register customer payment
   * @param {string} shopHashId
   * @param {object} customerData
   */
  async registerOrUpdateCustomerPayment(shopHashId, customerData = {}) {
    return await this.request(ENDPOINTS.REGISTER_OR_UPDATE_CUSTOMER_PAYMENT, [shopHashId], customerData);
  }
  
  /**
   * Setup payment method
   * @param {string} shopHashId
   */
  async setupPaymentMethod(shopHashId) {
    return await this.request(ENDPOINTS.SETUP_PAYMENT_METHOD, [shopHashId], {});
  }
  
  /**
   * Register payment method
   * @param {string} shopHashId
   */
  async registerPaymentMethod(shopHashId, paymentMethod) {
    return await this.request(ENDPOINTS.REGISTER_PAYMENT_METHOD, [shopHashId], {
      payment_method: paymentMethod,
    });
  }
  
  /**
   * Active Card
   * @param {string} shopHashId
   * @param {string} paymentMethodId
   */
  async activeCard(shopHashId, paymentMethodId) {
    return await this.request(ENDPOINTS.ACTIVE_CARD, [shopHashId], {
      payment_method_id: paymentMethodId,
    });
  }
}

export default new PaymentApiService();
