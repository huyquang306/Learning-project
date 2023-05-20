import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';

// Components
import PageContainer from 'js/shared/components/PageContainer';
import RegisterContainer from "../../shop/components/RegisterContainer";
import Card from 'js/shared/components/Card';
import {Box, Grid} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Button from 'js/shared/components/Button';
import Modal from 'js/shared/components/Modal';

// Services
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';
import UserInfoContext from 'js/customer-order/components/UserInfoContext';

// Utils
import {
  getCookie,
  setCookie,
  deleteCookie,
  CUSTOMER_AUTH_KEY,
  CUSTOMER_LOGIN_INFO_KEY
} from 'js/utils/components/cookie/cookie';
import {hideMiddlePhoneNumber} from 'js/utils/helpers/phoneNumber';

// Style
const useStyles = makeStyles({
  accountBoxWrap: {
    padding: '5px',
  },
  spaceText: {
    margin: '10px',
  },
  accountBox: {
    // display: 'flex',
    // alignItems: 'center',
    // flexDirection: 'column',
    maxWidth: '400px',
    border: 'solid 1px #000',
    borderRadius: '5px',
    margin: 'auto',
    padding: '20px',
    '@media (max-width: 600px)': {
      maxWidth: '180px',
      padding: '5px',
    },
  },
  underlineText: {
    textDecoration: 'underline',
  },
  autoBreakLine: {
    whiteSpace: 'pre-wrap',
    width: 'calc(100% - 36px)',
    textAlign: 'center',
  },
});

const PageWelcome = (_props) => {
  const classes = useStyles();
  const history = useHistory();
  const shopHashId = localStorage.getItem('shopHash');

  // Context
  const [userInfo, setUserInfo] = useContext(UserInfoContext);

  // Local state
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    getAccounts();
  }, []);

  const getAccounts = async () => {
    const customerLoginInfo = getCookie(CUSTOMER_LOGIN_INFO_KEY);
    if (customerLoginInfo && customerLoginInfo.phone_number) {
      const accountsRes = await CustomerOrderApiService.getCustomers(customerLoginInfo.phone_number);
      setAccounts(accountsRes);
      if (accountsRes.length === 1) {
        setSelectedAccount(accountsRes[0]);
      }
    } else {
      history.push(`${shopHashId}`);
    }
  };

  const handleErrorModalButtonClick = () => {
    setErrorMessage(null);
  };

  const handleCreateNewAccount = async () => {
    try {
      const customerLoginInfo = getCookie(CUSTOMER_LOGIN_INFO_KEY);
      const account = await CustomerOrderApiService.createCustomer(
        customerLoginInfo.phone_number,
        customerLoginInfo.nick_name
      );
      setCookie(CUSTOMER_AUTH_KEY, account);
      setUserInfo(account);
      setCookie('userHashId', account.hash_id);
      deleteCookie(CUSTOMER_LOGIN_INFO_KEY);
      history.push(`${shopHashId}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleLogin = () => {
    if (selectedAccount) {
      const account = accounts.find(accountTmp => accountTmp.hash_id === selectedAccount.hash_id);
      if (account) {
        setCookie(CUSTOMER_AUTH_KEY, account);
        setCookie('userHashId', account.hash_id);
        setUserInfo(account);
        deleteCookie(CUSTOMER_LOGIN_INFO_KEY);
        history.push(`${shopHashId}`);
      }
    }
  };

  return (
    <PageContainer>
      <RegisterContainer>
        <Card
          title='再来店'
          buttonTitle='登録して進む'
          customButtons={<></>}
        >
          <Box>再来店</Box>
          <Box>ありがとうございます！</Box>

          <Grid container justify='center' mt={2}>
            {
              accounts && accounts.map((account, accountKey) => (
                <Grid
                  item
                  key={accountKey}
                  xs={12}
                  md={6}
                  className={classes.accountBoxWrap}
                >
                  <Box className={classes.accountBox} onClick={() => setSelectedAccount(account)}>
                    <Box display='flex' justifyItems='center'>
                      <Box width='36px' height='26px'>
                        {
                          selectedAccount && selectedAccount.hash_id === account.hash_id ? <Check /> : null
                        }
                      </Box>
                      <Box className={classes.autoBreakLine}>{account.nick_name} 様</Box>
                    </Box>

                    <Box>{hideMiddlePhoneNumber(account.phone_number)}</Box>
                  </Box>
                </Grid>
              ))
            }
          </Grid>

          <Box>
            <Box className={classes.underlineText} mt={3}>
              <p onClick={handleCreateNewAccount}>違うユーザの場合はこちら</p>
            </Box>
            <Box>
              <Button
                title='選択して進む'
                bgcolor='#86BE27'
                fgcolor='#F7FAEE'
                disabled={!selectedAccount}
                onClick={handleLogin}
              ></Button>
            </Box>
          </Box>
        </Card>
      </RegisterContainer>

      <Modal title='' open={!!errorMessage}>
        <Box>{errorMessage}</Box>
        <br />
        <Button onClick={handleErrorModalButtonClick}>確認</Button>
      </Modal>
    </PageContainer>
  );
};

// PropTypes
PageWelcome.propTypes = {};
export default PageWelcome;
