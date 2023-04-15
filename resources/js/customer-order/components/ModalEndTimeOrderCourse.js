import React, { useState }  from 'react';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';
import Button from 'js/shared/components/Button';

// Components(Material-UI)
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Utils
import { getCookie, setCookie } from 'js/utils/components/cookie/cookie.js';
import { ORDER_GROUP_STATUS } from 'js/utils/helpers/courseHelper';
import { onSendNotifyCustomerRequestCheckout } from 'js/utils/helpers/socket';

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
    marginTop: '40%',
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
}));

const styles = {
  footerButton: {
    width: '50%',
  },
};

const CONFIRM_ACCOUNTING_KEY = 'confirmAccountingOrdergroup';

const ModalEndTimeOrderCourse = (props) => {
  const classes = useStyles();
  const userHashId = getCookie('userHashId') || '';
  const [isShowAccounting, setIsShowAccounting] = useState(false);

  const goToCheckBilling = () => {
    setCookie(CONFIRM_ACCOUNTING_KEY, props.ordergroupHashId);
    window.location.href = `/shop-or/${props.shopHashId}/billing`;
    props.onClose();
  };

  const confirmCheckout = async () => {
    try {
      const response = await CustomerOrderApiService.getStatusOrdergroup(
        props.shopHashId,
        props.ordergroupHashId
      );
      // Ordering
      if (response?.status < ORDER_GROUP_STATUS.REQUEST_CHECKOUT) {
        goToCheckout();
        props.onClose();
      }
      // Request checkout or stop order
      if (
        response?.status === ORDER_GROUP_STATUS.REQUEST_CHECKOUT ||
        response?.status === ORDER_GROUP_STATUS.WAITING_CHECKOUT
      ) {
          setIsShowAccounting(true);
      }
    } catch (error) {
      props.showWarningMessage(error.message);
    }
  };

  const goToCheckout = () => {
    CustomerOrderApiService.payRequest(props.shopHashId, props.ordergroupHashId)
      .then(() => {
        onSendNotifyCustomerRequestCheckout(props.shopHashId);
        window.location.href = `/shop-or/${props.shopHashId}/billing`;
      })
      .catch(() => {
        window.location.href = `/shop-or/${props.shopHashId}/thanks-for-customer`;
      });
  };

  const refreshCurrentPage = () => {
    window.location.reload();
  }

  const confirmExtendTime = async () => {
    try {
      const response = await CustomerOrderApiService.getStatusOrdergroup(
        props.shopHashId,
        props.ordergroupHashId
      );
      // Ordering
      if (response?.status < ORDER_GROUP_STATUS.REQUEST_CHECKOUT) {
        await extendOrderCourse();
        await props.onClose();
      }
      // Request checkout or stop order
      if (
        response?.status === ORDER_GROUP_STATUS.REQUEST_CHECKOUT ||
        response?.status === ORDER_GROUP_STATUS.WAITING_CHECKOUT
      ) {
          setIsShowAccounting(true);
      }
    } catch (error) {
      props.showWarningMessage(error.message);
    }
  };

  const extendOrderCourse = async () => {
    try {
      const data = {
        userHashId: userHashId,
      };
      const response = await CustomerOrderApiService.extendOrderCourse(
        props.shopHashId,
        props.ordergroupHashId,
        data
      );
      // OrderGroup has been checked-out or deleted by shop
      if (!response?.isExtend && response?.ordergroup?.status >= ORDER_GROUP_STATUS.CHECKED_OUT) {
        window.location.href = `/shop-or/${props.shopHashId}/thanks-for-customer`;
      }
      // Course has been extended by shop before
      if (!response?.isExtend && response?.ordergroup?.status < ORDER_GROUP_STATUS.REQUEST_CHECKOUT) {
        const message = `既に延長されました！`;
        props.showSuccessMessage(message);
      }
      // Extend course successfully
      if (response?.hash_id) {
        const message = `ありがとうございます。延長しました。`;
        props.showSuccessMessage(message);
      }
      await props.fetchOrderGroup();
    } catch (error) {
      props.showWarningMessage(error.message);
    }
  };

  const ModalActions = () => {
    if (props.orderGroupStatus == ORDER_GROUP_STATUS.WAITING_CHECKOUT) {
      return (
        <Button
          bgcolor="#808080"
          fgcolor="#F7FAEE"
          borderRadius="30px"
          padding="12px 20px"
          style={styles.footerButton}
          onClick={goToCheckBilling}
        >
          会計締切済
        </Button>
      );
    } else {
      if (props.hasExtendCourse) {
        return (
          <>
            <Button
              bgcolor="#808080"
              fgcolor="#F7FAEE"
              borderRadius="30px"
              padding="12px 20px"
              style={styles.footerButton}
              onClick={confirmExtendTime}
            >
              延長する
            </Button>
            <Button
              bgcolor="#f2994b"
              fgcolor="#ffffff"
              borderRadius="30px"
              padding="12px 20px"
              style={styles.footerButton}
              onClick={confirmCheckout}
            >
              会計する
            </Button>
          </>
        );
      } else {
        return (
          <Button
            bgcolor="#f2994b"
            fgcolor="#ffffff"
            borderRadius="30px"
            padding="12px 20px"
            style={styles.footerButton}
            onClick={confirmCheckout}
          >
            会計する
          </Button>
        );
      }
    }
  };

  const ModalAccountingAction = () => {
    return (
      <Button
        bgcolor="#808080"
        fgcolor="#F7FAEE"
        borderRadius="30px"
        padding="12px 20px"
        style={styles.footerButton}
        onClick={refreshCurrentPage}
      >
        戻る
      </Button>
    );
  };

  return (
    <>
    {isShowAccounting ? (
      <Modal
        open={props.open}
        title="お知らせ"
        actions={ModalAccountingAction()}
        maxWidth="450px"
        maxHeight="520px"
        disableBackdropClick={true}
      >
        <div className={classes.modalContent}>
          <Box textAlign="right">
            <Box className={classes.lineDetail}>
              <Box className={classes.boxConfirm}>
                すでに会計中です。
              </Box>
            </Box>
          </Box>
        </div>
      </Modal>
    ) : (
      <Modal
        open={props.open}
        title="お知らせ"
        actions={ModalActions()}
        maxWidth="450px"
        maxHeight="520px"
        disableBackdropClick={true}
      >
        <div className={classes.modalContent}>
          <Box textAlign="right">
            <Box className={classes.lineDetail}>
              <Box className={classes.boxConfirm}>
                コース終了です、会計をしてください。
              </Box>
            </Box>
          </Box>
        </div>
      </Modal>
    )}
    </>
  );
};

// PropTypes
ModalEndTimeOrderCourse.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  shopHashId: PropTypes.string,
  ordergroupHashId: PropTypes.string,
  hasExtendCourse: PropTypes.bool,
  extendEndTime: PropTypes.string,
  orderGroupStatus: PropTypes.string,
  fetchOrderGroup: PropTypes.func,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalEndTimeOrderCourse.defaultProps = {
  open: false,
  onClose: () => {},
  shopHashId: '',
  ordergroupHashId: '',
  hasExtendCourse: false,
  extendEndTime: '',
  orderGroupStatus: '',
  fetchOrderGroup: () => {},
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalEndTimeOrderCourse;
