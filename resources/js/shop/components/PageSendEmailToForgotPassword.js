import React, { useState, useContext } from 'react';
import { styled } from '@material-ui/core/styles';

// Components
import PageContainer from 'js/shared/components/PageContainer.js';
import Card from 'js/shared/components/Card';
import { Box, Container, TextField } from '@material-ui/core';
import Modal from 'js/shared/components/Modal.js';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import Button from 'js/shared/components/Button.js';

// Services
import ShopAuthApiService from 'js/shop/shop-auth-api-service';

// Utils
import {
  MAX_NUMBER_CHARS_EMAIL,
  MIN_NUMBER_CHARS_EMAIL,
  EMAIL_RULE,
} from 'js/utils/helpers/emailHelper';
import RegisterContainer from "./RegisterContainer";
const FormsContainer = styled(Container)({
  width: '90%',
});

const PageSendEmailToForgotPassword = () => {
  // Shop context
  const [shopInfo] = useContext(ShopInfoContext);
  // signUp or signIn (店舗名が設定されていれば新規登、空欄ならログイン)
  const isSignUp = !!shopInfo.name;

  // Local state
  const [authEmail, setAuthEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleChange = (event) => {
    setAuthEmail(event.target.value);
  };

  const handleButtonClick = async () => {
    // Validate email
    if (authEmail.trim() === '') {
      setErrorMessage('Hãy điền địa chỉ email của bạn');

      return;
    }
    if (!EMAIL_RULE.test(authEmail)
      || authEmail.length < MIN_NUMBER_CHARS_EMAIL
      || authEmail.length > MAX_NUMBER_CHARS_EMAIL
    ) {
      setErrorMessage('Định dạng địa chỉ email không chính xác.');

      return;
    }

    try {
      await ShopAuthApiService.authForgotPassword(authEmail);
      setIsConfirmed(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleErrorModalButtonClick = () => {
    setErrorMessage(null);
  };

  return (
    <PageContainer>
      <RegisterContainer type='forgot-password'>
        <Card
          title='Xác nhận địa chỉ eamil'
          onButtonClick={handleButtonClick}
          buttonTitle={isSignUp ? '＋Thêm email' : 'Gửi'}
          buttonDisabled={authEmail.trim() === ''}
          customButtons={isConfirmed && <></>}
        >
          {isConfirmed ? (
            <Box>Yêu cầu đã được gửi tới email của bạn, vui lòng xác nhận!</Box>
          ) : (
            <FormsContainer>
              <TextField
                id='authEmail'
                variant='outlined'
                value={authEmail}
                onChange={handleChange}
                placeholder='Email'
                fullWidth
                inputProps={{
                  maxLength: MAX_NUMBER_CHARS_EMAIL,
                  type: 'text',
                }}
              />
            </FormsContainer>
          )}
          {/* <RecaptchaContainer authService={ShopAuthService} /> */}
        </Card>
      </RegisterContainer>

      {/* Show error message */}
      <Modal title='' open={!!errorMessage}>
        <Box>{errorMessage}</Box>
        <br />
        <Button onClick={handleErrorModalButtonClick}>Xác nhận</Button>
      </Modal>
    </PageContainer>
  );
};

// PropTypes
PageSendEmailToForgotPassword.propTypes = {};
export default PageSendEmailToForgotPassword;
