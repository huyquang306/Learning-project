/*
 * Obento-R お弁当一覧
 */

import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router';
import CustomerApiService, { ENDPOINTS } from 'js/customer/customer-api-service';
import ShopInfoContext from 'js/customer/components/ShopInfoContext';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

// Components
import PageContainer from 'js/shared/components/PageContainer';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import HeaderAppBar from 'js/customer/components/HeaderAppBar';
import Waiting from 'js/shared/components/Waiting';
import Chips from 'js/shared/components/Chips';
//import DirectionsWalkOutlinedIcon from '@material-ui/icons/DirectionsWalkOutlined';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import RestaurantOutlinedIcon from '@material-ui/icons/RestaurantOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';

import OnsaleItemCard from 'js/shared/components/OnsaleItemCard';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#E35649',
    padding: '5px 10px',
  },
}));

const PageOnsale = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const shopHash = props.match.params.shopHash;

  // shop context
  const shopContext = useContext(ShopInfoContext);
  const [shopData, setShopData] = useState();
  const [wait, setWait] = useState(true);

  // 店舗情報リクエスト
  useEffect(() => {
    setWait(true);
    CustomerApiService.request(ENDPOINTS.GET_SHOP, [shopHash], null).then((result) => {
      console.debug('[PageOnsale] GET_SHOP', result);
      setWait(false);

      // 店舗情報がなければ地図画面へ
      if (result.length === 0) {
        history.push('/searchmap/');
      } else {
        setShopData(result);

        shopContext.hashId = shopHash;
        shopContext.lat = result[0].lat;
        shopContext.lng = result[0].lon;
      }
    });

    return () => {
      console.debug('[PageOnsale] unmount(shop)');
    };
  }, []);

  return (
    <PageContainer padding="0px">
      <HeaderAppBar
        title={shopData ? shopData[0].name : '店舗名'}
        lat={shopData ? shopData[0].lat : null}
        lng={shopData ? shopData[0].lon : null}
        phone_number={shopData ? shopData[0].phone_number : null}
      />
      <div className={classes.root}>
        {shopData ? (
          <Box>
            <Chips
              key={0}
              label={
                shopData[0].lunch_start_time.split(':')[0] +
                ':' +
                shopData[0].lunch_start_time.split(':')[1] +
                '〜' +
                shopData[0].lunch_end_time.split(':')[0] +
                ':' +
                shopData[0].lunch_end_time.split(':')[1]
              }
              icon={<WatchLaterOutlinedIcon style={{ color: '#E35649' }} />}
            />
            <Chips
              key={1}
              label={shopData[0].genres[0].name}
              icon={<RestaurantOutlinedIcon style={{ color: '#E35649' }} />}
            />
            <Chips
              key={2}
              label={
                (shopData[0].prefecture ? shopData[0].prefecture : '') +
                (shopData[0].city ? shopData[0].city : '') +
                (shopData[0].address ? shopData[0].address : '') +
                (shopData[0].building ? shopData[0].building : '')
              }
              icon={<RoomOutlinedIcon style={{ color: '#E35649' }} />}
            />
          </Box>
        ) : (
          '詳細情報を取得できませんでした。'
        )}
      </div>
      <PageInnerContainer>
        {shopData
          ? shopData[0].items.map((item) => {
              return (
                <OnsaleItemCard
                  key={item.hash_id}
                  img={`${item.m_image_folder_path}`}
                  itemName={item.name}
                  itemPrice={Number(item.price)}
                  status={item.status}
                />
              );
            })
          : '店舗情報取得中です...'}
      </PageInnerContainer>
      <Waiting isOpen={wait} />
    </PageContainer>
  );
};
// PropTypes
PageOnsale.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      shopHash: PropTypes.string,
    }),
  }),
};
// PropTypes
PageOnsale.defaultProps = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      shopHash: null,
    }),
  }),
};

export default PageOnsale;
