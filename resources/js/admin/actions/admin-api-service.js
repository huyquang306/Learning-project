import ApiBase, { HTTP_METHOD as METHOD } from 'js/shared/api-base';

export const ENDPOINTS = {
  // Shop list
  GET_SHOPS: ['shops', METHOD.GET, true],
  GET_SHOP: ['shops/$0', METHOD.GET, true],

  // Update shop servicePlan
  UPDATE_SHOP_SERVICE_PLAN: ['shops/$0/service-plan', METHOD.POST, true],

  // Cancel/Reopen shop
  CANCEL_SHOP: ['shops/$0/cancel', METHOD.POST, true],
  REOPEN_SHOP: ['shops/$0/reopen', METHOD.POST, true],

  // Service plans
  GET_FUNCTION_CONDITIONS: ['functions', METHOD.GET, true],
  GET_SERVICE_PLANS: ['service-plans', METHOD.GET, true],
  CREATE_SERVICE_PLAN: ['service-plans', METHOD.POST, true],
  UPDATE_SERVICE_PLAN: ['service-plans/$0', METHOD.PUT, true],
  DELETE_SERVICE_PLAN: ['service-plans/$0', METHOD.DELETE, true],

  // Shop billings
  GET_SHOP_BILLINGS: ['shops/$0/billings', METHOD.GET, true],

  // Shop customer payment info
  GET_CUSTOMER_PAYMENT: ['shops/$0/customer-payment', METHOD.GET, true],
};

class AdminApiService extends ApiBase {
  constructor(param) {
    super(param);
  }

  async getShops(params = {}) {
    return await this.request(ENDPOINTS.GET_SHOPS, [], params);
  }
  async getShop(shopHashId) {
    return await this.request(ENDPOINTS.GET_SHOP, [shopHashId], {});
  }

  // Update shop servicePlan
  async updateShopServicePlan(shopHashId, servicePlanId) {
    return await this.request(ENDPOINTS.UPDATE_SHOP_SERVICE_PLAN, [shopHashId], {service_plan_id: servicePlanId});
  }

  // Cancel/Reopen shop
  async cancelShop(shopHashId) {
    return await this.request(ENDPOINTS.CANCEL_SHOP, [shopHashId], {});
  }
  async reopenShop(shopHashId) {
    return await this.request(ENDPOINTS.REOPEN_SHOP, [shopHashId], {});
  }

  // Service plans
  async getFunctionConditions(params = {}) {
    return await this.request(ENDPOINTS.GET_FUNCTION_CONDITIONS, [], params);
  }
  async getServicePlans(params = {}) {
    return await this.request(ENDPOINTS.GET_SERVICE_PLANS, [], params);
  }
  async createServicePlan(data) {
    return await this.request(ENDPOINTS.CREATE_SERVICE_PLAN, [], data);
  }
  async updateServicePlan(servicePlanHashId, data) {
    return await this.request(ENDPOINTS.UPDATE_SERVICE_PLAN, [servicePlanHashId], data);
  }
  async deleteServicePlan(servicePlanHashId) {
    return await this.request(ENDPOINTS.DELETE_SERVICE_PLAN, [servicePlanHashId], {});
  }

  // Shop billing
  async getShopBillings(shopHashId, params = {}) {
    return await this.request(ENDPOINTS.GET_SHOP_BILLINGS, [shopHashId], params);
  }

  /**
   * GET customer payment
   * @param {string} shopHashId
   */
  async getCustomerPayment(shopHashId) {
    return await this.request(ENDPOINTS.GET_CUSTOMER_PAYMENT, [shopHashId], {});
  }
}

export default new AdminApiService();
