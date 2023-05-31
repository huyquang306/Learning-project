import React, {useEffect, useState} from 'react';
import Utils from 'js/shared/utils.js';
import { useHistory } from 'react-router';

// Components
import PageContainer from 'js/shared/components/PageContainer';
import RegisterContainer from "../RegisterContainer";
import Card from 'js/shared/components/Card';
import ConfirmPassword from 'js/shop/components/ConfirmPassword';

import FlashMessage from 'js/shared-order/components/FlashMessage';
// service
import ShopAuthApiService from 'js/shop/shop-auth-api-service';
import ShopAuthService from 'js/shop/shop-auth-service';

// Material-UI
import {makeStyles, styled} from '@material-ui/core/styles';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import {Box, Button, Container, IconButton, InputAdornment, TextField} from '@material-ui/core';

// Utils
import {MAX_NUMBER_CHARS_PASSWORD, convertTwoBytesCharacter} from 'js/utils/helpers/passwordHelper';
import {checkValidation} from './validationForgotPassword';

const InputUpperLabel = styled(Box)({
  marginTop: '1rem',
  textAlign: 'left',
  width: '100%',
});
const FormsContainer = styled(Container)({
  width: '95%',
});
const DEFAULT_PASSWORD_INFO = {
  password: '',
  password_confirmation: '',
};
const useStyles = makeStyles(() => ({
  cancelButton: {
    marginTop: '10px',
  },
}));

const PageForgotPassword = () => {
  const classes = useStyles();
  const history = useHistory();
  const tokenVerify = history?.location?.state?.from;

  // Local State
  const [isSubmit, setIsSubmit] = useState(true);
  const [passwordInfo, setPasswordInfo] = useState(DEFAULT_PASSWORD_INFO);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      if (tokenVerify) {
        const isValidTokenRes = await ShopAuthApiService.authVerifyForgotPassword(tokenVerify);
        if (!isValidTokenRes) {
          history.push('/');
        }
      } else {
        history.push('/');
      }
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const handleChangeInput = (event) => {
    const newPasswordInfo = Utils.cloneDeep(passwordInfo);
    const {name, value} = event.target;
    newPasswordInfo[name] = convertTwoBytesCharacter(value);
    setPasswordInfo(newPasswordInfo);
  };

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  const showSuccessMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'success',
    });
  };

  const handleForgotPassword = async () => {
    const errors = checkValidation(passwordInfo);
    setIsSubmit(true);

    if (errors.length > 0) {
      showWarningMessage(errors[0]);
      setIsSubmit(false);

      return;
    }

    try {
      await ShopAuthApiService.authResetPassword(passwordInfo.password, tokenVerify);
      showSuccessMessage('パスワードを変更しました!');

      setTimeout(() => {
        history.push('/');
      }, 500);
    } catch (error) {
      console.error('[Forgot Password] error ', error.message);
      showWarningMessage(error.message);
      setIsSubmit(false);
    }
  };

  const handleCancel = async () => {
    try {
      await ShopAuthService.signOut();
    } catch (e) {
      // User not login
    }
    window.location.href = process.env.MIX_BASENAME_SHOP_ORDER;
  };


  return (
    <PageContainer>
      <RegisterContainer>
        <Card
          title='パスワード再設定'
          key='createAccount'
          onButtonClick={handleForgotPassword}
          buttonDisabled={isSubmit}
        >
          <Box>新しいパスワードを設定してください。</Box>
          <FormsContainer>
            <ConfirmPassword
            isChangePassword={false}
            handleChange={handleChangeInput}
            handleDisabledButton={(value) => setIsSubmit(!value)}
            title='新しいパスワード'
          />

            <Button className={classes.cancelButton} onClick={handleCancel}>キャンセルする</Button>
          </FormsContainer>
        </Card>
      </RegisterContainer>

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
PageForgotPassword.propTypes = {};
export default PageForgotPassword;
