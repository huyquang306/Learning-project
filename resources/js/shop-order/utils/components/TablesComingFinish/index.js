import React, { useContext, useEffect, useState } from 'react';
import ModalAdminTableComingFinish from './ModalAdminTableComingFinish';
import ModalEndTimeOrderCourse from './ModalEndTimeOrderCourse';

// Services
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Base Components
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import FlashMessage from 'js/shared-order/components/FlashMessage';

// Library
import Utils from 'js/shared/utils';
import { momentVN } from 'js/utils/helpers/timer';
import { ORDER_GROUP_STATUS, ORDER_TYPE, ORDER_STATUS } from 'js/utils/helpers/courseHelper';
import moment from 'moment';
import 'moment-timezone';
moment.locale('vi');
import PubSub from 'pubsub-js';

// Helper
import { SHOP_ALERT_FLG, SHOP_END_TIME_ALERT_FLG } from 'js/utils/helpers/courseHelper';

const DATE_TIME_SECONDS_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const ORDER_GROUP_ALERTED_KEY = 'orderGroupAlerted';
const TYPE_CHECK_ALERT_TIME = 'checkShowAlertPopup';
const TYPE_CHECK_END_TIME = 'checkShowEndTimePopup';
const ORDER_GROUP_SHOW_ENDED_TIME = 'orderGroupHadShowEndTime';
const KEY_UPDATE_DELETED_ORDERGROUP = 'publishKeyFreshDeletedOrdergroup';
const KEY_UPDATE_CHECKED_OUT_ORDERGROUP = 'publishKeyFreshCheckedOutOrdergroup';
const DEFAULT_END_TIME = 5;

