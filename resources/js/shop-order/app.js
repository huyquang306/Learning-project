/*
 * Smart Order
 */
import React from 'react';
import ReactDOM from 'react-dom';
import ShopApiService from 'js/shop/shop-api-service';
import ShopWithoutAuthApiService from 'js/shop/shop-without-auth-api-service';
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import PaymentApiService from 'js/utils/components/Payment/payment-api-service';
import ShopAuthService from 'js/shop/shop-auth-service';
import ShopAuthApiService from 'js/shop/shop-auth-api-service';

// components
import AppContainer from 'js/shop-order/components/AppContainer';

//
// firebase initialize
//
ShopAuthService.initFirebase({
  apiKey: process.env.MIX_FIREBASE_APIKEY,
  authDomain: process.env.MIX_FIREBASE_AUTHDOMAIN,
  projectId: process.env.MIX_FIREBASE_PROJECTID,
  appId: process.env.MIX_FIREBASE_APPID,
  measurementId: process.env.MIX_FIREBASE_MEASUREMENTID,
});

//
// api service initialize
//
ShopWithoutAuthApiService.init({
  prefix: process.env.MIX_API_PREFIX,
});
ShopApiService.init({
  prefix: process.env.MIX_API_PREFIX,
  authService: ShopAuthService,
});
//
// api auth service initialize
//
ShopOrderApiService.init({
  prefix: process.env.MIX_API_SHOP_ORDER_PREFIX,
  authService: ShopAuthService,
});
PaymentApiService.init({
  prefix: process.env.MIX_API_PREFIX,
  authService: ShopAuthService,
});
ShopAuthApiService.init({
  prefix: process.env.MIX_API_PREFIX,
});

//
// rendering start
//

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
const vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

if (document.getElementById('appRoot')) {
  ReactDOM.render(<AppContainer />, document.getElementById('appRoot'));
}
