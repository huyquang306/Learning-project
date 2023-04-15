/*
 * Obento-R 顧客弁当検索地図画面
 */
import React, { useState, useEffect, useContext } from 'react';
import GoogleMapReact from 'google-map-react';
import styled from 'styled-components';

// Components
import PageContainer from 'js/shared/components/PageContainer';
import LinkChips from 'js/shared/components/LinkChips';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import DialogCard from 'js/shared/components/DialogCard';
import Backdrop from 'js/shared/components/Backdrop.js';
import Drawer from 'js/shared/components/Drawer';
//import DirectionsWalkOutlinedIcon from '@material-ui/icons/DirectionsWalkOutlined';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import RestaurantOutlinedIcon from '@material-ui/icons/RestaurantOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import Waiting from 'js/shared/components/Waiting';

// context
import ShopInfoContext from 'js/customer/components/ShopInfoContext';

// service
import CustomerApiService, { ENDPOINTS } from 'js/customer/customer-api-service';

const GoogleMapWrapper = styled.div`
  height: 100vh;
  width: 100%;
`;
const ReloadContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 50px;
`;

const LinkChipsStyle = styled.div`
  position: relative;
  text-align: center;
`;

// infowindowの内枠スタイル
const getInfoWindowString = (shop) => `
<div style="
position: static;
width: 218px;
/* height: 88px; */
left: 0px;
top: 0px;
padding: 5px;
background: #232735;
opacity: 0.84;
border-radius: 6px;
flex: none;
order: 0;
align-self: center;
margin: 0px 0px;"
>
<div style="
    font-family: 'Open Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: #FFFFFF;
    ">
      ${shop.name}
    </div>
<!--
    <div style="
/*    position: absolute; */
    height: 16px;
    left: 60px;
    right: 60px;
    top: 32px;
    font-family: 'Open Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    color: #FFFFFF;
    ">
      2020/05/31 10:16
    </div>
    <div style="
    /*    position: absolute; */
    height: 24px;
    left: 16px;
    right: 16px;
    top: 52px;
    font-family: 'Open Sans', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: #FFFFFF;
    ">
      今日は唐揚げ弁当がオススメ！
    </div>
