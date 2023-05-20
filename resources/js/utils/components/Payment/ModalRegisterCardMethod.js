import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

// Components(Material-UI)
import {Box} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

// Components
import Modal from 'js/shared-order/components/Modal';
import SetupForm from 'js/utils/components/Payment/SetupForm';

// Services
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import PaymentApiService from 'js/utils/components/Payment/payment-api-service';

const appearance = {
  theme: 'stripe',
};

const ModalRegisterCardMethod = (props) => {
  const {open, onClose, handleSuccess, showSuccessMessage, showWarningMessage} = props;
  const stripePromise = loadStripe(process.env.MIX_STRIPE_PUBLIC_KEY, {
    locale: 'ja'
  });
  
  // Local state
  const [clientSecret, setClientSecret] = useState(null);
  
  // shop context
  const [shop] = useContext(ShopInfoContext);
  
  useEffect(() => {
    if (open) {
      // Register customer as soon as the page loads
      registerCustomerPayment();
    }
  }, [open]);
  
  const registerCustomerPayment = async () => {
    try {
      const response = await PaymentApiService.setupPaymentMethod(shop.hashId);
      setClientSecret(response.client_secret);
    } catch (e) {
      showWarningMessage(e.message);
    }
  };
  
  const handleRegisterCardSuccess = () => {
    // TODO: translate
    showSuccessMessage('Register payment method success');
    handleSuccess();
  };
  
  return (
    <Modal
      open={open}
      title='Register credit card'
      minHeight='auto'
      maxHeight='auto'
    >
      <Box m={1} minHeight='360px'>
        {
          !clientSecret && <Box display='flex' justifyContent='center' mt={2}><CircularProgress /></Box>
        }
        {
          clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance,
              }}
            >
              <SetupForm
                handleSuccess={handleRegisterCardSuccess}
                onClose={onClose}
                showWarningMessage={showWarningMessage}
              />
            </Elements>
          ) : null
        }
      </Box>
    </Modal>
  );
};

// PropTypes
ModalRegisterCardMethod.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleSuccess: PropTypes.func,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalRegisterCardMethod.defaultProps = {
  open: false,
  onClose: () => {},
  handleSuccess: () => {},
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalRegisterCardMethod;
