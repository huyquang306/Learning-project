import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, makeStyles, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import PubSub from 'pubsub-js';

// Material ui
import CheckIcon from '@material-ui/icons/Check';
import BackspaceIcon from '@material-ui/icons/Backspace';

// Components
import Button from 'js/shared-order/components/Button';

// Services
import ShopApiService from 'js/shop/shop-api-service';
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import PageTableListContext, { formatAmount } from './PageTableListContext';

// Utils
import Utils from 'js/shared/utils';
import { CURRENCY_UNIT } from 'js/utils/helpers/const';

const KEY_UPDATE_CHECKED_OUT_ORDERGROUP = 'publishKeyFreshCheckedOutOrdergroup';
const ORDER_GROUP_SHOW_ENDED_TIME = 'orderGroupHadShowEndTime';

const useStyles = makeStyles(() => ({
  numberPickerBox: {
    '& .checked': {
      backgroundColor: '#ffa04b',
      color: '#fff',
    },
    '& .MuiInputBase-input': {
      textAlign: 'right',
    },
    '& .paymentMethods .MuiSvgIcon-root': {
      fill: '#FFF',
    },
    '& .paymentMethods button': {
      boxShadow:
        '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
      fontWeight: 600,
      '@media (max-width: 750px)': {
        padding: '2px 0',
        margin: '0px 5px',
      },
    },
    '& .paymentMethods button .MuiButton-label': {
      transform: 'translateX(-12px)',
      fontSize: 17,
      whiteSpace: 'nowrap',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#000',
    },
    '& .paymentMethods': {
      '@media (max-width: 750px)': {
        display: 'flex',
        flexDirection: 'column',
      },
      '@media (max-width: 600px)': {
        display: 'flex',
        flexDirection: 'row',
      },
    },
  },
  numberButton: {
    background: 'white',
    margin: 5,
    color: 'black',
    padding: 10,
    width: 110,
    height: 65,
    fontSize: 20,
    fontWeight: 'bold',
    '&:hover': {
      background: 'white',
    },
    '@media (max-width: 750px)': {
      width: 80,
      height: 50,
    },
  },
  numberButtonColumn: {
    background: 'white',
    margin: '5px 0',
    color: 'black',
    padding: 10,
    width: 100,
    height: 60 * 2 + 30,
    fontSize: 20,
    fontWeight: 'bold',
    '&:hover': {
      background: 'white',
    },
  },
  largeNumber: {
    '@media (max-width: 750px)': {
      fontSize: 16,
    },
  },
  rowNumberRight: {
    padding: '10px 0',
  },
  mainBox: {},
  titleNumberModal: {
    background: '#cccccc',
    padding: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  boxButton: {
    background: '#DBEAF5',
    padding: 20,
  },
  numberModal: {
    padding: 20,
    fontSize: 18,
    height: 50,
  },
  noPaddingContent: {
    padding: 0,
    marginBottom: 18,
  },
  rootDialogAction: {
    display: 'flex',
    justifyContent: 'space-between',
    background: '#DBEAF5',
    padding: 20,
  },
  inputNumberPicker: {
    marginLeft: 15,
    '@media (max-width: 600px)': {
      marginTop: '0px !important',
      marginBottom: 4,
    },
    '@media (max-width: 750px)': {
      marginLeft: 5,
      marginTop: 15,
    },
    '& .MuiOutlinedInput-root': {
      color: '#000 !important',
      fontWeight: 600,
    },
    '& .MuiInputBase-input': {
      padding: '10px 4px',
      fontSize: 30,
      '@media (max-width: 750px)': {
        padding: '4px 4px',
      },
    },
    '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      display: 'none',
    },
  },
  changeMoney: {
    borderTop: '2px solid rgba(224, 224, 224, 1)',
    paddingTop: 8,
    fontSize: 24,
    fontWeight: 600,
    marginTop: 32,
  },
  activeBackground: {
    backgroundColor: '#FFF7E2 !important'
  },
}));

