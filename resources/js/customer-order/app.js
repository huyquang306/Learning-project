/*
 * Order R
 */
import React from 'react';
import ReactDOM from 'react-dom';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';
import CustomerOrderAuthService from 'js/customer-order/customer-or-auth-service';

// components
import AppContainer from 'js/customer-order/components/AppContainer';

//
// firebase initialize
CustomerOrderAuthService.initFirebase({
  apiKey: process.env.MIX_FIREBASE_APIKEY,
  authDomain: process.env.MIX_FIREBASE_AUTHDOMAIN,
  projectId: process.env.MIX_FIREBASE_PROJECTID,
  appId: process.env.MIX_FIREBASE_APPID,
  measurementId: process.env.MIX_FIREBASE_MEASUREMENTID,
});
//
// TODO Connect firebase

//
// api service initialize
//
// TODO Connect API
//
// api service initialize
//
CustomerOrderApiService.init({
  prefix: process.env.MIX_API_SHOP_ORDER_PREFIX,
  authService: CustomerOrderAuthService, // 認証ありのAPI使うため依存関係がある
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
