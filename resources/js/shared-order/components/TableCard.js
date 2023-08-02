import React, { useContext, useEffect, useState } from 'react';
import OrderCard from './OrderCard';
import PropTypes from 'prop-types';

import PageTableListContext from 'js/shop-order/components/PageTableList/PageTableListContext.js';

import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography, Box } from '@material-ui/core';

import { isEmpty, sortBy } from 'lodash';
import {
  getTimerBySeconds,
  momentVN,
  DATE_TIME_SECONDS_FORMAT,
  DAY_SECONDS,
} from 'js/utils/helpers/timer';
import { ORDER_TYPE, ORDER_STATUS, ORDER_GROUP_STATUS } from 'js/utils/helpers/courseHelper';

// Library
import Utils from 'js/shared/utils';
import moment from 'moment';
moment.locale('vi');

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('xs')]: {
      flex: '0 0 calc(100% )',
      width: 'calc(100%)',
    },
    [theme.breakpoints.up('sm')]: {
      flex: '0 0 calc(100% / 2 )',
      width: 'calc(100% / 2)',
    },
    [theme.breakpoints.up('md')]: {
      flex: '0 0 calc(100% / 3 )',
      width: 'calc(100% / 3)',
    },
    [theme.breakpoints.up('lg')]: {
      flex: '0 0 calc(100% / 5)',
      width: 'calc(100% / 5)',
    },
    padding: '12px 10px',
    borderRadius: '8px',
  },
  card: {
    backgroundColor: '#FDFDFD',
    marginBottom: '6px',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 5px 8px',
    '&.selected': {
      boxShadow: 'none!important',
    },
  },
  header: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#F2F2F2',
  },
  textBold: {
    fontWeight: 600,
  },
  normalText: {
    fontWeight: 400,
    textAlign: 'right',
  },
  headerActive: {
    backgroundColor: '#FFA04B',
    color: '#FDFDFD',
  },
  headerInActive: {
    backgroundColor: '#FFFFFF',
    color: '#828282',
    border: '1px solid #828282',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    '&.selected': {
      border: 'none',
      color: '#000000',
      borderBottom: '2px solid #FFA04B',
    },
  },
  headerAllOrderServed: {
    backgroundColor: '#03fa07',
    color: '#FDFDFD',
  },
  headerRequestCheckout: {
    backgroundColor: '#f50505',
    color: '#FDFDFD',
  },
  cardContent: {
    padding: '5px',
  },
  cardSelected: {
    border: '2px solid #FFA04B',
  },
  cardOrder: {
    padding: '0px',
    marginTop: '4px',
    height: '120px',
  },
  numberPeople: {
    textAlign: 'left',
    fontSize: '16px',
    color: '#828282',
  },
  time: {
    textAlign: 'right',
    fontSize: '18px',
    color: '#4F4F4F',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '22px',
  },
  cardFooterLeft: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#000000',
    margin: '4px 0px 4px 6px',
  },
  cardFooterRight: {
    fontSize: '18px',
    lineHeight: '18px',
    color: '#4F4F4F',
  },
  cardTimerCourse: {
    color: '#000000',
    marginRight: '6px',
  },
  cardTimerDangerCourse: {
    color: '#FF0000',
  },
}));
const styles = {
  disabledTable: {
    pointerEvents: 'none', //'auto'
    opacity: 0.3,
  },
};

const getOrdergroup = (table, ordergroups) => {
  for (let ordergroup of ordergroups)
    for (let ordergroupTable of ordergroup.tables)
      if (table.hash_id === ordergroupTable.hash_id) return ordergroup;
  return {};
};

const getTableGroupName = (table, ordergroup) => {
  let nameTable = [];
  let result = { name: table.code, firstId: table.hash_id };
  if (!isEmpty(ordergroup)) {
    const firstId = ordergroup.tables[0].hash_id;
    if (table.hash_id === firstId)
      for (let ordergroupTable of ordergroup.tables) nameTable.push(ordergroupTable.code);
    result = { name: nameTable.join(', '), firstId };
  }
  return result;
};

