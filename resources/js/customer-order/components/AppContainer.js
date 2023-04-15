import React, { useState, useEffect } from 'react';
import Utils from 'js/shared/utils';
import { momentJP, TIME_SECONDS_FORMAT } from 'js/utils/helpers/timer';
import PubSub from 'pubsub-js';

import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';
import ModalExtendTimeOrderCourse from './ModalExtendTimeOrderCourse';
import ModalEndTimeOrderCourse from './ModalEndTimeOrderCourse';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import {
  ORDER_TYPE,
  ORDER_GROUP_STATUS,
  USER_ALERT_FLG,
  USER_END_TIME_ALERT_FLG,
} from 'js/utils/helpers/courseHelper';
import { Box } from '@material-ui/core';

// Library
import moment from 'moment';
import 'moment-timezone';
moment.locale('ja');

// Style
import 'css/style.css';

// context
import UserInfoContext from 'js/customer-order/components/UserInfoContext';

// Page Components
import PageOrder from 'js/customer-order/components/PageOrder';
import PageShopTop from 'js/customer-order/components/PageShopTop';
import PagePreOrder from 'js/customer-order/components/PagePreOrder';
import PageInstagram from 'js/customer-order/components/PageInstagram';
import PageCheckout from 'js/customer-order/components/PageCheckout';
import PageCallStaff from 'js/customer-order/components/PageCallStaff';
import PageCategoryMenu from 'js/customer-order/components/PageCategoryMenu';
import PageThanksForCustomer from 'js/customer-order/components/PageThanksForCustomer';
import PageSignin from 'js/customer-order/components/PageSignin';
import PageWelcome from 'js/customer-order/components/PageWelcome';
import PageUserInfo from 'js/customer-order/components/PageUserInfo';
import PageCourseList from 'js/customer-order/components/PageCourseList';
import PageListMenuInCourse from 'js/customer-order/components/PageListMenuInCourse';
import UseOnboardingScript from 'js/shared/onboarding';
import PageBoostToInstagram from 'js/customer-order/components/PageBoostToInstagram';
import PageTableSignin from 'js/customer-order/components/PageTableSignin';
import Modal from 'js/shared-order/components/Modal';
import Button from 'js/shared-order/components/Button.js';
// Utils
import { deleteCookie, getCookie, CUSTOMER_AUTH_KEY } from 'js/utils/components/cookie/cookie';
import { ON_BOARDING_CONFIG, PUB_SUB_KEY } from 'js/utils/helpers/const';
import { onConnectWebSocket } from 'js/utils/helpers/socket';

const StyledAppContainer = styled.div`
  margin: 0px;
  width: 100vw;
  position: relative;
  background: #ffffff;
`;

//
// Router
//
const RouterBase = (props) => {
  return (
    <Router basename={process.env.MIX_BASENAME_CUSTOMER_ORDER}>
      <Switch>{props.children}</Switch>
    </Router>
  );
};
RouterBase.propTypes = {
  children: PropTypes.node,
};

const RouterSignedInOut = () => {
  return (
    <StyledAppContainer>
      {/* Change background color body, all user page */}
      <style>
        {'body { background-color: white; min-height: unset; font-family: "Open Sans", sans-serif; }' +
          'html {scroll-behavior: auto;}'}
      </style>

      <RouterBase>
        {/* 新規登録・サインイン */}
        <Route path="/table-register" exact component={PageTableSignin} />
        <Route path="/register" exact component={PageSignin} />
        <Route path="/welcome" exact component={PageWelcome} />
        <Route path="/user-info" exact component={PageUserInfo} />
        <Route path="/:shop_hash_id/thanks-for-customer" exact component={PageThanksForCustomer} />
        <Route path="/:shop_hash_id" exact component={PageShopTop} />
        <Route path="/:shop_hash_id/pre_order/list" exact component={PagePreOrder} />
        <Route path="/:shop_hash_id/order/list" exact component={PageOrder} />
        <Route path="/:shop_hash_id/billing" exact component={PageCheckout} />
        <Route path="/:shop_hash_id/callstaff" exact component={PageCallStaff} />
        <Route path="/:shop_hash_id/instagram/:business_name" exact component={PageInstagram} />
        <Route
          path="/:shop_hash_id/boost_to_instagram/:business_name"
          exact
          component={PageBoostToInstagram}
        />
        <Route
          path="/:shop_hash_id/category/:category_hash_id/menu/list"
          exact
          component={PageCategoryMenu}
        />
        <Route path="/:shop_hash_id/recommend/menu/list" exact component={PageCategoryMenu} />
        <Route path="/:shopHashId/course/list" exact component={PageCourseList} />
        <Route
          path="/:shopHashId/course/:courseHashId/block/:blockHashId"
          exact
          component={PageListMenuInCourse}
        />
      </RouterBase>
    </StyledAppContainer>
  );
};

