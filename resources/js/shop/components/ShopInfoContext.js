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
    start_time: mShop.start_time,
    end_time: mShop.end_time,
    phoneNumber: mShop.phone_number,
    postalCode: mShop.postal_code,
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
    mShopPosSetting: mShop.mShopPosSetting,
    service_plan: mShop.service_plan,
    payment_method: mShop.payment_method,
    usageQRCodeInMonth: mShop.usageQRCodeInMonth,
    billings_in_month: mShop.billings_in_month
  }),
  
  toDB: (shopInfo) => ({
    name: shopInfo.name,
    genre: shopInfo.genre,
    phoneNumber: shopInfo.phone_number,
    prefecture: shopInfo.prefecture,
    city: shopInfo.city,
    address: shopInfo.address,
    building: shopInfo.building,
    lat: shopInfo.lat,
    lon: shopInfo.lon,
    email: shopInfo.email,
    password: shopInfo.password,
    start_time: shopInfo.start_time,
    end_time: shopInfo.end_time,
    billings_in_month: shopInfo.billings_in_month
  })
};

const shopInfoContext = createContext(shopInfoDefault);

export default shopInfoContext;