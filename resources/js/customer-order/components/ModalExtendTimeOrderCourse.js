import React, { Fragment } from 'react';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';
import PropTypes from 'prop-types';
import { getCookie, setCookie } from 'js/utils/components/cookie/cookie.js';

// Component
import Modal from 'js/shared-order/components/Modal';
import Button from '../../shared/components/Button';

// Components(Material-UI)
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ORDER_GROUP_STATUS } from 'js/utils/helpers/courseHelper';

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
    padding: '18px',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 160, 75, 0.7)',
    border: '2px solid #FFA04B',
  },
  textBold: {
    fontWeight: '600',
  },
  footerButton: {
    width: '50%',
  },
  footerActions: {
    padding: '0px 15px 0px 15px',
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
}));

const styles = {
  footerButton: {
    width: '50%',
  },
};
const CANCEL_EXTEND_KEY = 'cancelExtendOrderGroup';

const ModalExtendTimeOrderCourse = (props) => {
  const classes = useStyles();
  const userHashId = getCookie('userHashId') || '';

  const cancelExtendTime = () => {
    setCookie(CANCEL_EXTEND_KEY, props.ordergroupHashId);
    props.onClose();
  };

  const confirmExtendTime = () => {
    extendOrderCourse();
    props.onClose();
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
    if (props.extendCoursePrice > 0 && props.extendCourseTime > 0) {
      return (
        <Box className={classes.footerActions}>
          <Button
            bgcolor="#808080"
            fgcolor="#F7FAEE"
            borderRadius="30px"
            padding="12px 20px"
            style={styles.footerButton}
            onClick={cancelExtendTime}
          >
            延長しない
          </Button>
          <Button
            bgcolor="#f2994b"
            fgcolor="#ffffff"
            borderRadius="30px"
            padding="12px 20px"
            style={styles.footerButton}
            onClick={confirmExtendTime}
          >
            延長する
          </Button>
        </Box>
      );
    } else {
      return (
        <Box className={classes.footerActions}>
          <Button
            bgcolor="#808080"
            fgcolor="#F7FAEE"
            borderRadius="30px"
            padding="12px 20px"
            style={styles.footerButton}
            onClick={cancelExtendTime}
          >
            OK
          </Button>
        </Box>
      );
    }
  };

  return (
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
              <Box>あと<span className={classes.textBold}>{props.alertNotificationTime}</span>分でコースが終了します。</Box>
              {props.extendCoursePrice > 0 && props.extendCourseTime > 0 && (
                <Fragment>
                  <Box><span className={classes.textBold}>{props.extendCoursePrice}</span>円/1名で
                  <span className={classes.textBold}>{props.extendCourseTime}</span>分延長可能です。</Box>
                  <Box>延長しますか？</Box>
                  <br></br>
                  <Box>※時間が過ぎた場合は、</Box>
                  <Box>自動で延長になりますので、</Box>
                  <Box>ご注意下さい。</Box>
                </Fragment>
              )}
            </Box>
          </Box>
        </Box>
      </div>
    </Modal>
  );
};

// PropTypes
ModalExtendTimeOrderCourse.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  shopHashId: PropTypes.string,
  ordergroupHashId: PropTypes.string,
  extendCourseTime: PropTypes.number,
  extendCoursePrice: PropTypes.number,
  alertNotificationTime: PropTypes.number,
  extendEndTime: PropTypes.string,
  fetchOrderGroup: PropTypes.func,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalExtendTimeOrderCourse.defaultProps = {
  open: false,
  onClose: () => {},
  shopHashId: '',
  ordergroupHashId: '',
  extendCourseTime: 0,
  extendCoursePrice: 0,
  alertNotificationTime: 0,
  extendEndTime: '',
  fetchOrderGroup: () => {},
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalExtendTimeOrderCourse;
