/**
 * Modal Detail Order History
 */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import PageOrderHistoryContext from './PageOrderHistoryContext';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, OutlinedInput, InputAdornment } from '@material-ui/core';

// Utils
import {
  getPositiveNumber,
  CHARCODE_NUMBER_ZERO,
  CHARCODE_NUMBER_NINE,
} from 'js/utils/helpers/const';

// Library
import moment from 'moment';
moment.locale('ja');

const MIN_NUMBER_OF_QUANTITY = 1;

const useStyles = makeStyles(() => ({
  modalContent: {
    height: '340px',
    overflow: 'hidden',
    padding: '15px',
  },
  input: {
    padding: '15px',
  },
  inputRoot: {
    width: '100%',
  },
}));

const ModalDetailOrderHistory = (props) => {
  const classes = useStyles();

  const [shop] = useContext(ShopInfoContext);
  const { setRefresh, orderGroup, setWaiting, setToast } = useContext(PageOrderHistoryContext);

  const [quantity, setQuantity] = useState(orderGroup.order.quantity);

  const handleUpdateOrderClick = () => {
    if (orderGroup.order.status != 2) {
      let isUpdate = true;
      let data = {
        update_orders: [
          {
            id: orderGroup.order.id,
            quantity: quantity,
          },
        ],
      };
      setWaiting(true);
      if (!quantity) {
        setToast({ isShow: true, status: 'error', message: '数量が必須です。' });
        setWaiting(false);
        return;
      }
      ShopOrderApiService.order(shop.hashId, orderGroup.group.hash_id, data, isUpdate)
        .then(() => {
          setWaiting(false);
          setToast({ isShow: true, status: 'success', message: 'Update order success!' });
          setRefresh({ isRefresh: false, refreshAt: new Date() });
          props.onClose();
        })
        .catch(() => {
          setWaiting(false);
          setToast({ isShow: true, status: 'error', message: '数量が必須です。' });
        });
    } else {
      props.onClose();
    }
  };

  const handleRemoveOrderClick = () => {
    let isUpdate = true;
    let data = {
      cancel_orders: [orderGroup.order.id],
    };

    ShopOrderApiService.order(shop.hashId, orderGroup.group.hash_id, data, isUpdate)
      .then(() => {
        setWaiting(false);
        setToast({ isShow: true, status: 'success', message: 'Delete order success!' });
        setRefresh({ isRefresh: false, refreshAt: new Date() });
        props.onClose();
      })
      .catch((error) => {
        setWaiting(false);
        setToast({ isShow: true, status: 'error', message: error.message });
        console.error('[ModalDetailOrderHistory] handleRemoveOrderClick error', error);
      });
  };

  const footerActions = () => {
    return (
      <React.Fragment>
        <ButtonCustom
          title='戻る'
          borderRadius='28px'
          bgcolor='#828282'
          borderColor='#828282'
          width='176px'
          onClick={props.onClose}
        />
        <ButtonCustom
          title='保存する'
          borderRadius='28px'
          bgcolor='#FFA04B'
          borderColor='#FFA04B'
          width='176px'
          onClick={handleUpdateOrderClick}
        />
      </React.Fragment>
    );
  };

  const handleOnChangeQuantity = (event) => {
    const value = getPositiveNumber(event.target.value);
    setQuantity(value);
  };

  const handleOnKeyPressQuantity = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < CHARCODE_NUMBER_ZERO || charCode > CHARCODE_NUMBER_NINE) {
      event.preventDefault();
    }
  };

  return (
    <Modal open={props.open} title='アイテム詳細' onClose={props.onClose} actions={footerActions()}>
      <div className={classes.modalContent}>
        <Box
          textAlign='right'
          style={{
            pointerEvents: orderGroup.order.status === 2 ? 'none' : 'auto',
            opacity: orderGroup.order.status === 2 ? 0.4 : 1,
          }}
        >
          <ButtonCustom
            title='削除'
            borderRadius='12px'
            bgcolor='#f2c94c'
            width='100px'
            padding='5px'
            margin='5px 0px'
            fontSize='14px'
            onClick={handleRemoveOrderClick}
          />
        </Box>
        <Box style={{ maxWidth: '386px', margin: '0px auto 0' }}>
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={3}>
              テーブル
            </Grid>
            <Grid item xs={9}>
              {orderGroup.group.code_tables}
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={3}>
              注文時間
            </Grid>
            <Grid item xs={9}>
              {moment(orderGroup.order.ordered_at).format('YYYY/MM/DD HH:mm')}
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={3}>
              商品名
            </Grid>
            <Grid item xs={9}>
              {orderGroup.order.name}
              {orderGroup.order.m_course ? <span> (コース内)</span> : null}
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={3}>
              数量
            </Grid>
            <Grid item xs={9}>
              <OutlinedInput
                id='outlined-1'
                disabled={orderGroup.order.status === 2 ? true : false}
                type='number'
                value={quantity}
                classes={{ root: classes.inputRoot, input: classes.input }}
                endAdornment={<InputAdornment position='end'>個</InputAdornment>}
                labelWidth={0}
                inputProps={{ min: MIN_NUMBER_OF_QUANTITY }}
                onChange={handleOnChangeQuantity}
                onKeyPress={handleOnKeyPressQuantity}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={3}>
              価格
            </Grid>
            <Grid item xs={9}>
              <OutlinedInput
                id='outlined-2'
                disabled={true}
                type='number'
                value={orderGroup.order.amount}
                classes={{ root: classes.inputRoot, input: classes.input }}
                endAdornment={
                  <InputAdornment position='end'>
                    {shop?.mShopPosSetting?.m_currency?.name}
                  </InputAdornment>
                }
                labelWidth={0}
                onChange={() => {}}
              />
            </Grid>
          </Grid>
        </Box>
      </div>
    </Modal>
  );
};

// PropTypes
ModalDetailOrderHistory.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

// defaultProps
ModalDetailOrderHistory.defaultProps = {
  open: false,
  onClose: () => {
    /*nop*/
  },
};

export default ModalDetailOrderHistory;
