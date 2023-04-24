import React from "react";
import ReactDOM from "react-dom";
import ShopApiService from "./shop-api-service";
import ShopAuthService from "./shop-auth-service";
import ShopAuthApiService from "./shop-auth-api-service";
import ShopWithoutAuthApiService from "./shop-without-auth-api-service";
import AppContainer from "./components/AppContainer";

// Initialize firebase
ShopAuthService.initFirebase({
  apiKey: process.env.MIX_FIREBASE_APIKEY,
  authDomain: process.env.MIX_FIREBASE_AUTHDOMAIN,
  projectId: process.env.MIX_FIREBASE_PROJECTID,
  appId: process.env.MIX_FIREBASE_APPID,
  measurementId: process.env.MIX_FIREBASE_MEASUREMENTID,
});

ShopWithoutAuthApiService.init({
  prefix: process.env.MIX_API_PREFIX,
});

// Initialize api service
ShopApiService.init({
  prefix: process.env.MIX_API_PREFIX,
  authService: ShopAuthService,
});

// api auth service initialize
ShopAuthApiService.init({
  prefix: process.env.MIX_API_PREFIX,
  authService: ShopAuthService,
});

// Rendering
if (document.getElementById('appRoot')) {
  ReactDOM.render(<AppContainer />, document.getElementById('appRoot'));
}


