/*
  CustomerOrderApiService class
 */
import ApiBase, { HTTP_METHOD as METHOD } from 'js/shared/api-base';

export const ENDPOINTS = {
  // GET user by phoneNumber
  GET_USERS_BY_PHONE_NUMBER: ['user/search-user', METHOD.GET, false],
  POST_USER: ['user', METHOD.POST, false],

  // GET CUSTOMER ORDER LIST
  GET_ORDER_LIST: ['user/$0/billing/calc/$1', METHOD.GET, 'user'],
  // CUSTOMER MAKE PAY REQUEST
  PAY_REQUEST: ['user/$0/billing/payrequest/$1', METHOD.POST, 'user'],
  //GET CATEGORY
  GET_CATEGORY_LIST: ['user/$0/category', METHOD.GET, false],
  //GET CATEGORY INFO
  GET_CATEGORY_INFO: ['user/$0/category/$1', METHOD.GET, false],
  //GET MENU BY CATEGORY
  GET_MENU_LIST: ['user/$0/menu', METHOD.GET, false],
  // ORDER MENU
  CREATE_ORDER: ['user/$0/order/$1', METHOD.POST, 'user'],
  //RECOMMEND_MENU
  GET_RECOMMEND_MENU: ['user/$0/menu-recommend', METHOD.GET, false],
  // 新規登録
  REGIST_USER: ['user', METHOD.GET, true],
  //UPDATE USER INFO
  UPDATE_USER: ['user/$0',  METHOD.PUT, true],
  // GET STATUS OF ORDER GROUP
  GET_STATUS_ORDERGROUP: ['user/$0/ordergroup/$1', METHOD.GET, false],
  // GET ACTIVE ORDER GROUP
  GET_ACTIVE_ORDERGROUP: ['user/$0/ordergroup/table/$1', METHOD.GET, false],
  // LIST COURSE
  GET_LIST_OF_COURSE: ['user/$0/course', METHOD.GET, false],
  // LIST MENU IN COURSE
  GET_LIST_MENU_IN_COURSE: ['user/$0/course/$1', METHOD.GET, false],
  // CONFIRM ORDER COURSE
  CONFIRM_ORDER_COURSE: ['user/$0/course-order/$1', METHOD.PUT, false],
  // EXTEND ORDER COURSE
  EXTEND_ORDER_COURSE: ['user/$0/course-extend/$1', METHOD.PUT, false],
  // EXTEND ORDER COURSE
  CHECK_EXTEND_ORDER_COURSE: ['user/$0/course-extend/$1/check-extend', METHOD.PUT, false],
  // GET INSTAGRAM LINK
  GET_INSTAGRAM_LINK: ['user/$0/instagram_link', METHOD.GET, false],

  // GET SHOP TAX INFO
  GET_SHOP_TAX_INFO: ['user/$0/tax-info', METHOD.GET, false],

  // GET SHOP DATA
  GET_SHOP: ['user/$0/shop', METHOD.GET, false],
};

class CustomerOrderApiService extends ApiBase {
  constructor(param) {
    super(param);
  }

  /**
   * GET user by phoneNumber
   */
  async getCustomers(phoneNumber) {
    return await this.request(ENDPOINTS.GET_USERS_BY_PHONE_NUMBER, [], {phone_number: phoneNumber});
  }
  async createCustomer(phoneNumber, nickName) {
    return await this.request(ENDPOINTS.POST_USER, [], {
      phone_number: phoneNumber,
      nick_name: nickName,
    });
  }

