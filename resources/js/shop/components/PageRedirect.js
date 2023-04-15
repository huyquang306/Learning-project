import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// Utils
import { isUrlValid } from 'js/utils/helpers/urlHelper';
import PageContainer from 'js/shared-order/components/PageContainer';

const LoadingStyledAppContainer = styled.div`
  margin: 0px;
  padding: 0px;
  background: transparent;
  width: 100vw;
  height: 100vh;
`;
const LoadingContainer = styled.div`
  text-align: center;
  position: absolute;
  top: 30vh;
  width: 60%;
  left: 20%;
  backdrop-filter: blur(10px);
  font-size: 12px;
  line-height: 20px;
  padding: 40px;
  color: #fff;
  text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.8);
  img {
    margin: auto;
    width: 140px;
    height: 125px;
  }
`;

const PageRedirect = () => {
  const history = useHistory();

  // Get params url
  const search = window.location.search;
  const currentDomain = window.location.hostname;

  const params = new URLSearchParams(search);
  const continueUrl = params.get('continueUrl');
  if (!continueUrl || !isUrlValid(continueUrl)) {
    history.push('/');

    return <></>;
  }

  const redirectURL = new URL(continueUrl);
  const redirectDomain = redirectURL.hostname;
  if (redirectDomain === currentDomain) {
    setTimeout(() => {
      history.push(`${continueUrl.split('/')[4]}`);
    }, 2000);

    return (
      <LoadingStyledAppContainer>
        <PageContainer
          backgroundImage={`${process.env.MIX_ASSETS_PATH}/img/shared/orderr_launch_background.png`}
        >
          <LoadingContainer>
            <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/orderr_logo.png`} alt='logo' />
            <br />
            起動中...
          </LoadingContainer>
        </PageContainer>
      </LoadingStyledAppContainer>
    );
  }

  history.push('/');

  return <></>;
};

PageRedirect.propTypes = {};
export default PageRedirect;
