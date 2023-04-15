/*
  ShopOrderApiService class
 */
import ApiBase, { HTTP_METHOD as METHOD } from 'js/shared/api-base';

export const ENDPOINTS = {
  /**
   * Api Tables
   */
  GET_TABLES: ['shop/$0/table', METHOD.GET, true],
  CREATE_TABLE: ['shop/$0/table', METHOD.POST, true],
  UPDATE_TABLE: ['shop/$0/table/$1', METHOD.PUT, true],
  GET_TABLE_QR_PREVIEW: ['shop/$0/table-qr-preview/', METHOD.GET, true],
  REGENERATE_TABLE_HASH_ID: ['shop/$0/table/$1/regenerate', METHOD.PUT, true],
  DELETE_TABLE: ['shop/$0/table/$1', METHOD.DELETE, true],

  /**
   * Api Menus
   */
  GET_MENUS: ['shop/$0/menu', METHOD.GET, true],
  GET_MASTER_MENUS: ['shop/$0/master-menus', METHOD.GET, true],
  GET_MENU: ['shop/$0/menu/$1', METHOD.GET, true],
  CREATE_MENU: ['shop/$0/menu', METHOD.POST_FORM_DATA, true],
  UPDATE_MENU_INFO: ['shop/$0/menu/$1', METHOD.PUT, true],
  UPDATE_MENU: ['shop/$0/menu-update/$1', METHOD.POST_FORM_DATA, true],
  UPDATE_MENUS: ['shop/$0/many-menus', METHOD.POST_FORM_DATA, true],
  DELETE_MENU: ['shop/$0/menu/$1', METHOD.DELETE, true],

  /**
   * Api Categories
   */
  GET_CATEGORIES: ['shop/$0/category', METHOD.GET, true],
  GET_CATEGORY: ['shop/$0/category/$1', METHOD.GET, true],
  CREATE_CATEGORY: ['shop/$0/category', METHOD.POST, true],
  UPDATE_CATEGORY: ['shop/$0/category/$1', METHOD.PUT, true],
  DELETE_CATEGORY: ['shop/$0/category/$1', METHOD.DELETE, true],

  // Api Printers
  GET_PRINTERS: ['shop/$0/printer', METHOD.GET, true],
  GET_PRINTER: ['shop/$0/printer/$1', METHOD.GET, true],
  CREATE_PRINTER: ['shop/$0/printer', METHOD.POST, true],
  UPDATE_PRINTER: ['shop/$0/printer/$1', METHOD.PUT, true],
  GET_PRINTER_POSITIONS: ['shop/$0/printer/position', METHOD.GET, true],
  DELETE_PRINTER: ['shop/$0/printer/$1', METHOD.DELETE, true],

  /**
   * Api OrderGroup Summary, History
   */
  GET_ORDER_GROUP_SUMMARY: ['shop/$0/ordergroupsummary', METHOD.GET, true],
  POST_CHECK_EXTEND: ['shop/$0/ordergroups/check-alert-extend', METHOD.POST, true],
  POST_EXTEND_TIME_ORDER_GROUP: ['shop/$0/ordergroup/$1/extend-time', METHOD.POST, true],
  GET_HISTORY_ORDER_GROUP_SUMMARY: ['shop/$0/history/ordergroupsummary', METHOD.GET, true],
  POST_AUTO_CALCULATE_EXTEND: ['shop/$0/ordergroup/$1/auto-calculate-extend', METHOD.POST, true],

  /**
   * Api Order group - Register Customer
   */
  POST_ORDER_GROUP: ['shop/$0/ordergroup', METHOD.POST, true],
  PUT_ORDER_GROUP: ['shop/$0/ordergroup/$1', METHOD.PUT, true],
  DELETE_ORDER_GROUP: ['shop/$0/ordergroup/$1', METHOD.DELETE, true],

  /**
   * Api Order
   */
  POST_ORDER: ['shop/$0/ordergroup/$1/order', METHOD.POST, true],
  PUT_ORDER: ['shop/$0/ordergroup/$1/menu', METHOD.PUT, true],
  CHANGE_SHIP_ORDER_STATUS: ['shop/$0/order/ship-status', METHOD.PUT, true],

  /**
   * Api Payment
   */
  POST_PAYMENT: ['shop/$0/billing/payrequest/ordergroup/$1', METHOD.POST, true],
  PUT_WAITING_PAYMENT: ['shop/$0/billing/paying/ordergroup/$1', METHOD.PUT, true],
  PUT_PAYMENT: ['shop/$0/billing/payment/ordergroup/$1', METHOD.PUT, true],

  /**
   * Api Users
   */
  GET_LIST_USERS: ['shop/$0/users', METHOD.GET, true],

  /**
   * Api Staffs
   */
  GET_LIST_STAFFS: ['shop/$0/staffs', METHOD.GET, true],
  POST_CREATE_STAFF: ['shop/$0/staffs', METHOD.POST, true],
  PUT_UPDATE_STAFF: ['shop/$0/staffs/$1', METHOD.PUT, true],
  DELETE_STAFF: ['shop/$0/staffs/$1', METHOD.DELETE, true],

  /**
   * Api User History
   */
  GET_LIST_USER_HISTORY: ['shop/$0/history/users', METHOD.GET, true],
  GET_LIST_USER_DETAL_HISTORY: ['shop/$0/history/users/$1', METHOD.GET, true],

  /**
   * Api Course
   */
  GET_COURSES: ['shop/$0/course', METHOD.GET, true],
  GET_MASTER_COURSES: ['shop/$0/master-courses', METHOD.GET, true],
  GET_COURSE: ['shop/$0/course/$1', METHOD.GET, true],
  POST_ADD_MENU_TO_COURSE: ['shop/$0/course/$1/menu', METHOD.POST, true],
  POST_COURSE: ['shop/$0/course', METHOD.POST_FORM_DATA, true],
  POST_UPDATE_MENUS_IN_COURSE: ['shop/$0/course/$1/menu-update', METHOD.POST_FORM_DATA, true],
  POST_UPDATE_BLOCKS_IN_COURSE: ['shop/$0/course-update/$1', METHOD.POST_FORM_DATA, true],
  PUT_COPY_COURSE: ['shop/$0/course/$1/copy', METHOD.POST, true],
  DELETE_COURSE: ['shop/$0/course/$1', METHOD.DELETE, true],
  DELETE_MENU_IN_COURSE: ['shop/$0/course/$1/menu/$2', METHOD.DELETE, true],

  /**
   * Api Announcement
   */
  GET_ANNOUNCEMENTS: ['shop/$0/announcements', METHOD.GET, true],
  POST_ANNOUNCEMENT: ['shop/$0/announcements', METHOD.POST, true],

  /**
   * Api shop cook places
   */
  GET_COOK_PLACES: ['shop/$0/cook-places', METHOD.GET, true],
  POST_CREATE_COOK_PLACE: ['shop/$0/cook-places', METHOD.POST, true],
  PUT_UPDATE_COOK_PLACE: ['shop/$0/cook-places/$1', METHOD.PUT, true],
  DELETE_COOK_PLACE: ['shop/$0/cook-places/$1', METHOD.DELETE, true],

   /**
   * Api billing
   */
  GET_BILLING_DETAIL_HISTORY: ['shop/$0/billing/history', METHOD.GET, true],

  /**
   * Api Upload image s3
   */
  POST_IMAGE_TO_S3: ['shop/$0/upload-image', METHOD.POST, true],
};