const TableCard = (props) => {
  const { table, onClick, filterStatus } = props;
  const classes = useStyles();
  const { state, dispatch, ordergroups } = useContext(PageTableListContext);
  // second unit
  const [spendingTime, setSpendingTime] = useState(0);
  const [numberExtendCourse, setNumberExtendCourse] = useState(0);
  const [timeOrder, setTimeOrder] = useState(0);
  const [orderCourse, setOrderCourse] = useState([]);
  
  const ordergroup = getOrdergroup(table, ordergroups);
  const tableGroupName = getTableGroupName(table, ordergroup);
  const course =
    ordergroup?.orders?.find(
      (order) =>
        !Utils.isEmpty(order.m_course) &&
        order.order_type == ORDER_TYPE.ORDER_COURSE &&
        order.status != ORDER_STATUS.STATUS_CANCEL
    )?.m_course || {};
  
  useEffect(() => {
    if (
      table.hash_id === tableGroupName.firstId &&
      !isEmpty(ordergroup) &&
      tableGroupName.firstId === state.tableGroupName.firstId
    ) {
      dispatch({ type: 'UPDATE', payload: { ordergroup, table, refresh: false, tableGroupName } });
    }
  }, [ordergroups]);
  
  useEffect(() => {
    let timerCountdownInterval = null;
    if (!isEmpty(course)) {
      const orderHasCourse = getOrderHasCourse(ordergroup);
      timerCountdownInterval = setInterval(() => {
        const numberExtendCourse = getNumberExtendCourse(ordergroup);
        const extendTimeBlock = !Utils.isEmpty(course?.list_child_courses)
          ? course?.list_child_courses[0].time_block_unit
          : 0;
        const nowMomentJp = momentVN();
        const startTime = moment(orderHasCourse?.ordered_at, DATE_TIME_SECONDS_FORMAT);
        const spendingTime = moment.duration(nowMomentJp.diff(startTime)).asSeconds();
        const timeOrder = course.time_block_unit * 60 + extendTimeBlock * numberExtendCourse * 60;
        setSpendingTime(spendingTime);
        setTimeOrder(timeOrder);
        setNumberExtendCourse(numberExtendCourse);
      }, Utils.REFRESH_SECOND());
      
      if (!Utils.isEmpty(orderHasCourse)) {
        setOrderCourse(orderHasCourse);
      }
    }
    
    return () => {
      clearInterval(timerCountdownInterval);
    };
  }, [course]);
  
  const getNumberExtendCourse = (orderGroup) => {
    return Array.isArray(orderGroup?.orders)
      ? orderGroup.orders.filter(
        (order) =>
          order.order_type == ORDER_TYPE.ORDER_EXTEND_COURSE &&
          order.status != ORDER_STATUS.STATUS_CANCEL
      ).length
      : 0;
  };
  
  const getOrderHasCourse = (orderGroup) => {
    return Array.isArray(orderGroup?.orders)
      ? orderGroup.orders?.find(
        (order) =>
          !Utils.isEmpty(order.m_course) &&
          order.order_type == ORDER_TYPE.ORDER_COURSE &&
          order.status != ORDER_STATUS.STATUS_CANCEL
      )
      : [];
  };
  
  const handleOnClick = () => {
    onClick(ordergroup, tableGroupName);
  };
  
  const showTimeTable = () => {
    let result = '';
    if (!isEmpty(course) && !Utils.isEmpty(course?.list_child_courses)) {
      if (
        spendingTime <= timeOrder &&
        spendingTime <= course.time_block_unit * 60
      ) {
        result = `${getTimerBySeconds(spendingTime)}`;
      }
      // extend course
      if (
        spendingTime > timeOrder ||
        (spendingTime <= timeOrder &&
          spendingTime > course.time_block_unit * 60 &&
          numberExtendCourse > 0)
      ) {
        result = `${getTimerBySeconds(course.time_block_unit * 60)} (+ ${getTimerBySeconds(
          spendingTime - course.time_block_unit * 60
        )}) `;
      }
    }
    
    // Case: not setting extend
    if (!isEmpty(course) && Utils.isEmpty(course?.list_child_courses)) {
      if (spendingTime <= timeOrder && spendingTime <= course.time_block_unit * 60) {
        result = `${getTimerBySeconds(spendingTime)}`;
      } else {
        result = `${getTimerBySeconds(course.time_block_unit * 60)} (${getTimerBySeconds(
          spendingTime - timeOrder
        )}) `;
      }
    }
    
    return result;
  };
  
  return (
    <div
      className={classes.root}
      style={
        !isEmpty(ordergroup) && table.hash_id != tableGroupName.firstId ? styles.disabledTable : {}
      }
    >
      <Card className={`${classes.card} ${table.hash_id === state.table.hash_id ? 'selected' : ''}`}>
        <div className={table.hash_id === state.table.hash_id ? classes.cardSelected : null}>
          <div
            className={[
              classes.cardContent,
              classes.header,
              table.hash_id === tableGroupName.firstId && isEmpty(ordergroup)
                ? classes.headerInActive
                : (ordergroup?.status == ORDER_GROUP_STATUS.REQUEST_CHECKOUT
                  ? classes.headerRequestCheckout
                  : (!ordergroup?.hasOrderNotServed)
                    ? classes.headerAllOrderServed
                    : classes.headerActive),
              table.hash_id === state.table.hash_id ? 'selected' : null,
              classes.disabled,
            ].join(' ')}
          >
            <Box display={'flex'} alignItems={'center'}>
              <Box width={'30%'} className={classes.textBold}>
                {tableGroupName.name.length > 0 ? tableGroupName.name : table.code}
              </Box>
              <Box width={'70%'} className={classes.normalText}>
                {
                  !isEmpty(ordergroup) &&
                  ordergroup?.status == ORDER_GROUP_STATUS.PRE_ORDER ||
                  ordergroup?.status == ORDER_GROUP_STATUS.ORDERING
                    ? 'Đang sử dụng' : null
                }
                {
                  !isEmpty(ordergroup) &&
                  ordergroup?.status == ORDER_GROUP_STATUS.REQUEST_CHECKOUT
                    ? 'Yêu cầu thanh toán' : null
                }
                {
                  !isEmpty(ordergroup) &&
                  ordergroup?.status == ORDER_GROUP_STATUS.WAITING_CHECKOUT
                    ? 'Chờ thanh toán' : null
                }
                {
                  isEmpty(ordergroup) ? 'Trống' : null
                }
              </Box>
            </Box>
          </div>
          
          <div className={[classes.cardOrder, classes.disabled]} onClick={() => handleOnClick()}>
            <OrderCard
              selected={table.hash_id === state.table.hash_id}
              filterStatus={filterStatus}
              orders={
                !isEmpty(ordergroup) && table.hash_id === tableGroupName.firstId
                  ? sortBy(ordergroup.orders, 'status').filter(
                    (item) => item.status !== ORDER_STATUS.STATUS_CANCEL
                  )
                  : []
              }
              course={course}
              ordergroup={ordergroup}
              overTimeCourse={
                !!(!isEmpty(course) &&
                  Utils.isEmpty(course?.list_child_courses) &&
                  orderCourse?.status != ORDER_STATUS.STATUS_CANCEL &&
                  spendingTime &&
                  spendingTime > timeOrder)
              }
            />
          </div>
          <div className={classes.cardFooter}>
            <div className={classes.cardFooterLeft}>
              {!isEmpty(ordergroup) ? ordergroup.number_of_customers + ' người' : ''}
            </div>
            <div className={classes.cardFooterRight}>
              {!isEmpty(ordergroup) ? ordergroup.time_create : ' '}
            </div>
            {!isEmpty(course) && orderCourse?.status != ORDER_STATUS.STATUS_CANCEL ? (
              <div
                className={
                  Utils.isEmpty(course?.list_child_courses) &&
                  spendingTime &&
                  spendingTime > timeOrder
                    ? `${classes.cardFooterRight} ${classes.cardTimerDangerCourse}`
                    : `${classes.cardFooterRight} ${classes.cardTimerCourse}`
                }
              >
                {showTimeTable()}
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
};

TableCard.propTypes = {
  table: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  selectTableId: PropTypes.string,
  filterStatus: PropTypes.array,
};

TableCard.defaultProps = {
  table: {
    code: '',
    hash_id: '',
    m_shop_id: 0,
    status: 0,
  },
  filterStatus: [0, 1, 2],
};

export default TableCard;
