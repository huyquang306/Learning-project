import React, { useState } from 'react';
import Utils from 'js/shared/utils';

// Base Components
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import Footer from 'js/shared-order/components/Footer';
import ConfirmPassword from 'js/shop/components/ConfirmPassword';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { OutlinedInput, Button, Box, Grid } from '@material-ui/core';

// Services
import ShopAuthService from 'js/shop/shop-auth-service';

// Utils
import { checkValidation } from './validationChangePassword';
import CircularProgress from '@material-ui/core/CircularProgress';
import { convertTwoBytesCharacter } from 'js/utils/helpers/passwordHelper';

const useStyles = makeStyles(() => ({
  container: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#000',
  },
  input: {
    width: '100%',
    color: '#000',
    fontSize: '16px',
    height: '40px',
    borderRadius: '4px',
    paddingRight: '15px',
    '& .MuiInputBase-formControl': {
      paddingTop: '1px',
      paddingBottom: '1px',
    },
  },
  buttonController: {
    color: '#fff',
    borderRadius: '28px',
    padding: '12px 0',
    fontSize: '18px',
    width: '252px',
    textAlign: 'center',
  },
  buttonAdd: {
    background: '#FFA04B',
    boxShadow: 'rgb(0 0 0 / 24%) 0px 3px 8px !important',
    border: '1px solid #FFA04B',
    '&:hover': {
      background: '#FFA04B',
      border: '1px solid #FFA04B',
    },
    '&[disabled]': {
      border: '1px solid #908b8b',
      background: 'rgba(0, 0, 0, 0.12)',
    },
  },
  buttonBack: {
    background: '#828282',
    '&:hover': {
      background: '#828282',
    },
  },
  iconAdd: {
    color: '#BDBDBD',
    fontSize: 30,
  },
}));
const DEFAULT_PASSWORD_INFO = {
  currentPassword: '',
  password: '',
  password_confirmation: '',
};

const PageSettingChangePassword = (props) => {
  const classes = useStyles(props);

  // local state
  const [isSubmit, setIsSubmit] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [passwordInfo, setPasswordInfo] = useState(DEFAULT_PASSWORD_INFO);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

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

  const handleChangeInput = (event) => {
    const newPasswordInfo = Utils.cloneDeep(passwordInfo);
    const { name, value } = event.target;
    newPasswordInfo[name] = convertTwoBytesCharacter(value);
    setPasswordInfo(newPasswordInfo);
  };

  const handleChangePassword = async () => {
    const errors = checkValidation(passwordInfo);
    setIsSubmit(true);

    if (errors.length > 0) {
      showWarningMessage(errors[0]);
      setIsSubmit(false);

      return;
    }

    try {
      await ShopAuthService.reauthenticateWithPassword(passwordInfo.currentPassword);
      await ShopAuthService.updatePassword(passwordInfo.password);
      setPasswordInfo(DEFAULT_PASSWORD_INFO);
      showSuccessMessage('パスワードが変更されました。');
      setIsSubmit(false);
    } catch (error) {
      handleError(error);
      setIsSubmit(false);
    }
  };

  const handleError = (error) => {
    if (error.code === 'auth/wrong-password') {
      showWarningMessage('現在のパスワードが間違っています。');
    } else {
      showWarningMessage(error.message);
    }
  };

  return (
    <>
      <PageContainer padding='0px'>
        <HeaderAppBar title='Đổi mật khẩu' />
        <PageInnerContainer padding='0px 0px 25px 0px'>
          <Box p={4} className={classes.container}>
            <ConfirmPassword
              title='Mật khẩu mới'
              isChangePassword={true}
              handleChangeInputChangePassWord={handleChangeInput}
              handleDisabledButton={(value) => setButtonDisabled(!value)}
            />
            {/* END Password Confirmation */}

            <Footer padding='20px 10px'>
              <Grid container justify='center' spacing={5}>
                <Grid item>
                  <Button
                    onClick={handleChangePassword}
                    className={`${classes.buttonController} ${classes.buttonAdd}`}
                    disabled={
                      isSubmit ||
                      !passwordInfo.password ||
                      !passwordInfo.currentPassword ||
                      !passwordInfo.password_confirmation ||
                      buttonDisabled
                    }
                  >
                    Đổi mật khẩu
                    {isSubmit ? (
                      <CircularProgress style={{ marginLeft: 10, width: 20, height: 20 }} />
                    ) : null}
                  </Button>
                </Grid>
              </Grid>
            </Footer>
          </Box>

          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />
        </PageInnerContainer>
      </PageContainer>
    </>
  );
};

PageSettingChangePassword.propTypes = {};
export default PageSettingChangePassword;
