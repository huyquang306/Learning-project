import React, { useState } from 'react';
import {makeStyles, styled} from '@material-ui/core/styles';
import Utils from 'js/shared/utils';
import {convertTwoBytesCharacter} from "js/utils/helpers/passwordHelper";
import { Link } from 'react-router-dom';

// Services
import ShopAuthService from 'js/shop/shop-auth-service';
import ShopAuthApiService from "../shop-auth-api-service";
import { RecaptchaContainer } from 'js/shared/auth-base';

// Components
import PageContainer from 'js/shared/components/PageContainer.js';
import Card from 'js/shared/components/Card';
import {Box, Container, IconButton, InputAdornment, TextField} from '@material-ui/core';
import Modal from 'js/shared/components/Modal.js';
import Button from 'js/shared/components/Button.js';
import {VisibilityOff, Visibility} from '@material-ui/icons';
import RegisterContainer from "./RegisterContainer";
import {TIME_WAITING_FOR_RESEND} from "../../utils/helpers/const";

const FormsContainer = styled(Container)({
  width: '90%',
});

const useStyles = makeStyles(() => ({
  labelInput: {
    textAlign: 'left',
  },
  labelInputTop: {
    marginTop: '15px',
  },
}));

const PageSignin = (props) => {
  const classes = useStyles(props);

  // Local state
  const [account, setAccount] = useState({
    email: '',
    password: '',
  })
  const [showWait, setShowWait] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [sendEmail, setSendEmail] = useState(null);
  const [countdown, setCountDown] = useState(TIME_WAITING_FOR_RESEND / Utils.REFRESH_SECOND());
  const [buttonResendDisabled, setButtonResendDisabled] = useState(true);
  const [timerInterval, setTimerInterval] = useState(null);
  const [breakTimeout, setBreakTimeout] = useState(null);

  const handleChange = (event) => {
    const newAccount = Utils.cloneDeep(account);
    const {name, value} = event.target;
    newAccount[name] = convertTwoBytesCharacter(value);
    setAccount(newAccount);
  }

  const handleButtonClick = async () => {
    setShowWait(true);
    try {
      const res = await ShopAuthService.signInWithEmailAndPassword(account.email, account.password);
      console.log(res);
      setShowWait(false);
      if (!res?.user?.emailVerified) {
        sendVerifyEmail(account.email);
        setSendEmail(account.email);
        setErrorMessage('Vui lòng xác thực email trước khi sử dụng hệ thống, nếu bạn không nhận được email hãy yêu cầu gửi lại!');
      }
    } catch (error) {
      setShowWait(false);
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    console.error('[Login] signInWithEmailAndPassword ' + error.code);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email') {
      setErrorMessage('Thông tin đăng nhập không chính xác');
    } else if (error.code === 'auth/user-disabled') {
      setErrorMessage('Tài khoản của bạn đã bị vô hiệu hóa');
    } else {
      setErrorMessage('Đăng nhập thất bại');
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);
  
  const sendVerifyEmail = async (email) => {
    const data = {
      email: email
    }
    await ShopAuthApiService.sendVerifyEmailRegister(data);
    countDownForResend();
  }
  
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

  return (
    <PageContainer>
      <RegisterContainer type="signin">
        <Card
          title="Đăng nhập"
          onButtonClick={handleButtonClick}
          buttonTitle="Đăng nhập"
          buttonDisabled={!account.email && !account.password}
        >
          <FormsContainer>
            <Box className={classes.labelInput}>Email</Box>
            <TextField
              name="email"
              variant="outlined"
              value={account.email}
              onChange={handleChange}
              placeholder=""
              fullWidth
              inputProps={{
                maxLength: 100,
                type: 'email',
              }}
            />

            <Box className={`${classes.labelInput} ${classes.labelInputTop}`}>Mật khẩu</Box>
            <TextField
              name="password"
              variant="outlined"
              value={account.password}
              onChange={handleChange}
              placeholder=""
              fullWidth
              inputProps={{
                maxLength: 100,
                type: showPassword ? 'text' : 'password',
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                    onClick={togglePassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Box className={`${classes.labelInput} ${classes.labelInputTop}`}>
              <Link to="/verify-forgot-password">Quên mật khẩu</Link>
            </Box>
          </FormsContainer>

          <RecaptchaContainer authService={ShopAuthService} />
        </Card>
      </RegisterContainer>

      <Modal title="" open={showWait} height={250}>
        Đăng nhập ...
      </Modal>

      <Modal title="" open={!!errorMessage} height={250}>
        <Box>{errorMessage}</Box>
        <Box>
          {sendEmail ? <Button
            bgcolor='#FFF'
            fgcolor='#86BE27'
            onClick={() => {
              sendVerifyEmail(sendEmail);
            }}
            padding='8px 32px'
            borderColor={buttonResendDisabled ? '#00000033' : '#86BE27'}
          >
            Gửi lại email {buttonResendDisabled && `sau（${countdown} giây nữa）`}
          </Button> : <></>}
          {/*<br />*/}
          <Button onClick={() => setErrorMessage(null)}>OK</Button>
        </Box>
      </Modal>
    </PageContainer>
  );
};
// PropTypes
PageSignin.propTypes = {};
export default PageSignin;
