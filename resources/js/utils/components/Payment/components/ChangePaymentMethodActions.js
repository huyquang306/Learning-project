import React, {useState} from 'react';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import {Box} from '@material-ui/core';

// styles
import {useRegisterPaymentMethod as useStyles} from '../styles';

const ChangePaymentMethodActions = (props) => {
  const classes = useStyles();
  const {
    isLoading,
    isUpdateServicePlan,
    isQrLimitInPoints,
    paymentInfo,
    handleSubmit,
    onClose,
    isErrorValidateRegisterForm,
    checkDownGradeServicePayment,
  } = props;
  
  // Local state
  const [isConfirmUpdate, setIsConfirmUpdate] = useState(false);
  
  const confirmActions = () => {
    return (
      <>
        <ButtonCustom
          title='変更しない'
          bgcolor='#828282'
          borderColor='#828282'
          borderRadius='28px'
          width='176px'
          padding='8px 0px'
          onClick={() => setIsConfirmUpdate(false)}
        />
        <ButtonCustom
          title='変更する'
          borderRadius='28px'
          bgcolor='#F2994A'
          borderColor='#F2994A'
          width='176px'
          onClick={handleSubmit}
        />
      </>
    );
  };
  
  const handleValidateAndConfirm = () => {
    // Check down-grade payment service is over limit when update payment service
    if (isUpdateServicePlan) {
      if (!checkDownGradeServicePayment()) {
        return;
      }
    }
    
    if (isErrorValidateRegisterForm()) {
      return;
    }
    
    setIsConfirmUpdate(true);
  };
  
  const handleValidateAndSubmit = (event) => {
    if (isErrorValidateRegisterForm()) {
      return;
    }
    
    handleSubmit(event);
  };
  
  return (
    <>
      {
        isUpdateServicePlan ? (
          <>
            <ButtonCustom
              title='戻る'
              bgcolor='#828282'
              borderColor='#828282'
              borderRadius='28px'
              width='176px'
              padding='8px 0px'
              onClick={onClose}
            />
            <ButtonCustom
              title='保存する'
              borderRadius='28px'
              bgcolor='#F2994A'
              borderColor='#F2994A'
              width='176px'
              onClick={handleValidateAndConfirm}
              disabled={!paymentInfo.acceptTerm || isLoading}
            />
          </>
        ) : (
          <>
            {
              isQrLimitInPoints && (
                <ButtonCustom
                  title='戻る'
                  bgcolor='#828282'
                  borderColor='#828282'
                  borderRadius='28px'
                  width='176px'
                  padding='8px 0px'
                  onClick={onClose}
                />
              )
            }
            <ButtonCustom
              title='契約する'
              borderRadius='28px'
              bgcolor='#F2994A'
              borderColor='#F2994A'
              width='176px'
              onClick={handleValidateAndSubmit}
              disabled={!paymentInfo.acceptTerm || isLoading}
            />
          </>
        )
      }
      
      {/* Modal confirm update payment service */}
      {isConfirmUpdate && (
        <Modal
          title='確認'
          open={open}
          actions={confirmActions()}
          maxWidth='450px'
          minHeight='120px'
        >
          <Box textAlign='center' className={classes.boxContent}>
            <Box className={classes.textModal}>プラン・請求情報を変更しますか？</Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

// PropTypes
ChangePaymentMethodActions.propTypes = {
  isLoading: PropTypes.bool,
  isUpdateServicePlan: PropTypes.bool,
  isQrLimitInPoints: PropTypes.bool,
  paymentInfo: PropTypes.object,
  handleSubmit: PropTypes.func,
  onClose: PropTypes.func,
  isErrorValidateRegisterForm: PropTypes.func,
  checkDownGradeServicePayment: PropTypes.func,
};

// defaultProps
ChangePaymentMethodActions.defaultProps = {
  isLoading: false,
  isUpdateServicePlan: false,
  isQrLimitInPoints: false,
  paymentInfo: {},
  handleSubmit: () => {},
  onClose: () => {},
  isErrorValidateRegisterForm: () => {},
  checkDownGradeServicePayment: () => {},
};

export default ChangePaymentMethodActions;
