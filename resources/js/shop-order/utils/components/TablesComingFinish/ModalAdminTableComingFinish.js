import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PubSub from 'pubsub-js';
import { map } from 'lodash';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

// Services
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Library
import Utils from 'js/shared/utils';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Base Components
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Utils
import { ORDER_TYPE, ORDER_STATUS } from 'js/utils/helpers/courseHelper';
import { PUB_SUB_KEY } from 'js/utils/helpers/const';

// Styles
const useStyles = makeStyles({
  modalContent: {
    width: '500px',
  },
  tableName: {
    backgroundColor: '#BDBDBD',
    padding: '10px 0',
  },
  boxAlertContent: {
    margin: 'auto',
    marginTop: '50px',
    width: '300px',
    padding: '10px 0 50px 0',
    border: '2px solid #FFA04B',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255, 160, 75, 0.7)',
  },
});

const DEFAULT_END_TIME = 5;

const ModalAdminTableComingFinish = (props) => {
  const [shop] = useContext(ShopInfoContext);
  const classes = useStyles();
  const { open, orderGroup } = props;

  useEffect(() => {
    closeModalWhenOverTimeCourse();
  }, []);

  useEffect(() => {
    if (open) {
      // When show a new modal, ring alarm
      PubSub.publish(PUB_SUB_KEY.RING_ALARM, null);
    }
  }, [open]);

  const closeModalWhenOverTimeCourse = () => {
    const { orderGroup } = props;
    const course = getCourse(orderGroup);
    const timeOut = (course?.alert_notification_time - DEFAULT_END_TIME) * 60 * 1000;

    setTimeout(() => {
      props.onClose();
    }, timeOut);
  };

  const renderActions = () => {
    if (!Utils.isEmpty(props.course.list_child_courses)) {
      return (
        <>
          <ButtonCustom
            title="延長しない"
            bgcolor="#828282"
            borderColor="#828282"
            borderRadius="28px"
            width="176px"
            padding="8px 0px"
            onClick={cancelExtendCourse}
          />
          <ButtonCustom
            title="延長する"
            borderRadius="28px"
            bgcolor="#FFA04B"
            borderColor="#FFA04B"
            width="176px"
            padding="8px 0px"
            onClick={handleExtendTime}
          />
        </>
      );
    } else {
      return (
        <>
          <ButtonCustom
            title="OK"
            borderRadius="28px"
            bgcolor="#FFA04B"
            borderColor="#FFA04B"
            width="176px"
            padding="8px 0px"
            onClick={props.onClose}
          />
        </>
      );
    }
  };

  const cancelExtendCourse = () => {
    props.onClose();
  };

  const handleExtendTime = async () => {
    const { orderGroup } = props;
    const course = getCourse(orderGroup);
    const orderHasMainCourse = Array.isArray(orderGroup?.orders)
      ? orderGroup.orders?.find(
          (order) =>
            !Utils.isEmpty(order.m_course) &&
            order.order_type == ORDER_TYPE.ORDER_COURSE &&
            order.status != ORDER_STATUS.STATUS_CANCEL
        )
      : [];
    let data = {
      course_hash_id: course.list_child_courses[0].hash_id,
      course_price_hash_id: course.list_child_courses[0].list_course_prices[0].hash_id,
      number_of_customers: orderHasMainCourse?.quantity ? orderHasMainCourse.quantity : 0,
    };
    try {
      const response = await ShopOrderApiService.extendTimeOrderGroup(
        shop.hashId,
        orderGroup.hash_id,
        data
      );
      // Course has been extended by user before
      if (!response?.isExtend) {
        props.showSuccessMessage('既に延長されました！' );
      }
      // Extend course successfully
      if (response?.hash_id) {
        props.showSuccessMessage('延長しました。' );
      }
    } catch (error) {
      props.showErrorMessage(error.message);
    }
    setTimeout(() => {
      props.onClose();
    }, 1000);
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

  const getTablesCode = () => {
    const { orderGroup } = props;

    return orderGroup?.tables ? map(orderGroup.tables, 'code').join(', ') : '';
  };

  return (
    <Modal
      open={props.open}
      title="お知らせ"
      onClose={props.onClose}
      actions={renderActions()}
      maxWidth="500px"
      disableBackdropClick={true}
    >
      <div>
        <Box textAlign="center" className={classes.tableName}>
          <h3>{getTablesCode()}テーブル</h3>
        </Box>

        <Box>
          <Box textAlign="center" className={classes.boxAlertContent}>
            <Box>コースの制限時間まで</Box>
            {props.course.alert_notification_time ? (
              <Box>
                あと<strong>{props.course.alert_notification_time}分</strong>です。
              </Box>
            ) : null}
            {!Utils.isEmpty(props.course.list_child_courses) ? (
              <Box>※時間が過ぎた場合は自動で延長になりますので、ご注意ください。</Box>
            ) : null}
          </Box>
        </Box>
      </div>
    </Modal>
  );
};

// PropTypes
ModalAdminTableComingFinish.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  orderGroup: PropTypes.object,
  course: PropTypes.object,
};

// defaultProps
ModalAdminTableComingFinish.defaultProps = {
  open: false,
  onClose: () => {},
  orderGroup: {},
  course: {},
};

export default ModalAdminTableComingFinish;