const NumberPicker = (props) => {
  const classes = useStyles({
    position: props.position,
  });
  const shopInfo = props.shop;
  const currencyName = shopInfo?.mShopPosSetting?.m_currency?.name;
  const currencyCode = shopInfo?.mShopPosSetting?.m_currency?.code;

  // Context
  const { setWaiting, state, setToast, dispatch } = useContext(PageTableListContext);

  const wrapperRef = useRef(null);
  const inputNumberRef = useRef(null);

  // Local state
  const [infoPayment] = useState({
    totalServeFee: Number(props?.infoPayment?.totalServeFee?.toString().replace(/,/g, '')),
    totalTaxFee: Number(props?.infoPayment?.totalTaxFee?.toString().replace(/,/g, '')),
    totalAmount: Number(props?.infoPayment?.totalAmount?.toString().replace(/,/g, '')),
    totalTax: Number(props?.infoPayment?.totalTax?.toString().replace(/,/g, '')),
    serve_charge_rate: props?.infoPayment?.serve_charge_rate,
  });
  const [paymentRequest, setPaymentRequest] = useState({
    count: 0,
    t_payment: {
      t_payment_methods: [],
      change_value: 0,
    },
    total_billing: 0,
    serve_charge_price: infoPayment?.totalServeFee,
    serve_charge_tax_value: infoPayment?.totalTaxFee,
    serve_charge_tax_rate: infoPayment?.serve_charge_rate,
  });
  const [numberInputCalc, setNumberInputCalc] = useState([]);
  const [inputActiveIndex, setInputActiveIndex] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [paymentMethodsActive, setPaymentMethodsActive] = useState([{}, {}, {}, {}]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonFlag, setButtonFlag] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInfoPaymentMethods();
  }, []);

  useEffect(() => {
    if (props.submited) {
      handlePaymentRequestClick();
    }
  }, [props.submited]);

  const getTotalAmountRounded = (value) => {
    let res = 0;
    const lengthOfValue = value.toString().replace(/,/g, '').length - 1;
    const numberConverted = Number(value.toString().replace(/,/g, ''));
    if (numberConverted % Math.pow(10, lengthOfValue) === 0) {
      if (numberConverted < 10) {
        res = numberConverted + 1;
      } else {
        res = numberConverted;
      }
    } else {
      res =
        Math.floor(numberConverted / Math.pow(10, lengthOfValue) + 1) * Math.pow(10, lengthOfValue);
    }

    return res;
  };

  const getNearestBillUnit = (value) => {
    if (value > Math.max(...CURRENCY_UNIT)) {
      return Math.max(...CURRENCY_UNIT);
    } else {
      const filterValue = CURRENCY_UNIT.includes(getTotalAmountRounded(value))
        ? getTotalAmountRounded(value)
        : value;
      return filterValue === Math.max(...CURRENCY_UNIT)
        ? filterValue
        : CURRENCY_UNIT.filter((item) => item > filterValue)[0];
    }
  };

  const ops = [
    [
      `${currencyCode}${formatAmount(getTotalAmountRounded(infoPayment?.totalAmount))}`,
      `${currencyCode}${formatAmount(getNearestBillUnit(infoPayment?.totalAmount))}`,
      `${currencyCode}${formatAmount(infoPayment?.totalAmount)}`,
    ],
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '00', <BackspaceIcon key='backspace' />],
  ];

  const getInfoPaymentMethods = async () => {
    const paymentRequestClone = Utils.cloneDeep(paymentRequest);
    let paymentMethodsActiveClone = Utils.cloneDeep(paymentMethodsActive);
    const shopDataInfo = await ShopApiService.getShopTaxInfo(shopInfo?.hashId);

    ShopApiService.getPaymentMethods(shopInfo?.hashId)
      .then((result) => {
        const paymentMethodsMatch = result?.filter((item, key) =>
          shopDataInfo?.payment_method_ids?.includes(result[key].id)
        );
        paymentMethodsActiveClone[inputActiveIndex] = paymentMethodsMatch[inputActiveIndex];
        paymentRequestClone['t_payment']['tax_value'] = infoPayment?.totalTax;
        setPaymentRequest(paymentRequestClone);
        setPaymentMethods(paymentMethodsMatch);
        setPaymentMethodsActive(paymentMethodsActiveClone);
        setButtonDisabled(false);
      })
      .catch(() => {
        console.error('Modal payment: getPaymentMethods error')
      }).finally(() => {
        setLoading(false);
      });
  };

  const handleCalculatorAmount = (data, paymentMethodsActiveClone = null) => {
    const paymentRequestClone = Utils.cloneDeep(paymentRequest);
    const paymentMethodsClone = Utils.cloneDeep(paymentMethods);
    paymentMethodsActiveClone = paymentMethodsActiveClone
      ? paymentMethodsActiveClone
      : Utils.cloneDeep(paymentMethodsActive);

    const totalBilling = data?.reduce((total, item) => Number(total) + Number(item));
    const totalChangeMoney = totalBilling - infoPayment?.totalAmount;

    if (totalChangeMoney >= 0) {
      props.handleButtonDisabled(false);
    } else {
      props.handleButtonDisabled(true);
    }
    paymentRequestClone['t_payment']['change_value'] = totalChangeMoney >= 0 ? totalChangeMoney : 0;
    paymentRequestClone['total_billing'] = infoPayment?.totalAmount;
    // Map data to payment methods
    if (paymentMethodsClone) {
      paymentMethodsClone.forEach((paymentMethodTmp, paymentMethodTmpIndex) => {
        if (data[paymentMethodTmpIndex]) {
          paymentMethodsClone[paymentMethodTmpIndex].value = data[paymentMethodTmpIndex];
        }
      });
    }
    paymentRequestClone['t_payment']['total_amount_value'] = infoPayment?.totalAmount;
    paymentRequestClone['t_payment']['total_amount_received'] = totalBilling;

    // Mapping payment method active
    paymentRequestClone.t_payment.t_payment_methods = paymentMethodsClone?.filter(paymentMethodTmp => {
      const pmActive = paymentMethodsActiveClone.find(
        pmActiveTmp => pmActiveTmp?.id && pmActiveTmp.id === paymentMethodTmp.id
      );

      return paymentMethodTmp?.id && pmActive && paymentMethodTmp?.value;
    })?.map(paymentMethodTmp => {
      return { ...paymentMethodTmp, m_payment_method_id: paymentMethodTmp.id };
    });
    setPaymentRequest(paymentRequestClone);
  };

  const changeNumber = (digit, rowIndex) => {
    let numberInputCalcClone = Utils.cloneDeep(numberInputCalc);

    if (typeof digit != 'string') {
      numberInputCalcClone[inputActiveIndex] = 0;
    } else {
      let number = null;

      // Case: row index = 0, first row
      if (rowIndex === 0) {
        number = digit;
        setButtonFlag(true);
      } else if (digit !== '000' && digit !== '0000') {
        if (buttonFlag === true) {
          number = digit;
        } else {
          number =
            Number(numberInputCalcClone[inputActiveIndex]) != 0
              ? numberInputCalcClone[inputActiveIndex] + digit
              : digit;
        }
        setButtonFlag(false);
      } else {
        if (numberInputCalcClone[inputActiveIndex] === 0) {
          return;
        } else {
          number = numberInputCalcClone[inputActiveIndex] + digit;
        }
      }
      numberInputCalcClone[inputActiveIndex] = number
        .replace(/[^0-9.]/g, '')
        .replace('.', 'x')
        .replace(/\./g, '')
        .replace('x', '.');
    }
    setNumberInputCalc(numberInputCalcClone);
    handleCalculatorAmount(numberInputCalcClone);
  };

  const handleClickButtonPaymentMethod = (item, key) => {
    let paymentMethodsActiveClone = Utils.cloneDeep(paymentMethodsActive);
    const numberInputCalcClone = Utils.cloneDeep(numberInputCalc);
    const filter = paymentMethodsActive?.filter((_item) => _item?.id === item?.id);

    if (filter.length === 0) {
      // Case: active payment method
      paymentMethodsActiveClone[key] = item;
      setPaymentMethodsActive(paymentMethodsActiveClone);
    } else {
      // Case: deactive payment method
      paymentMethodsActiveClone[key] = {};
      numberInputCalcClone[key] = 0;
      setNumberInputCalc(numberInputCalcClone);
      setPaymentMethodsActive(paymentMethodsActiveClone);
    }

    // Check active number buttons
    setInputActiveIndex(key);
    paymentMethodsActiveClone[key]?.id ? setButtonDisabled(false) : setButtonDisabled(true);
    if (numberInputCalcClone.length) {
      handleCalculatorAmount(numberInputCalcClone, paymentMethodsActiveClone);
    }
  };

  const handlePaymentRequestClick = async () => {
    setWaiting(true);
    let paymentRequestClone = Utils.cloneDeep(paymentRequest);
    paymentRequestClone.count = state.ordergroup.orders.length;
    try {
      await ShopOrderApiService.payment(
        shopInfo?.hashId,
        state.ordergroup.hash_id,
        paymentRequestClone
      );
      dispatch({
        type: 'UPDATE',
        payload: {
          ordergroup: {
            tables: [],
            orders: [],
            number_of_customers: '?',
            code_tables: '?',
          },
          table: { hash_id: '' },
          totalAmount: 0,
          refresh: true,
          screenName: '',
          refreshAt: '',
          tableGroupName: { firstId: '' },
        },
      });
      PubSub.publish(KEY_UPDATE_CHECKED_OUT_ORDERGROUP, state.ordergroup);
      setToast({ isShow: true, status: 'success', message: 'Thanh toán thành công!' });
      // Remove course had show end time
      let orderGroupsShowEndedTime =
        JSON.parse(localStorage.getItem(ORDER_GROUP_SHOW_ENDED_TIME)) || [];
      const index = orderGroupsShowEndedTime.indexOf(state.ordergroup.hash_id);
      if (index > -1) {
        orderGroupsShowEndedTime.splice(index, 1);
        localStorage.setItem(ORDER_GROUP_SHOW_ENDED_TIME, JSON.stringify(orderGroupsShowEndedTime));
      }
      setWaiting(false);
      props.closeModalPayment();
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
      setWaiting(false);
    }
  };

  const itemButton = (digit, rowIndex) => {
    if (!props.isFloat && digit === '.') return null;

    return (
      <Button
        key={digit}
        variant='contained'
        className={`${classes.numberButton} ${digit?.length > 6 ? classes.largeNumber : ''}`}
        onClick={() => changeNumber(digit, rowIndex)}
        disabled={buttonDisabled}
      >
        {digit}
      </Button>
    );
  };

  const renderButton = () => ops.map((item, rowIndex) => (
      <Box key={rowIndex}>
        {item.map((digit, columnIndex) => (
          <React.Fragment key={columnIndex}>{itemButton(digit, rowIndex)}</React.Fragment>
        ))}
      </Box>
    )
  );

  const renderPaymentMethods = () => {
    return paymentMethods?.map((item, key) => {
      return (
        <Box
          width='100%'
          className='paymentMethods'
          key={key}
          display={{ xs: 'flex' }}
          flexDirection={{ xs: 'row' }}
          justifyContent='center'
          mt={2}
        >
          <Box className='wrap-button-payment'>
            <Button
              bgcolor={'#FFF'}
              fgcolor={'#FFA04B'}
              variant='outlined'
              borderColor='#FFA04B'
              padding='10px 0px'
              width='130px'
              margin='0px 0px'
              customClass={item.id === paymentMethodsActive[key].id ? 'checked' : null}
              onClick={() => handleClickButtonPaymentMethod(item, key)}
            >
              <CheckIcon />
              {item?.name}
            </Button>
          </Box>

          <Box key={key}>
            <TextField
              ref={inputNumberRef}
              fullWidth
              onClick={() => {
                setInputActiveIndex(key);
                paymentMethodsActive[key]?.id ? setButtonDisabled(false) : setButtonDisabled(true);
              }}
              className={classes.inputNumberPicker}
              required
              value={!isNaN(numberInputCalc[key]) ? formatAmount(Number(numberInputCalc[key])) : 0}
              variant='outlined'
              name={props.name}
              disabled={true}
              InputProps={{
                endAdornment: currencyName,
                inputMode: 'none',
                className: `${(inputActiveIndex === key && !buttonDisabled) && classes.activeBackground}`,
              }}
            />
          </Box>
        </Box>
      );
    });
  };

  return (
    <Box ref={wrapperRef}>
      <Box className={classes.numberPickerBox}>
        <Box classes={{ root: classes.noPaddingContent }}>
          <Box px={1}>
            <Box
              display={{ sm: 'flex' }}
              mt={{ xs: 1, sm: 3 }}
              mb={{ xs: 0.5, sm: 3 }}
              justifyContent='space-around'
            >
              <Box width={{ sm: '40%', md: '55%' }}>
                {loading === false && (
                  <Box>
                    {renderPaymentMethods()}
                    <Box
                      width='100%'
                      display='flex'
                      justifyContent={'space-between'}
                      className={classes.changeMoney}
                    >
                      <Box>Trả lại</Box>
                      <Box>
                        {formatAmount(paymentRequest?.t_payment?.change_value)}
                        {currencyName}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>

              <Box ml={{ xs: 4, sm: 0 }} alignSelf='center'>
                {renderButton()}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

NumberPicker.propTypes = {
  shop: PropTypes.object,
  label: PropTypes.string,
  isFloat: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  error: PropTypes.bool,
  helperText: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  setValue: PropTypes.func,
  setError: PropTypes.func,
  onChange: PropTypes.func,
  position: PropTypes.oneOf(['bottom-left', 'bottom-right', 'top-left', 'top-right', 'center']),
  inputRef: PropTypes.node,
  onGetBoundingInputLeft: PropTypes.func,
  isThousandUnit: PropTypes.bool,
  infoPayment: PropTypes.object,
  closeModalPayment: PropTypes.func,
  handleButtonDisabled: PropTypes.func,
  submited: PropTypes.bool,
};

NumberPicker.defaultProps = {
  shop: {},
  label: '',
  isFloat: false,
  value: 0,
  error: false,
  disabled: false,
  helperText: '',
  name: 'number-picker',
  onChange: () => {},
  setValue: () => {},
  setError: () => {},
  position: 'bottom-right',
  inputRef: null,
  onGetBoundingInputLeft: () => {},
  isThousandUnit: true,
  infoPayment: {},
  closeModalPayment: () => {},
  handleButtonDisabled: () => {},
  submited: false,
};

export default NumberPicker;
