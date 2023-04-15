import React, {useState, useContext} from 'react';
import { styled } from '@material-ui/core/styles';
import Utils from 'js/shared/utils';
import {useHistory} from 'react-router-dom';
import jwt_decode from 'jwt-decode';

// Components
import PageContainer from 'js/shared/components/PageContainer.js';
import RegistContainer from 'js/shop/components/RegistContainer';
import Card from 'js/shared/components/Card';
import { Box, Container, TextField } from '@material-ui/core';
import Modal from 'js/shared/components/Modal.js';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import Button from 'js/shared/components/Button.js';
import ModalConfirmationCode from 'js/shared/components/ModalConfirmationCode';

// Services
import ShopAuthService from 'js/shop/shop-auth-service';
import ShopApiService from 'js/shop/shop-api-service';
import { RecaptchaContainer } from 'js/shared/auth-base';

// Utils
import { SEND_OTP_TYPE, IS_FORGOT_PASSWORD_KEY } from 'js/utils/helpers/const';
import { setCookie } from 'js/utils/components/cookie/cookie.js';
import {IS_ACTIVE_SHOP_KEY} from 'js/utils/helpers/localStorage/const';

const FormsContainer = styled(Container)({
  width: '90%',
});

const PageSendOTP = () => {
  const hisory = useHistory();
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const otpType = params.get('type');

  // Shop context
  const [shopInfo] = useContext(ShopInfoContext);
  // signUp or signIn (店舗名が設定されていれば新規登、空欄ならログイン)
  const isSignUp = !!shopInfo.name;

  // Local state
  const [authPhoneNUmber, setAuthPhoneNumber] = useState('');
  const [showWait, setShowWait] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Confirmation login
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isShowConfirmCode, setIsShowConfirmCode] = useState(false);

  const handleChange = (event) => {
    setAuthPhoneNumber(event.target.value);
  };

  const handleButtonClick = async () => {
    if (!Utils.validatePattern('MOBILE_JP', authPhoneNUmber)) {
      setErrorMessage('携帯番号を入力してください');
      return;
    }
    const phoneNumber = Utils.addPhonePrefix(authPhoneNUmber);
    setShowWait(true);

    try {
      const confirmation = otpType === SEND_OTP_TYPE.isRegister
        ? await ShopAuthService.linkWithPhoneNumber(phoneNumber)
        : await ShopAuthService.signInWithPhoneNumber(phoneNumber);
      setConfirmationResult(confirmation);
      setIsShowConfirmCode(true);
    } catch (error) {
      setShowWait(false);
      handleRegisterError(error);
    }
  };

  const handleRegisterError = (error) => {
    // ERROR CODE の仕様
    if (error.code === 'auth/invalid-verification-code') {
      setErrorMessage('認証コードが一致しませんでした。もう一度お試しください。');
    } else if (error.code === 'auth/missing-verification-code') {
      setErrorMessage(`認証コードが入力されていません。もう一度お試しください。`);
    } else if (error.code === 'auth/credential-already-in-use') {
      setErrorMessage('この電話番号は既に使われています。');
    } else {
      setErrorMessage(`エラー(${error.code})。もう一度お試しください。`);
    }
  };

  const onCloseConfirmCode = () => {
    setShowWait(false);
    setIsShowConfirmCode(false);
  }

  const onSubmitConfirmCode = async (code) => {
    setIsShowConfirmCode(false);
    setShowWait(false);
    try {
      const result = await confirmationResult.confirm(code);
      if (shopInfo.password) {
        await ShopAuthService.reauthenticateWithPassword(shopInfo.password);
      }
      ShopAuthService.setCurrentUser(result.user);

      if (otpType === SEND_OTP_TYPE.isRegister) {
        // Check register by active shop
        const activeShopHashId = localStorage.getItem(IS_ACTIVE_SHOP_KEY);
        if (activeShopHashId) {
          try {
            await ShopApiService.registerDeactivateShop(activeShopHashId);
            localStorage.removeItem(IS_ACTIVE_SHOP_KEY);

            // redirect to home
              window.location.href = process.env.MIX_BASENAME_SHOP_ORDER;
            } catch (error) {
              // TODO: translate
              console.error(error.message);
            }
        } else {
          // redirect to home
          window.location.href = process.env.MIX_BASENAME_SHOP_ORDER;
        }
      } else if (otpType === SEND_OTP_TYPE.isForgot) {
        const token = await ShopAuthService.getIdToken();
        const tokenDecode = jwt_decode(token);
        // check phoneNumber register email/password
        if (tokenDecode.email) {
          // redirect to forgot password
          setCookie(IS_FORGOT_PASSWORD_KEY, true);
          hisory.push('/forgot-password');

          return;
        }

        // remove phoneNumber firebase account
        try {
          await ShopAuthService.deleteCurrentUser();
          setErrorMessage('電話番号が登録されていません。');
        } catch (error) {
          console.debug('[ForgotPassword][Remove User] Remove user verify phoneNumber error ', error.message);
        }
      }
    } catch (error) {
      handleRegisterError(error);
    }
  }

  const handleErrorModalButtonClick = () => {
    setErrorMessage(null);
  };

  return (
    <PageContainer>
      <RegistContainer>
        <Card
          title="電話番号認証"
          onButtonClick={handleButtonClick}
          buttonTitle={isSignUp ? '＋登録' : '送信'}
        >
          <Box>
            半角英数ハイフン(-)なしで入力してください。
          </Box>
          <FormsContainer>
            <TextField
              id="authPhoneNumber"
              variant="outlined"
              value={authPhoneNUmber}
              onChange={handleChange}
              placeholder="携帯電話番号"
              fullWidth
              inputProps={{
                maxLength: 11,
                type: 'tel',
              }}
            />
          </FormsContainer>
          <RecaptchaContainer authService={ShopAuthService} />
        </Card>
      </RegistContainer>

      {/* 処理中 modal */}
      <Modal title="" open={showWait}>
        携帯電話のSMS(ショートメッセージ)に6桁の番号が送られます。
        <br />
        <br />
        送られない場合は「キャンセル」し、再度電話番号を入力ください
      </Modal>

      {/* Modal get confirm code */}
      <ModalConfirmationCode
        title='コードを入力'
        open={ isShowConfirmCode }
        onClose={ onCloseConfirmCode }
        onSubmit={ onSubmitConfirmCode }
      />
      {/* END Modal get confirm code */}

      {/* エラー modal */}
      <Modal title="" open={!!errorMessage}>
        <Box>{errorMessage}</Box>
        <br />
        <Button onClick={handleErrorModalButtonClick}>確認</Button>
      </Modal>
    </PageContainer>
  );
};

// PropTypes
PageSendOTP.propTypes = {};
export default PageSendOTP;
