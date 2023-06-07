import React, {useContext, useState} from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';

// Components(Material-UI)
import {
  Box,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

// styles
import './payment.css';

// Utils
import CustomerPaymentComponent from './components/CustomerPaymentComponent';
import ChangePaymentMethodActions from "./components/ChangePaymentMethodActions";

// Services
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import PaymentApiService from 'js/utils/components/Payment/payment-api-service';

const PaymentForm = (props) => {
  const {
    isUpdateServicePlan,
    isQrLimitInPoints,
    paymentInfo,
    showWarningMessage,
    handleSuccess,
    handleChangeInput,
    handleChangeCheckbox,
    handleCloseModal,
    isErrorValidateRegisterForm,
    checkDownGradeServicePayment,
  } = props;
  // const stripe = useStripe();
  const elements = useElements();
  
  // shop context
  const [shop] = useContext(ShopInfoContext);
  
  // Local state
  const [isLoading, setIsLoading] = useState(true);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    
    setIsLoading(true);
    const {error, setupIntent} = await stripe.confirmSetup({
      elements,
      confirmParams: {},
      redirect: 'if_required',
    });
    
    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment, details incomplete)
      showWarningMessage(error.message);
    } else {
      await PaymentApiService.activeCard(shop.hashId, setupIntent.payment_method);
      handleSuccess();
    }
    
    setIsLoading(false);
  };
  
  return (
    <form>
      <Box id='payment-form'>
        <PaymentElement id='payment-element' onReady={() => setIsLoading(false)} />
      </Box>
      {
        isLoading ? <Box display='flex' justifyContent='center' mt={2}><CircularProgress /></Box> : null
      }
      
      <CustomerPaymentComponent
        paymentInfo={paymentInfo}
        handleChangeInput={handleChangeInput}
        handleChangeCheckbox={handleChangeCheckbox}
      />
      
      {
        isLoading ? null : (
          <Box display='flex' justifyContent='center'>
            <ChangePaymentMethodActions
              isLoading={isLoading}
              isUpdateServicePlan={isUpdateServicePlan}
              paymentInfo={paymentInfo}
              handleSubmit={handleSubmit}
              onClose={handleCloseModal}
              isErrorValidateRegisterForm={isErrorValidateRegisterForm}
              checkDownGradeServicePayment={checkDownGradeServicePayment}
              isQrLimitInPoints={isQrLimitInPoints}
            />
          </Box>
        )
      }
    </form>
  );
}

// PropTypes
PaymentForm.propTypes = {
  isUpdateServicePlan: PropTypes.bool,
  isQrLimitInPoints: PropTypes.bool,
  paymentInfo: PropTypes.object,
  handleSuccess: PropTypes.func,
  showWarningMessage: PropTypes.func,
  handleChangeInput: PropTypes.func,
  handleChangeCheckbox: PropTypes.func,
  handleCloseModal: PropTypes.func,
  isErrorValidateRegisterForm: PropTypes.func,
  checkDownGradeServicePayment: PropTypes.func,
};
PaymentForm.defaultProps = {
  isUpdateServicePlan: false,
  isQrLimitInPoints: false,
  paymentInfo: {},
  handleSuccess: () => {},
  showWarningMessage: () => {},
  handleChangeInput: () => {},
  handleChangeCheckbox: () => {},
  handleCloseModal: () => {},
  isErrorValidateRegisterForm: () => {},
  checkDownGradeServicePayment: () => {},
};

export default PaymentForm;
