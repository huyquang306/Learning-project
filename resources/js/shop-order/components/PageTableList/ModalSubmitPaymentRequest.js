import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

// Components(Material-UI)
import { Box, Grid, Divider } from '@material-ui/core';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import NumberPicker from './NumberPicker';

// Context
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Styles
import { useStylesPaymentRequest as useStyles } from './styles';

const ModalSubmitPaymentRequest = (props) => {
  const classes = useStyles();
  // Context
  const [shop] = useContext(ShopInfoContext);
  const currencyName = shop?.mShopPosSetting?.m_currency?.name;
  const currencyCode = shop?.mShopPosSetting?.m_currency?.code;
  // Local state
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [submited, setSubmited] = useState(false);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  const handleButtonDisabled = (value) => {
    setButtonDisabled(value);
  };

  const renderFooterActions = () => {
    return (
      <>
        <Box width='100%' fontWeight={600} borderTop='1px #000 solid'>
          <Grid container>
            <Grid item xs={3}>
              <Box className={classes.buttonBoxShadow}>
                <ButtonCustom
                  bgcolor='#828282'
                  fgcolor='#FFF'
                  onClick={props.onClose}
                  variant='outlined'
                  borderColor='#828282'
                  padding='4px 40px'
                  margin='16px 26px'
                >
                  Quay lại
                </ButtonCustom>
              </Box>
            </Grid>
            <Grid item xs={8} sm={6}>
              <Box textAlign='center' className={classes.buttonBoxShadow}>
                <ButtonCustom
                  bgcolor='#FFA04B'
                  fgcolor='#FFF'
                  variant='outlined'
                  borderColor='#FFA04B'
                  padding='4px 40px'
                  width='90%'
                  disabled={buttonDisabled}
                  onClick={() => setSubmited(true)}
                >
                  Thanh toán &nbsp;
                  {props?.infoPayment?.totalAmount}
                  {currencyCode}
                </ButtonCustom>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  return (
    <Modal
      open={props.open}
      title='Thanh toán'
      maxWidth='850px'
      maxHeight='80vh'
      actions={renderFooterActions()}
    >
      <Box
        mt={{ xs: 1, sm: 3 }}
        mb={{ xs: 1, sm: 3 }}
        display='flex'
        justifyContent='center'
        alignItems='baseline'
        fontWeight={600}
      >
        <Box fontSize={{ xs: 20, sm: 25 }} mr={1}>
          Tiền khách trả
        </Box>{' '}
        <Box fontSize={{ xs: 35, sm: 45 }}>
          {props?.infoPayment?.totalAmount}
          {currencyName}
        </Box>
      </Box>
      <Divider />

      <NumberPicker
        shop={shop}
        infoPayment={props?.infoPayment}
        submited={submited}
        onClose={props.onClose}
        closeModalPayment={props.closeModalPayment}
        handleButtonDisabled={handleButtonDisabled}
      />
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
ModalSubmitPaymentRequest.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  infoPayment: PropTypes.object,
  closeModalPayment: PropTypes.func,
};

// defaultProps
ModalSubmitPaymentRequest.defaultProps = {
  open: false,
  onClose: () => {},
  infoPayment: {},
  closeModalPayment: () => {},
};

export default ModalSubmitPaymentRequest;
