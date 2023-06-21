import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import Utils from 'js/shared/utils';
import ShopApiService from 'js/shop/shop-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Base Components
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import Waiting from 'js/shared/components/Waiting';
import Footer from 'js/shared-order/components/Footer';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import {
  OutlinedInput,
  Button,
  Box,
  Grid,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
// Utils
import CircularProgress from '@material-ui/core/CircularProgress';
import { CHARCODE_MINUS } from 'js/utils/helpers/const';

const useStyles = makeStyles(() => ({
  container: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#000',
    display: 'flex',
    justifyContent: 'center',
    '@media (max-width: 960px)': {
      padding: '20px 20px 160px 20px',
    },
    padding: '50px 180px 90px',
    '& .MuiTabs-root': {
      overflow: 'visible',
    },
    '& .MuiTab-root': {
      minHeight: 38,
      '@media (max-width: 720px)': {
        maxWidth: '100px',
        minWidth: 'auto',
      },
    },
    '& .background-gray .MuiInputBase-root': {
      background: 'rgba(130, 130, 130, .3)',
    },
  },
  wrapTabs: {
    display: 'flex',
    '@media (max-width: 1200px)': {
      display: 'block',
      margin: 0,
    },
  },
  textHanldeTax: {
    fontSize: 12,
    fontWeight: 400,
    alignSelf: 'center',
    margin: '20px 16px 0',
    whiteSpace: 'nowrap',
    '@media (max-width: 1200px)': {
      margin: 0,
    },
  },
  wrapContentRow: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 450px)': {
      alignItems: 'start',
      flexDirection: 'column',
    },
  },
  input: {
    width: '100%',
    color: '#000',
    fontSize: '16px',
    height: '40px',
    borderRadius: '4px',
    textAlign: 'right',
    fontWeight: 600,
    '& .MuiInputBase-formControl': {
      paddingTop: '1px',
      paddingBottom: '1px',
    },
    '-webkit-appearance': 'none',
    '-moz-appearance': 'none',
    '&::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  buttonController: {
    color: '#fff',
    borderRadius: '28px',
    padding: '12px 0',
    fontSize: '18px',
    width: '252px',
    textAlign: 'center',
  },
  buttonAdd: {
    background: '#FFA04B',
    '&:hover': {
      background: '#FFA04B',
    },
  },
  buttonBack: {
    background: '#828282',
    '&:hover': {
      background: '#828282',
    },
  },
  label: {
    minWidth: '25%',
    '@media (max-width: 600px)': {
      minWidth: '35%',
    },
  },
  customTab: {
    color: '#F2994A',
    border: '1px solid #F2994A',
    padding: '2px 20px',
    fontSize: '18px',
    background: '#FEFEFE',
    textAlign: 'center',
    marginRight: 10,
    textTransform: 'none',
    borderRadius: 4,
    whiteSpace: 'nowrap',
    boxShadow:
      '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
  },
  customTabLeft: {
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    '&.Mui-selected': {
      background: '#F2994A',
      color: '#FFFFFF',
      border: '1px solid #F2994A',
    },
  },
  customTabRight: {
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    '&.Mui-selected': {
      background: '#F2994A',
      color: '#FFFFFF',
      border: '1px solid #F2994A',
    },
  },
  customTabMiddle: {
    '&.Mui-selected': {
      background: '#F2994A',
      color: '#FFFFFF',
      border: '1px solid #F2994A',
    },
  },
  labelCheckbox: {
    whiteSpace: 'nowrap',
  },
}));

const INCLUDE_TAX = 0;
const NOT_INCLUDE_TAX = 1;
const ROUND_DOWN = 0;
const ROUND_UP = 1;
const ROUND_NORMAL = 2;