  getOrderList(shopHash, ordergroupHash) {
    return this.request(ENDPOINTS.GET_ORDER_LIST, [shopHash, ordergroupHash], null)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  payRequest(shopHash, ordergroupHash, data = {}) {
    return this.request(ENDPOINTS.PAY_REQUEST, [shopHash, ordergroupHash], data, null)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  getCategoryInfo(shopHash, categoryCode) {
    return this.request(ENDPOINTS.GET_CATEGORY_INFO, [shopHash, categoryCode], null, null).then(
      (response) => {
        return response;
      }
    );
  }

  getCategoryList(shopHash, data) {
    return this.request(ENDPOINTS.GET_CATEGORY_LIST, [shopHash], data, null).then((response) => {
      return response;
    });
  }

  getMenuList(shopHash, data) {
    return this.request(ENDPOINTS.GET_MENU_LIST, [shopHash], data, null).then((response) => {
      return response;
    });
  }

  getRecommend(shopHash, data = {}) {
    return this.request(ENDPOINTS.GET_RECOMMEND_MENU, [shopHash], data, null).then((response) => {
      return response;
    });
  }

  createOrder(shopHash, ordergroupHash, data) {
    return this.request(ENDPOINTS.CREATE_ORDER, [shopHash, ordergroupHash], data, null)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  /**
   * Register user
   *
   */
  async registUser() {
    try {
      const result = await this.request(ENDPOINTS.REGIST_USER);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Update user
   *
   */
  async updateUser(userHashId, data = {}) {
    try {
      const result = await this.request(ENDPOINTS.UPDATE_USER, [userHashId], data);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * GET STATUS OF ORDER GROUP
   *
   */
  async getStatusOrdergroup(shopHash, ordergroupHash) {
    return await this.request(ENDPOINTS.GET_STATUS_ORDERGROUP,[shopHash, ordergroupHash], null, null);
  }

  /**
   * GET ACTIVE ORDER GROUP(既存 or 新規)
   * （テーブルQRコード対応）
   *
   */
  async getActiveOrdergroupByShopHashAndTableHash(shopHash, tableHash) {
    try {
      const result = await this.request(ENDPOINTS.GET_ACTIVE_ORDERGROUP,[shopHash, tableHash], null, null);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * GET LIST OF COURSE
   *
   */
  async getListOfCourse(shopHash) {
    return await this.request(ENDPOINTS.GET_LIST_OF_COURSE,[shopHash], null, null);
  }

  /**
   * GET DETAIL INFO OF COURSE
   *
   */
  async getDetailCourse(shopHash, courseHash) {
    try {
      const result = await this.request(ENDPOINTS.GET_LIST_MENU_IN_COURSE,[shopHash, courseHash], null, null);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * CONFIRM ORDER COURSE
   *
   */
  async confirmOrderCourse(shopHash, ordergroupHash, data = {}) {
    try {
      const result = await this.request(ENDPOINTS.CONFIRM_ORDER_COURSE,[shopHash, ordergroupHash], data, null);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * EXTEND ORDER COURSE
   *
   */
   async extendOrderCourse(shopHash, ordergroupHash, data = {}) {
    try {
      const result = await this.request(ENDPOINTS.EXTEND_ORDER_COURSE, [shopHash, ordergroupHash], data, null);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Check extend course order
   *
   */
  async checkExtendOrderCourse(shopHash, ordergroupHash) {
    try {
      return await this.request(ENDPOINTS.CHECK_EXTEND_ORDER_COURSE, [shopHash, ordergroupHash], {}, null);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * GET Instagram Info
   * m_shop.instagram_linkの取得
   *
   */
   async getInstagramLink(shopHash) {
    try {
      const result = await this.request(ENDPOINTS.GET_INSTAGRAM_LINK,[shopHash], null, null);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * GET SHOP TAX INFO
   *
   */
   async getShopTaxInfo(shopHash) {
    try {
      const result = await this.request(ENDPOINTS.GET_SHOP_TAX_INFO, [shopHash], null, null);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * GET SHOP
   * 店舗情報の取得
   *
   */
   async getShop(shopHash) {
    try {
      const result = await this.request(ENDPOINTS.GET_SHOP,[shopHash], null, null);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}

// singleton
export default new CustomerOrderApiService();
