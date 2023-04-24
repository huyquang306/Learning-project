import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import Waiting from 'js/shared/components/Waiting';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Services
import ShopAuthApiService from 'js/shop/shop-auth-api-service';

// Components
import PageContainer from 'js/shared/components/PageContainer';
import Card from 'js/shared/components/Card';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiBackdrop-root': {
      backgroundColor: 'none',
    },
  },
}));
const StyledRegistContainer = styled.div`
  text-align: center;
`;
const HeaderMessage = styled.div`
  text-align: center;
  padding: 15px 0;
  border-radius: 3px;
  border: 2px solid #f8b62d;
  color: #40434f;
  font-size: 18px;
  line-height: 100%;
  margin: 10px auto 30px auto;
  background: #fff;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
  strong {
    color: #f8b62d;
  }
`;

const PARAM_TYPES = {
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot-password',
};

const PageVerifiedEmail = (props) => {
  const history = useHistory();
  const classes = useStyles(props);

  // Query params
  const search = useLocation().search;
  const paramToken = new URLSearchParams(search).get('token');
  const paramType = new URLSearchParams(search).get('type');

  // Local state
  const [waiting, setWaiting] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const waitingForVerify = setTimeout(verifyToken, 2000);
    if (!waiting) {
      clearTimeout(waitingForVerify);
    }
  }, [waiting]);

  const verifyToken = async () => {
    if (paramType === PARAM_TYPES.REGISTER) {
      try {
        await ShopAuthApiService.verifyCreateShop(paramToken);
        window.location.href = 'signin';
      } catch (er) {
        setWaiting(false);
        setError(er?.result?.errorMessage);
      }
    } else if (paramType === PARAM_TYPES.FORGOT_PASSWORD) {
      try {
        const response = await ShopAuthApiService.authVerifyForgotPassword(paramToken);
        if (response) {
          history.push(`/forgot-password`, { from: paramToken });

          return ;
        }

        setWaiting(false);
        setError('This code has expired or is invalid');
      } catch (er) {
        setWaiting(false);
        setError(er?.result?.errorMessage);
      }
    } else {
      setWaiting(false);
      setError('This URL is invalid');
    }
  };

  return (
    <PageContainer className={classes.root}>
      {waiting ? (
        <StyledRegistContainer>
          <HeaderMessage>
            {paramType === PARAM_TYPES.FORGOT_PASSWORD ? (
              'Password reset'
            ) : (
              <>
                Easy Registration with<strong>３ staps</strong>
              </>
            )}
          </HeaderMessage>
          <Card title='Confirming' buttonDisabled={true} customButtons={<></>}>
            <Box>Please wait. . .</Box>
          </Card>
          <Waiting isOpen={waiting} />
        </StyledRegistContainer>
      ) : (
        <Box align='center'>{error}</Box>
      )}
    </PageContainer>
  );
};

// PropTypes
PageVerifiedEmail.propTypes = {};
// defaultProps
PageVerifiedEmail.defaultProps = {};

export default PageVerifiedEmail;
