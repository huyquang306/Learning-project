import ApiBase, {HTTP_METHOD as METHOD} from "../shared/api-base";

export const ENDPOINTS = {
  SEARCH_SHOPS: ['search_shops', METHOD.GET, true],
}

class ShopWithoutAuthApiService extends ApiBase {
  constructor(param) {
    super(param);
  }
  
  /**
   * Search shops by keyword, prefecture
   * @param {Object} filter {keyword, prefecture}
   * @return {Promise<object>} m_shop
   */
  async searchShops(filter) {
    return await this.request(ENDPOINTS.SEARCH_SHOPS, [], filter);
  }
}

export default new ShopWithoutAuthApiService();