class ShopOrderApiService extends ApiBase {
  constructor(param) {
    super(param);
  }

  createTable(shopHash, data) {
    return this.request(ENDPOINTS.CREATE_TABLE, [shopHash], data)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  updateTable(shopHash, tableHash, data) {
    return this.request(ENDPOINTS.UPDATE_TABLE, [shopHash, tableHash], data)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  regenerateTableHashId(shopHash, tableHash) {
    return this.request(ENDPOINTS.REGENERATE_TABLE_HASH_ID, [shopHash, tableHash])
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  async deleteTable(shopHash, tableHash) {
    return await this.request(ENDPOINTS.DELETE_TABLE, [shopHash, tableHash]);
  }

  /**
   * Get tables
   * @param {number} shopHashId
   * @param {object} queryParams
   */
  getTables(shopHashId, queryParams= {}) {
    return this.request(ENDPOINTS.GET_TABLES, [shopHashId], queryParams)
      .then((result) => {
        return result;
      });
  }

  /**
   * getTableQRPreview
   * @param {number} shopHashId
   */
   getTableQRPreview(shopHashId) {
    return this.request(ENDPOINTS.GET_TABLE_QR_PREVIEW, [shopHashId], null)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  /**
   * Get menus
   * @param {number} shopHash
   * @param {object} queryParams
   */
  getMenus(shopHash = null, queryParams = {}) {
    return this.request(ENDPOINTS.GET_MENUS, [shopHash], queryParams)
      .then((result) => {
        return result;
      });
  }

  async getMasterMenus(shopHash = null, queryParams = {}) {
    return await this.request(ENDPOINTS.GET_MASTER_MENUS, [shopHash], queryParams);
  }

  async getMenu(shopHash, menuHash) {
    return await this.request(ENDPOINTS.GET_MENU, [shopHash, menuHash], null);
  }

  createMenu(shopHash, data) {
    return this.request(ENDPOINTS.CREATE_MENU, [shopHash], data)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  updateMenu(shopHash, menuHash, data) {
    return this.request(ENDPOINTS.UPDATE_MENU, [shopHash, menuHash], data)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  async updateMenus(shopHash, data) {
    return await this.request(ENDPOINTS.UPDATE_MENUS, [shopHash], data);
  }

  async updateMenuInfo(shopHash, menuHash, data) {
    return await this.request(ENDPOINTS.UPDATE_MENU_INFO, [shopHash, menuHash], data);
  }

  deleteMenu(shopHash, menuHash) {
    return this.request(ENDPOINTS.DELETE_MENU, [shopHash, menuHash])
      .then((result) => {
        return result;
      });
  }

  getPrinters(shopHash) {
    return this.request(ENDPOINTS.GET_PRINTERS, [shopHash], null)
      .then((result) => {
        return result;
      });
  }

  getPrinter(shopHash, printerHash) {
    return this.request(ENDPOINTS.GET_PRINTER, [shopHash, printerHash], null)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  createPrinter(shopHash, data) {
    return this.request(ENDPOINTS.CREATE_PRINTER, [shopHash], data)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  updatePrinter(shopHash, printerHash, data) {
    return this.request(ENDPOINTS.UPDATE_PRINTER, [shopHash, printerHash], data)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  async deletePrinter(shopHash, printerHash) {
    try {
      return await this.request(ENDPOINTS.DELETE_PRINTER, [shopHash, printerHash])
    } catch(error) {
      throw new Error(error)
    }
  }

  /**
   * Get category
   * @param {number} shopHash
   * @param {object} queryParams
   */
  getCategories(shopHash = null, queryParams = { tier_number: 1, parent_id: 0 }) {
    return this.request(ENDPOINTS.GET_CATEGORIES, [shopHash], queryParams)
      .then((result) => {
        return result;
      });
  }

  getCategory(shopHash, categoryCode) {
    return this.request(ENDPOINTS.GET_CATEGORY, [shopHash, categoryCode], {})
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  createCategory(shopHash, data) {
    return this.request(ENDPOINTS.CREATE_CATEGORY, [shopHash], data)
      .then((result) => {
        return result;
      })
  }

  updateCategory(shopHash, categoryCode, data) {
    return this.request(ENDPOINTS.UPDATE_CATEGORY, [shopHash, categoryCode], data)
      .then((result) => {
        return result;
      })
  }

  deleteCategory(shopHash, categoryCode) {
    return this.request(ENDPOINTS.DELETE_CATEGORY, [shopHash, categoryCode])
      .then((result) => {
        return result;
      })
  }

  /**
   * Get OrderGroup Summary
   * @param {number} shopHashId
   * @param {number} history
   */
   async getOrderGroupSummary(shopHashId = null, history = false, filter = {}) {
      return await this.request(
        history ? ENDPOINTS.GET_HISTORY_ORDER_GROUP_SUMMARY : ENDPOINTS.GET_ORDER_GROUP_SUMMARY,
        [shopHashId],
        filter
      );
  }

  /**
   * Post auto calculate extend course
   * @param {string} shopHashId
   * @param {string} orderGroupHashId
   * @param {object} data
   */
  async postAutoCalculateExtend(shopHashId = null, orderGroupHashId = false, data = {}) {
    try {
      return await this.request(ENDPOINTS.POST_AUTO_CALCULATE_EXTEND, [shopHashId, orderGroupHashId], data);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Check show alert extend time
   * @param {string} shopHashId
   * @param {object} data
   */
  async postCheckExtend(shopHashId, data = {}) {
    try {
      return await this.request(ENDPOINTS.POST_CHECK_EXTEND, [shopHashId], data);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * post extend time orderGroup
   * @param {string} shopHashId
   * @param {string} orderGroupHashId
   * @param {object} data
   */
  async extendTimeOrderGroup(shopHashId, orderGroupHashId, data = {}) {
    try {
      return await this.request(ENDPOINTS.POST_EXTEND_TIME_ORDER_GROUP, [shopHashId, orderGroupHashId], data);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Order
   * @param {number} shopHashId
   * @param {number} ordergroupHashId
   * @param {object} data
   * @param {boolean} isUpdate
   */
  order(shopHashId = null, ordergroupHashId = null, data = {}, isUpdate = false) {
    return this.request(
      isUpdate ? ENDPOINTS.PUT_ORDER : ENDPOINTS.POST_ORDER,
      [shopHashId, ordergroupHashId],
      data
    )
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  /**
   * Change ship order status
   * @param {number} shopHashId
   * @param {object} data
   */
  async changeShipOrderStatus(shopHashId, data = {}) {
    return await this.request(ENDPOINTS.CHANGE_SHIP_ORDER_STATUS, [shopHashId], data);
  }

  /**
   * Payment reqquest
   * @param {number} shopHashId
   * @param {number} ordergroupHashId
   * @param {object} data
   */
  payment(shopHashId = null, ordergroupHashId = null, data = {}) {
    return this.request(ENDPOINTS.PUT_PAYMENT, [shopHashId, ordergroupHashId], data)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  /**
   * Waiting Payment - Stop order
   * @param {number} shopHashId
   * @param {number} ordergroupHashId
   * @param {object} data
  */
  async waittingPayment(shopHashId = null, ordergroupHashId = null, data = {}) {
    try {
      const result = await this.request(ENDPOINTS.PUT_WAITING_PAYMENT, [shopHashId, ordergroupHashId], data);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  getPrinterPositions(shopHash) {
    return this.request(ENDPOINTS.GET_PRINTER_POSITIONS, [shopHash], null)
      .then((result) => {
        return result;
      })
  }

  /**
   * Get users
   * @param {number} shopHashId
   * @param {object} queryParams
   */
  async getUsers(shopHashId, queryParams = {}) {
    try {
      const result = await this.request(ENDPOINTS.GET_LIST_USERS, [shopHashId], queryParams);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Get users history
   * @param {number} shopHashId
   * @param {object} queryParams
   */
   async getUserHistory(shopHashId, queryParams = {}) {
    return await this.request(ENDPOINTS.GET_LIST_USER_HISTORY, [shopHashId], queryParams);
  }

  /**
   * Get users detail history
   * @param {number} shopHashId
   * @param {object} queryParams
   */
  async getUserDetailHitory(shopHashId, userHashId, data = {}) {
    return await this.request(ENDPOINTS.GET_LIST_USER_DETAL_HISTORY, [shopHashId, userHashId], data);
  }

  /**
   * Get staffs of shop
   * @param {string} shopHashId
   * @param {object} queryParams
   */
  async getStaffs(shopHashId, queryParams) {
    return await this.request(ENDPOINTS.GET_LIST_STAFFS, [shopHashId], queryParams);
  }

  /**
   * Create a new staff for shop
   * @param {string} shopHashId
   * @param {object} staffInfo
   */
  async createStaff(shopHashId, staffInfo) {
    return await this.request(ENDPOINTS.POST_CREATE_STAFF, [shopHashId], staffInfo);
  }

  /**
   * Update a new staff
   * @param {string} shopHashId
   * @param {string} staffHashId
   * @param {object} staffInfo
   */
  async updateStaff(shopHashId, staffHashId, staffInfo) {
    return await this.request(ENDPOINTS.PUT_UPDATE_STAFF, [shopHashId, staffHashId], staffInfo);
  }

  /**
   * Delete a new staff
   * @param {string} shopHashId
   * @param {string} staffHashId
   */
  async deleteStaff(shopHashId, staffHashId) {
    return await this.request(ENDPOINTS.DELETE_STAFF, [shopHashId, staffHashId], {});
  }

  /**
   * Get master data of list courses
   *
   * @param {string} shopHashId
   * @param {string} status
   * @param {number} available
   */
  async getMasterCourses(shopHashId, status = null, available = 0) {
    return await this.request(ENDPOINTS.GET_MASTER_COURSES, [shopHashId], { status, available });
  }

  /**
   * Get detail course
   * @param {string} shopHashId
   * @param {string} courseHashId
   */
  async getCourse(shopHashId, courseHashId) {
    try {
      const result = await this.request(ENDPOINTS.GET_COURSE, [shopHashId, courseHashId], {});

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Get list courses
   * @param {number} shopHashId
   * @param {string} status
   */
  async getCourses(shopHashId, status = null) {
    return await this.request(ENDPOINTS.GET_COURSES, [shopHashId], { status });
  }

  /**
   * Create new Course
   * @param {number} shopHashId
   * @param {object} newCourse
   */
  async createCourse(shopHashId, newCourse = {}) {
    try {
      const result = await this.request(ENDPOINTS.POST_COURSE, [shopHashId], newCourse);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Add menus to course
   * @param {number} shopHashId
   * @param {number} courseHashId
   * @param {array} list_menus
   */
  async addMenusToCourse(shopHashId, courseHashId, list_menus = []) {
    try {
      const result = await this.request(ENDPOINTS.POST_ADD_MENU_TO_COURSE, [shopHashId, courseHashId], { list_menus });

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Update Menus info and common Course info in Course
   * @param {number} shopHashId
   * @param {number} courseHashId
   * @param {object} newCourse
   */
  async updateMenusInCourse(shopHashId, courseHashId, newCourse = {}) {
    try {
      const result = await this.request(ENDPOINTS.POST_UPDATE_MENUS_IN_COURSE, [shopHashId, courseHashId], newCourse);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Update Blocks info and common Course info in Course
   * @param {number} shopHashId
   * @param {number} courseHashId
   * @param {object} newCourse
   */
  async updateBlocksInCourse(shopHashId, courseHashId, newCourse = {}) {
    try {
      const result = await this.request(ENDPOINTS.POST_UPDATE_BLOCKS_IN_COURSE, [shopHashId, courseHashId], newCourse);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Copy Course
   * @param {number} shopHashId
   * @param {number} courseHashId
   */
  async copyCourse(shopHashId, courseHashId) {
    try {
      const result = await this.request(ENDPOINTS.PUT_COPY_COURSE, [shopHashId, courseHashId], {});

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Delete Course
   * @param {number} shopHashId
   * @param {number} courseHashId
   */
  async deleteCourse(shopHashId, courseHashId) {
    try {
      const result = await this.request(ENDPOINTS.DELETE_COURSE, [shopHashId, courseHashId], {});

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Delete Course
   * @param {number} shopHashId
   * @param {number} courseHashId
   * @param {number} menuHashId
   */
  async deleteMenuInCourse(shopHashId, courseHashId, menuHashId) {
    try {
      const result = await this.request(ENDPOINTS.DELETE_MENU_IN_COURSE, [shopHashId, courseHashId, menuHashId], {});

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * get all Announcement
   * @param {number} shopHashId
   */
  async getAnnouncements(shopHashId) {
    return await this.request(ENDPOINTS.GET_ANNOUNCEMENTS, [shopHashId], {});
  }

  /**
   * Update a Announcement
   * @param {number} shopHashId
   * @param {object} announcementData
   */
  async updateAnnouncement(shopHashId, announcementData = {}) {
    return await this.request(ENDPOINTS.POST_ANNOUNCEMENT, [shopHashId], announcementData);
  }

  /**
   * Get all shop cook places
   * @param {number} shopHashId
   */
  async getCookPlaces(shopHashId) {
    return await this.request(ENDPOINTS.GET_COOK_PLACES, [shopHashId], {});
  }

  /**
   * Create a new shop cook place
   * @param {number} shopHashId
   * @param {object} newCookPlace
   */
  async createCookPlace(shopHashId, newCookPlace = {}) {
    return await this.request(ENDPOINTS.POST_CREATE_COOK_PLACE, [shopHashId], newCookPlace);
  }

  /**
   * Update a shop cook place
   * @param {number} shopHashId
   * @param {number} cookPlaceHashId
   * @param {object} cookPlace
   */
  async updateCookPlace(shopHashId, cookPlaceHashId, cookPlace = {}) {
    return await this.request(ENDPOINTS.PUT_UPDATE_COOK_PLACE, [shopHashId, cookPlaceHashId], cookPlace);
  }

  /**
   * Delete a shop cook place
   * @param {number} shopHashId
   * @param {number} cookPlaceHashId
   */
  async deleteCookPlace(shopHashId, cookPlaceHashId) {
    return await this.request(ENDPOINTS.DELETE_COOK_PLACE, [shopHashId, cookPlaceHashId], {});
  }

  /**
   * Get detail billing payment history
   * @param {number} shopHashId
   * @param {object} data
   */
   async getBillingDetailHistory(shopHashId, data = {}) {
    return await this.request(ENDPOINTS.GET_BILLING_DETAIL_HISTORY, [shopHashId], data);
  }

  /**
   * Upload image to s3
   * @param {number} shopHashId
   */
   async uploadImageToS3(shopHashId, data) {
    return await this.request(ENDPOINTS.POST_IMAGE_TO_S3, [shopHashId], data);
  }
}

export default new ShopOrderApiService();
