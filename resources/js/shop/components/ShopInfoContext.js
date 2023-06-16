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
    genres: mShop.genres,
    phoneNumber: mShop.phone_number,
    prefecture: mShop.prefecture,
    city: mShop.city,
    address: mShop.address,
    building: mShop.building,
    lat: mShop.lat,
    lon: mShop.lon,
    businessHours: mShop.m_business_hours,
    wifi_name: mShop.wifi_name,
    wifi_pass: mShop.wifi_pass,
    sns_links: mShop.sns_links,
    instagram_link: mShop.instagram_link,
    email: mShop.email,
    m_country: mShop.m_country,
    m_business_hours: mShop.m_business_hours,
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