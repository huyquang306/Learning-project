import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRegisterPaymentMethod as useStyles } from './styles';
import { checkRegisterForm } from './validationRegisterPaymentMethod';

// Components(Material-UI)
import {
  Box,
  FormControlLabel,
  ListItemIcon,
  Radio,
  RadioGroup,
  Button,
  Grid, Checkbox, Link,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import TermsOfServiceDialog from 'js/shared/components/TermsOfServiceDialog';

// Services
import ShopApiService from 'js/shop/shop-api-service';
import PaymentApiService from 'js/utils/components/Payment/payment-api-service';

import CircularProgress from '@material-ui/core/CircularProgress';
import SetupForm from 'js/utils/components/Payment/SetupForm';

// Utils
import Utils from 'js/shared/utils';
import { PAYMENT_METHOD_TYPES, formatNumberWithCommas } from './paymentConst';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CustomerPaymentComponent from './components/CustomerPaymentComponent';
import ChangePaymentMethodActions from './components/ChangePaymentMethodActions';

const appearance = {
  theme: 'stripe',
};

const PAYMENT_INFO_DEFAULT = {
  stripe_customer_id: '',
  name: '',
  zip_code: '',
  address: '',
  phone: '',
  email: '',
  payment_method: PAYMENT_METHOD_TYPES.card,
  acceptTerm: false,
};

const ModalRegisterPaymentMethod = (props) => {
  const classes = useStyles();
  const { open, showSuccessMessage, showWarningMessage, onClose, isQrLimitInPoints } = props;
  
  // Context
  const [shop] = useContext(ShopInfoContext);
  const currentPlan = shop?.service_plan;
  
  // Local state
  const [paymentInfo, setPaymentInfo] = useState(PAYMENT_INFO_DEFAULT);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [servicePlans, setServicePlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOverQrLimit, setIsOverQrLimit] = useState(false);
  const stripePromise = loadStripe(process.env.MIX_STRIPE_PUBLIC_KEY, {
    locale: 'ja',
  });
  const [clientSecret, setClientSecret] = useState(null);
  const [isOpenTerms, setIsOpenTerms] = useState(false);
  
  useEffect(() => {
    if (open) {
      setPaymentInfo(PAYMENT_INFO_DEFAULT);
      getServicePlans();
      getOrCreateCustomerPayment();
    }
  }, [open]);
  
  const getOrCreateCustomerPayment = async () => {
    let newPaymentInfo = Utils.cloneDeep(paymentInfo);
    try {
      const response = await PaymentApiService.getCustomerPayment(shop.hashId);
      // if (shop.payment_method) {
      //   newPaymentInfo.payment_method = shop.payment_method.toString();
      // }
      
      // If the customer payment exists
      if (response && response.id) {
        const { name, zip_code, address, phone, email, id } = response;
        newPaymentInfo.stripe_customer_id = id;
        newPaymentInfo.name = name;
        newPaymentInfo.zip_code = zip_code;
        newPaymentInfo.address = address;
        newPaymentInfo.phone = phone;
        newPaymentInfo.email = email;
      } else {
        // register a new customer payment
        const response = await PaymentApiService.registerOrUpdateCustomerPayment(shop.hashId, {});
        const { id } = response;
        newPaymentInfo.stripe_customer_id = id;
      }
      newPaymentInfo.acceptTerm = false;
      setPaymentInfo(newPaymentInfo);
      
      const paymentMethodRes = await PaymentApiService.setupPaymentMethod(shop.hashId);
      setClientSecret(paymentMethodRes.client_secret);
    } catch (e) {
      showWarningMessage(e.message);
    }
  };
  
  const getServicePlans = async () => {
    const servicePlansRes = await ShopApiService.getServicePlans();
    setServicePlans(servicePlansRes);
    
    // set first plan default
    if (servicePlansRes.length) {
      const plansAvailable = getServicePlansAvailable(servicePlansRes);
      if (plansAvailable.length) {
        if (props?.isUpdateServicePlan && props?.originalServicePlan?.id) {
          setSelectedPlanId(props?.originalServicePlan?.id);
        } else {
          setSelectedPlanId(plansAvailable[0].id);
        }
      }
    }
  };
  
  const renderActions = () => {
    if (paymentInfo.payment_method === PAYMENT_METHOD_TYPES.invoice || selectedPlan?.price == 0) {
      return (
        <ChangePaymentMethodActions
          isLoading={isLoading}
          isUpdateServicePlan={props.isUpdateServicePlan}
          paymentInfo={paymentInfo}
          handleSubmit={handleSubmit}
          onClose={onClose}
          isErrorValidateRegisterForm={isErrorValidateRegisterForm}
          checkDownGradeServicePayment={checkDownGradeServicePayment}
          isQrLimitInPoints={isQrLimitInPoints}
        />
      );
    }
    
    return null;
  };
  
  const actionModalError = () => {
    return (
      <>
        <ButtonCustom
          title='OK'
          borderRadius='28px'
          bgcolor='#F2994A'
          borderColor='#F2994A'
          width='176px'
          onClick={handleOnModalError}
        />
      </>
    );
  };
  
  const handleOnModalError = () => {
    onClose();
    setIsOverQrLimit(false);
  };
  
  const isErrorValidateRegisterForm = () => {
    if (selectedPlan?.price == 0) {
      return false;
    }
    
    // validation
    const errors = checkRegisterForm(paymentInfo);
    if (errors.length > 0) {
      showWarningMessage(errors[0]);
      
      return true;
    }
    
    return false;
  }
  
  const handleSubmit = async () => {
    // validation
    if (isErrorValidateRegisterForm()) {
      return;
    }
    
    // register customer payment
    try {
      setIsLoading(true);
      const { name, zip_code, address, phone, email } = paymentInfo;
      const customerData = {
        name,
        zip_code,
        address,
        phone,
        email,
      };
      
      // Register/Update customer payment
      await PaymentApiService.registerOrUpdateCustomerPayment(shop.hashId, customerData);
      await PaymentApiService.registerPaymentMethod(shop.hashId, paymentInfo.payment_method);
      await ShopApiService.updateServicePlanOfShop(shop.hashId, selectedPlanId);
      // TODO: translate
      showSuccessMessage('プラン・請求情報を変更しました');
      window.location.reload();
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      showWarningMessage(e.message);
    }
  };
  
  const handleChangeInput = (event) => {
    const newPaymentInfo = Utils.cloneDeep(paymentInfo);
    const { name, value } = event.target;
    newPaymentInfo[name] = value;
    setPaymentInfo(newPaymentInfo);
  };
  
  const handleChangeCheckbox = (event) => {
    const newPaymentInfo = Utils.cloneDeep(paymentInfo);
    const { name, checked } = event.target;
    newPaymentInfo[name] = checked;
    setPaymentInfo(newPaymentInfo);
  };
  
  const getServicePlansAvailable = (servicePlansData) => !props.isUpdateServicePlan && currentPlan
    ? servicePlansData.filter(planTmp => planTmp.id > currentPlan.id)
    : servicePlansData;
  
  const handleRegisterCardSuccess = async () => {
    // TODO: translate
    showSuccessMessage('Setup card success');
    handleSubmit();
  };
  
  const checkDownGradeServicePayment = () => {
    const originalServicePlan = props?.originalServicePlan;
    let newTempServicePlan = servicePlans.find((planTmp) => planTmp.id === selectedPlanId);
    const newLimitQr =
      newTempServicePlan?.r_function_conditions[0]?.restricted_value;
    // Check usage QR code in month
    if (
      originalServicePlan &&
      originalServicePlan?.id != selectedPlanId &&
      props?.usageQRCodeInMonth &&
      newLimitQr &&
      props?.usageQRCodeInMonth > newLimitQr
    ) {
      // Show modal error
      setIsOverQrLimit(true);
      
      return false;
    }
    
    return true;
  };
  
  const selectedPlan = servicePlans.find((planTmp) => planTmp.id === selectedPlanId);
  
  return (
    <Modal title='プラン申込' open={open} maxHeight='80vh'>
      <Box m={1} p={3}>
        {/* service plan select */}
        <Box mt={1} className={classes.boxItems}>
          <Box width='20%' fontWeight={600}>
            プラン選択
          </Box>
          
          <Box width='80%'>
            {getServicePlansAvailable(servicePlans).map((planTmp) => (
              <Button
                key={planTmp.hash_id}
                variant='contained'
                className={`${classes.buttonSelect} ${
                  selectedPlanId === planTmp.id ? classes.buttonSelectActive : null
                }`}
                onClick={() => setSelectedPlanId(planTmp.id)}
              >
                {selectedPlanId === planTmp.id ? <Check /> : null}
                {planTmp.name}
              </Button>
            ))}
          </Box>
        </Box>
        
        {/* plan contents */}
        {selectedPlan && (
          <>
            <Box mt={1} className={classes.boxItems}>
              <Box width='20%' fontWeight={600}>
                プラン内容
              </Box>
              <Box width='70%' flex={1}>
                <Grid spacing={5} container justify='center'>
                  <Grid item xs={12}>
                    <Box mt={2} className={classes.boxItems}>
                      <Box width='25%' className={classes.ItemName}>
                        初期費用
                      </Box>
                      <Box width='75%' className={classes.ItemValue}>
                        ¥{Number(selectedPlan.initial_price).toLocaleString()}
                      </Box>
                    </Box>
                    
                    <Box mt={2} className={classes.boxItems}>
                      <Box width='25%' className={classes.ItemName}>
                        月額基本料金
                      </Box>
                      <Box width='75%' className={classes.ItemValue}>
                        ¥{Number(selectedPlan.price).toLocaleString()}
                      </Box>
                    </Box>
                    
                    <Box mt={2} className={classes.boxItems}>
                      <Box width='25%' className={classes.ItemName}>
                        追加QR料金
                      </Box>
                      <Box width='75%' className={classes.ItemValue}>
                        {
                          selectedPlan.r_function_conditions[0].m_function?.m_service_plan_options[0]
                          && Number(selectedPlan.r_function_conditions[0].m_function?.m_service_plan_options[0].additional_price)
                            ? (
                              <>
                              <span>
                                1QRごと¥
                                {
                                  Number(selectedPlan.r_function_conditions[0].m_function?.m_service_plan_options[0].additional_price) ?? 0
                                }
                              </span>
                                <span className={classes.noteItem}>※
                                  {
                                    formatNumberWithCommas(
                                      parseInt(
                                        selectedPlan.r_function_conditions[0]?.restricted_value
                                      ) + 1
                                    )
                                  }
                                  QR以上ご利用で追加料金が発生します
                              </span>
                              </>
                            ) : (
                              `¥0`
                            )
                        }
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </>
        )}
        
        {/* payment method */}
        {selectedPlan?.price > 0 && (
          <>
            <Box mt={1} className={classes.boxItems} marginTop={'30px'}>
              <Box width='20%' fontWeight={600}>
                支払方法
              </Box>
              <Box width='80%'>
                <RadioGroup
                  name='payment_method'
                  onChange={(event) => handleChangeInput(event)}
                  value={paymentInfo.payment_method}
                >
                  <ListItemIcon>
                    <FormControlLabel
                      value={PAYMENT_METHOD_TYPES.card}
                      control={<Radio disableRipple classes={{ checked: classes.radioChecked }} />}
                      label='クレジットカード'
                    />
                    {/* <FormControlLabel
                      value={PAYMENT_METHOD_TYPES.invoice}
                      control={<Radio disableRipple classes={{ checked: classes.radioChecked }} />}
                      label='請求書払い（月末〆／翌月末払い）'
                    /> */}
                  </ListItemIcon>
                </RadioGroup>
              </Box>
            </Box>
            
            {/* payment method card */}
            {paymentInfo.payment_method === PAYMENT_METHOD_TYPES.card && (
              <Box mt={1}>
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
                        isUpdateServicePlan={props.isUpdateServicePlan}
                        paymentInfo={paymentInfo}
                        handleSuccess={handleRegisterCardSuccess}
                        showWarningMessage={showWarningMessage}
                        handleChangeInput={handleChangeInput}
                        handleChangeCheckbox={handleChangeCheckbox}
                        handleCloseModal={onClose}
                        isErrorValidateRegisterForm={isErrorValidateRegisterForm}
                        checkDownGradeServicePayment={checkDownGradeServicePayment}
                        isQrLimitInPoints={isQrLimitInPoints}
                      />
                    </Elements>
                  ) : <Box display='flex' justifyContent='center' mt={2}><CircularProgress /></Box>
                }
              </Box>
            )}
            
            {/* payment method invoice */}
            {
              paymentInfo.payment_method === PAYMENT_METHOD_TYPES.invoice && (
                <CustomerPaymentComponent
                  paymentInfo={paymentInfo}
                  handleChangeInput={handleChangeInput}
                  handleChangeCheckbox={handleChangeCheckbox}
                />
              )
            }
          </>
        )}
      </Box>
      
      {/* acceptTerm */}
      {
        (paymentInfo.payment_method !== PAYMENT_METHOD_TYPES.card || selectedPlan?.price == 0) && (
          <>
            <Box mt={1} className={classes.boxItems}>
              <Box width='35%' />
              
              <Box width='65%'>
                <FormControlLabel
                  control={<Checkbox checked={paymentInfo.acceptTerm} name='acceptTerm' />}
                  label={(
                    <Box>
                      <Link
                        href='#'
                        onClick={() => setIsOpenTerms(true)}
                        className={classes.termOfService}
                      >利用規約
                      </Link>に同意して利用する
                    </Box>
                  )}
                  onChange={(event) => handleChangeCheckbox(event)}
                />
              </Box>
            </Box>
            <TermsOfServiceDialog isOpen={isOpenTerms} setIsOpen={setIsOpenTerms} />
          </>
        )
      }
      
      <Box display='flex' justifyContent='center'>
        {renderActions()}
      </Box>
      
      {/* Modal error when down-grade payment service over limition */}
      {isOverQrLimit && (
        <Modal
          title='確認'
          open={open}
          actions={actionModalError()}
          maxWidth='480px'
          minHeight='150px'
        >
          <Box textAlign='center' className={classes.boxContent}>
            <Box className={classes.textModal} color='red'>
              プランを変更できません。
            </Box>
            <Box className={classes.textModal}>
              QR数上限を超えているため、プラン変更できません。
            </Box>
            <Box className={classes.textModal}>サポート窓口までお問い合わせください。</Box>
          </Box>
        </Modal>
      )}
    </Modal>
  );
};

// PropTypes
ModalRegisterPaymentMethod.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  isUpdateServicePlan: PropTypes.bool,
  isQrLimitInPoints: PropTypes.bool,
  usageQRCodeInMonth: PropTypes.number,
  originalServicePlan: PropTypes.object,
  stripeCustomerId: PropTypes.string,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalRegisterPaymentMethod.defaultProps = {
  open: false,
  onClose: () => {},
  isUpdateServicePlan: false,
  isQrLimitInPoints: false,
  usageQRCodeInMonth: null,
  originalServicePlan: {},
  stripeCustomerId: null,
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalRegisterPaymentMethod;
