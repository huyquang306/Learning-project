/*
  CustomerApiService class
  顧客向けAPI通信
 */
import ApiBase, { HTTP_METHOD as METHOD } from 'js/shared/api-base';

/*
 * Endpoint情報
 *
 * 各Keyごとに以下の順の1次元配列で指定する
 * [url, method, needAuth]
 * url {string} 変数は$0, $1, $2指定
 * method {string}
 * needauth {boolean}
 * options {Object}
 */

export const ENDPOINTS = {
  // 店舗情報取得 shop/$0 : GET
  GET_SHOP: ['shop/$0', METHOD.GET, false],
  // 近隣店舗情報取得 user/area?sw_lat=xxx&sw_lon=xxx&ne_lat=xxx&ne_lon=xxx : GET
  GET_AREA_SHOPS: ['user/area?sw_lat=$0&sw_lon=$1&ne_lat=$2&ne_lon=$3', METHOD.GET, false],
  // GET CUSTOMER ORDER LIST
  GET_ORDER_LIST: ['user/$0/billing/calc/$1', METHOD.GET, false],
  // CUSTOMER MAKE PAY REQUEST
  PAY_REQUEST : ['user/$0/billing/payrequest/$1', METHOD.POST, false],
    //GET CATEGORY
    GET_CATEGORY_LIST : ['user/$0/category', METHOD.GET, false],
    //GET CATEGORY INFO
    GET_CATEGORY_INFO : ['user/$0/category/$1', METHOD.GET, false],
    //GET MENU BY CATEGORY
    GET_MENU_LIST : ['user/$0/menu', METHOD.GET, false],
    // ORDER MENU
    CREATE_ORDER : ['user/$0/order/$1', METHOD.POST, false],
    //RECOMMEND_MENU
    GET_RECOMMEND_MENU : ['user/$0/menu-recommend', METHOD.GET, false],
};

class CustomerApiService extends ApiBase {
  constructor(param) {
    super(param);
  }

  getOrderList(shopHash, ordergroupHash) {
    return this.request(ENDPOINTS.GET_ORDER_LIST, [shopHash, ordergroupHash], null)
      .then((response) => {
        return response;
      });
  }

  payRequest(shopHash, ordergroupHash) {
    return this.request(ENDPOINTS.PAY_REQUEST, [shopHash, ordergroupHash], null, null)
        .then((response) => {
          return response;
        });
  }

    getCategoryInfo(shopHash, categoryCode) {
        return this.request(ENDPOINTS.GET_CATEGORY_INFO, [shopHash, categoryCode], null, null)
            .then((response) => {
                return response;
            });
    }

  getCategoryList(shopHash, data) {
    return this.request(ENDPOINTS.GET_CATEGORY_LIST, [shopHash], data, null)
        .then((response) => {
          return response;
        });
  }

    getMenuList(shopHash, data) {
        return this.request(ENDPOINTS.GET_MENU_LIST, [shopHash], data, null)
            .then((response) => {
                return response;
            });
    }

    getRecommend(shopHash) {
        return this.request(ENDPOINTS.GET_RECOMMEND_MENU, [shopHash], null, null)
            .then((response) => {
                return response;
            });
    }

    createOrder(shopHash, ordergroupHash, data) {
        return this.request(ENDPOINTS.CREATE_ORDER, [shopHash, ordergroupHash], data, null)
            .then((response) => {
                return response;
            });
    }
}

// singleton
export default new CustomerApiService();
