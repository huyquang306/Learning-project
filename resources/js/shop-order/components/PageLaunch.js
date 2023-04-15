/*
 * Obento-R 起動初期画面
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
// components
import PageContainer from 'js/shared/components/PageContainer';
import Button from 'js/shared/components/Button';

// styled
const InnerContainer = styled.div`
  position: absolute;
  text-align: center;
  top: 15vh;
  left: 10%;
  width: 80%;
  height: 70%;
  padding-top: 15%;
/*
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.3);
*/
  img {
    display: block;
/*
    width: 140px;
    height: 125px;
*/
    margin: 0px auto 20px auto;
  }
`;

const PageLaunch = (_props) => {
  const history = useHistory();
  return (
    <PageContainer
      padding="0px"
      backgroundImage={`${process.env.MIX_ASSETS_PATH}/img/shared/orderr_launch_background.png`}
    >
      <InnerContainer>
        <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/orderr_logo.png`} alt="logo" />

        <Button
          title="はじめて使う"
          onClick={() => {
            history.push('/register');
          }}
        />

        <Button
          title="ログインする"
          bgcolor="#F8B62D"
          onClick={() => {
            history.push('/signin');
          }}
        />
      </InnerContainer>
    </PageContainer>
  );
};
// PropTypes
PageLaunch.propTypes = {};
export default PageLaunch;