-->
    </div>
    `;

// google map api key
const googlekey = process.env.MIX_GOOGLE_MAP_APIKEY;

// *************************** //
// Page SearchMap              //
// *************************** //
const PageSearchMap = (_props) => {
  // 同意ステータス
  // const [isAgreeStatus, setIsAgreeStatus] = useState(true);
  // 同意モーダルステータス
  const [backdropOpen, setBackdropOpen] = useState(false);
  // 現在地（初期値：湾岸）
  const [presentLocation, setPresentLocation] = useState({
    lat: 35.631183823453,
    lng: 139.75350925255,
  });
  // 現在の地図領域
  const [latlng, setLatlng] = useState();
  // shop context
  const shopContext = useContext(ShopInfoContext);
  // 店舗一覧情報データ
  const [shopData, setShopData] = useState();
  // 選択店舗ID
  const [shopId, setShopId] = useState();
  // 選択店舗の弁当データ
  const [items, setItems] = useState();
  // 選択店舗のChips一覧
  const [chips, setChips] = useState();
  // mapsオブジェクト
  const [maps, setMaps] = useState();
  // mapオブジェクト
  const [map, setMap] = useState();
  // マーカークリック(key:店舗ID,infowindow:指定infowindow)
  const [markerClick, setMarkerClick] = useState();
  const [preMarkerClick, setPreMarkerClick] = useState();
  // Drawerウィンドウ制御
  const [toggleState, setToggleState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  // waitng
  const [wait, setWait] = useState(false);

  // 地図領域
  let bounds;
  // 地図表示領域左下
  let swLatlng;
  // 地図表示領域右上
  let neLatlng;

  // 現在地取得
  const getPresentLocation = () => {
    setWait(true);

    // 店舗詳細ページからの戻り
    if (shopContext.hashId) {
      setPresentLocation({
        lat: shopContext.lat,
        lng: shopContext.lng,
      });
      setWait(false);
    } else {
      // 初期描画

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPresentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.debug(position.coords);
          setWait(false);
        },
        (err) => {
          // 現在地が取得できなかった場合にダイヤログを出す
          // setIsAgreeStatus(false);
          setBackdropOpen(true);

          console.debug(err);
          setWait(false);
        }
      );
    }

    // （メモ）連続的に位置情報を取得して精度を出したいとしたら
    // https://developer.mozilla.org/ja/docs/Web/API/Geolocation/watchPosition
  };

  // 店舗情報再取得処理
  const handleClick = () => {
    console.debug('店舗情報再取得');
    bounds = map.getBounds();
    swLatlng = bounds.getSouthWest();
    neLatlng = bounds.getNorthEast();
    setLatlng([swLatlng.lat(), swLatlng.lng(), neLatlng.lat(), neLatlng.lng()]);
  };

  // bottomのtogglewindowを開く処理
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setToggleState({ ...toggleState, [anchor]: open });
    // 同じ店舗クリック対策
    setMarkerClick();
  };

  // 同意DialogCardからの戻り値によるモーダル処理
  const agreeStatus = (status) => {
    if (status) {
      // 同意
      // setIsAgreeStatus(true);
      // モーダル閉じる
      setBackdropOpen(false);
    } else {
      // setIsAgreeStatus(false);
      setBackdropOpen(false);
    }
  };

  // **************************** //
  // 地図表示                      //
  // **************************** //
  // レンダリング時に実行される地図描画
  const handleApiLoaded = (map, maps) => {
    // 現在地もしくは販売ページからの戻りでセンター座標を決める
    getPresentLocation();

    console.debug('[hadleApiLoaded start]');
    // mapsにアクセスできるように
    setMaps(maps);
    setMap(map);

    // マーカー以外のクリックでドロワーを閉じるイベント設定
    maps.event.addListener(map, 'click', () => {
      setToggleState({ ...toggleState, bottom: false });
    });

    // 現在の描画緯度経度
    const bounds = map.getBounds();
    swLatlng = bounds.getSouthWest();
    neLatlng = bounds.getNorthEast();

    setLatlng([swLatlng.lat(), swLatlng.lng(), neLatlng.lat(), neLatlng.lng()]);
    console.debug('[setLatLng]');
  };

  // マーカーアイコンのSVGデータ生成
  const svgToBase64DataURL = (size, color) => {
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" fill="${color[0]}"/>
      <path d="M19.9999 5.83301C14.5174 5.83301 10.0833 10.2672 10.0833 15.7497C10.0833 23.1872 19.9999 34.1663 19.9999 34.1663C19.9999 34.1663 29.9166 23.1872 29.9166 15.7497C29.9166 10.2672 25.4824 5.83301 19.9999 5.83301ZM12.9166 15.7497C12.9166 11.8397 16.0899 8.66634 19.9999 8.66634C23.9099 8.66634 27.0833 11.8397 27.0833 15.7497C27.0833 19.8297 23.0033 25.9355 19.9999 29.7463C17.0533 25.9638 12.9166 19.7872 12.9166 15.7497Z" fill="${color[1]}"/>
      <path d="M19.9999 19.2913C21.9559 19.2913 23.5416 17.7057 23.5416 15.7497C23.5416 13.7937 21.9559 12.208 19.9999 12.208C18.0439 12.208 16.4583 13.7937 16.4583 15.7497C16.4583 17.7057 18.0439 19.2913 19.9999 19.2913Z" fill="${color[2]}"/>
      <path d="M20 0 0 2 0 2 20H-2C-2 32.1503 7.84974 42 20 42V38ZM38 20C38 29.9411 29.9411 38 20 38V42C32.1503 42 42 32.1503 42 20H38ZM20 2C29.9411 2 38 10.0589 38 20H42C42 7.84974 32.1503 -2 20 -2V2ZM20 -2C7.84974 -2 -2 7.84974 -2 20H2C2 10.0589 10.0589 2 20 2V-2Z" fill="${color[3]}"/>
      </svg>`;
    // M20 38C10.0589 38 2 29.9411-> M20 0 0 2 0
    return {
      url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
      scaledSize: new maps.Size(size, size),
    };
  };

  // 地図描画（latlng）をhook
  useEffect(() => {
    const markers = [];
    const infowindows = [];

    // いったん初期化する
    setShopData();

    console.debug(latlng);

    if (latlng) {
      console.debug('[GET_AREA_SHOP api start]');

      // latlngでショップ情報取得
      setWait(true);
      CustomerApiService.request(ENDPOINTS.GET_AREA_SHOPS, latlng, null).then((result) => {
        console.debug('[app] api response', result);
        // 店舗データがある場合
        if (result.length) {
          const shops = result.map((value) => {
            const lunch_start_time = value.lunch_start_time
              ? value.lunch_start_time.split(':')[0] + ':' + value.lunch_start_time.split(':')[1]
              : ':';

            const lunch_end_time = value.lunch_end_time
              ? value.lunch_end_time.split(':')[0] + ':' + value.lunch_end_time.split(':')[1]
              : ':';

            return {
              id: value.hash_id,
              name: value.name,
              lat: value.lat,
              lng: value.lon,
              items: value.items,
              image: `${value.s_image_folder_path}`,
              chips: [
                {
                  key: 0,
                  label: lunch_start_time + '〜' + lunch_end_time,
                  icon: Object.assign({}, <WatchLaterOutlinedIcon />),
                },
                {
                  key: 1,
                  label: value.genres[0] ? value.genres[0].name : null,
                  icon: Object.assign({}, <RestaurantOutlinedIcon />),
                },
                {
                  key: 2,
                  label:
                    (value.prefecture ? value.prefecture : '') +
                    (value.city ? value.city : '') +
                    (value.address ? value.address : '') +
                    (value.building ? value.building : ''),
                  icon: Object.assign({}, <RoomOutlinedIcon />),
                },
                // いったんなし  { key:4, label: '徒歩9分', icon: Object.assign({}, <DirectionsWalkOutlinedIcon />)},
              ],
            };
          });

          // 店舗情報
          setShopData(shops);

          // 場所の数だけマーカー作成
          shops.forEach((s) => {
            // markerに緯度経度情報をpush
            markers[s.id] = new maps.Marker({
              position: {
                lat: s.lat,
                lng: s.lng,
              },
              map: map,
              // マーカーの色
              icon: svgToBase64DataURL(40, ['#FFFFFF', '#E35649', '#E35649', '#FFFFFF']),
            });
            // markerクリックした際のコンテンツをpush
            infowindows[s.id] = new maps.InfoWindow({
              content: getInfoWindowString(s),
            });
          });

          // 地図再描画時にマーカーの色を付ける
          if (markerClick && markers[markerClick.shop]) {
            markers[markerClick.shop].setIcon(
              svgToBase64DataURL(40, ['#E35649', '#FFFFFF', '#FFFFFF', '#E35649'])
            );
          }

          // 店舗（緯度経度）ごとにクリックされた際の挙動
          Object.keys(markers).map((key) => {
            markers[key].addListener('click', () => {
              // 選択されたマーカーの色を変える
              markers[key].setIcon(
                svgToBase64DataURL(40, ['#E35649', '#FFFFFF', '#FFFFFF', '#E35649'])
              );

              // 小窓を出す。
              infowindows[key].open(map, markers[key]);

              setMarkerClick({
                shop: key,
                infowindow: infowindows[key],
                marker: markers[key],
              });
            });
          });

          // 店舗詳細ページからの戻り
          if (shopContext.hashId) {
            // マーカーの色を変える
            markers[shopContext.hashId].setIcon(
              svgToBase64DataURL(40, ['#E35649', '#FFFFFF', '#FFFFFF', '#E35649'])
            );
            // 小窓を出す
            infowindows[shopContext.hashId].open(map, markers[shopContext.hashId]);

            // マーカークリック時の店舗ID
            setMarkerClick({
              shop: shopContext.hashId,
              infowindow: infowindows[shopContext.hashId],
              marker: markers[shopContext.hashId],
            });

            // context初期化
            shopContext.hashId = null;
            shopContext.lat = null;
            shopContext.lng = null;
          }
        }
        setWait(false);
      });
    }
  }, [latlng]);

  // マーカークリック(markerClick)をHook
  useEffect(() => {
    // 前のクリックマーカー設定をリセット
    if (preMarkerClick && markerClick) {
      console.debug(markerClick);
      console.debug(preMarkerClick);
      if (markerClick.shop !== preMarkerClick.shop && preMarkerClick.shop) {
        preMarkerClick.infowindow.close();
        preMarkerClick.marker.setIcon(
          svgToBase64DataURL(40, ['#FFFFFF', '#E35649', '#E35649', '#FFFFFF'])
        );
      }
    }

    // 店舗（緯度経度）ごとにクリックされた際の挙動
    if (markerClick && shopData) {
      shopData.filter((shop) => {
        if (shop.id === markerClick.shop) {
          console.debug('[items]', shop.items);
          // 選択したマーカーにpan
          // map.panTo(new maps.LatLng(shop.lat, shop.lng));

          // 現在のマーカー設定を一時保存
          setPreMarkerClick({
            shop: markerClick.shop,
            infowindow: markerClick.infowindow,
            marker: markerClick.marker,
          });

          // Drawer用のitem一覧セット
          setItems(shop ? shop.items : null);
          // Drawer用のchipsセット
          setChips(shop ? shop.chips : null);
          // Drawer用のshopId
          setShopId(shop ? shop.id : null);
          // toggleウィンドウを出す
          setToggleState({ ...toggleState, bottom: true });
        }
      });
    }
  }, [markerClick]);

  // 地図移動をHook（mapのうちtilesloaded)
  useEffect(() => {
    if (map) {
      console.debug('[addListener tilesloaded]');
      map.addListener('tilesloaded', () => {
        window.setTimeout(() => {
          console.debug('地図が移動');
          bounds = map.getBounds();
          swLatlng = bounds.getSouthWest();
          neLatlng = bounds.getNorthEast();
          setLatlng([swLatlng.lat(), swLatlng.lng(), neLatlng.lat(), neLatlng.lng()]);
          if (markerClick) markerClick.infowindow.close();
        }, 1000);
      });

      console.debug('[addListener dragend]');
      map.addListener('dragend', () => {
        window.setTimeout(() => {
          console.debug('地図が移動');
          bounds = map.getBounds();
          swLatlng = bounds.getSouthWest();
          neLatlng = bounds.getNorthEast();
          setLatlng([swLatlng.lat(), swLatlng.lng(), neLatlng.lat(), neLatlng.lng()]);
          if (markerClick) markerClick.infowindow.close();
        }, 1000);
      });
    }
  }, [map]);

  // 地図自体のオプション
  const createMapOptions = () => {
    return {
      mapTypeControl: false,
      zoomControl: true,
      scaleControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    };
  };

  return (
    <PageContainer padding="0px">
      <Backdrop open={backdropOpen}>
        <DialogCard agreeStatus={agreeStatus} />
      </Backdrop>
      <GoogleMapWrapper>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: googlekey,
          }}
          center={{
            lat: presentLocation.lat,
            lng: presentLocation.lng,
          }}
          defaultZoom={16}
          options={createMapOptions}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        ></GoogleMapReact>
      </GoogleMapWrapper>
      <ReloadContainer>
        <LinkChipsStyle>
          <LinkChips
            label="販売中のお弁当を再検索"
            icon={<RefreshOutlinedIcon />}
            onClick={handleClick}
          />
        </LinkChipsStyle>
      </ReloadContainer>
      <Drawer
        items={items}
        chips={chips}
        shop={shopId}
        anchor="bottom"
        onClick={toggleDrawer('bottom', true)}
        open={toggleState['bottom']}
        onClose={toggleDrawer('bottom', false)}
      />
      <Waiting isOpen={wait} />
    </PageContainer>
  );
};

// PropTypes
PageSearchMap.propTypes = {};
export default PageSearchMap;
