import ApiBase, { HTTP_METHOD as METHOD } from "../shared/api-base";
import { shopInfoMapper } from "./components/ShopInfoContext";

export const ENDPOINTS = {
  GET_SHOP: ['shop/$0', METHOD.GET, true],
  POST_CREATE_SHOP_TMP: ['shop', METHOD.POST, true],
  GET_LATLON: ['address/geo/$0', METHOD.GET, false],
}

class ShopApiService extends ApiBase {
  constructor(param) {
    super(param);
  }
  
  /**
   * Get shop info
   * @param {string} hashId: shop hash id
   */
  getShop(hashId = '') {
    const hash = [];
    if (hashId) {
      hash.push(hashId);
    }
    return this.request(ENDPOINTS.GET_SHOP, hash, null)
      .then((result) => {
        if (!Array.isArray(result)) {
          throw Error('invalid response(GET_SHOP)');
        }
        const shop = result.pop();
        console.debug('[API] getShop() shop', shop);
        if (!shop) {
          return null;
        } else if (shop.hash_id && shop.hash_id.length > 0) {
          return shopInfoMapper.fromDB(shop);
        } else {
          throw Error('invalid response(GET_SHOP)');
        }
      });
  }
  
  /*
   * Create shop tmp api
   * @param {object} data
   * @param {string} data.name
   * @param {string} data.email
   * @param {string} data.phone_number
   * @param {string} data.address
   * @param {string} data.postal_code
   * @param {string} data.prefecture
   * @param {string} data.start_time
   * @param {string} data.end_time
   * @param {string} data.city
   * @param {string} data.genre
   */
  async createShopTemp(data = {}) {
    return await this.request(ENDPOINTS.POST_CREATE_SHOP_TMP, [], data);
  }
  
  async getLatLon(prefecture, city, address, building) {
    return await this.request(ENDPOINTS.GET_LATLON, [prefecture + city + address + building], null);
  }
}

export default new ShopApiService();