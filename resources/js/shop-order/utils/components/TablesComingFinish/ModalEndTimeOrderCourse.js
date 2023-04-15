import React, {useState, useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import PubSub from 'pubsub-js';
import { map } from 'lodash';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import ModalPaymentRequest from 'js/shop-order/utils/components/OrderGroupPaymentRequest/ModalPaymentRequest';

// Components(Material-UI)
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Context
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Services
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Utils
import Utils from 'js/shared/utils';
import { ORDER_TYPE, ORDER_STATUS } from 'js/utils/helpers/courseHelper';
import { PUB_SUB_KEY } from 'js/utils/helpers/const';

const useStyles = makeStyles(() => ({
  modalContent: {
    maxWidth: '470px',
  },
  right: {
    fontSize: '24px',
    color: '#4F4F4F',
    fontWeight: 700,
  },
  lineDetail: {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    marginTop: '30%',
    marginLeft: '10%',
    marginRight: '10%',
  },
  boxConfirm: {
    width: '100%',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 160, 75, 0.7)',
    border: '2px solid #FFA04B',
  },
  tableName: {
    backgroundColor: '#BDBDBD',
    padding: '10px 0',
  },
}));

const ModalEndTimeOrderCourse = (props) => {
  const [shop] = useContext(ShopInfoContext);
  const classes = useStyles();
  const { open, orderGroup } = props;

  // Local state
  const [isShowEndTimePopup, setIsShowEndTimePopup] = useState(true);
  const [isSubmitExtendLoading, setIsSubmitExtendLoading] = useState(false);
  const [isSubmitWaitingPayLoading, setIsSubmitWaitingPayLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // When show a new modal, ring alarm
      PubSub.publish(PUB_SUB_KEY.RING_ALARM, null);
    }
  }, [open]);

  // Change spec: update from click to go to checkout => click to stop order
  const handleWaitingPaymentRequest = () => {
    // setIsShowEndTimePopup(false);
    updateToFinishedOrders();
    updateToWaittingPayment();
  };

  const updateToWaittingPayment = async () => {
    try {
      setIsSubmitWaitingPayLoading(true);
      let data = { flag: true };
      const response = await ShopOrderApiService.waittingPayment(shop.hashId, orderGroup.hash_id, data);
      if (response) {
        props.showSuccessMessage('Update successfully!');
        await props.refreshDataOrderGroup();
        PubSub.publish(PUB_SUB_KEY.KEY_FRESH_UPDATE_ORDER, orderGroup);
        props.onClose();
      }
    } catch (error) {
      props.showErrorMessage(error.message);
    } finally {
      setIsSubmitWaitingPayLoading(false);
    }
  };

  const updateToFinishedOrders = async () => {
    try {
      let isUpdate = true;
      let data = {
        update_orders: []
      };
      const ordersNotFinished = orderGroup?.orders?.filter(
        (order) => [ORDER_STATUS.STATUS_ORDER, ORDER_STATUS.STATUS_SHIPPING].includes(order.status)
      );
      ordersNotFinished.forEach(order => {
        data.update_orders.push({
          id: order?.id,
          quantity: order?.quantity,
          status: ORDER_STATUS.STATUS_FINISH
        });
      });
      await ShopOrderApiService.order(shop.hashId, orderGroup.hash_id, data, isUpdate);
    } catch (error) {
      props.showErrorMessage(error.message);
    }
  };

  const handleExtendTime = async () => {
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
      setIsSubmitExtendLoading(true);
      const response = await ShopOrderApiService.extendTimeOrderGroup(
        shop.hashId,
        orderGroup.hash_id,
        data
      );
      await props.refreshDataOrderGroup();
      PubSub.publish(PUB_SUB_KEY.KEY_FRESH_UPDATE_ORDER, orderGroup);
      // Course has been extended by user before
      if (!response?.isExtend) {
        props.showSuccessMessage('既に延長されました！');
      }
      // Extend course successfully
      if (response?.hash_id) {
        props.showSuccessMessage('延長しました。');
      }
    } catch (error) {
      props.showErrorMessage(error.message);
    } finally {
      setIsSubmitExtendLoading(false);
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

  const ModalActions = () => {
    if (!Utils.isEmpty(props?.course?.list_child_courses)) {
      return (
        <>
          <ButtonCustom
            title="延長する"
            borderRadius="28px"
            bgcolor="#828282"
            borderColor="#828282"
            width="176px"
            padding="8px 0px"
            isLoading={isSubmitExtendLoading}
            onClick={handleExtendTime}
          />
          <ButtonCustom
            title="注文を締め切る"
            bgcolor="#FFA04B"
            borderColor="#FFA04B"
            borderRadius="28px"
            width="176px"
            padding="8px 0px"
            isLoading={isSubmitWaitingPayLoading}
            onClick={handleWaitingPaymentRequest}
          />
        </>
      );
    } else {
      return (
        <>
          <ButtonCustom
            title="注文を締め切る"
            bgcolor="#FFA04B"
            borderColor="#FFA04B"
            borderRadius="28px"
            width="176px"
            padding="8px 0px"
            onClick={handleWaitingPaymentRequest}
          />
        </>
      );
    }
  };

  const getTablesCode = () => {
    return orderGroup?.tables ? map(orderGroup.tables, 'code').join(', ') : '';
  };

  return (
    <>
      {isShowEndTimePopup ? (
        <Modal
          open={props.open}
          title="お知らせ"
          actions={ModalActions()}
          maxWidth="450px"
          maxHeight="520px"
          disableBackdropClick={true}
        >
          <div className={classes.modalContent}>
            <Box textAlign="center" className={classes.tableName}>
              <h3>{getTablesCode()}テーブル</h3>
            </Box>
            <Box textAlign="right">
              <Box className={classes.lineDetail}>
                <Box className={classes.boxConfirm}>コース終了です、会計をしてください。</Box>
              </Box>
            </Box>
          </div>
        </Modal>
      ) : (
        <ModalPaymentRequest
          open={true}
          onClose={props.onClose}
          orderGroup={orderGroup}
          course={props.course}
          refreshDataOrderGroup={props.refreshDataOrderGroup}
        />
      )}
    </>
  );
};

// PropTypes
ModalEndTimeOrderCourse.propTypes = {
  open: PropTypes.bool,
  orderGroup: PropTypes.object,
  course: PropTypes.object,
  refreshDataOrderGroup: PropTypes.func,
  onClose: PropTypes.func,
  showSuccessMessage: PropTypes.func,
  showErrorMessage: PropTypes.func,
};

// defaultProps
ModalEndTimeOrderCourse.defaultProps = {
  open: false,
  orderGroup: {},
  course: {},
  refreshDataOrderGroup: () => {},
  onClose: () => {},
  showSuccessMessage: () => {},
  showErrorMessage: () => {},
};

export default ModalEndTimeOrderCourse;
