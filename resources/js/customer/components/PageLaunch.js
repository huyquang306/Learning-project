/*
 * Obento-R 顧客起動画面画面
 */

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
// components
import PageContainer from 'js/shared/components/PageContainer';
import Button from 'js/shared/components/Button';

// Dialogs
import PrivacyPolicyDialog from 'js/shared/components/PrivacyPolicyDialog';
import TermsOfServiceDialog from 'js/shared/components/TermsOfServiceDialog';

// Material-UI
import { Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiTypography-colorPrimary': {
      color: '#FFF',
    },
  },
}));

// styled
const InnerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  width: 85%;
  height: 50%;
  padding-top: 15%;
  backdrop-filter: blur(10px);
  img {
    display: block;
    width: 140px;
    height: 125px;
    margin: 0px auto 20px auto;
  }
`;

const CopyrightStyled = styled.div`
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #ffffff;
`;

const PageLaunch = (_props) => {
  // dialogs state
  const [isOpenPP, setIsOpenPP] = useState(false);
  const [isOpenTerms, setIsOpenTerms] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  return (
    <PageContainer
      backgroundImage={`${process.env.MIX_ASSETS_PATH}/img/customer/launch_background.jpg`}
      height={'100vh'}
    >
      <InnerContainer>
        <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/logo.png`} alt="logo" />

        <Button
          title="お弁当を探す"
          onClick={() => {
            history.push('/searchmap');
          }}
        />
        <br />
        <span className={classes.root}>
          {/* 規約・プライバシポリシー */}
          <Link
            href="#"
            onClick={() => {
              setIsOpenTerms(true);
            }}
          >
            利用規約
          </Link>
          <br />
          <Link
            href="#"
            onClick={() => {
              setIsOpenPP(true);
            }}
          >
            プライバシーポリシー
          </Link>
        </span>
        <br />
        <br />
        <TermsOfServiceDialog isOpen={isOpenTerms} setIsOpen={setIsOpenTerms} />
        <PrivacyPolicyDialog isOpen={isOpenPP} setIsOpen={setIsOpenPP} />
        <CopyrightStyled>provided by libelize.com</CopyrightStyled>
      </InnerContainer>
    </PageContainer>
  );
};
// PropTypes
PageLaunch.propTypes = {};
export default PageLaunch;
