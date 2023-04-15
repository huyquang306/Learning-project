import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
moment.locale('ja');
import { isEmpty } from 'lodash';
import PubSub from 'pubsub-js';

// Styles
import { useStylesPaymentRequest as useStyles } from 'js/shop-order/components/PageTableList/styles.js';

// Context
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Services
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Component
import FlashMessage from 'js/shared-order/components/FlashMessage';
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

// Utils
import Utils from 'js/shared/utils';
import { PUB_SUB_KEY } from 'js/utils/helpers/const';

const TYPE_ORDER_MENU = 'order';
const ORDER_GROUP_SHOW_ENDED_TIME = 'orderGroupHadShowEndTime';

const ModalPaymentRequest = (props) => {
  const classes = useStyles();
  const [shop] = useContext(ShopInfoContext);
  const [orderGroup, setOrderGroup] = useState(props.orderGroup);
  const [showInfo, setShowInfo] = useState({
    isShow: false,
    type: '',
  });
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [order, setOrder] = useState({ name: '', quantity: 0, price: 0, amount: 0 });

  const handleShowInfoClick = (order) => {
    setShowInfo({
      isShow: true,
      type: TYPE_ORDER_MENU,
    });
    setOrder(order);
  };

  const handleUpdateOrderClick = async () => {
    try {
      let isUpdate = true;
      let data = {
        update_orders: [
          {
            id: order.id,
            quantity: order.quantity,
          },
        ],
      };
      const response = await ShopOrderApiService.order(shop.hashId, orderGroup.hash_id, data, isUpdate);
      if (response) {
        setOrderGroup(response);
        PubSub.publish(PUB_SUB_KEY.KEY_FRESH_UPDATE_ORDER, orderGroup);
        setToast({ isShow: true, status: 'success', message: 'Update order success!' });
      }
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
    }
  };

  const handleRemoveOrderClick = async () => {
    try {
      let isUpdate = true;
      let data = {
        cancel_orders: [order.id],
      };
      const response = await ShopOrderApiService.order(shop.hashId, orderGroup.hash_id, data, isUpdate);
      if (response) {
        setOrderGroup(response);
        PubSub.publish(PUB_SUB_KEY.KEY_FRESH_UPDATE_ORDER, orderGroup);
        setShowInfo({
          isShow: false,
          type: null,
        });
        setToast({ isShow: true, status: 'success', message: 'Delete order success!' });
      }
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
    }
  };

  const handlePaymentRequestClick = () => {
    let cloneOrderGroup = Utils.cloneDeep(orderGroup);
    cloneOrderGroup.count = orderGroup.orders.length;
    ShopOrderApiService.payment(shop.hashId, orderGroup.hash_id, cloneOrderGroup)
      .then(() => {
        // Publish key refresh data to table list screen
        PubSub.publish(PUB_SUB_KEY.KEY_FRESH_PAYMENT_ORDERGROUP, orderGroup);
        // Remove course had show end time
        let orderGroupsShowEndedTime = JSON.parse(localStorage.getItem(ORDER_GROUP_SHOW_ENDED_TIME)) || [];
        const index = orderGroupsShowEndedTime.indexOf(orderGroup.hash_id);
        if (index > -1) {
          orderGroupsShowEndedTime.splice(index, 1);
          localStorage.setItem(ORDER_GROUP_SHOW_ENDED_TIME, JSON.stringify(orderGroupsShowEndedTime));
        }
        props.refreshDataOrderGroup();
        props.onClose();
      })
      .catch((error) => {
        console.error('[ModalPaymentRequest] handlePaymentRequestClick error', error);
        setToast({ isShow: true, status: 'error', message: error.message });
      });
  };

  const cancelPaymentRequest = () => {
    // set list ordergroup had been show end time
    let orderGroupsShowEndedTime = JSON.parse(localStorage.getItem(ORDER_GROUP_SHOW_ENDED_TIME)) || [];
    orderGroupsShowEndedTime.push(orderGroup.hash_id);
    localStorage.setItem(ORDER_GROUP_SHOW_ENDED_TIME, JSON.stringify(orderGroupsShowEndedTime));
    props.onClose();
  }

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
      const orderTotal = orderGroup.orders.reduce((a, b) => a + (b.amount || 0), 0);
      total += orderTotal;
    }

    return total;
  };

  const formatAmount = (number, n = 0, x = 3) => {
    let reg = '\\d(?=(\\d{' + x + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return number ? number.toFixed(n).replace(new RegExp(reg, 'g'), '$&,') : 0;
  };

  const renderListOrder = () => {
    return orderGroup.orders.map((item, index) => {
      return (
        <div key={index} className={classes.menuItem}>
          <div className={classes.menuName}>
            {item.status === 2 ? <div className={classes.cancelOrder}>【取消】</div> : null}
            {item.name}
          </div>
          <div className={classes.menuCount}>
            {item.quantity}
            <span>個</span>
          </div>
          <div className={classes.menuPrice}>
            {item.amount}
            <span>円</span>
          </div>
          {item.status === 2 ? (
            <div className={classes.menuButton}></div>
          ) : (
            <div className={classes.menuButton} onClick={() => handleShowInfoClick(item)}>
              <button>選択</button>
            </div>
          )}
        </div>
      );
    });
  };

  const renderFooterActions = () => {
    return (
      <>
        <ButtonCustom
          customClass={classes.button}
          title="戻る"
          borderRadius="28px"
          bgcolor="#828282"
          borderColor="#828282"
          width="176px"
          onClick={cancelPaymentRequest}
        />
        <ButtonCustom
          customClass={classes.button}
          title="会計する"
          borderRadius="28px"
          bgcolor="#FFA04B"
          borderColor="#FFA04B"
          width="176px"
          onClick={handlePaymentRequestClick}
        />
      </>
    );
  };

  const renderOrderInfo = () => {
    return (
      <div className={classes.payment}>
        <div className={classes.paymentHeader}>
          <div className={'paymentHeaderLeft'}>アイテム詳細</div>
          <div className={'paymentHeaderRight'}>
            <button onClick={handleRemoveOrderClick}>削除</button>
          </div>
        </div>
        <div className={classes.paymentInfo}>
          <div className={classes.paymentColLeft}>商品名</div>
          <div className={classes.paymentColRight}>{order.name}</div>
        </div>

        <div className={classes.paymentInfo}>
          <div className={classes.paymentColLeft}>数量</div>
          <div className={classes.paymentColRight}>
            <div className={classes.paymentBoxInput}>
              <input
                type={'text'}
                disabled={false}
                value={order.quantity}
                onChange={(event) => {
                  setOrder({ ...order, quantity: event.target.value });
                }}
              />
              <span>個</span>
            </div>
          </div>
        </div>
        <div className={classes.paymentInfo}>
          <div className={classes.paymentColLeft}>価格</div>
          <div className={classes.paymentColRight}>
            <div className={classes.paymentBoxInput}>
              <input type={'text'} disabled={true} value={order.quantity * order.price} onChange={() => {}} />{' '}
              <span>円</span>
            </div>
          </div>
        </div>

        <div className={classes.paymentButton}>
          <div className={'paymentButtonLeft'}>
            <button onClick={handleUpdateOrderClick}>保存する</button>
          </div>
          <div
            className={'paymentButtonRight'}
            onClick={() => setShowInfo({ isShow: false, type: null })}
          >
            <button>キャンセル</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={props.open}
      title="会計"
      onClose={props.onClose}
      actions={renderFooterActions()}
      disableBackdropClick={true}
    >
      <div className={classes.modalContent}>
        <div className={classes.contentLeft}>
          <div className={`${classes.header}`}>
            <div className="headerMenuName">商品名</div>
            <div className="headerMenuCount">点数</div>
            <div className="headerMenuPrice">金額</div>
            <div className="headerMenuButton"> </div>
          </div>

          <div className={classes.menuBody}>{renderListOrder()}</div>
        </div>

        <div className={classes.contentRight}>
          {showInfo.isShow && showInfo.type === TYPE_ORDER_MENU && renderOrderInfo()}
          <div className={classes.totalAmount}>
            <div>
              合計金額： &nbsp; &nbsp;<span>{formatAmount(totalAmount(orderGroup))}円</span>
            </div>
          </div>
        </div>
      </div>

      <FlashMessage
        isOpen={toast.isShow}
        onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
        status={toast.status}
        message={toast.message}
      />
    </Modal>
  );
};

// PropTypes
ModalPaymentRequest.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  course: PropTypes.object,
  refreshDataOrderGroup: PropTypes.func,
};

// defaultProps
ModalPaymentRequest.defaultProps = {
  open: false,
  onClose: () => {
    /*nop*/
  },
  course: {},
  refreshDataOrderGroup: () => {},
};

export default ModalPaymentRequest;
