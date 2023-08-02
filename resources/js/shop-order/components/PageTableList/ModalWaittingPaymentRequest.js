import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useStylesWaittingPaymentRequest as useStyles } from './styles';
import Utils from 'js/shared/utils';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import PageTableListContext from './PageTableListContext';

// Components(Material-UI)
import { Box } from '@material-ui/core';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import moment from 'moment';
moment.locale('vi');
import { ORDER_STATUS } from 'js/utils/helpers/courseHelper';

const ModalWaittingPaymentRequest = (props) => {
  const classes = useStyles();
  const [shop] = useContext(ShopInfoContext);
  const { setToast, setWaiting, state, dispatch } = useContext(PageTableListContext);

  const handleWaitingPaymentRequest = () => {
    setWaiting(true);
    updateToFinishedOrders(state.ordergroup);
    updateToWaittingPayment(state.ordergroup);
  };

  const updateToFinishedOrders = async (orderGroup) => {
    try {
      let isUpdate = true;
      let data = {
        update_orders: [],
      };
      const ordersNotFinished = orderGroup?.orders?.filter(
        (order) =>
          order.status === ORDER_STATUS.STATUS_ORDER ||
          order.status === ORDER_STATUS.STATUS_SHIPPING
      );
      ordersNotFinished.forEach((order, index) => {
        data.update_orders.push({
          id: order?.id,
          quantity: order?.quantity,
          status: ORDER_STATUS.STATUS_FINISH,
        });
      });
      await ShopOrderApiService.order(shop.hashId, orderGroup.hash_id, data, isUpdate);
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
    }
  };

  const updateToWaittingPayment = async (orderGroup) => {
    try {
      const data = { flag: true };
      const response = await ShopOrderApiService.waittingPayment(
        shop.hashId,
        orderGroup.hash_id,
        data
      );
      if (response) {
        setToast({ isShow: true, status: 'success', message: 'Cập nhật thành công!' });
        dispatch({ type: 'REFRESH' });
        setWaiting(false);
        props.onClose();
      }
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
    }
  };

  const renderListOrdersNotFinished = () => {
    return state.ordergroup.orders
      .filter(
        (order) =>
          order.status === ORDER_STATUS.STATUS_ORDER ||
          order.status === ORDER_STATUS.STATUS_SHIPPING
      )
      .map((order, index) => {
        return (
          <div key={index} className={classes.menuItem}>
            <div className={classes.menuName}>
              <div className={`${classes.labelStatus} ${'preparing'}`}>
                {/*<span>未</span>*/}
              </div>
              <div className={classes.orderName}>{order.name}</div>
            </div>
            <div className={classes.quantityItem}>
              {order.quantity}
              <span className={classes.normalText}>
                &nbsp;
                &nbsp;
                &nbsp;
              </span>
            </div>
            <div className={classes.amountItem}>
              {order.amount}
              <span className={classes.normalText}>{shop?.mShopPosSetting?.m_currency?.name}</span>
            </div>
          </div>
        );
      });
  };

  const renderFooterActions = () => {
    return (
      <Box className={classes.boxButton}>
        <ButtonCustom
          customClass={classes.button}
          title='Quay lại'
          borderRadius='28px'
          bgcolor='#828282'
          borderColor='#828282'
          width='230px'
          padding='8px'
          onClick={props.onClose}
        />
        <ButtonCustom
          customClass={classes.button}
          title='Kết thúc'
          borderRadius='28px'
          bgcolor='#FFA04B'
          borderColor='#FFA04B'
          width='230px'
          padding='8px'
          onClick={handleWaitingPaymentRequest}
        />
      </Box>
    );
  };

  return (
    <Modal open={props.open} onClose={props.onClose} actions={renderFooterActions()}>
      <div className={classes.modalContent}>
        <Box className={classes.messageWarning}>
          Có món ăn chưa được phục vụ, bạn có chắc chắn muốn kết thúc không?
        </Box>
        <div className={classes.menuBody}>{renderListOrdersNotFinished()}</div>
      </div>
    </Modal>
  );
};

// PropTypes
ModalWaittingPaymentRequest.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

// defaultProps
ModalWaittingPaymentRequest.defaultProps = {
  open: false,
  onClose: () => {
    /*nop*/
  },
};

export default ModalWaittingPaymentRequest;
