import React, { useState, useEffect } from 'react';
import Utils from "../../shared/utils";
import { useHistory } from "react-router-dom";

// Components
import PageContainer from "../../shared/components/PageContainer";
import RegisterContainer from "./RegisterContainer";
import Card from "../../shared/components/Card";
import Modal from "../../shared/components/Modal";
import { shopInfoDefault } from "./ShopInfoContext";
import FlashMessage from "../../shared-order/components/FlashMessage";
import Button from "../../shared-order/components/Button";
import ConfirmPassword from "./ConfirmPassword";

// Services
import ShopAuthService from "../shop-auth-service";
import ShopApiService from "../shop-api-service";
import ShopWithoutAuthApiService from "../shop-without-auth-api-service";
import ShopAuthApiService from "../shop-auth-api-service";

// Material UI
import { styled, makeStyles } from '@material-ui/core/styles';
import { Box, Container, TextField, Grid, Checkbox, Link } from '@material-ui/core';

// Utils
import {
  MAX_NUMBER_CHARS_PASSWORD,
  MIN_NUMBER_CHARS_PASSWORD,
  PASSWORD_POLICY_REGEX,
  PASSWORD_CONTAINS_ALLOW_SYMBOL,
  convertTwoBytesCharacter,
} from "../../utils/helpers/passwordHelper";
import {
  MAX_NUMBER_CHARS_EMAIL,
  MIN_NUMBER_CHARS_EMAIL,
  EMAIL_RULE
} from "../../utils/helpers/emailHelper";
import { TIME_WAITING_FOR_RESEND } from "../../utils/helpers/const";
import PrefSelector from "../../shared/components/PrefSelector";
import TermsOfServiceDialog from "../../shared/components/TermsOfServiceDialog";
import * as PropTypes from "prop-types";
import PrivacyPolicyDialog from "../../shared/components/PrivacyPolicyDialog";
import ModalRegisterAccountForDeactiveShop from "./PageRegister/ModalRegisterAccountForDeactiveShop";

const useStyles = makeStyles({
  textLeft: {
    textAlign: 'left',
  },
  timeSelector: {
    width: '100%',
    margin: '0px 5px',
  },
  selectShopButton: {
    margin: '10px 0',
    padding: '8px 40px',
    backgroundColor: '#FFF',
    color: '#F8B62E',
    border: 'solid 1px #F8B62E',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: '#F8B62E',
      color: '#FFF',
      opacity: 0.9,
    },
  },
  selectedShopButton: {
    backgroundColor: '#F8B62E',
    color: '#FFF',
  },
  floatRightButton: {
    float: 'right',
    boxShadow: 'rgb(0 0 0 / 30%) 0px 2px 0px 0px',
    borderRadius: '5px',
    padding: '8px 40px',
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'rgb(146, 197, 61)',
    borderColor: 'rgb(146, 197, 61)',
    cursor: 'pointer',
    margin: '20px 5px',
    display: 'inline-block',
    borderStyle: 'solid',
    borderWidth: '2px',
    textDecoration: 'none',
  },
  label: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    '@media (max-width: 600px)': {
      transform: 'translateY(20px)',
    },
  },
  confirmNoti: {
    width: '80%',
    margin: '0 auto',
    textAlign: 'center',
  },
  shopname: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 800,
    margin: '24px 0',
  },
  wrapButton: {
    '& button': {
      whiteSpace: 'nowrap',
      '@media (max-width: 600px)': {
        width: '100%',
        padding: '8px 0',
      },
    },
  },
  boxButtonSearch: {
    '& button': {
      '@media (max-width: 600px)': {
        margin: '25px 0',
        width: '100%',
      },
    },
  },
  required: {
    fontSize: 12,
    color: 'red',
    marginLeft: 4
  },
  agreement : {
    fontSize: 15,
  }
});

const FormsContainer = styled(Container)({
  width: '95%',
});

const STEPS_FOR_SHOW = [1, 2];
const ROBOT_REGISTER = 1;
const SEARCH_SHOP_STEP = 0;
const CREATE_NEW_SHOP_STEP = 1;
const START_TIME = '00:00:00';
const END_TIME = '23:30:00';