const CANCEL_EXTEND_KEY = 'cancelExtendOrderGroup';
const CONFIRM_ACCOUNTING_KEY = 'confirmAccountingOrdergroup';
const DEFAULT_END_TIME = 5;

const AppContainer = () => {
  const customerAuth = getCookie(CUSTOMER_AUTH_KEY);
  let shopHashId = localStorage.getItem('shopHash');
  let shopName = localStorage.getItem('shopName');

  let ordergroupHashId = localStorage.getItem('ordergroupHash');
  // local state
  const [userInfo, setUserInfo] = useState(customerAuth);
  const [isShowConfirmExtendTime, setIsShowConfirm] = useState(false);
  const [isShowEndTimeCourse, setIsShowEndTimeCourse] = useState(false);
  const [orderGroup, setOrderGroup] = useState(null);
  const [course, setCourse] = useState(null);
  const [extendEndTime, setExtendEndTime] = useState();
  const [orderGroupStatus, setOrderGroupStatus] = useState();
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [showModalExpired, setShowModalExpired] = useState(false);

  useEffect(() => {
    PubSub.subscribe(PUB_SUB_KEY.DEACTIVE_SHOP, () => {
      setShowModalExpired(true);
    });
  }, []);

  useEffect(() => {
    shopHashId = localStorage.getItem('shopHash');
    ordergroupHashId = localStorage.getItem('ordergroupHash');

    fetchOrderGroup();
    checkComingFinishCourse();
  }, []);

  useEffect(() => {
    const timerOrderGroupRefresh = setInterval(() => {
      fetchOrderGroup();
    }, Utils.REFRESH_CYCLE_DATA());

    return () => clearInterval(timerOrderGroupRefresh);
  }, []);

  useEffect(() => {
    const timerCountdownInterval = setInterval(() => {
      checkComingFinishCourse();
    }, Utils.REFRESH_SECOND());

    return () => clearInterval(timerCountdownInterval);
  });
  
  const handleLogout = () => {
    deleteCookie(CUSTOMER_AUTH_KEY);
    deleteCookie('userHashId');
    setShowModalExpired(false);
    window.location.href = `/shop-or/register`;
  };
  
  // Connect to endpoint API Gateway
  useEffect(() => {
    onConnectWebSocket(shopHashId);
  }, [shopHashId]);

  const renderActions = () => (
    <>
      <Button onClick={handleLogout} bgcolor="#FFA04B" borderRadius="28px" borderColor="#828282">
        ログアウトする
      </Button>
    </>
  );

  const fetchOrderGroup = async () => {
    try {
      shopHashId = localStorage.getItem('shopHash');
      ordergroupHashId = localStorage.getItem('ordergroupHash');
      if (!shopHashId || !ordergroupHashId) {
        return;
      }

      const response = await CustomerOrderApiService.getStatusOrdergroup(
        shopHashId,
        ordergroupHashId
      );
      setOrderGroup(response);
      setCourse(response?.m_course);
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const checkComingFinishCourse = async () => {
    if (!orderGroup || !course) return;

    let nowDateTime = momentJP();
    const {
      alert_notification_time = 0,
      time_block_unit = 0,
      user_alert_flg = 0,
      user_end_time_alert_flg = 0,
    } = course;
    const cancelExtendOrderGroup = getCookie(CANCEL_EXTEND_KEY);
    const orderCourse = getOrderCourse();
    let startTimeJP = moment(orderCourse.ordered_at);
    const confirmAccountingOrdergroup = getCookie(CONFIRM_ACCOUNTING_KEY);

    // endtime = starttime + time_block_unit + extend * numberExtend
    const orderExtends = getOrderExtendCourse();
    let endTimeJP = startTimeJP.add(time_block_unit, 'minutes');
    if (orderExtends.length) {
      const timeExtend = orderExtends[0]?.m_course?.time_block_unit ?? 0;
      endTimeJP = endTimeJP.add(timeExtend * orderExtends.length, 'minutes');
    }
    let endTimeCourse = endTimeJP.clone();
    const timeShowPopupEndTime = endTimeCourse.subtract(DEFAULT_END_TIME, 'minutes');
    setExtendEndTime(endTimeJP.format(TIME_SECONDS_FORMAT));
    const alertExtendTime = endTimeJP.subtract(alert_notification_time, 'minutes');

    if (nowDateTime >= alertExtendTime && nowDateTime < timeShowPopupEndTime) {
      // show extend popup
      if (
        alert_notification_time > 0 &&
        cancelExtendOrderGroup !== orderGroup.hash_id &&
        orderGroup.status < ORDER_GROUP_STATUS.REQUEST_CHECKOUT &&
        user_alert_flg === USER_ALERT_FLG.STATUS_ON
      ) {
        const checkExtend = await CustomerOrderApiService.checkExtendOrderCourse(
          shopHashId,
          ordergroupHashId
        );
        if (checkExtend && checkExtend.isExtend) {
          setIsShowConfirm(true);
          deleteCookie(CONFIRM_ACCOUNTING_KEY);
        }
      }
    } else {
      deleteCookie(CANCEL_EXTEND_KEY);
    }

    // Show end time popup
    if (
      nowDateTime >= timeShowPopupEndTime &&
      (orderGroup.status < ORDER_GROUP_STATUS.REQUEST_CHECKOUT ||
        (orderGroup.status == ORDER_GROUP_STATUS.WAITING_CHECKOUT &&
          confirmAccountingOrdergroup !== orderGroup.hash_id)) &&
      user_end_time_alert_flg === USER_END_TIME_ALERT_FLG.STATUS_ON
    ) {
      if (isShowConfirmExtendTime) {
        setIsShowConfirm(false);
      }
      setIsShowEndTimeCourse(true);
      setOrderGroupStatus(orderGroup.status);
    }

    // Close popup alert and popup end time when orderGroup has been checked-out or deleted by shop
    if (orderGroup.status >= ORDER_GROUP_STATUS.CHECKED_OUT) {
      setIsShowConfirm(false);
      setIsShowEndTimeCourse(false);
    }
  };

  const getOrderCourse = () =>
    orderGroup &&
    orderGroup.orders &&
    orderGroup.orders.find((order) => order.order_type === ORDER_TYPE.ORDER_COURSE);

  const getOrderExtendCourse = () => {
    if (orderGroup && orderGroup.orders) {
      return orderGroup.orders.filter(
        (order) => order.order_type === ORDER_TYPE.ORDER_EXTEND_COURSE
      );
    }

    return [];
  };

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

  // Render
  return (
    <UserInfoContext.Provider value={[userInfo, setUserInfo]}>
      <RouterSignedInOut />
      <ModalExtendTimeOrderCourse
        open={isShowConfirmExtendTime}
        onClose={() => setIsShowConfirm(false)}
        shopHashId={shopHashId}
        ordergroupHashId={ordergroupHashId}
        extendCourseTime={orderGroup?.extend_course_time}
        extendCoursePrice={orderGroup?.extend_course_price}
        alertNotificationTime={course?.alert_notification_time}
        extendEndTime={extendEndTime}
        fetchOrderGroup={fetchOrderGroup}
        showWarningMessage={showWarningMessage}
        showSuccessMessage={showSuccessMessage}
      />
      <ModalEndTimeOrderCourse
        open={isShowEndTimeCourse}
        onClose={() => setIsShowEndTimeCourse(false)}
        shopHashId={shopHashId}
        ordergroupHashId={ordergroupHashId}
        hasExtendCourse={!Utils.isEmpty(course?.child_courses) ? true : false}
        extendEndTime={extendEndTime}
        fetchOrderGroup={fetchOrderGroup}
        showWarningMessage={showWarningMessage}
        showSuccessMessage={showSuccessMessage}
        orderGroupStatus={orderGroupStatus}
      />
      <FlashMessage
        isOpen={toast.isShow}
        onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
        status={toast.status}
        message={toast.message}
      />

      <UseOnboardingScript
        shopInfo={{ hashId: shopHashId, name: shopName }}
        userGroupId={ON_BOARDING_CONFIG.USER_GROUP_ID.CUSTOMER}
        userGroupName={ON_BOARDING_CONFIG.USER_GROUP_NAME.CUSTOMER}
      />
      
      {window.location.pathname !== '/shop-or/register' && <Modal
        open={showModalExpired}
        title="お知らせ"
        actions={renderActions()}
        maxHeight="auto"
        minHeight="120px"
      >
        <Box textAlign="center" fontWeight={600} mt={8}>
          この店舗は無効です。
        </Box>
      </Modal>}
    </UserInfoContext.Provider>
  );
};

export default AppContainer;
