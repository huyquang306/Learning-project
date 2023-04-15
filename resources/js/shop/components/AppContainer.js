import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import styled from 'styled-components';
import propTypes from 'prop-types';
import shopInfoContext, { shopInfoDefault } from "./ShopInfoContext";
import ShopApiService from "../shop-api-service";
import ShopAuthService from "../shop-auth-service";
import Utils from "../../shared/utils";

// Page Components
import PageContainer from "../../shared/components/PageContainer";
import ShopInfoContext from "./ShopInfoContext";
import PageSetting from "./PageSetting";
import PageRegister from "./PageRegister";
import PageItemList from "./PageItemList";
import PageItemRegist from "./PageItemRegist";
import PageItemEdit from "./PageItemEdit";
import PageOnsale from "./PageOnsale";
import PageStatistics from "./PageStatistics";
import PageSignin from "./PageSignin";
import PageLaunch from "./PageLaunch";

const StyledAppContainer = styled.div`
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

const RouterBase = (props) => {
  return (
    <Router basename={process.env.MIX_INDEX_PATH_SHOP_MANAGE}>
      <Switch>
        {props.children}
      </Switch>
    </Router>
  )
}

RouterBase.PropTypes = {
  children: propTypes.node,
}

const RouteSignedInOut = (props) => {
  if (props.isSignedIn) {
    if (!props.shopInfo.hashId) {
      return (
        <RouterBase>
          <Route path='/register' exact component={PageRegister} />
          <Route path='/setting' exact component={PageSetting}/>

          <Redirect to='/register'/>
        </RouterBase>
      );
    }

    return (
      <RouterBase>
        <Route path="/item/list" exact component={PageItemList} />
        <Route path="/item/regist" exact component={PageItemRegist} />
        <Route path="/item/edit/:itemHash" exact component={PageItemEdit} />
        <Route path="/onsale" exact component={PageOnsale} />
        <Route path="/statistics" exact component={PageStatistics} />
        
        <Redirect to="/item/list" />
      </RouterBase>
    )
  } else {
    return (
      <RouterBase>
        <Route path="/" exact component={PageLaunch} />
        <Route path="/register" exact component={PageRegister} />
        <Route path="/signin" exact component={PageSignin} />

        <Redirect to='/'/>
      </RouterBase>
    )
  }
}

const AppContainer = () => {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [uid, setUid] = useState(null);
  const [shopInfo, setShopInfo] = useState(shopInfoDefault);
  
  const authUser = ShopAuthService.useAuthState();
  
  useEffect(() => {
    if (authUser) {
      setPhoneNumber(Utils.trimPhonePrefix(authUser.phoneNumber));
      setUid(authUser.uid);
      
      const isRegistered = !!shopInfo.name;
  
      // Debug
      const logPattern = (id) => {
        console.debug(
          '[AppContainer] %cSignIn PATTERN_' + id,
          'font-size:20px; padding: 10px; font-weight:bold; background: #ffc;'
        );
      };
      
      ShopApiService.getShop()
        .then((registeredShop) => {
          if (registeredShop) {
            setShopInfo(registeredShop);
            if (!isRegistered) {
              // Login
              logPattern(1);
            } else {
              logPattern(2);
            }
          } else {
            if (shopInfo.name) {
              // return ShopApiService.registerShop(shopInfo);
            } else {
              logPattern(4);
            }
          }
          
          return null;
        })
        .then((shopHashId) => {
          if (shopHashId) {
            setShopInfo((prevState) => ({...prevState, hashId: shopHashId}));
          }
          
          setIsSignedIn(true);
        })
        .catch((error) => {
          console.debug('[AppContainer] getShop() ERROR', error);
        });
    } else {
      console.debug('[AppContainer] SIGN-OUT');
      setShopInfo(shopInfoDefault);
      setPhoneNumber(null);
      setUid(null);
  
      setIsSignedIn(false);
    }
  }, [authUser]);
  
  // Loading
  if (isSignedIn === null) {
    return (
      <StyledAppContainer>
        <PageContainer
          backgroundImage={`${process.env.MIX_ASSETS_PATH}/img/shared/launch_background.png`}
        >
          <LoadingContainer>
            <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/logo.png`} alt="logo" />
            <br />
            Please wait...
          </LoadingContainer>
        </PageContainer>
      </StyledAppContainer>
    )
  }
  
  // Render
  return (
    <ShopAuthService.context.Provider
      value={{ isSignedIn: isSignedIn, phoneNumber: phoneNumber, uid: uid }}
    >
      <ShopInfoContext.Provider value={[shopInfo, setShopInfo]}>
        <StyledAppContainer auth={isSignedIn ? 'signin' : 'signout'}>
          <RouteSignedInOut isSignedIn={isSignedIn} shopInfo={shopInfo} />
        </StyledAppContainer>
      </ShopInfoContext.Provider>
      
    </ShopAuthService.context.Provider>
  )
}

export default AppContainer
