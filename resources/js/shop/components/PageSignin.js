import React, { useState } from 'react';
import {makeStyles, styled} from '@material-ui/core/styles';
import Utils from 'js/shared/utils';
import {convertTwoBytesCharacter} from "js/utils/helpers/passwordHelper";
import { Link } from 'react-router-dom';

// Services
import ShopAuthService from 'js/shop/shop-auth-service';
import { RecaptchaContainer } from 'js/shared/auth-base';

// Components
import PageContainer from 'js/shared/components/PageContainer.js';
import Card from 'js/shared/components/Card';
import {Box, Container, IconButton, InputAdornment, TextField} from '@material-ui/core';
import Modal from 'js/shared/components/Modal.js';
import Button from 'js/shared/components/Button.js';
import {VisibilityOff, Visibility} from '@material-ui/icons';
import RegisterContainer from "./RegisterContainer";

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

  const handleChange = (event) => {
    const newAccount = Utils.cloneDeep(account);
    const {name, value} = event.target;
    newAccount[name] = convertTwoBytesCharacter(value);
    setAccount(newAccount);
  }

  const handleButtonClick = async () => {
    setShowWait(true);
    try {
      await ShopAuthService.signInWithEmailAndPassword(account.email, account.password);
      setShowWait(false);
    } catch (error) {
      setShowWait(false);
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    console.error('[Login] signInWithEmailAndPassword ' + error.code);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email') {
      setErrorMessage('Your login information is incorrect');
    } else if (error.code === 'auth/user-disabled') {
      setErrorMessage('This store is disabled');
    } else {
      setErrorMessage('Login failed');
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

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
            <Box className={classes.labelInput}>Email Address</Box>
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

            <Box className={`${classes.labelInput} ${classes.labelInputTop}`}>Password</Box>
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
        <br />
        <Button onClick={() => setErrorMessage(null)}>Confirm</Button>
      </Modal>
    </PageContainer>
  );
};
// PropTypes
PageSignin.propTypes = {};
export default PageSignin;
