import ApiBase, { HTTP_METHOD as METHOD } from "../shared/api-base";
import { shopInfoMapper } from "./components/ShopInfoContext";
import moment from "moment";

export const ENDPOINTS = {
  GET_SHOP: ['shop/$0', METHOD.GET, true],
  POST_CREATE_SHOP_TMP: ['shop', METHOD.POST, true],
  GET_LATLON: ['address/geo/$0', METHOD.GET, false],
  GET_ITEMS: ['shop/$0/item', METHOD.GET, true],
  REGIST_ITEM: ['shop/$0/item', METHOD.POST, true],
  REGIST_ITEM_IMG: ['shop/$0/item/$1/images', METHOD.POST_FILE, true],
  UPDATE_ITEM: ['shop/$0/item/$1', METHOD.PUT, true],
  DELETE_ITEM: ['shop/$0/item/$1', METHOD.DELETE, true],
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
  
  getItem(shopHash, itemHash) {
    return this.request(ENDPOINTS.GET_ITEMS, [shopHash], null).then((result) => {
      if (result && Array.isArray(result)) {
        const target = result.find((item) => item.hash_id === itemHash);
        return target;
      } else {
        return null;
      }
    });
  }
  
  deleteItem(shopHash, itemHash) {
    return this.request(ENDPOINTS.DELETE_ITEM, [shopHash, itemHash], {
      deleted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    }).then((result) => {
      console.debug('[shop-api-service] deleteItem() result', result);
      return result;
    });
  }
  
  toggleOnsale(shopHash, itemHash, isOnsale) {
    const params = [];
    if (shopHash) {
      params.push(shopHash);
    }
    if (itemHash) {
      params.push(itemHash);
    }
    return this.request(ENDPOINTS.UPDATE_ITEM, params, {
      status: isOnsale ? 'onsale' : 'not_onsale',
    }).then((result) => {
      return result.status;
    });
  }
}

export default new ShopApiService();