import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';

// Utils
import {IS_ACTIVE_SHOP_KEY} from "../../utils/helpers/const";

const StyledRegisterContainer = styled.div`
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

const TYPES = {
  SIGNIN: 'signin',
  FORGOT_PASSWORD: 'forgot-password',
};

const RegisterContainer = (props) => {
  // Check register by active shop
  const activeShopHashId = localStorage.getItem(IS_ACTIVE_SHOP_KEY);
  
  return (
    <StyledRegisterContainer>
      <HeaderMessage>
        {props.type === TYPES.SIGNIN && !activeShopHashId ? (
          'Đăng nhập ngay để trải nghiệm dịch vụ!'
        ) : props.type === TYPES.FORGOT_PASSWORD ? (
          'Hãy tạo mật khẩu mới'
        ) : (
          <>
            Easily sign-up！<strong>in 3 minutes</strong> {props.step && <Box mt={1} display={{xs: 'block', sm: 'inline-block'}}>({props.step}/2 steps)</Box>}
          </>
        )}
      </HeaderMessage>
      {props.children}
    </StyledRegisterContainer>
  );
}

RegisterContainer.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};

RegisterContainer.defaultProps = {
  type: TYPES.SIGNIN,
};

export default RegisterContainer;