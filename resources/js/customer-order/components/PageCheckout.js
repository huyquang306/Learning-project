/**
 * Page Checkout
 */

// React
import React, { useEffect, useState } from 'react';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';

// Material UI component
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Component
import HeaderAppBar from './HeaderAppBar';
import PageInnerWrap from './PageInnerWrap';

// Component shared
import PageContainer from '../../shared/components/PageContainer';
import PageInnerContainer from '../../shared/components/PageInnerContainer';
import { useHistory, useParams } from 'react-router-dom';

//Utils
import { ORDER_STATUS } from 'js/utils/helpers/courseHelper';

// Style
const useStyles = makeStyles({
  textUnderline: {
    textDecoration: 'underline',
  },
  textGray: {
    color: '#757575',
  },
});

const PageCheckout = () => {
  const classes = useStyles();
  const [amount, setAmount] = useState([]);
  const [tableName, setTableName] = useState('');
  const table_code = localStorage.getItem('tableCode') || tableName;
  const { shop_hash_id } = useParams();
  const ordergroup_hash_id = localStorage.getItem('ordergroupHash');
  const [priceDisplayMode, setPriceDisplayMode] = useState();
  const [currencyName, setCurrencyName] = useState('');
  const history = useHistory();

  useEffect(() => {
    //Get shop tax info
    getShopTaxInfo();
  }, []);

  const getShopTaxInfo = async () => {
    try {
      const responseInfoShop = await CustomerOrderApiService.getShopTaxInfo(shop_hash_id);
      const responseOrders = await CustomerOrderApiService.getOrderList(
        shop_hash_id,
        ordergroup_hash_id
      );
      const keyname =
        responseInfoShop?.price_display_mode === 1
          ? 'price_unit_without_tax'
          : 'price_unit_with_tax';

      const totalBilling = responseOrders?.orders
        ?.filter((item) => item.status !== ORDER_STATUS.STATUS_CANCEL)
        ?.reduce((total, item) => total + item.current_price[keyname] * item.quantity, 0);
      setAmount(totalBilling);
      setPriceDisplayMode(responseInfoShop?.price_display_mode);
      setCurrencyName(responseInfoShop?.mCurrency?.name);
      setTableName(responseOrders.code_tables);
    } catch (error) {
      history.push('/thanks-for-customer');
    }
  };

  useEffect(() => {
    CustomerOrderApiService.getStatusOrdergroup(shop_hash_id, ordergroup_hash_id).then(response => {
      if(response.status === 4) {
        history.push('/' + shop_hash_id + '/thanks-for-customer');
      }
    }).catch(() => {
      history.push('/' + shop_hash_id + '/thanks-for-customer');
    });
  });

  return (
    <PageContainer padding='0'>
      <HeaderAppBar title='Xin cảm ơn' />
      <PageInnerWrap>
        <PageInnerContainer>
          <Box textAlign='center' fontWeight={600}>
            <Box py={6} fontSize={45} display='flex' justifyContent='center'>
              {amount}
              <Box>{currencyName}</Box>
              <Box fontSize={14} alignSelf='end' mb={2}>
                {priceDisplayMode === 1 && '(税抜き)'}
              </Box>
            </Box>

            <Box fontSize={24}>Vui lòng thanh toán tại quầy thu ngân</Box>

            <Box pt={5} fontSize={24}>
              Bàn
            </Box>
            <Box fontSize={36} className={classes.textUnderline}>
              {table_code}
            </Box>

            <Box pt={4} className={classes.textGray}>
              {/*※Không thanh toán thông qua hệ thống này*/}
            </Box>
            {/*<Box className={classes.textGray}>ご注文・サービスがある場合、</Box>*/}
            {/*<Box className={classes.textGray}>お会計金額が変わる可能性があります</Box>*/}
          </Box>
        </PageInnerContainer>
      </PageInnerWrap>
    </PageContainer>
  );
};

export default PageCheckout;
