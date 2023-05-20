import { DATE_TIME_SECONDS_FORMAT, TIME_SECONDS_FORMAT, momentVN } from './timer';
import moment from 'moment';
moment.locale('ja');
import Utils from 'js/shared/utils';

const COURSE_STATUS_ACTIVE = 'active';
const BLOCK_STATUS_ACTIVE = 'active';
const COURSE_AVAILABLE_FLAG_TRUE = 1;
const COURSE_AVAILABLE_FLAG_FALSE = 0;

const ORDER_TYPE = {
  ORDER_MENU: 0,
  ORDER_COURSE: 1,
  ORDER_EXTEND_COURSE: 2,
  SERVE_SERVICE_TYPE: 3,
  ORDER_WITHOUT_MENU: 4
};

const ORDER_STATUS = {
  STATUS_ORDER: 0,
  STATUS_FINISH: 1,
  STATUS_CANCEL: 2,
  STATUS_SHIPPING: 3,
  STATUS_SHIPPED: 4,
};

const ORDER_GROUP_STATUS = {
  PRE_ORDER: 0,
  ORDERING: 1,
  REQUEST_CHECKOUT: 2,
  WAITING_CHECKOUT: 3,
  CHECKED_OUT: 4,
  CANCEL: 9,
};

const INITIAL_PROPOSE_FLG = {
  STATUS_OFF: 0,
  STATUS_ON: 1,
};

const SHOP_ALERT_FLG = {
  STATUS_OFF: 0,
  STATUS_ON: 1,
};

const USER_ALERT_FLG = {
  STATUS_OFF: 0,
  STATUS_ON: 1,
};

const SHOP_END_TIME_ALERT_FLG = {
  STATUS_OFF: 0,
  STATUS_ON: 1,
};

const USER_END_TIME_ALERT_FLG = {
  STATUS_OFF: 0,
  STATUS_ON: 1,
};

const getBlockNearestNow = (course, timeStartCheck = null) => {
  if (course?.list_course_prices) {
    return course.list_course_prices.find((coursePrice) => {
      if (coursePrice.status === BLOCK_STATUS_ACTIVE) {
        let checkTime = momentVN().format(TIME_SECONDS_FORMAT);
        let startTimeOfDay =  momentVN().startOf('day').format(TIME_SECONDS_FORMAT);
        let endTimeOfDay =  momentVN().endOf('day').format(TIME_SECONDS_FORMAT);
        startTimeOfDay = moment(startTimeOfDay, TIME_SECONDS_FORMAT);
        endTimeOfDay = moment(endTimeOfDay, TIME_SECONDS_FORMAT);
        if (timeStartCheck) {
          checkTime = moment(timeStartCheck, DATE_TIME_SECONDS_FORMAT).format(TIME_SECONDS_FORMAT);
        }
        checkTime = moment(checkTime, TIME_SECONDS_FORMAT);
        const blockStartTime = moment(coursePrice.block_time_start, TIME_SECONDS_FORMAT);
        const blockFinishTime = moment(coursePrice.block_time_finish, TIME_SECONDS_FORMAT);
        
        if (blockStartTime < blockFinishTime) {
          return blockStartTime <= checkTime && checkTime <= blockFinishTime;
        } else {
          return (blockStartTime <= checkTime && checkTime <= endTimeOfDay)
            ||  (startTimeOfDay <=  checkTime && checkTime <= blockFinishTime);
        }
      }
      
      return false;
    });
  }
  
  return null;
};

// return seconds
const getRemainingTimeByMainCourse = (orderGroup, course) => {
  const orderHasMainCourse = getOrderHasCourse(orderGroup);
  if (orderHasMainCourse.ordered_at) {
    const nowMomentJp = momentJP();
    const startTimeEat = moment(orderHasMainCourse.ordered_at, DATE_TIME_SECONDS_FORMAT);
    
    // time_block_unit - (now - ordered_at)
    const eatenTimeSeconds = moment.duration(nowMomentJp.diff(startTimeEat)).asSeconds();
    
    return course.time_block_unit * 60 - eatenTimeSeconds;
  }
  
  return 0;
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

const getNumberExtendCourse = (orderGroup) => {
  return Array.isArray(orderGroup?.orders)
    ? orderGroup.orders.filter(
      (order) =>
        order.order_type == ORDER_TYPE.ORDER_EXTEND_COURSE &&
        order.status != ORDER_STATUS.STATUS_CANCEL
    ).length
    : 0;
};

// return seconds
const getRemainingTime = (orderGroup, course) => {
  const orderHasMainCourse = getOrderHasCourse(orderGroup);
  const numberExtendCourse = getNumberExtendCourse(orderGroup);
  const extendTimeBlock = !Utils.isEmpty(course?.list_child_courses)
    ? course?.list_child_courses[0].time_block_unit
    : 0;
  let remainingSeconds = 0;
  if (orderHasMainCourse.ordered_at) {
    remainingSeconds = getRemainingTimeByMainCourse(orderGroup, course);
    if (numberExtendCourse && extendTimeBlock) {
      remainingSeconds += numberExtendCourse * extendTimeBlock * 60;
    }
    
    remainingSeconds = remainingSeconds > 0 ? remainingSeconds : 0;
  } else {
    remainingSeconds = course.time_block_unit * 60;
  }
  
  return Math.round(remainingSeconds);
};

const isOverTimeCourse = (orderGroup, course) => {
  const orderHasMainCourse = getOrderHasCourse(orderGroup);
  const numberExtendCourse = getNumberExtendCourse(orderGroup);
  const extendTimeBlock = course?.list_child_courses?.time_block_unit;
  let remainingSeconds = 0;
  if (orderHasMainCourse.ordered_at) {
    remainingSeconds = getRemainingTimeByMainCourse(orderGroup, course);
    if (numberExtendCourse && extendTimeBlock) {
      remainingSeconds += numberExtendCourse * extendTimeBlock * 60;
    }
  }
  
  return course.alert_notification_time && remainingSeconds <= 0;
};

export {
  COURSE_STATUS_ACTIVE,
  COURSE_AVAILABLE_FLAG_TRUE,
  COURSE_AVAILABLE_FLAG_FALSE,
  BLOCK_STATUS_ACTIVE,
  ORDER_TYPE,
  ORDER_GROUP_STATUS,
  ORDER_STATUS,
  getBlockNearestNow,
  getRemainingTimeByMainCourse,
  getRemainingTime,
  isOverTimeCourse,
  INITIAL_PROPOSE_FLG,
  SHOP_ALERT_FLG,
  USER_ALERT_FLG,
  SHOP_END_TIME_ALERT_FLG,
  USER_END_TIME_ALERT_FLG,
};
