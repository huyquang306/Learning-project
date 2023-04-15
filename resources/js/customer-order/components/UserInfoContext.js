/*
  UserInfo Context
  店舗情報のContext
 */

  import { createContext } from 'react';

  /*
   * 既定値
   */
  export const userInfoDefault = {
    mUserId: null,
    hashId: null,
    firebaseUid: null,
    nickName:'',
    email: '',
    familyName: '',
    givenName: '',
    familyNameKana: '',
    givenNameKana: '',
    phoneNumber: '',
    birthDate: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
  };

  export const userInfoMapper = {
    // APIからの取得値を(必要なものだけ)マッピング
    fromDB: (mUser) => ({
      mUserId: mUser.id,
      hashId: mUser.hash_id,
      firebaseUid: mUser.firebase_uid,
      nickName: mUser.nick_name,
      email: mUser.email, // array でくる想定
      familyName: mUser.family_name,
      givenName: mUser.given_name,
      familyNameKana: mUser.family_name_kana,
      givenNameKana: mUser.given_name_kana,
      phoneNumber: mUser.phone_number,
      birthDate: mUser.birth_date,
      prefecture: mUser.prefecture,
      city: mUser.city,
      address: mUser.address,
      building: mUser.building,
    }),
    // 登録用データmapping
    toDB: (userInfo) => ({
      nick_name: userInfo.nickName,
      email: userInfo.email, // array でくる想定
      family_name: userInfo.familyName,
      given_name: userInfo.givenName,
      family_name_kana: userInfo.familyNameKana,
      given_name_kana: userInfo.givenNameKana,
      phone_number: userInfo.phoneNumber,
      birth_date: userInfo.birthDate,
      prefecture: userInfo.prefecture,
      city: userInfo.city,
      address: userInfo.address,
      building: userInfo.building,
    }),
  };

  /*
    UserInfo Context
    店舗情報のContext
   */

  const UserInfoContext = createContext(userInfoDefault);
  export default UserInfoContext;
