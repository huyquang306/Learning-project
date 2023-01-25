import ApiBase, { HTTP_METHOD as METHOD } from "../shared/api-base";
import { shopInfoMapper } from "./components/ShopInfoContext";

export const ENDPOINTS = {
  GET_SHOP: ['shop/$0', METHOD.GET, true],
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
}

export default new ShopApiService();