import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import styled from 'styled-components';
import PropTypes from 'prop-types';
import shopInfoContext, { shopInfoDefault } from "./ShopInfoContext";
import ShopApiService from "../shop-api-service";
import ShopAuthService from "../shop-auth-service";
import Utils from "../../shared/utils";

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
    <Router basename={process.env.INDEX_PATH_SHOP_MANAGE}>
      <Switch>
        {props.children}
      </Switch>
    </Router>
  )
}

RouterBase.PropTypes = {
  children: PropTypes.node,
}

const RouteSignedInOut = (props) => {
  if (props.isSignedIn) {
    if (!props.shopInfo.hashId) {
      return (
        <RouterBase>
          <Route path='/register' exact/>
          <Route path='/setting' exact/>

          <Redirect to='/register'/>
        </RouterBase>
      );
    }

    return (
      <RouterBase>

      </RouterBase>
    )
  } else {
    return (
      <RouterBase>
        <Route path='/' exact/>
        <Route path='/register' exact/>
        <Route path='/sign-in' exact/>

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
}

export default AppContainer
