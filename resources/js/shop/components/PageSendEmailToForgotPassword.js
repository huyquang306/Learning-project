import React, { useState, useContext } from 'react';
import { styled } from '@material-ui/core/styles';

// Components
import PageContainer from 'js/shared/components/PageContainer.js';
import RegistContainer from 'js/shop/components/RegistContainer';
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
      setErrorMessage('メールアドレスを入力して下さい。');

      return;
    }
    if (!EMAIL_RULE.test(authEmail)
      || authEmail.length < MIN_NUMBER_CHARS_EMAIL
      || authEmail.length > MAX_NUMBER_CHARS_EMAIL
    ) {
      setErrorMessage('メールアドレスの形式が正しくありません。');

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
      <RegistContainer type='forgot-password'>
        <Card
          title='メールアドレス認証'
          onButtonClick={handleButtonClick}
          buttonTitle={isSignUp ? '＋登録' : '送信'}
          buttonDisabled={authEmail.trim() === ''}
          customButtons={isConfirmed && <></>}
        >
          {isConfirmed ? (
            <Box>メールにリクエストを送信しました。 確認してください。</Box>
          ) : (
            <FormsContainer>
              <TextField
                id='authEmail'
                variant='outlined'
                value={authEmail}
                onChange={handleChange}
                placeholder='メールアドレス'
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
      </RegistContainer>

      {/* Show error message */}
      <Modal title='' open={!!errorMessage}>
        <Box>{errorMessage}</Box>
        <br />
        <Button onClick={handleErrorModalButtonClick}>確認</Button>
      </Modal>
    </PageContainer>
  );
};

// PropTypes
PageSendEmailToForgotPassword.propTypes = {};
export default PageSendEmailToForgotPassword;
