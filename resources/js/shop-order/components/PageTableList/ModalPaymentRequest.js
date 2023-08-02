import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStylesPaymentRequest as useStyles } from './styles';
import Utils from 'js/shared/utils';
import { Box, Divider, Grid, OutlinedInput, InputAdornment } from '@material-ui/core';
import { find } from 'lodash';

import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import PageTableListContext, { formatAmount } from './PageTableListContext';

// Utils
import { TAX_OPTIONS, hanldePriceFractionMode, CHARCODE_MINUS } from 'js/utils/helpers/const';
import { renderUrlImageS3 } from 'js/utils/helpers/image';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import ButtonCore from 'js/shared/components/Button';
import ModalOrderDetail from './ModalChildren';
import moment from 'moment';
moment.locale('vi');

const DEFAULT_QUANTITY_ORDER = 1;
const DEFAULT_NUMBER_OF_SERVE = 0;
const MAX_NUMBER_OF_SERVE = 99;

const ModalPaymentRequest = (props) => {
  const classes = useStyles();
  const [shop] = useContext(ShopInfoContext);
  const currencyName = props?.shopTaxInfo?.mCurrency?.name;
  const { setToast, setWaiting, state, dispatch } = useContext(PageTableListContext);
  const [fractionMode, setFractionMode] = useState(0);
  const [order, setOrder] = useState({
    name: '',
    quantity: DEFAULT_QUANTITY_ORDER,
    price: 0,
    amount: 0,
    s_image_path: '',
  });
  const [showModalChangeQuantity, setShowModalChangeQuantity] = useState(false);
  const [showModalChangeServe, setShowModalChangeServe] = useState(false);
  const [draftTaxRate, setDraftTaxRate] = useState(props?.shopTaxInfo?.serve_charge_rate*100)
  const [infoPayment, setInfoPayment] = useState({
    totalServeFee: 0,
    totalTaxFee: 0,
    totalAmount: 0,
    totalTax: 0,
    serve_charge_rate: props?.shopTaxInfo?.serve_charge_rate,
  });

  useEffect(() => {
    getDataInfoPayment();
  }, [state, shop, draftTaxRate]);

  const getDataInfoPayment = () => {
    const infoPaymentClone = Utils.cloneDeep(infoPayment);
    const priceFractionMode = props?.shopTaxInfo?.price_fraction_mode;
    console.log(props?.shopTaxInfo);
    console.log('priceFractionMode');
    console.log(priceFractionMode);
    const serveRate = Number(infoPayment.serve_charge_rate);
    console.log('serveRate');
    console.log(serveRate);
    const ordersFilter = state?.ordergroup?.orders?.filter((item) => item?.status !== 2);
    console.log('ordersFilter');
    console.log(ordersFilter);
    const totalTax = hanldePriceFractionMode(
      ordersFilter?.reduce((total, item) => total + item?.tax_value * item?.quantity, 0),
      0,
      priceFractionMode
    );
    console.log('totalTax');
    console.log(totalTax);
    const totalGrossServeFee = Number(serveRate) * (state?.totalAmount - totalTax)
    console.log('totalGrossServeFee');
    console.log(totalGrossServeFee);
    const totalAmountFractionMode = props?.shopTaxInfo?.total_amount_fraction_mode;
    console.log('totalAmountFractionMode');
    console.log(totalAmountFractionMode);
    const totalAmount = hanldePriceFractionMode(
      state?.totalAmount + totalGrossServeFee + totalGrossServeFee * 0.1,
      0,
      priceFractionMode
    );
    console.log('totalAmount');
    console.log(totalAmount);
    infoPaymentClone.totalServeFee = formatAmount(
      hanldePriceFractionMode(totalGrossServeFee * 0.1 + totalGrossServeFee, 0, priceFractionMode)
    );
    infoPaymentClone.totalTaxFee = formatAmount(
      hanldePriceFractionMode(totalGrossServeFee * 0.1, 0, priceFractionMode)
    );
    infoPaymentClone.totalAmount =
      totalAmountFractionMode === 1
        ? formatAmount(Math.floor(Number(totalAmount) / 10) * 10)
        : formatAmount(totalAmount);
    infoPaymentClone.totalTax = formatAmount(
      hanldePriceFractionMode(
        totalGrossServeFee * 0.1 + totalTax,
        0,
        priceFractionMode
      )
    );
    console.log(infoPaymentClone);
    setInfoPayment(infoPaymentClone);
    setFractionMode(priceFractionMode);
  };

  const handleUpdateOrderClick = () => {
    let isUpdate = true;
    let data = {
      update_orders: [
        {
          id: order.id,
          quantity: order.quantity,
        },
      ],
    };
    setWaiting(true);
    ShopOrderApiService.order(shop.hashId, state.ordergroup.hash_id, data, isUpdate)
      .then(() => {
        setWaiting(false);
        dispatch({ type: 'REFRESH' });
        setToast({ isShow: true, status: 'success', message: 'Cập nhật thành công' });
      })
      .catch(() => {
        setWaiting(false);
        setToast({ isShow: true, status: 'error', message: 'Vui lòng nhập số lượng' });
      });
  };

  const handleDecrement = () => {
    let orderClone = Utils.cloneDeep(order);
    const { quantity } = orderClone;
    orderClone.quantity = quantity > DEFAULT_QUANTITY_ORDER ? quantity - 1 : DEFAULT_QUANTITY_ORDER;
    setOrder(orderClone);
  };

  const handleIncrement = () => {
    let orderClone = Utils.cloneDeep(order);
    orderClone.quantity += 1;
    setOrder(orderClone);
  };

  const showTextConsumptionTax = (tax_rate) => {
    const taxOption = find(TAX_OPTIONS, { tax_rate: Number(tax_rate) });
    return taxOption?.name;
  };

  const handleNextModalPayment = () => {
    props.getInfoPayment(infoPayment);
    props.handleModal();
  };

  const handleConfirmChangeServe = () => {
    const infoPaymentClone = Utils.cloneDeep(infoPayment)
    infoPaymentClone.serve_charge_rate = Number(draftTaxRate)/100;
    setInfoPayment({...infoPaymentClone});
    setDraftTaxRate(infoPaymentClone.serve_charge_rate*100);

  }
  const renderListOrder = () => {
    return state.ordergroup.orders.map((item, index) => {
      return (
        <Grid container key={index}>
          <Grid item xs={4}>
            <Box
              display='flex'
              flexDirection={{ xs: 'column', sm: 'row' }}
              ml={{ xs: 1, sm: '10%' }}
              height='100%'
            >
              {item.status === 2 && (
                <Box className={classes.cancelOrder} whiteSpace='nowrap'>
                  【Hủy】
                </Box>
              )}
              <Box className={classes.firstColumn}>{item.name}</Box>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box className={classes.textCenter} minHeight={48}>
              {item.quantity}
            </Box>
          </Grid>
          {/*<Grid item xs={3}>*/}
          {/*  <Box className={classes.textCenter} minHeight={48}>*/}
          {/*    {showTextConsumptionTax(item?.tax_rate)}*/}
          {/*  </Box>*/}
          {/*</Grid>*/}
          <Grid item xs={6}>
            <Box
              className={classes.textCenter}
              minHeight={48}
              flexDirection={{ xs: 'column', sm: 'row' }}
              style={{ justifyContent: 'start' }}
            >
              <Box
                mr={1}
                width='40%'
                whiteSpace='nowrap'
                display='flex'
                flexDirection={{ xs: 'column', sm: 'row' }}
              >
                <Box mr={1} style={{ paddingLeft: '60px' }}>
                  {formatAmount(item.amount)}
                  {currencyName}
                </Box>
                {/*<Box overflow='hidden' textOverflow='ellipsis'>*/}
                {/*  (*/}
                {/*  {item.amount == 0 ? 0 : formatAmount(*/}
                {/*    hanldePriceFractionMode(item?.tax_value * item?.quantity, 0, fractionMode)*/}
                {/*  )}*/}
                {/*  {currencyName})*/}
                {/*</Box>*/}
              </Box>
              <Box mb={1} style={{ paddingLeft: '50px' }}>
                {item.status !== 2 && (
                  <ButtonCustom
                    bgcolor='#FFF'
                    fgcolor='#FFA04B'
                    onClick={() => {
                      setShowModalChangeQuantity(true);
                      setOrder({
                        name: item?.name,
                        quantity: item?.quantity,
                        price: item?.price,
                        amount: item?.amount,
                        id: item?.id,
                        s_image_path: item?.m_menu && item?.m_menu?.main_image?.s_image_path
                      });
                    }}
                    variant='outlined'
                    borderColor='#FFA04B'
                    padding='1px 35px'
                    margin='0'
                  >
                    Thay đổi
                  </ButtonCustom>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      );
    });
  };

  const renderFooterActions = () => {
    return (
      <>
        <Box width='100%' fontWeight={600}>
          <Box>
            <Divider />
            <Box mt={3}>
              <Grid container>
                <Grid item sm={3} xs={3}>
                  <Box textAlign='center'>Tổng cộng</Box>
                </Grid>
                <Grid item sm={2} xs={1}>
                  <Box textAlign='center'></Box>
                </Grid>
                <Grid item sm={7} xs={8}>
                  <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }}>
                    <Box textAlign='center' mr={2} fontSize={24} style={{paddingLeft: '30px'}}>
                      {infoPayment?.totalAmount}
                      {currencyName}
                    </Box>
                    {/*<Box alignSelf='center'>*/}
                    {/*  (Tiến thuế {infoPayment?.totalTax}*/}
                    {/*  {currencyName})*/}
                    {/*</Box>*/}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Grid container>
            <Grid item sm={3} xs={12}>
              <Box textAlign='center' className={classes.buttonBoxShadow}>
                <ButtonCustom
                  bgcolor='#828282'
                  fgcolor='#FFF'
                  onClick={props.onClose}
                  variant='outlined'
                  borderColor='#828282'
                  padding='4px 40px'
                >
                  Quay lại
                </ButtonCustom>
              </Box>
            </Grid>
            <Grid item sm={2} xs={12}></Grid>
            <Grid item sm={6} xs={12}>
              <Box textAlign='center' className={classes.buttonBoxShadow}>
                <ButtonCustom
                  bgcolor='#FFA04B'
                  fgcolor='#FFF'
                  variant='outlined'
                  borderColor='#FFA04B'
                  width='90%'
                  onClick={handleNextModalPayment}
                >
                  Thanh toán
                </ButtonCustom>
              </Box>
            </Grid>
            <Grid item sm={1} xs={12}></Grid>
          </Grid>
        </Box>
      </>
    );
  };

  return (
    <Modal
      open={props.open}
      title='Thanh toán'
      onClose={props.onClose}
      actions={renderFooterActions()}
      maxWidth='850px'
      maxHeight='40vh'
    >
      <Box className={classes.modalContent}>
        <Grid container>
          <Grid item xs={4} className='firstHeading'>
            <Box ml={{ xs: 1, sm: '45%' }}>Món</Box>
          </Grid>
          <Grid item xs={2} className='heading'>
            <Box>Số lượng</Box>
          </Grid>
          {/*<Grid item xs={3} className='heading'>*/}
          {/*  <Box>Thuế</Box>*/}
          {/*</Grid>*/}
          <Grid item xs={6} className='heading' style={{ justifyContent: 'start', paddingLeft: '60px' }}>
            <Box>Số tiền</Box>
          </Grid>
        </Grid>
        {renderListOrder()}
        {props?.shopTaxInfo?.serve_charge_in_use === 1 && (
          <Grid container>
            <Grid item xs={3}>
              <Box
                ml={{ xs: 1, sm: '10%' }}
                mb={'10px'}
                alignItems='center'
                height='100%'
                display='flex'
              >
                Phí dịch vụ ({Number(infoPayment.serve_charge_rate * 100)}%)
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box textAlign='center'></Box>
            </Grid>
            {/*<Grid item xs={3}>*/}
            {/*  <Box justifyContent='center' alignItems='center' height='100%' display='flex'>*/}
            {/*    Thuế*/}
            {/*  </Box>*/}
            {/*</Grid>*/}
            <Grid item xs={7}>
              <Box
                className={classes.textCenter}
                minHeight={48}
                flexDirection={{ xs: 'column', sm: 'row' }}
                style={{ justifyContent: 'start' }}
              >
                <Box
                  mr={1}
                  width='40%'
                  whiteSpace='nowrap'
                  display='flex'
                  flexDirection={{ xs: 'column', sm: 'row' }}
                >
                  <Box mr={1}>
                    {infoPayment?.totalServeFee}
                    {currencyName}
                  </Box>
                  <Box overflow='hidden' textOverflow='ellipsis'>
                    ({infoPayment?.totalTaxFee}
                    {currencyName})
                  </Box>
                </Box>
                <Box mb={1}>
                  <ButtonCustom
                    bgcolor='#FFF'
                    fgcolor='#FFA04B'
                    onClick={() => {
                      setShowModalChangeServe(true);
                    }}
                    variant='outlined'
                    borderColor='#FFA04B'
                    padding='1px 35px'
                    margin='0'
                  >
                    Thay đổi
                  </ButtonCustom>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
      <ModalOrderDetail
        isOpen={showModalChangeQuantity}
        title={order.name}
        onClose={() => {
          setShowModalChangeQuantity(false);
        }}
        onConfirm={handleUpdateOrderClick}
      >
        <Box display='flex' alignItems='center' justifyContent='center' className={classes.prodItem}>
          {order?.s_image_path ? (
            <img src={renderUrlImageS3(order?.s_image_path)} />
          ) : (
            <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/noimage.png`} alt='banner' />
          )}
        </Box>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <ButtonCore
            padding='0'
            borderRadius='50%'
            className={classes.customButton}
            style={{ background: '#E4E1B0', color: '#333333' }}
            onClick={handleDecrement}
          >
            ー
          </ButtonCore>
          <Box display='flex' alignItems='baseline' fontSize={50} fontWeight='fontWeightBold'>
            {order?.quantity}
            <Box fontSize={23} fontWeight='fontWeightRegular'>

            </Box>
          </Box>
          <ButtonCore
            padding='0'
            borderRadius='50%'
            bgcolor='#F2994B'
            fgcolor='#ffffff'
            className={classes.customButton}
            onClick={handleIncrement}
          >
            ＋
          </ButtonCore>
        </Box>
      </ModalOrderDetail>

      <ModalOrderDetail
        isOpen={showModalChangeServe}
        title='Phí dịch vụ'
        onClose={() => {
          setShowModalChangeServe(false);
          setDraftTaxRate(infoPayment.serve_charge_rate*100);
        }}
        onConfirm={handleConfirmChangeServe}
      >
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <OutlinedInput
            id='outlined-adornment-weight'
            type='number'
            value={draftTaxRate}
            className={classes.inputNumberServe}
            endAdornment={<InputAdornment position='end'>%</InputAdornment>}
            labelWidth={0}
            inputProps={{
              min: DEFAULT_NUMBER_OF_SERVE,
              max: MAX_NUMBER_OF_SERVE,
            }}
            onChange={(event) => {
              if (Number(event.target.value) > MAX_NUMBER_OF_SERVE) {
                return;
              }
              setDraftTaxRate(event.target.value);
            }}
            onKeyPress={(event) => {
              const charCode = event.which ? event.which : event.keyCode;
              if (charCode === CHARCODE_MINUS) {
                event.preventDefault();
              }
            }}
          />
        </Box>
      </ModalOrderDetail>
    </Modal>
  );
};

// PropTypes
ModalPaymentRequest.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleModal: PropTypes.func,
  getInfoPayment: PropTypes.func,
};

// defaultProps
ModalPaymentRequest.defaultProps = {
  open: false,
  onClose: () => {
    /*nop*/
  },
  handleModal: () => {},
  getInfoPayment: () => {},
};

export default ModalPaymentRequest;