const PageSettingTax = (props) => {
  const classes = useStyles(props);
  const history = useHistory();

  // Local state
  const [shopData, setShopData] = useState({
    m_currency_id: 1,
    price_fraction_mode: ROUND_DOWN,
    total_amount_fraction_mode: 1,
    price_display_mode: INCLUDE_TAX,
    serve_charge_rate: '0.0',
    serve_charge_in_use: 0,
    m_currency: null,
    payment_method_ids: [],
    mCurrency: null,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [waiting, setWaiting] = useState(true);

  // shop context
  const [shop, setShopInfo] = useContext(ShopInfoContext);

  useEffect(() => {
    getShopData();
  }, [getShopData]);

  const getShopData = async () => {
    try {
      const paymentMethodsRes = await ShopApiService.getPaymentMethods(shop?.hashId);
      console.log(paymentMethodsRes);
      let shopDataInfo = await ShopApiService.getShopTaxInfo(shop?.hashId);
      console.log(paymentMethodsRes);
      shopDataInfo['serve_charge_rate'] = (
        parseFloat(shopDataInfo?.serve_charge_rate) * 100
      )?.toFixed(1);
      setShopData(shopDataInfo);
      setPaymentMethods(paymentMethodsRes);
      setWaiting(false);
    } catch (error) {
      setWaiting(false);
      if (error?.result?.errorCode === 'deactive_shop') {
        return;
      }
      showWarningMessage(error?.result?.errorMessage);
    }
  };

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  const showSuccessMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'success',
    });
  };

  const handleUpdateClick = async () => {
    let newShopDataClone = Utils.cloneDeep(shopData);
    newShopDataClone.serve_charge_rate = (
      parseFloat(newShopDataClone.serve_charge_rate) / 100
    ).toFixed(4);

    if (shopData?.serve_charge_in_use === 1 && parseFloat(shopData?.serve_charge_rate) == 0) {
      showWarningMessage('Vui lòng nhập phí dịch vụ');
      return;
    }

    // if (parseFloat(shopData?.serve_charge_rate) > 100) {
    //   showWarningMessage('Vui lòng nhập phí dịch vụ từ 100 trở xuống');
    //   return;
    // }

    if (shopData?.payment_method_ids.length === 0) {
      showWarningMessage('Vui lòng chọn một phương thức thanh toán');
      return;
    }

    try {
      await ShopApiService.postShopTaxInfo(shop?.hashId, newShopDataClone);
      showSuccessMessage('Cập nhật thành công');
      setIsSubmit(false);
    } catch (error) {
      showWarningMessage(error?.result[0]?.errorCode);
      setIsSubmit(false);
    }
  };

  const onChangeTabTax = (event, tabValue) => {
    let newShopDataClone = Utils.cloneDeep(shopData);
    newShopDataClone.price_display_mode = tabValue;
    setShopData(newShopDataClone);
  };

  const onChangeTabTaxRounding = (event, tabValue) => {
    let newShopDataClone = Utils.cloneDeep(shopData);
    newShopDataClone.price_fraction_mode = tabValue;
    setShopData(newShopDataClone);
  };

  const onChangeCheckBox = (event) => {
    let newShopDataClone = Utils.cloneDeep(shopData);
    let newPaymentMethodsClone = Utils.cloneDeep(paymentMethods);

    const { target } = event;
    const name = target.getAttribute('name');
    if (name === 'total_amount_fraction_mode') {
      target.checked ? (newShopDataClone[name] = 1) : (newShopDataClone[name] = 0);
    }

    if (name === 'serve_charge_in_use') {
      if (target.checked) {
        newShopDataClone[name] = 0;
        newShopDataClone.serve_charge_rate = '0.0';
      } else {
        newShopDataClone[name] = 1;
      }
    }

    if (name === 'payment_method_ids') {
      const value = parseInt(target.getAttribute('value'));
      newPaymentMethodsClone = newPaymentMethodsClone?.map((item) => {
        return { ...item, show: item.id == value ? !item.show : item.show };
      });
      if (shopData?.payment_method_ids?.includes(value)) {
        const dataFilterPaymentMethods = newShopDataClone?.payment_method_ids?.filter((item) => {
          return item != value;
        });
        newShopDataClone[name] = dataFilterPaymentMethods;
      } else {
        newShopDataClone?.payment_method_ids.push(value);
      }
    }
    setShopData(newShopDataClone);
  };

  const onChangeInput = (event) => {
    let newShopDataClone = Utils.cloneDeep(shopData);
    const { value } = event.target;
    newShopDataClone.serve_charge_rate = value;
    setShopData(newShopDataClone);
  };

  const handleOnKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode === CHARCODE_MINUS) {
      event.preventDefault();
    }
  };

  const handleOnKeyBlur = (event) => {
    let newShopDataClone = Utils.cloneDeep(shopData);
    const { value } = event.target;
    newShopDataClone.serve_charge_rate = Number(value).toFixed(1);
    setShopData(newShopDataClone);
  };

  return (
    <>
      <PageContainer padding='0px'>
        <HeaderAppBar title='Cài đặt thuế' />
        {!waiting ? (
          <PageInnerContainer padding='0px 0px 25px 0px'>
            <Box className={classes.container}>
              <Box>
                <Box className={classes.wrapContentRow}>
                  <Box className={classes.label}>Đơn vị tiền tệ</Box>
                  <Box className={classes.label}>
                    {`${shop?.m_country?.name} ${shop?.mShopPosSetting?.m_currency?.name} (${shop?.mShopPosSetting?.m_currency?.code})`}
                  </Box>
                </Box>
                <Box mt={2} className={classes.wrapContentRow}>
                  <Box className={classes.label}>Hiển thị số tiền</Box>
                  <Box flex={1} className={classes.wrapTabs}>
                    <Tabs
                      value={shopData?.price_display_mode}
                      onChange={onChangeTabTax}
                      aria-label='simple tabs example'
                      TabIndicatorProps={{ style: { display: 'none' } }}
                      name='tabs'
                    >
                      <Tab
                        label='Hiển thị cả tiền thuế'
                        id='show-tax'
                        value={INCLUDE_TAX}
                        className={`${classes.customTab} ${classes.customTabLeft}`}
                      />
                      <Tab
                        label='Không hiển thị tiền thuế'
                        id='hide-tax'
                        value={NOT_INCLUDE_TAX}
                        className={`${classes.customTab} ${classes.customTabRight}`}
                      />
                    </Tabs>
                  </Box>
                </Box>
                <Box mt={2} className={classes.wrapContentRow}>
                  <Box className={classes.label}>Làm tròn tiền thuế</Box>
                  <Box flex={1} className={classes.wrapTabs}>
                    <Tabs
                      value={shopData?.price_fraction_mode}
                      onChange={onChangeTabTaxRounding}
                      aria-label='simple tabs example'
                      TabIndicatorProps={{ style: { display: 'none' } }}
                    >
                      <Tab
                        label='Làm tròn xuống'
                        id='round-down'
                        value={ROUND_DOWN}
                        className={`${classes.customTab} ${classes.customTabLeft}`}
                      />
                      <Tab
                        label='Làm tròn lên'
                        id='round-up'
                        value={ROUND_UP}
                        className={`${classes.customTab} ${classes.customTabMiddle}`}
                      />
                      <Tab
                        label='Làm tròn số'
                        id='round-normal'
                        value={ROUND_NORMAL}
                        className={`${classes.customTab} ${classes.customTabRight}`}
                      />
                    </Tabs>
                    <Box className={classes.textHanldeTax}>
                      {/*商品価格の税額端数 (0.1~0.9{shop?.mShopPosSetting?.m_currency?.name}*/}
                      {/*)の処理方法*/}
                    </Box>
                  </Box>
                </Box>
                {/*<Box mt={2} className={classes.wrapContentRow}>*/}
                {/*  <Box className={classes.label}>合計額端数</Box>*/}
                {/*  <FormControlLabel*/}
                {/*    control={*/}
                {/*      <Checkbox*/}
                {/*        checked={shopData?.total_amount_fraction_mode === 1 ? true : false}*/}
                {/*        name='total_amount_fraction_mode'*/}
                {/*        value={shopData?.total_amount_fraction_mode}*/}
                {/*        color='default'*/}
                {/*      />*/}
                {/*    }*/}
                {/*    label={*/}
                {/*      <Box style={{ fontSize: 14 }}>*/}
                {/*        レシート合計の1~9{shop?.mShopPosSetting?.m_currency?.name}は切り捨てする*/}
                {/*      </Box>*/}
                {/*    }*/}
                {/*    onChange={(event) => onChangeCheckBox(event)}*/}
                {/*  />*/}
                {/*</Box>*/}
                <Box mt={2} className={classes.wrapContentRow}>
                  <Box className={classes.label}>Phí dịch vụ</Box>
                  <Box display={{ sm: 'flex' }}>
                    <Box
                      display='flex'
                      className={shopData?.serve_charge_in_use === 0 && 'background-gray'}
                      mr={2}
                    >
                      <OutlinedInput
                        id='service'
                        name='service'
                        type='number'
                        className={classes.input}
                        placeholder='0.0'
                        value={shopData?.serve_charge_rate}
                        labelWidth={0}
                        onChange={(e) => onChangeInput(e)}
                        onKeyPress={(e) => handleOnKeyPress(e)}
                        onBlur={(e) => handleOnKeyBlur(e)}
                        classes={{ input: classes.input }}
                        disabled={shopData.serve_charge_in_use === 0}
                      />
                      <Box mx={1} alignSelf='center'>
                        %
                      </Box>
                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={shopData?.serve_charge_in_use === 0 ? true : false}
                          name='serve_charge_in_use'
                          value={shopData?.serve_charge_in_use === 0 ? true : false}
                          color='default'
                        />
                      }
                      label={<Box className={classes.labelCheckbox}>Không sử dụng</Box>}
                      onChange={(event) => onChangeCheckBox(event)}
                    />
                  </Box>
                </Box>
                <Box mt={2} mb={4} className={classes.wrapContentRow}>
                  <Box className={classes.label}>Phương thức thanh toán</Box>
                  <Box>
                    <Grid container spacing={0}>
                      {paymentMethods &&
                        paymentMethods.map((item, key) => {
                          return (
                            <Grid item sm={6} key={key}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      shopData?.payment_method_ids?.includes(paymentMethods[key].id)
                                        ? true
                                        : false
                                    }
                                    color='default'
                                    name='payment_method_ids'
                                    value={item.id}
                                  />
                                }
                                label={
                                  <Box
                                    style={{
                                      fontWeight: 600,
                                      color:
                                        !shopData?.payment_method_ids?.includes(
                                          paymentMethods[key].id
                                        ) && '#828282',
                                    }}
                                  >
                                    {item.name}
                                  </Box>
                                }
                                onChange={(event) => onChangeCheckBox(event)}
                              />
                            </Grid>
                          );
                        })}
                    </Grid>
                  </Box>
                </Box>
              </Box>
              <Footer padding='20px 10px'>
                <Grid container justify='center' spacing={5}>
                  <Grid item>
                    <Button
                      onClick={() => history.push('/setting')}
                      className={`${classes.buttonController} + ' ' + ${classes.buttonBack}`}
                    >
                      Quay lại
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      onClick={handleUpdateClick}
                      className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                      disabled={isSubmit}
                    >
                      Lưu
                      {isSubmit ? (
                        <CircularProgress style={{ marginLeft: 10, width: 20, height: 20 }} />
                      ) : null}
                    </Button>
                  </Grid>
                </Grid>
              </Footer>
            </Box>

            <FlashMessage
              isOpen={toast.isShow}
              onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
              status={toast.status}
              message={toast.message}
            />
          </PageInnerContainer>
        ) : (
          <Waiting isOpen={waiting} />
        )}
      </PageContainer>
    </>
  );
};
PageSettingTax.propTypes = {};
export default PageSettingTax;
