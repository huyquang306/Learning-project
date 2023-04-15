/*
 * Obento-R 登録画面 container
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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

const RegistContainer = (props) => {
  return (
    <StyledRegistContainer>
      <HeaderMessage>
        登録はかんたん！<strong>３分</strong>で終わります
      </HeaderMessage>
      {props.children}
    </StyledRegistContainer>
  );
};
RegistContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RegistContainer;
