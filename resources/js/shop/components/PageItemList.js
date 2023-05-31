/*
 * Obento-R お弁当販売
 */

import React, { useState, useEffect, useContext } from 'react';
//import PropTypes from 'prop-types';

import { useHistory } from 'react-router';
import ShopApiService, { ENDPOINTS } from 'js/shop/shop-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Base Components
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import Footer from 'js/shop/components/Footer';
import Waiting from 'js/shared/components/Waiting';

// Components(Material-UI)
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// icon
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';

import ItemCard from 'js/shared/components/ItemCard';
import Button from 'js/shared/components/Button';

const useStyles = makeStyles({
  floatButtonContainer: {
    position: 'fixed',
    bottom: '40px',
    right: '5px',
  },
});

const PageItemList = (props) => {
  const classes = useStyles(props);
  const history = useHistory();

  // shop context
  const [shop] = useContext(ShopInfoContext);
  const [items, setItems] = useState([]);

  const [wait, setWait] = useState(true);

  // click edit button
  const handleClickEditButton = (item) => {
    // console.debug('[PageItemList] handleEditButton', itemHash);
    history.push(`/item/edit/${item.hash_id}`);
  };

  // click regist button
  const handleClickRegistButton = () => {
    history.push(`/item/regist`);
  };
  
  // request to get sale item
  useEffect(() => {
    // console.debug('[PageItemList] effect shop', shop);
    setWait(true);
    ShopApiService.request(ENDPOINTS.GET_ITEMS, [shop.hashId], null).then((result) => {
      console.debug('[PageItemList] GET_ITEMS', result);
      setWait(false);
      // If there is no registered item, go to the item registration screen
      if (result.length === 0) {
        history.push('/item/regist');
      } else {
        setItems(result);
      }
    });

    return () => {
      console.debug('[PageItemList] unmount(shop)');
    };
  }, [shop]);

  return (
    <PageContainer padding="0px">
      <HeaderAppBar title="Danh sách" />
      <PageInnerContainer backgroundColor="rgba(200,200,200,0.4)" padding="10px 5px 100px 5px">
        {items.map((item) => {
          return (
            <ItemCard
              key={item.hash_id}
              img={`${item.m_image_folder_path}`}
              itemName={item.name}
              itemPrice={Number(item.price)}
            >
              <Button
                onClick={() => {
                  handleClickEditButton(item);
                }}
                padding="8px 20px"
              >
                <CreateOutlinedIcon /> Sửa
              </Button>
            </ItemCard>
          );
        })}
        <Box className={classes.floatButtonContainer}>
          <Button
            title="+ Thêm mới"
            bgcolor="#86BE27"
            fgcolor="#F7FAEE"
            onClick={handleClickRegistButton}
            borderRadius="40px"
            borderColor="#fff"
          ></Button>
        </Box>
      </PageInnerContainer>
      <Footer initialTabIndex={Number(0)}></Footer>
      <Waiting isOpen={wait} />
    </PageContainer>
  );
};
// PropTypes
PageItemList.propTypes = {};
export default PageItemList;
