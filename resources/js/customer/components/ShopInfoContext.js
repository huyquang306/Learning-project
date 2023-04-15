/*
  ShopInfo Context
  店舗情報のContext
 */

import { createContext } from 'react';

/*
 * 既定値
 */
/*
 export const shopInfoDefault = {
  mShopId: null,
  hashId: null,
  name: '',
  genre: [],
  lunchStartTime: '11:00:00',
  lunchEndTime: '14:00:00',
  phoneNumber: '',
  postalCode: '',
  prefecture: '',
  city: '',
  address: '',
  building: '',
};

export const shopInfoMapper = {
  // APIからの取得値を(必要なものだけ)マッピング
  fromDB: (mShop) => ({
    mShopId: mShop.id,
    hashId: mShop.hash_id,
    name: mShop.name,
    genre: mShop.genre, // array でくる想定
    lunchStartTime: mShop.lunch_start_time,
    lunchEndTime: mShop.lunch_end_time,
    phoneNumber: mShop.phone_number,
    postalCode: mShop.postal_code,
    prefecture: mShop.prefecture,
    city: mShop.city,
    address: mShop.address,
    building: mShop.building,
    // TODO
    // lat: mShop.lat,
    // lon: mShop.lon,
    // email: mShop.email,
    // faxNumber: mShop.fax_number,
    // openDate: mShop.open_date,
    // closeDate: mShop.close_date,
  }),
  // 登録用データmapping
  toDB: (shopInfo) => ({
    name: shopInfo.name,
    genre: shopInfo.genre, // array で送る
    lunch_start_time: shopInfo.lunchStartTime,
    lunch_end_time: shopInfo.lunchEndTime,
    phone_number: shopInfo.phoneNumber,
    postal_code: shopInfo.postalCode,
    prefecture: shopInfo.prefecture,
    city: shopInfo.city,
    address: shopInfo.address,
    building: shopInfo.building,
  }),
};
*/
/*
  ShopInfo Context
  店舗情報のContext
 */

//const ShopInfoContext = createContext(shopInfoDefault);
const ShopInfoContext = createContext();
export default ShopInfoContext;
