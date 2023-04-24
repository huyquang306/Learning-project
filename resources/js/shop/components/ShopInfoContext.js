import { createContext} from "react";

// Default shop context
export const shopInfoDefault = {
  mShopId: null,
  hashId: null,
  name: '',
  phoneNumber: '',
  email: '',
  prefecture: '',
  city: '',
  building: '',
  address: '',
  password: '',
  password_confirmation: '',
  lat: '',
  lon: '',
};

export const shopInfoMapper = {
  fromDB: (mShop) => ({
    mShopId: mShop.id,
    hashId: mShop.hash_id,
    name: mShop.name,
    phoneNumber: mShop.phone_number,
    prefecture: mShop.prefecture,
    city: mShop.city,
    address: mShop.address,
    lat: mShop.lat,
    lon: mShop.lon,
  }),
  
  toDB: (shopInfo) => ({
    name: shopInfo.name,
    phoneNumber: shopInfo.phone_number,
    prefecture: shopInfo.prefecture,
    city: shopInfo.city,
    address: shopInfo.address,
    lat: shopInfo.lat,
    lon: shopInfo.lon,
  })
};

const shopInfoContext = createContext(shopInfoDefault);

export default shopInfoContext;