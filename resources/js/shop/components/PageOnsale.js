/*
 * Obento-R お弁当販売
 */

import React, { useState, useEffect, useContext } from 'react';
//import PropTypes from 'prop-types';

import { useHistory } from 'react-router';
import ShopApiService, { ENDPOINTS } from 'js/shop/shop-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Components
import PageContainer from 'js/shared/components/PageContainer';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import HeaderAppBar from 'js/shop/components/HeaderAppBar';
import Footer from 'js/shop/components/Footer';
import Waiting from 'js/shared/components/Waiting';

// Components(Material-UI)
// import { Container } from '@material-ui/core';
//

import ItemCard from 'js/shared/components/ItemCard';
import ButtonOnSale from 'js/shared/components/ButtonOnSale';

const isItemOnsale = (item) => {
  return item.status === 'onsale';
};

const PageOnsale = (_props) => {
  const history = useHistory();

  // shop context
  const [shop] = useContext(ShopInfoContext);
  const [items, setItems] = useState([]);

  const [wait, setWait] = useState(true);

  // 販売アイテム取得リクエスト
  useEffect(() => {
    // console.debug('[PageOnsale] effect shop', shop);
    setWait(true);
    ShopApiService.request(ENDPOINTS.GET_ITEMS, [shop.hashId], null).then((result) => {
      console.debug('[PageOnsale] GET_ITEMS', result);
      setWait(false);
      // 登録アイテムなければ弁当一覧へ
      if (result.length === 0) {
        history.push('/item/list');
      } else {
        setItems(result);
      }
    });

    return () => {
      console.debug('[PageOnsale] unmount(shop)');
    };
  }, [shop]);

  const handleToggleOnsale = (item) => {
    const nextOnsale = !isItemOnsale(item);
    ShopApiService.toggleOnsale(shop.hashId, item.hash_id, nextOnsale)
      .then((resultOnsale) => {
        setItems((prevItems) => {
          const nextItems = prevItems.reduce((arr, pItem) => {
            arr.push({ ...pItem });
            return arr;
          }, []);
          const target = nextItems.find((nItem) => nItem.id === item.id);
          target.status = resultOnsale;
          return nextItems;
        });
      })
      .catch((error) => {
        console.error('[PageOnsale] toggle onsale error', error);
      });
  };

  return (
    <PageContainer padding="0px">
      <HeaderAppBar title="Giao diện bán hàng" />

      <PageInnerContainer backgroundColor="rgba(200,200,200,0.4)">
        {items.map((item) => {
          return (
            <ItemCard
              key={item.hash_id}
              img={`${item.m_image_folder_path}`}
              itemName={item.name}
              itemPrice={Number(item.price)}
            >
              <ButtonOnSale
                title="Bắt đầu bán"
                bgcolor="#E35649"
                fgcolor="#F8B62D"
                border="2px solid #B53F35"
                disabled={isItemOnsale(item)}
                onClick={() => {
                  handleToggleOnsale(item);
                }}
              ></ButtonOnSale>

              <ButtonOnSale
                title="Ngừng bán"
                bgcolor="#97C633"
                fgcolor="#F8B62D"
                border="2px solid #739A1E"
                disabled={!isItemOnsale(item)}
                onClick={() => {
                  handleToggleOnsale(item);
                }}
              ></ButtonOnSale>
            </ItemCard>
          );
        })}
      </PageInnerContainer>
      <Footer initialTabIndex={Number(1)}></Footer>
      <Waiting isOpen={wait} />
    </PageContainer>
  );
};
// PropTypes
PageOnsale.propTypes = {};
export default PageOnsale;
