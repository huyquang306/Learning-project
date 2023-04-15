import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Utils from 'js/shared/utils';
import ShopAuthService from 'js/shop/shop-auth-service';
import PubSub from 'pubsub-js';
import { Howl } from 'howler';
import { Box } from '@material-ui/core';

// Context
import ShopInfoContext, { shopInfoDefault } from 'js/shop/components/ShopInfoContext';

// Services
import ShopApiService from 'js/shop/shop-api-service';

// Styles
import 'css/style.css';

// Page Components
import RouterSignedInOut from 'js/shop-order/components/RouterSignedInOut';
import PageContainer from 'js/shared-order/components/PageContainer';
import TablesComingFinish from 'js/shop-order/utils/components/TablesComingFinish';
import Modal from 'js/shared-order/components/Modal';
import Button from 'js/shared-order/components/Button.js';

import UseOnboardingScript from 'js/shared/onboarding.js';

// Utils
import { ON_BOARDING_CONFIG, PUB_SUB_KEY, ALARM_AUDIO_PATH } from 'js/utils/helpers/const';
import {closeCurrentSocket} from 'js/utils/helpers/socket';

const StyledAppContainer = styled.div`
  margin: 0px;
  padding: 0px;
  background: transparent;
  width: 100vw;
  min-height: 100vh;
`;
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

const Loading = () => {
  return (
    <LoadingStyledAppContainer>
      <PageContainer
        backgroundImage={`${process.env.MIX_ASSETS_PATH}/img/shared/orderr_launch_background.png`}
      >
        <LoadingContainer>
          <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/orderr_logo.png`} alt="logo" />
          <br />
          起動中...
        </LoadingContainer>
      </PageContainer>
    </LoadingStyledAppContainer>
  );
};

const AppContainer = () => {
  // State
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [uid, setUid] = useState(null);
  const [shopInfo, setShopInfo] = useState(shopInfoDefault);
  const [showModalExpired, setShowModalExpired] = useState(false);
  const authUser = ShopAuthService.getUserAuthStatus();

  useEffect(() => {
    console.debug('[AppContainer] authUser.statusCode ', authUser.statusCode);

    if (authUser.statusCode > 0) {
      if (authUser.phoneNumber) {
        setPhoneNumber(Utils.trimPhonePrefix(authUser.phoneNumber));
      }
      setUid(authUser.uid);

      fetchData();
      pubSubSubscribe();
    } else if (authUser.statusCode === 0) {
      signOut();
    }
  }, [authUser]);

  const pubSubSubscribe = () => {
    // Channel Ring alarm
    PubSub.subscribe(PUB_SUB_KEY.RING_ALARM, ringAlarm);
    // Channel show deactive shop
    PubSub.subscribe(PUB_SUB_KEY.DEACTIVE_SHOP, () => {
      setShowModalExpired(true);
    });
  };

  const fetchData = async () => {
    try {
      const registedShop = await ShopApiService.getShop();
      if (registedShop) {
        setShopInfo(registedShop);
        setIsSignedIn(true);
      } else {
        setIsSignedIn(true);
      }
    } catch (error) {
      console.error('[AppContainer] getShop ', error);
    }
  };

  const ringAlarm = (msg) => {
    if (msg === PUB_SUB_KEY.RING_ALARM) {
      const sound = new Howl({
        src: ALARM_AUDIO_PATH,
        volume: 10, // 1000%
      });
      sound.play();
    }
  };

  const signOut = () => {
    console.debug('[AppContainer] SIGN-OUT');
    setShopInfo(shopInfoDefault); /** reset */
    setPhoneNumber(null);
    setUid(null);
    setIsSignedIn(false);
    setShowModalExpired(false);
    PubSub.clearAllSubscriptions();
    closeCurrentSocket();
    if (authUser.statusCode > 0) {
      ShopAuthService.signOut();
    }
  };

  const renderActions = () => (
    <>
      <Button onClick={() => signOut()} bgcolor="#FFA04B" borderRadius="28px" borderColor="#828282">
        ログアウトする
      </Button>
    </>
  );

  return (
    <>
      {isSignedIn === null || authUser.statusCode === -1 ? (
        <Loading />
      ) : (
        <ShopAuthService.context.Provider
          value={{ isSignedIn: isSignedIn, phoneNumber: phoneNumber, uid: uid }}
        >
          <ShopInfoContext.Provider value={[shopInfo, setShopInfo]}>
            <StyledAppContainer auth={isSignedIn ? 'signin' : 'signout'}>
              <RouterSignedInOut isSignedIn={isSignedIn} shopInfo={shopInfo} authUser={authUser} />
            </StyledAppContainer>

            {isSignedIn && shopInfo.hashId ? <TablesComingFinish /> : null}

            <UseOnboardingScript
              shopInfo={shopInfo}
              userGroupId={ON_BOARDING_CONFIG.USER_GROUP_ID.SHOP}
              userGroupName={ON_BOARDING_CONFIG.USER_GROUP_NAME.SHOP}
            />
            <Modal
              open={showModalExpired}
              title="お知らせ"
              actions={renderActions()}
              maxHeight="auto"
              minHeight="120px"
            >
              <Box textAlign="center" fontWeight={600} mt={8}>
                この店舗は無効です。
              </Box>
            </Modal>
          </ShopInfoContext.Provider>
        </ShopAuthService.context.Provider>
      )}
    </>
  );
};

export default AppContainer;
