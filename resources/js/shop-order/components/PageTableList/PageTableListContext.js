/*
  PageTableList Context
 */

import { createContext } from 'react';
import { isEmpty } from 'lodash';
import { ORDER_STATUS } from 'js/utils/helpers/courseHelper';

const pageTableListDataDefault = {
  isRefreshPage: false,
  setIsRefreshPage: () => {},
};

const pageReducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    case 'REFRESH':
      return {
        ...state,
        isRefresh: true,
        refreshAt: new Date(),
      };
    case 'UPDATE':
      return {
        ...state,
        isRefresh: payload.refresh || false,
        refreshAt: new Date(),
        table: payload.table,
        ordergroup: payload.ordergroup,
        totalAmount: totalAmount(payload.ordergroup),
        tableGroupName: payload.tableGroupName,
      };
    case 'REGISTER_UPDATE':
      return {
        ...state,
        isRefresh: action.payload.refresh || false,
        refreshAt: new Date(),
        tableGroupName: { ...state.tableGroupName, firstId: action.payload.firstId },
      };
    default:
      throw new Error();
  }
};

const totalAmount = (orderGroup) => {
  if (isEmpty(orderGroup)) {
    return 0;
  }

  let total = 0;
  if (Object.prototype.hasOwnProperty.call(orderGroup, 'orders')) {
    if (isEmpty(orderGroup.orders)) {
      return total;
    }

    // price by menus
    const orderTotal = orderGroup.orders.filter(order => order.status !== ORDER_STATUS.STATUS_CANCEL)
      .reduce((a, b) => {
        if (b?.is_menu_in_course) {
          return a;
        } else {
          return  a + (b.amount || 0)
        }
      }, 0);
    total += orderTotal;
  }

  return total;
};

const formatAmount = (number, n = 0, x = 3) => {
  let reg = '\\d(?=(\\d{' + x + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return number ? Number(number).toFixed(n).replace(new RegExp(reg, 'g'), '$&,') : '0';
};

const PageTableListContext = createContext(pageTableListDataDefault);

export { pageTableListDataDefault, pageReducer, formatAmount };
export default PageTableListContext;
