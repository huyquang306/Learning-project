import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {makeStyles, styled} from '@material-ui/core/styles';

// Components
import PageContainer from 'js/shared/components/PageContainer';
import RegisterContainer from "../../shop/components/RegisterContainer";
import Card from 'js/shared/components/Card';
import { Box, Container, TextField } from '@material-ui/core';
import Modal from 'js/shared/components/Modal';
import Button from 'js/shared/components/Button';
import UserInfoContext from 'js/customer-order/components/UserInfoContext';

// Services
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';

// Utils
import Utils from 'js/shared/utils';
import {setCookie, getCookie, deleteCookie, CUSTOMER_AUTH_KEY, CUSTOMER_LOGIN_INFO_KEY} from 'js/utils/components/cookie/cookie';

// Style
const useStyles = makeStyles({
  underlineText: {
    textDecoration: 'underline',
  },
});

const FormsContainer = styled(Container)({
  width: '90%',
});

const PageSignin = (_props) => {
  const customerAuth = getCookie(CUSTOMER_AUTH_KEY);
  const classes = useStyles();
  const history = useHistory();
  const oldShopHashId = localStorage.getItem('shopHash');

  // Local state
  const [authPhoneNUmber, setAuthPhoneNumber] = useState('');
  const [nickName, setNickName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [orderLink, setOrderLink] = useState(null);

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const shopHash = params.get('redirect_url');
  const ordergroupHash = params.get('ordergroup_hash_id');
  const shopName = params.get('shop_name');
  const tableCode = params.get('table_code');
  // get cookie user hash id
  const userHashId = getCookie('userHashId');

  // Context
  const [userInfo, setUserInfo] = useContext(UserInfoContext);

  // set transaction info
  useEffect(() => {
    // Check new login in other shops
    if (shopHash && oldShopHashId !== shopHash) {
      localStorage.removeItem('shopHash');
    }

    if (search) {
      if (shopHash) {
        localStorage.setItem('shopHash', shopHash);
      }
      if (ordergroupHash) {
        localStorage.setItem('ordergroupHash', ordergroupHash);
      }
      if (shopName) {
        localStorage.setItem('shopName', shopName);
      }
      if (tableCode) {
        localStorage.setItem('tableCode', tableCode);
      }
      // set order link
      const newOrderLink = `${shopHash}?ordergroup_hash_id=${ordergroupHash}&shop_name=${encodeURI(
        shopName
      )}&table_code=${encodeURI(tableCode)}`;
      setOrderLink(newOrderLink);

      if (customerAuth) {
        setUserInfo(customerAuth);
        history.push(newOrderLink);
      }
    } else {
      // Case: user has logined => logout => login
      const shopHashId = localStorage.getItem('shopHash');
      setOrderLink(`${shopHashId}`);

      if (customerAuth) {
        setUserInfo(customerAuth);
        history.push(`${shopHashId}`);
      }
    }
  }, [search, shopHash, ordergroupHash, shopName, tableCode]);

  useEffect(() => {
    // get status of ordergroup
    getStatusOrdergroup();
  }, []);

  useEffect(() => {
    // delete Customer older info in cookie
    deleteCookie(CUSTOMER_LOGIN_INFO_KEY);
    deleteCookie(CUSTOMER_AUTH_KEY);
  }, []);

  useEffect(() => {
    // save link order
    if (search && orderLink) {
      localStorage.setItem('orderLinkForOneQRCode', orderLink);
      // go to order menu screen when local still have user hash id on cookie
      if (userHashId) {
        handleButtonSkipClick();
      }
    }
  }, [search, orderLink]);

  // form change
  const handleChange = (event) => {
    setAuthPhoneNumber(event.target.value);
  };

  const handleChangeNickName = (event) => {
    setNickName(event.target.value);
  };

  const checkValidate = () => {
    let errors = [];
    // Validate Nickname
    if (!nickName) {
      errors.push('Vui lòng nhập tên tài khoản');
    }
    // if (!Utils.validatePattern('MOBILE_JP', authPhoneNUmber)) {
    //   errors.push('Vui lòng nhập số điện thoại di động của bạn');
    // }
    if (authPhoneNUmber === '') {
      errors.push('Vui lòng nhập số điện thoại di động của bạn');
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = checkValidate();
    if (errors && errors.length) {
      setErrorMessage(errors[0]);

      return ;
    }

    const phoneNumber = Utils.addPhonePrefix(authPhoneNUmber);
    try {
      const accounts = await CustomerOrderApiService.getCustomers(phoneNumber);
      // Case: Have any accounts
      if (accounts && accounts.length) {
        // Save login customer info
        setCookie(CUSTOMER_LOGIN_INFO_KEY, {
          phone_number: phoneNumber,
          nick_name: nickName,
        });
        history.push('/welcome');
      } else {
        // Create a new customer account
        const account = await CustomerOrderApiService.createCustomer(phoneNumber, nickName);
        setCookie(CUSTOMER_AUTH_KEY, account);
        setCookie('userHashId', account.hash_id);
        setUserInfo(account);
        history.push(orderLink);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleErrorModalButtonClick = () => {
    setErrorMessage(null);
  };

  const getStatusOrdergroup = async () => {
    try {
      if (!shopHash || !ordergroupHash) {
        return;
      }
      const response = await CustomerOrderApiService.getStatusOrdergroup(shopHash, ordergroupHash);
      // status =4 when order has been checked out
      if (response && response.status === 4) {
        const checkoutLink =`${shopHash}?isCheckout=1`;
        history.push(checkoutLink);
      }
    } catch (error) {
      if (error.message === 'Error: deactive_shop') {
        setErrorMessage(null);
        return;
      }
      setErrorMessage(error.message);
    }
  };

  const handleButtonSkipClick = () => {
    history.push(orderLink);
  };

  return (
    <PageContainer>
      <RegisterContainer>
        <Card
          title='Đăng kí tài khoản'
          customButtons={<></>}
        >
          <FormsContainer>
            <TextField
              id='nickName'
              variant='outlined'
              value={nickName}
              onChange={handleChangeNickName}
              placeholder='Tên tài khoản'
              fullWidth
              inputProps={{
                maxLength: 50,
                type: 'string',
              }}
            />

            <Box mt={2}>
              <TextField
                id='authPhoneNumber'
                variant='outlined'
                value={authPhoneNUmber}
                onChange={handleChange}
                placeholder='Số điện thoại'
                fullWidth
                inputProps={{
                  maxLength: 15,
                  type: 'tel',
                }}
              />
            </Box>
          </FormsContainer>

          {/*<Box textAlign={'left'} paddingTop={'15px'} paddingLeft={'6%'}>*/}
          {/*  <br />*/}
          {/*  <br />*/}
          {/*</Box>*/}

          <Box>
            <Box mt={1}>
              <Button
                title='Đăng ký'
                bgcolor='#86BE27'
                fgcolor='#F7FAEE'
                onClick={handleSubmit}
                disabled={!nickName || !authPhoneNUmber}
              ></Button>
            </Box>
            <Box className={classes.underlineText} mt={1}>
              <p onClick={handleButtonSkipClick}>Bỏ qua đăng ký</p>
            </Box>
          </Box>
        </Card>
      </RegisterContainer>

      {/* Error modal */}
      <Modal title='' open={!!errorMessage}>
        <Box>{errorMessage}</Box>
        <br />
        <Button onClick={handleErrorModalButtonClick}>OK</Button>
      </Modal>
    </PageContainer>
  );
};
// PropTypes
PageSignin.propTypes = {};
export default PageSignin;