const getOrderGroupsHasCourse = (orderGroups) => {
  return orderGroups.filter((orderGroup) => {
    // check orderGroup has not been request checkout
    if (
      orderGroup.status === ORDER_GROUP_STATUS.ORDERING ||
      orderGroup.status === ORDER_GROUP_STATUS.PRE_ORDER
    ) {
      const orderHasCourse = getOrderHasCourse(orderGroup);
      // check orderGroup has orderCourse and Course has extend
      return !!orderHasCourse;
    }

    return false;
  });
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

const getCourse = (orderGroup) => {
  return Array.isArray(orderGroup?.orders)
    ? orderGroup?.orders?.find(
        (order) =>
          !Utils.isEmpty(order.m_course) &&
          order.order_type == ORDER_TYPE.ORDER_COURSE &&
          order.status != ORDER_STATUS.STATUS_CANCEL
      )?.m_course
    : [];
};

const makeAlertOrderGroup = (orderGroup, isShow = true) => ({
  isShow,
  orderGroupHashId: orderGroup.hash_id,
  orderGroup: orderGroup,
  course: getCourse(orderGroup),
});

const checkAlertExtend = (orderGroup, typeCheck) => {
  const course = getCourse(orderGroup);
  const orderHasMainCourse = getOrderHasCourse(orderGroup);
  const numberExtendCourse = Array.isArray(orderGroup?.orders)
    ? orderGroup.orders.filter((order) => order.order_type == ORDER_TYPE.ORDER_EXTEND_COURSE).length
    : 0;
  const extendTimeBlock = !Utils.isEmpty(course?.list_child_courses)
    ? course?.list_child_courses[0].time_block_unit
    : 0;
  const startTime = orderHasMainCourse?.ordered_at;
  const nowMomentJp = momentJP();

  let subtractTime = 0;
  if (typeCheck == TYPE_CHECK_END_TIME) {
    subtractTime = DEFAULT_END_TIME;
  } else {
    subtractTime = course.alert_notification_time;
  }

  let beforeExtendTime = moment(startTime, DATE_TIME_SECONDS_FORMAT)
    .add(course.time_block_unit, 'minutes')
    .add(extendTimeBlock * numberExtendCourse, 'minutes')
    .subtract(subtractTime, 'minutes');

  beforeExtendTime = moment(
    beforeExtendTime.format(DATE_TIME_SECONDS_FORMAT),
    DATE_TIME_SECONDS_FORMAT
  );

  let afterExtendTime = moment(startTime, DATE_TIME_SECONDS_FORMAT)
    .add(course.time_block_unit, 'minutes')
    .add(extendTimeBlock * numberExtendCourse, 'minutes');
  afterExtendTime = moment(
    afterExtendTime.format(DATE_TIME_SECONDS_FORMAT),
    DATE_TIME_SECONDS_FORMAT
  );

  if (typeCheck == TYPE_CHECK_END_TIME) {
    return beforeExtendTime <= nowMomentJp;
  }

  return beforeExtendTime <= nowMomentJp && nowMomentJp <= afterExtendTime;
};

const getOrderGroupsComingFinish = (orderGroups, typeCheck) => {
  const orderGroupsHasCourse = getOrderGroupsHasCourse(orderGroups);

  return Array.isArray(orderGroupsHasCourse)
    ? orderGroupsHasCourse.filter((orderGroup) => {
        const course = getCourse(orderGroup);
        const orderHasMainCourse = getOrderHasCourse(orderGroup);
        if (
          course &&
          orderHasMainCourse?.ordered_at &&
          orderHasMainCourse?.status != ORDER_STATUS.STATUS_CANCEL &&
          (
            (
              typeCheck == TYPE_CHECK_END_TIME &&
              course?.shop_end_time_alert_flg === SHOP_END_TIME_ALERT_FLG.STATUS_ON
              ) ||
            (
              typeCheck == TYPE_CHECK_ALERT_TIME &&
              course?.alert_notification_time &&
              course?.shop_alert_flg === SHOP_ALERT_FLG.STATUS_ON
            )
          )
        ) {
          return checkAlertExtend(orderGroup, typeCheck);
        }

        return false;
      })
    : [];
};

/*
 * check orderGroup that has just expired
 */
const checkOrderGroupHasJustExpired = (orderGroup) => {
  const course = getCourse(orderGroup);
  const orderHasMainCourse = getOrderHasCourse(orderGroup);
  if (course) {
    const numberExtendCourse = orderGroup.orders.filter(
      (order) => order.order_type == ORDER_TYPE.ORDER_EXTEND_COURSE
    ).length;
    const extendTimeBlock = !Utils.isEmpty(course?.list_child_courses)
      ? course?.list_child_courses[0].time_block_unit
      : 0;
    const startTime = orderHasMainCourse?.ordered_at;
    const nowMomentJp = momentJP();
    const maxFinishDate = moment(startTime, DATE_TIME_SECONDS_FORMAT)
      .add(course.time_block_unit, 'minutes')
      .add(1, 'days')
      .format(DATE_TIME_SECONDS_FORMAT);
    const maxFinishMoment = moment(maxFinishDate, DATE_TIME_SECONDS_FORMAT);

    let expiredTime = moment(startTime, DATE_TIME_SECONDS_FORMAT)
      .add(course.time_block_unit, 'minutes')
      .add(extendTimeBlock * numberExtendCourse, 'minutes');
    expiredTime = moment(expiredTime.format(DATE_TIME_SECONDS_FORMAT), DATE_TIME_SECONDS_FORMAT);

    return nowMomentJp >= expiredTime && nowMomentJp <= maxFinishMoment;
  }

  return false;
};

let listFetchOrder = [];

const TablesComingFinish = (props) => {
  const [shop] = useContext(ShopInfoContext);
  const [orderGroups, setOrderGroups] = useState([]);
  const [alertOrderGroups, setAlertOrderGroups] = useState([]);
  const [endTimeOrderGroups, setEndTimeOrderGroups] = useState([]);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };
  
  const showSuccessMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'success',
    });
  };
  
  const showErrorMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'error',
    });
  };

  // Refresh data after deleted ordergroup
  useEffect(() => {
    PubSub.subscribe(KEY_UPDATE_DELETED_ORDERGROUP, refreshDataAfterDeleteOrderGroup);
  }, [PubSub.subscribe(KEY_UPDATE_DELETED_ORDERGROUP, refreshDataAfterDeleteOrderGroup)]);

  const refreshDataAfterDeleteOrderGroup = (msg, data) => {
    if (msg === KEY_UPDATE_DELETED_ORDERGROUP && !Utils.isEmpty(data)) {
      fetchOrderGroup();
    }
  };

  // Refresh data after checked out ordergroup
  useEffect(() => {
    PubSub.subscribe(KEY_UPDATE_CHECKED_OUT_ORDERGROUP, refreshDataAfterCheckOutOrderGroup);
  }, [PubSub.subscribe(KEY_UPDATE_CHECKED_OUT_ORDERGROUP, refreshDataAfterCheckOutOrderGroup)]);

  const refreshDataAfterCheckOutOrderGroup = (msg, data) => {
    if (msg === KEY_UPDATE_CHECKED_OUT_ORDERGROUP && !Utils.isEmpty(data)) {
      fetchOrderGroup();
    }
  };

  useEffect(() => {
    fetchOrderGroup();
    checkComingFinish();
  }, []);

  useEffect(() => {
    const timerRefreshData = setInterval(() => {
      fetchOrderGroup();
    }, Utils.REFRESH_CYCLE_DATA());

    return () => clearInterval(timerRefreshData);
  }, []);

  useEffect(() => {
    const timerCountdownInterval = setInterval(() => {
      checkComingFinish();
    }, Utils.REFRESH_SECOND());

    return () => clearInterval(timerCountdownInterval);
  });

  useEffect(() => {
    const autoExtendInterval = setInterval(() => {
      autoExtendCourseNoSetAlert();
    }, Utils.REFRESH_FIVE_SECONDS());

    return () => clearInterval(autoExtendInterval);
  }, [orderGroups]);

  const fetchOrderGroup = async () => {
    if (shop.hashId) {
      try {
        const result = await ShopOrderApiService.getOrderGroupSummary(shop.hashId, false, {
          status: `${ORDER_STATUS.STATUS_ORDER},${ORDER_STATUS.STATUS_FINISH},${ORDER_STATUS.STATUS_SHIPPING},${ORDER_STATUS.STATUS_SHIPPED}`,
        });
        setOrderGroups(result);
      } catch (error) {
        setToast({ isShow: true, status: 'error', message: error.message });
      }
    }
  };

  const removeOrderGroupNotComingFinish = (orderGroupsComingFinish) => {
    const orderGroupsAlerted = JSON.parse(localStorage.getItem(ORDER_GROUP_ALERTED_KEY)) || [];
    const newOrderGroupHashIds = orderGroupsAlerted.filter((orderGroupHashId) => {
      const existsOrderGroup = orderGroupsComingFinish.find(
        (orderGroupTmp) => orderGroupTmp.hash_id === orderGroupHashId
      );

      return !!existsOrderGroup;
    });
    localStorage.setItem(ORDER_GROUP_ALERTED_KEY, JSON.stringify(newOrderGroupHashIds));
  };

  const checkComingFinish = async () => {
    let orderGroupsAlerted = JSON.parse(localStorage.getItem(ORDER_GROUP_ALERTED_KEY)) || [];
    let alertOrderGroupsClone = Utils.cloneDeep(alertOrderGroups);
    const orderGroupsComingFinish = getOrderGroupsComingFinish(orderGroups, TYPE_CHECK_ALERT_TIME);

    // Get list ordergroups end time course
    const orderGroupsEndTime = getOrderGroupsComingFinish(orderGroups, TYPE_CHECK_END_TIME);
    if (!Utils.isEmpty(orderGroupsEndTime)) {
      let orderGroupsShowEndedTime =
        JSON.parse(localStorage.getItem(ORDER_GROUP_SHOW_ENDED_TIME)) || [];
      const orderGroupsNotShowEndTime = orderGroupsEndTime.filter(
        (orderGroupTmp) => !orderGroupsShowEndedTime.includes(orderGroupTmp.hash_id)
      );
      setEndTimeOrderGroups(
        orderGroupsNotShowEndTime.map((orderGroupTmp) => makeAlertOrderGroup(orderGroupTmp))
      );
    }

    const orderGroupsNotAlert = orderGroupsComingFinish.filter(
      (orderGroupTmp) => !orderGroupsAlerted.includes(orderGroupTmp.hash_id)
    );
    if (orderGroups.length) {
      await removeOrderGroupNotComingFinish(orderGroupsComingFinish);
    }

    if (orderGroupsNotAlert && orderGroupsNotAlert.length) {
      const orderGroupsNotAlertIds = orderGroupsNotAlert.map((orderGroupTmp) => orderGroupTmp.id);
      try {
        const result = await ShopOrderApiService.postCheckExtend(shop.hashId, {
          orderGroupIds: orderGroupsNotAlertIds,
        });
        if (result.orderGroupIds.length) {
          orderGroupsAlerted = JSON.parse(localStorage.getItem(ORDER_GROUP_ALERTED_KEY)) || [];
          result.orderGroupIds.forEach((orderGroupId) => {
            const alertOrderGroup = orderGroups.find(
              (orderGroupTmp) => orderGroupTmp.id === orderGroupId
            );
            const existOrderGroup = orderGroupsAlerted.find(
              (hashIdTmp) => alertOrderGroup?.hash_id === hashIdTmp
            );
            if (alertOrderGroup && !existOrderGroup) {
              alertOrderGroupsClone.push(makeAlertOrderGroup(alertOrderGroup));

              // save this to not replay alert
              orderGroupsAlerted.push(alertOrderGroup.hash_id);
              localStorage.setItem(ORDER_GROUP_ALERTED_KEY, JSON.stringify(orderGroupsAlerted));
            }
          });
        }
      } catch (error) {
        setToast({ isShow: true, status: 'error', message: error.message });
      }
    }

    setAlertOrderGroups(alertOrderGroupsClone);
  };

  const autoExtendCourseNoSetAlert = () => {
    // Cancelled extend course -> overtime -> auto extend
    orderGroups.forEach(async (orderGroupTmp) => {
      if (checkOrderGroupHasJustExpired(orderGroupTmp)) {
        // Get course
        const course = getCourse(orderGroupTmp);
        // Case: Course donot have extend
        if (!Utils.isEmpty(course.list_child_courses) &&
          (orderGroupTmp.status === ORDER_GROUP_STATUS.PRE_ORDER || orderGroupTmp.status === ORDER_GROUP_STATUS.ORDERING)) {
          const result = await ShopOrderApiService.postCheckExtend(shop.hashId, {
            orderGroupIds: [orderGroupTmp.id],
          });

          if (
            result.orderGroupIds?.length > 0 &&
            !listFetchOrder.find((orderGroup) => orderGroup === orderGroupTmp.hash_id)
          ) {
            try {
              listFetchOrder.push(orderGroupTmp.hash_id);
              const orderGroupResponse = await ShopOrderApiService.postAutoCalculateExtend(
                shop.hashId,
                orderGroupTmp.hash_id
              );
              if (orderGroupResponse) {
                const orderGroupClone = Utils.cloneDeep(orderGroups);
                const orderGroupIndex = orderGroupClone.findIndex(
                  (orderGroupTmp) => orderGroupTmp.id === orderGroupResponse.id
                );
                if (orderGroupIndex > -1) {
                  orderGroupClone[orderGroupIndex] = orderGroupResponse;
                }
                setOrderGroups(orderGroupClone);
                // Close popup end time
                const endTimeOrderGroupsClone = Utils.cloneDeep(endTimeOrderGroups);
                const endTimeIndex = endTimeOrderGroupsClone.findIndex(
                  (endTimeOrderGroupTmp) => endTimeOrderGroupTmp.orderGroupHashId === orderGroupResponse.hash_id
                );
                if (endTimeIndex > -1) {
                  endTimeOrderGroupsClone[endTimeIndex].isShow = false;
                  endTimeOrderGroupsClone.splice(endTimeIndex, 1);
                  setEndTimeOrderGroups(endTimeOrderGroupsClone);
                }
                listFetchOrder = listFetchOrder.filter((orderGroup) => orderGroup !== orderGroupResponse.hash_id);
              }
            } catch (error) {
              setToast({ isShow: true, status: 'error', message: error.message });
            }
          }
        }
      }
    });
  };

  const onCloseModal = (alertOrder) => {
    let alertOrderGroupsClone = Utils.cloneDeep(alertOrderGroups);
    const index = alertOrderGroupsClone.findIndex(
      (orderGroupTmp) => orderGroupTmp.orderGroupHashId === alertOrder.orderGroupHashId
    );
    if (index > -1) {
      alertOrderGroupsClone[index].isShow = false;
      alertOrderGroupsClone.splice(index, 1);
      setAlertOrderGroups(alertOrderGroupsClone);
    }
  };

  const goToCheckoutOrderGroup = (endTimeOrderGroup) => {
    // delete state
    let endTimeOrderGroupsClone = Utils.cloneDeep(endTimeOrderGroups);
    const index = endTimeOrderGroupsClone.findIndex(
      (orderGroupTmp) => orderGroupTmp.orderGroupHashId === endTimeOrderGroup.orderGroupHashId
    );
    if (index > -1) {
      endTimeOrderGroupsClone[index].isShow = false;
      endTimeOrderGroupsClone.splice(index, 1);
      setEndTimeOrderGroups(endTimeOrderGroupsClone);
    }
  };

  return (
    <>
      {alertOrderGroups.map((alertOrder) => (
        <ModalAdminTableComingFinish
          key={alertOrder.orderGroupHashId}
          open={alertOrder.isShow}
          onClose={() => onCloseModal(alertOrder)}
          orderGroup={alertOrder.orderGroup}
          course={alertOrder.course}
          showWarningMessage={showWarningMessage}
          showSuccessMessage={showSuccessMessage}
          showErrorMessage={showErrorMessage}
        />
      ))}

      {endTimeOrderGroups.map((endTimeOrderGroup) => (
        <ModalEndTimeOrderCourse
          key={endTimeOrderGroup.orderGroupHashId}
          open={endTimeOrderGroup.isShow}
          onClose={() => goToCheckoutOrderGroup(endTimeOrderGroup)}
          orderGroup={endTimeOrderGroup.orderGroup}
          course={endTimeOrderGroup.course}
          refreshDataOrderGroup={fetchOrderGroup}
          showWarningMessage={showWarningMessage}
          showSuccessMessage={showSuccessMessage}
          showErrorMessage={showErrorMessage}
        />
      ))}

      <FlashMessage
        isOpen={toast.isShow}
        onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
        status={toast.status}
        message={toast.message}
      />
    </>
  );
};

TablesComingFinish.propTypes = {};
TablesComingFinish.defaultProps = {};

export default TablesComingFinish;
