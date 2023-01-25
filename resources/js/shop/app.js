import React from "react";
import ReactDOM from "react-dom";
import ShopApiService from "./shop-api-service";
import ShopAuthService from "./shop-auth-service";
import ShopAuthApiService from "./shop-auth-api-service";
import ShopWithoutAuthApiService from "./shop-without-auth-api-service";
import AppContainer from "./components/AppContainer";

// Initialize firebase
ShopAuthService.initFirebase({
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENTID,
});

ShopWithoutAuthApiService.init({
  prefix: process.env.INDEX_PATH_SHOP_MANAGE,
});

// Initialize api service
ShopApiService.init({
  prefix: process.env.INDEX_PATH_SHOP_MANAGE,
  authService: ShopAuthService,
});

// Rendering
if (document.getElementById('appRoot')) {
  ReactDOM.render(<AppContainer />, document.getElementById('appRoot'));
}