function WaitingModal(props) {
  return null;
}

WaitingModal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  children: PropTypes.node
};
const PageRegister = (props) => {
  // history
  const history = useHistory();
  const classes = useStyles(props);
  
  // state
  const [shop, setShop] = useState(shopInfoDefault);
  const [step, setStep] = useState(0);
  const [stepName, setStepName] = useState(null);
  const [showWait, setShowWait] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [filterShop, setFilterShop] = useState({
    keyword: '',
    prefecture: '',
  });
  const [searchShops, setSearchShops] = useState([]);
  const [selectedSearchShopHashId, setSelectedSearchShopHashId] = useState(null);
  const [isBacktoPreviousStep, setIsBacktoPreviousStep] = useState(false);
  const [lastStepBeforeBack, setLastStepBeforeBack] = useState(0);
  const [disabledPassword, setDisabledPassword] = useState(false);
  const [buttonResendDisabled, setButtonResendDisabled] = useState(true);
  const [emailBeforeChange, setEmailBeforeChange] = useState('email');
  const [countdown, setCountDown] = useState(TIME_WAITING_FOR_RESEND / Utils.REFRESH_SECOND());
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [modalRegisterForDeactiveStatus, setModalRegisterForDeactiveStatus] = useState(false);
  const [isSearchShop, setIsSearchShop] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [breakTimeout, setBreakTimeout] = useState(null);
  const [haveError, setHaveError] = useState(false);
  const [typeModelRobot, setTypeModeRobot] = useState(true);
  const [infoAccountTypeModelRobot, setInfoAccountTypeModelRobot] = useState(null);
  const [backToModalRobot, setBackToModalRobot] = useState();
  // checkbox state
  const [isChecked, setIsChecked] = useState({
    term: false,
    privacy: false,
  });
  // dialogs state
  const [isOpenPP, setIsOpenPP] = useState(false);
  const [isOpenTerms, setIsOpenTerms] = useState(false);
  
  
  // Case: user login by unregistered phone number and choose regist from login screen
  const authPhoneNumber = localStorage.getItem('phoneNumber');
  
  // count up step
  useEffect(() => {
    const card = cardList[step];
    if (!card) {
      return;
    }
    console.debug('[PageRegist] step update', step, card.key);
    setStepName(card.key);
    clearInterval(timerInterval);
    clearTimeout(breakTimeout);
    handleDisabledButton() ? setButtonDisabled(true) : setButtonDisabled(false);
  }, [step]);
  
  useEffect(() => {
    getModelSetupRobot();
  }, []);
  
  const getModelSetupRobot = async () => {
    try {
      const res = await ShopAuthApiService.getSystemConfiguration();
      console.log(res);
      if (res.ROBOT_REGISTER == ROBOT_REGISTER) {
        setTypeModeRobot(true);
        setStep(SEARCH_SHOP_STEP);
      } else {
        setTypeModeRobot(false)
        setStep(CREATE_NEW_SHOP_STEP);
      }
    } catch (error) {
      showWarningMessage(error.message);
    }
  };
  
  const createShopTemp = async (isResend = false) => {
    isResend && setShowWait(true);
    setButtonResendDisabled(true);
    if (!infoAccountTypeModelRobot) {
      let shopClone = Utils.cloneDeep(shop);
      let infoShop = {
        name: shopClone.name,
        email: shopClone.email,
        phone_number: shopClone.phoneNumber,
        address: shopClone.address,
        postal_code: shopClone.postalCode,
        prefecture: shopClone.prefecture,
        start_time: START_TIME,
        end_time: END_TIME,
        city: shopClone.city,
        genre: ["other"],
        lat: shopClone.lat,
        lng: shopClone.lng,
        building: shopClone.building,
      };
      try {
        const latlngResult = await ShopApiService.getLatLon(
          shopClone.prefecture,
          shopClone.city,
          shopClone.address,
          shopClone.building
        );
        infoShop.lat = latlngResult.lat;
        infoShop.lng = latlngResult.lng;
        infoShop.lon = latlngResult.lng;
        
        await ShopApiService.createShopTemp(infoShop);
        isResend === false && setStep((prev) => prev + 1);
        setShowWait(false);
        setEmailBeforeChange(shop?.email);
        setHaveError(false);
      } catch (error) {
        setShowWait(false);
        showWarningMessage(error.message);
        setHaveError(true);
      }
    } else {
      let infoShop = {
        email: infoAccountTypeModelRobot.email,
        is_active_shop: true,
        hash_id: searchShops.find((shopTmp) => shopTmp.hash_id === selectedSearchShopHashId).hash_id
      };
      try {
        await ShopApiService.createShopTemp(infoShop);
        setShowWait(false);
      } catch (error) {
        showWarningMessage(error.message);
      }
    }
    countDownForResend();
  };
  
  const countDownForResend = () => {
    let countdownClone = TIME_WAITING_FOR_RESEND / Utils.REFRESH_SECOND();
    setCountDown(TIME_WAITING_FOR_RESEND / Utils.REFRESH_SECOND());
    
    let countdownInterval = setInterval(() => {
      setCountDown(--countdownClone);
      if (countdownClone <= 0) {
        clearInterval(countdownInterval);
      }
    }, Utils.REFRESH_SECOND());
    
    const timeoutCountdown = setTimeout(() => {
      setButtonResendDisabled(false);
    }, TIME_WAITING_FOR_RESEND);
    setTimerInterval(countdownInterval);
    setBreakTimeout(timeoutCountdown);
  };
  
  const handleButtonClick = async () => {
    let shopClone = Utils.cloneDeep(shop);
    
    // last step
    if (step === cardList.length - 2) {
      setShowWait(true);
      setButtonDisabled(true);
      try {
        await ShopAuthService.createUserWithEmailAndPassword(shopClone.email, shopClone.password);
      } catch (error) {
        setShowWait(false);
        setHaveError(true);
        if (error.code !== 'auth/email-already-in-use') {
          showWarningMessage(`Lỗi (${error.code}), vui lòng thử lại sau`);
          return;
        } else {
          showWarningMessage(`Địa chỉ email này đã được đăng ký`);
          return;
        }
      }
      createShopTemp();
    } else {
      setStep((prev) => prev + 1);
      isBacktoPreviousStep && step <= lastStepBeforeBack
        ? setButtonDisabled(false)
        : setButtonDisabled(true);
    }
    
    if (step > lastStepBeforeBack) {
      setLastStepBeforeBack(step);
    }
    
    // remove item phoneNumber save at local storage when passing step enter phone number
    if (authPhoneNumber && step === 3) {
      localStorage.removeItem('phoneNumber');
    }
  };
  
  //Back to prev step
  const handleBackClick = () => {
    if (typeModelRobot && backToModalRobot) {
      setStep(0);
      setModalRegisterForDeactiveStatus(true);
      setDisabledPassword(true);
    } else {
      setStep((prev) => prev - 1);
      setIsBacktoPreviousStep(true);
      setButtonDisabled(false);
    }
  };
  
  const handleClickShopAccount = async () => {
    const { email, password, password_confirmation } = shop;
    // Validate email
    if (
      !EMAIL_RULE.test(email) ||
      email.length < MIN_NUMBER_CHARS_EMAIL ||
      email.length > MAX_NUMBER_CHARS_EMAIL
    ) {
      setButtonDisabled(true);
      showWarningMessage('Please enter your email address');
      setHaveError(true);
      return;
    }
    
    // Validate password
    if (
      password.length < MIN_NUMBER_CHARS_PASSWORD ||
      password.length > MAX_NUMBER_CHARS_PASSWORD
    ) {
      setButtonDisabled(true);
      showWarningMessage(
        `Please enter a character length password from ${MIN_NUMBER_CHARS_PASSWORD} to ${MAX_NUMBER_CHARS_PASSWORD}`
      );
      setHaveError(true);
      
      return;
    } else if (!PASSWORD_CONTAINS_ALLOW_SYMBOL.test(password)) {
      showWarningMessage(`Contains symbols that cannot be used`);
      setHaveError(true);
      
      return;
    } else if (!PASSWORD_POLICY_REGEX.test(password)) {
      showWarningMessage(
        `Please enter a password with at least one character ${MIN_NUMBER_CHARS_PASSWORD} including alphanumeric characters and symbols`
      );
      
      return;
    }
    
    // Validate password_confirmation
    if (password_confirmation !== password) {
      setButtonDisabled(true);
      showWarningMessage('Password does not match confirmation password');
      return;
    }
    
    handleButtonClick();
  };
  
  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };
  
  // form change
  const handleChange = (event) => {
    const key = event.target.id;
    let value = event.target.value;
    const inputType = event.target.type;
    const pattern = event.target.dataset ? event.target.dataset.pattern : null;
    
    if (key === 'password' || key === 'password_confirmation') {
      value = convertTwoBytesCharacter(value);
    }
    
    if ((inputType === 'tel' || inputType === 'number') && !/^\d*$/.test(value)) {
      return;
    }
    
    if (key === 'email') {
      emailBeforeChange === value ? setDisabledPassword(true) : setDisabledPassword(false);
      if (haveError) {
        shop.email === value ? setButtonDisabled(true) : setButtonDisabled(false);
      }
    }
    
    setShop((prev) => ({ ...prev, [key]: value }));
    
    if (pattern) {
      if (new RegExp(pattern).test(value)) {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }
    // remove item phoneNumber save at local storage when on change phone number
    if (key === 'phoneNumber') {
      localStorage.removeItem('phoneNumber');
    }
  };
  
  const handleChangeSearchShop = (event) => {
    const { target } = event;
    const key = target.id;
    const value = target.value;
    const filterShopClone = Utils.cloneDeep(filterShop);
    filterShopClone[key] = value;
    setFilterShop(filterShopClone);
  };
  
  const handleSearchShops = async () => {
    // validate prefecture
    if (!filterShop.prefecture) {
      showWarningMessage('Select the prefecture');
      
      return;
    }
    
    setIsSearchShop(true);
    try {
      const shops = await ShopWithoutAuthApiService.searchShops(filterShop);
      setSelectedSearchShopHashId(null);
      setSearchShops(shops);
    } catch (error) {
      console.error('Search shops error', error);
    }
  };
  
  const handleChangePostalCode = (event) => {
    const pattern = event.target.dataset ? event.target.dataset.pattern : null;
    const value = event.target.value;
    // if (pattern) {
    //   if (new RegExp(pattern).test(shop.postalCode)) {
    //     if (shop.postalCode !== '') {
    //       setShowWait(true);
    //       ShopApiService.request(ENDPOINTS.SEARCH_ZIP, [shop.postalCode], null)
    //         .then((result) => {
    //           setShowWait(false);
    //           console.debug('[app] api response', result);
    //           if (result.prefecture) {
    //             setShop((prev) => ({
    //               ...prev,
    //               prefecture: result.prefecture,
    //               city: result.city,
    //               address: result.address,
    //             }));
    //           }
    //         })
    //         .catch((error) => {
    //           setShowWait(false);
    //           console.error('SEARCH_ZIP ERROR', error);
    //         });
    //     }
    //   }
    // }
  };
  
  // checkbox handler
  const handleChangeCheckbox = (event) => {
    const target = event.target;
    check(target.name, target.checked);
  };
  const check = (name, isChecked) => {
    setIsChecked((prev) => {
      const current = { ...prev };
      current[name] = isChecked;
      return current;
    });
  };
  
  const handleDisabledButton = () => {
    if (step === 1) {
      return (
        !shop.name ||
        !shop.phoneNumber ||
        !shop.postalCode ||
        !shop.prefecture ||
        !shop.city ||
        !shop.address ||
        !isChecked.term ||
        !isChecked.privacy
      );
    }
  };
  
  // scenario
  const cardList = [
    // === step 0: search deactive shops ===
    <Card title='Find Your Shop' key='search_shop' customButtons={<></>}>
      <FormsContainer>
        <PrefSelector
          id='prefecture'
          variant='outlined'
          value={filterShop.prefecture}
          onChange={handleChangeSearchShop}
          fullWidth
          className={classes.textLeft}
        />
        
        <Box display='flex' alignItems='center' mt={3} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Box width={{ xs: '100%', sm: '80%' }}>
            <TextField
              id='keyword'
              inputProps={{
                maxLength: 30,
                type: 'text',
                'data-pattern': '.',
              }}
              variant='outlined'
              value={filterShop.keyword}
              onChange={handleChangeSearchShop}
              placeholder='Nhập tên shop hoặc email'
              fullWidth
            />
          </Box>
          
          <Box
            whiteSpace='nowrap'
            width={{ xs: '100%', sm: 'auto' }}
            className={classes.boxButtonSearch}
          >
            <Button
              title='Search'
              bgcolor='#FFF'
              fgcolor='#92C53D'
              borderColor='#92C53D'
              onClick={handleSearchShops}
              className={classes.floatRightButton}
              disabled={!filterShop.keyword && !filterShop.prefecture}
            ></Button>
          </Box>
        </Box>
        
        {/* result search shops */}
        <Box width='60%' textAlign='left'>
          {searchShops && searchShops.length
            ? searchShops.map((shopData, shopIndex) => (
              <Box key={shopIndex} display='flex' alignItems='center'>
                <Box width='60%'>{shopData.name}</Box>
                
                <Box width='40%'>
                  <Button
                    title='Select'
                    bgcolor='#F8B62E'
                    borderColor='#F8B62E'
                    fgcolor='#F7FAEE'
                    className={`${classes.selectShopButton} ${
                      shopData.hash_id === selectedSearchShopHashId
                        ? classes.selectedShopButton
                        : ''
                    }`}
                    onClick={() => {
                      if (shopData.hash_id !== selectedSearchShopHashId) {
                        setSelectedSearchShopHashId(shopData.hash_id);
                      } else {
                        setSelectedSearchShopHashId(null);
                      }
                    }}
                  ></Button>
                </Box>
              </Box>
            ))
            : isSearchShop && <Box mt={2}>Shop not found</Box>}
        </Box>
        
        <Box
          display={{ sm: 'flex' }}
          justifyContent='center'
          alignItems='center'
          mt={3}
          className={classes.wrapButton}
        >
          <Button
            title='Tạo cửa hàng mới'
            bgcolor='#FFF'
            fgcolor='#92C53D'
            borderColor='#92C53D'
            onClick={() => { setBackToModalRobot(false); handleButtonClick();}}
          ></Button>
          <Button
            title='Chọn và tiếp tục'
            bgcolor='#86BE27'
            fgcolor='#F7FAEE'
            onClick={() => { setBackToModalRobot(true); setModalRegisterForDeactiveStatus(true)}}
            disabled={!selectedSearchShopHashId}
          ></Button>
        </Box>
      </FormsContainer>
    </Card>,
    
    // === step 1: shop name =========
    <Card
      title='Setting the basic information of the shop'
      key='name'
      onButtonClick={handleButtonClick}
      buttonDisabled={buttonDisabled || handleDisabledButton()}
      showButtonBack={true}
      handleBackClick={() => { typeModelRobot ? setStep(0) : history.goBack() }}
    >
      <FormsContainer>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={2}>
            <Box className={classes.label} justifyContent={{ xs: 'start', sm: 'center' }}>
              Tên cửa hàng <Box className={classes.required}>(*)</Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              id='name'
              inputProps={{
                maxLength: 30,
                type: 'text',
                'data-pattern': '.',
              }}
              variant='outlined'
              value={shop.name}
              onChange={handleChange}
              placeholder=''
              fullWidth
            />
          </Grid>
        </Grid>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={2}>
            <Box className={classes.label} justifyContent={{ xs: 'start', sm: 'center' }}>
              Số điện thoại <Box className={classes.required}>(*)</Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              id='phoneNumber'
              inputProps={{
                maxLength: 11,
                type: 'tel',
                'data-pattern': '^\\d{9,11}$',
              }}
              variant='outlined'
              value={authPhoneNumber ? authPhoneNumber : shop.phoneNumber}
              onChange={handleChange}
              placeholder=''
              fullWidth
            />
          </Grid>
        </Grid>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={2}>
            <Box className={classes.label} justifyContent={{ xs: 'start', sm: 'center' }}>
              Zipcode <Box className={classes.required}>(*)</Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id='postalCode'
              inputProps={{
                maxLength: 7,
                type: 'tel',
                'data-pattern': '^\\d{7}$',
              }}
              variant='outlined'
              value={shop.postalCode}
              onBlur={handleChangePostalCode}
              onChange={handleChange}
              placeholder='1000001'
              fullWidth
            />
          </Grid>
          {/*<Grid item xs={12} sm={2}>*/}
          {/*  <Box className={classes.label} justifyContent={{ xs: 'start', sm: 'center' }}>*/}
          {/*    Prefectures <Box className={classes.required}>(*)</Box>*/}
          {/*  </Box>*/}
          {/*</Grid>*/}
          {/*<Grid item xs={12} sm={4}>*/}
          {/*  <PrefSelector*/}
          {/*    id='prefecture'*/}
          {/*    variant='outlined'*/}
          {/*    value={shop.prefecture}*/}
          {/*    onChange={handleChange}*/}
          {/*    fullWidth*/}
          {/*    className={classes.textLeft}*/}
          {/*  />*/}
          {/*</Grid>*/}
          
          <Grid item xs={12} sm={2}>
            <Box className={classes.label} justifyContent={{ xs: 'start', sm: 'center' }}>
              Tỉnh/Thành phố <Box className={classes.required}>(*)</Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id='city'
              inputProps={{
                maxLength: 50,
                type: 'text',
              }}
              variant='outlined'
              value={shop.city}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        
        <Grid container spacing={4}>
          {/*<Grid item xs={12} sm={2}>*/}
          {/*  <Box className={classes.label} justifyContent={{ xs: 'start', sm: 'center' }}>*/}
          {/*    Municipalities <Box className={classes.required}>(*)</Box>*/}
          {/*  </Box>*/}
          {/*</Grid>*/}
          {/*<Grid item xs={12} sm={4}>*/}
          {/*  <TextField*/}
          {/*    id='city'*/}
          {/*    inputProps={{*/}
          {/*      maxLength: 50,*/}
          {/*      type: 'text',*/}
          {/*    }}*/}
          {/*    variant='outlined'*/}
          {/*    value={shop.city}*/}
          {/*    fullWidth*/}
          {/*    onChange={handleChange}*/}
          {/*  />*/}
          {/*</Grid>*/}
          
          <Grid item xs={12} sm={2}>
            <Box className={classes.label} justifyContent={{ xs: 'start', sm: 'center' }}>
              Quận/Huyện <Box className={classes.required}>(*)</Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            {/*<PrefSelector*/}
            {/*  id='prefecture'*/}
            {/*  variant='outlined'*/}
            {/*  value={shop.prefecture}*/}
            {/*  onChange={handleChange}*/}
            {/*  fullWidth*/}
            {/*  className={classes.textLeft}*/}
            {/*/>*/}
            <TextField
              id='prefecture'
              inputProps={{
                maxLength: 50,
                type: 'text',
              }}
              variant='outlined'
              value={shop.prefecture}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Box className={classes.label} justifyContent={{ xs: 'start', sm: 'center' }}>
              Địa chỉ <Box className={classes.required}>(*)</Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id='address'
              inputProps={{
                maxLength: 200,
                type: 'text',
              }}
              variant='outlined'
              value={shop.address}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={12} sm={2}>
            </Grid>
            <Grid
              item
              xs={12}
              sm={10}
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Checkbox
                name="term"
                color="default"
                onChange={handleChangeCheckbox}
                checked={isChecked.term}
              />
              <Box className={classes.agreement}>
                <Link
                  href="#"
                  onClick={() => {
                    setIsOpenTerms(true);
                    check('term', true);
                  }}
                >
                  Điều khoản dịch vụ
                </Link>
                <span className={classes.required}>(*)</span>
              </Box>
            </Grid>
            <Grid item xs={12} sm={2}>
            </Grid>
            <Grid
              item
              xs={12}
              sm={10}
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Checkbox
                name="privacy"
                color="default"
                onChange={handleChangeCheckbox}
                checked={isChecked.privacy}
              />
              <Box className={classes.agreement}>
                <Link
                  href="#"
                  onClick={() => {
                    setIsOpenPP(true);
                    check('privacy', true);
                  }}
                >
                  Chính sách bảo mật
                </Link>
                <span className={classes.required}>(*)</span>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        
        {/* </Grid> */}
      </FormsContainer>
      <TermsOfServiceDialog isOpen={isOpenTerms} setIsOpen={setIsOpenTerms} />
      <PrivacyPolicyDialog isOpen={isOpenPP} setIsOpen={setIsOpenPP} />
    </Card>,
    
    // === step ２: shop email, password =========
    <Card
      title='Thông tin đăng nhập'
      key='createAccount'
      onButtonClick={handleClickShopAccount}
      buttonDisabled={buttonDisabled || !shop.email || disabledPassword}
      handleBackClick={handleBackClick}
      showButtonBack={true}
    >
      <FormsContainer>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={2}>
            <Box className={classes.label} flexDirection={{ xs: 'row', sm: 'column' }}>
              Email
              {/*<Box className={classes.required}>(*)</Box>*/}
            </Box>
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              id='email'
              inputProps={{
                maxLength: MAX_NUMBER_CHARS_EMAIL,
                type: 'text',
              }}
              variant='outlined'
              value={shop.email}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        
        <ConfirmPassword
          isChangePassword={false}
          disabledPassword={disabledPassword}
          handleChange={handleChange}
          handleDisabledButton={(value) => setButtonDisabled(!value)}
          shop={shop}
          title="Mật khẩu"
        />
      </FormsContainer>
    </Card>,
    
    // === step 3: waiting confirmation ==========
    <Card
      title='Thông tin đăng nhập'
      key='waitConfirm'
      buttonDisabled={buttonDisabled}
      customButtons={<></>}
    >
      <Box>
        <Box>Yêu cầu đã được gửi tới email của bạn, vui lòng xác nhận!</Box>
        <Box mt={3} mb={2}>
          {shop?.email || infoAccountTypeModelRobot?.email}
        </Box>
        
        <Box>
          <Button
            bgcolor='#86BE27'
            fgcolor='#F7FAEE'
            disabled={false}
            onClick={() => {
              handleBackClick();
              setDisabledPassword(true);
            }}
          >
            Thay đổi email
          </Button>
          <Button
            bgcolor='#FFF'
            fgcolor='#86BE27'
            disabled={buttonResendDisabled}
            onClick={() => {
              createShopTemp(true);
            }}
            padding={buttonResendDisabled ? '8px 32px' : '8px 76px'}
            borderColor={buttonResendDisabled ? '#00000033' : '#86BE27'}
          >
            Gửi lại email {buttonResendDisabled && `（sau ${countdown} giây nữa）`}
          </Button>
        </Box>
      </Box>
    </Card>,
  ];
  
  return (
    <PageContainer>
      <RegisterContainer type='register' step={STEPS_FOR_SHOW.includes(step) ? step : null}>
        {cardList[step]}
      </RegisterContainer>
      
      <ModalRegisterAccountForDeactiveShop
        selectedShop={searchShops.find((shopTmp) => shopTmp.hash_id === selectedSearchShopHashId)}
        open={modalRegisterForDeactiveStatus}
        onClose={() => setModalRegisterForDeactiveStatus(false)}
        showWarningMessage={showWarningMessage}
        moveToNextStep={(account) => {
          setInfoAccountTypeModelRobot(account);
          setStep(cardList.length - 1);
          countDownForResend();
        }}
        infoAccountTypeModelRobot={infoAccountTypeModelRobot}
      />
      
      {/* processing modal */}
      <WaitingModal title='' open={showWait}>
        Vui lòng chờ...
      </WaitingModal>
      
      <FlashMessage
        isOpen={toast.isShow}
        onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
        status={toast.status}
        message={toast.message}
      />
    </PageContainer>
  );
};
// PropTypes
PageRegister.propTypes = {};
export default PageRegister;