/**
 * Page Pre Order
 */

// React
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';

// Library
import { cloneDeep } from 'lodash';

// Material UI component
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Component
import HeaderAppBar from './HeaderAppBar';
import PageInnerWrap from './PageInnerWrap';
import { getCookie } from 'js/utils/components/cookie/cookie.js';

// Component shared
import Button from '../../shared/components/Button';
import PageContainer from '../../shared/components/PageContainer';
import PageInnerContainer from '../../shared/components/PageInnerContainer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import ModalConfirmOrder from './ModalConfirmOrder';
import OrderFooter from '../../shared/components/OrderFooter';
import { onConnectWebSocket, onSendNotifyHasNewOrder } from '../../utils/helpers/socket';

// Utils
import { ORDER_TYPE } from 'js/utils/helpers/courseHelper';
import { setSuccessOrderMenu } from 'js/customer-order/utils/ordermenu';

// Style
const useStyles = makeStyles({
  orderItem: {
    padding: '12px 6px 6px',
    marginBottom: '3px',
    backgroundColor: '#F2F2F2',
    fontWeight: 600,
  },
  customButton: {
    minWidth: '24px',
    height: '24px',
    border: 0,
    lineHeight: '27px',
    boxShadow: 'rgba(0, 0, 0, 0.3) 1px 1px 1px 0px',
    fontWeight: 600,
  },
});

const ORDERGROUP_STATUS = {
  PRE_ORDER: 0,
  ORDERING: 1,
  REQUEST_CHECKOUT: 2,
  WAITING_CHECKOUT: 3,
  CHECKED_OUT: 4,
  CANCEL: 9,
};

const PagePreOrder = () => {
  const classes = useStyles();
  const history = useHistory();
  const { shop_hash_id } = useParams();
  const [orderList, setOrderList] = useState([]);

  const ordergroup_hash_id = localStorage.getItem('ordergroupHash');
  const keyStoragePreOrderList = `${shop_hash_id}:${ordergroup_hash_id}:preOrderList`;
  const [courseHashId, setCourseHashId] = useState();
  const [isShowConfirmOrder, setIsShowConfirmOrder] = useState(false);
  const [priceDisplayMode, setPriceDisplayMode] = useState();
  const [currencyName, setCurrencyName] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  // get cookie user hash id
  const userHashId = getCookie('userHashId') || '';

  const getTotal = () => {
    let total = 0;

    orderList.forEach((item) => {
      total += item.quantity;
    });

    return total;
  };

  useEffect(() => {
    getInfoOfOrdergroup();
    getShopTaxInfo();
  }, []);

  // Connect to endpoint API Gateway
  useEffect(() => {
    onConnectWebSocket(shop_hash_id);
  }, []);

  const getShopTaxInfo = async () => {
    try {
      const response = await CustomerOrderApiService.getShopTaxInfo(shop_hash_id);
      setPriceDisplayMode(response?.price_display_mode);
      setCurrencyName(response?.mCurrency?.name)
    } catch (error) {
      history.push('/thanks-for-customer');
    }
  };

  const handleDecrement = (index) => {
    const newOrderList = cloneDeep(orderList);

    if (newOrderList[index].quantity === 1) {
      newOrderList.splice(index, 1);
      localStorage.setItem(keyStoragePreOrderList, JSON.stringify(newOrderList));
      return setOrderList(newOrderList);
    }

    newOrderList[index].quantity -= 1;
    setOrderList(newOrderList);
    localStorage.setItem(keyStoragePreOrderList, JSON.stringify(newOrderList));
  };

  const handleIncrement = (index) => {
    const newOrderList = cloneDeep(orderList);
    newOrderList[index].quantity += 1;
    setOrderList(newOrderList);
    localStorage.setItem(keyStoragePreOrderList, JSON.stringify(newOrderList));
  };

  const goToOrder = () => {
    setIsSubmitLoading(true);
    const cloneOrderList = orderList.map((item) => {
      return {
        ...item,
        user_hash_id: userHashId || '',
        course_hash_id: courseHashId || '',
      };
    });
    const param_data = {
      orders: cloneOrderList,
    };
    CustomerOrderApiService.createOrder(shop_hash_id, ordergroup_hash_id, param_data)
      .then(() => {
        localStorage.setItem(keyStoragePreOrderList, JSON.stringify([]));
        setSuccessOrderMenu();
        history.push('/' + shop_hash_id);
        // Push notification for shop update realtime data
        onSendNotifyHasNewOrder(shop_hash_id);
        setIsSubmitLoading(false);
      })
      .catch(() => {
        history.push('/' + shop_hash_id + '/thanks-for-customer');
        setIsSubmitLoading(false);
      });
  };

  const getInfoOfOrdergroup = async () => {
    try {
      const response = await CustomerOrderApiService.getStatusOrdergroup(
        shop_hash_id,
        ordergroup_hash_id
      );
      if (response?.course_hash_id) {
        setCourseHashId(response.course_hash_id);
      }
      // Check status order: when request check-out => remove list pre order
      let preOrderList = JSON.parse(localStorage.getItem(keyStoragePreOrderList));
      let statusOrder = response?.status || 0;
      if (
        preOrderList &&
        preOrderList.length > 0 &&
        statusOrder < ORDERGROUP_STATUS.REQUEST_CHECKOUT
      ) {
        setOrderList(preOrderList);
      } else {
        localStorage.setItem(keyStoragePreOrderList, JSON.stringify([]));
      }
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  const backToMenu = () => {
    history.push('/' + shop_hash_id);
  };
  
  const hanldeShowTaxNotIncluded = (value) => {
    if (priceDisplayMode === 1 &&  value.price > 0) {
      return '(税抜き)';
    }
  };

  return (
    <PageContainer padding='0' height='auto' minHeight='auto'>
      <HeaderAppBar title='未注文リスト' />
      <PageInnerWrap height='auto'>
        <PageInnerContainer padding='0px 0px 60px 0px'>
          {orderList &&
            orderList.map((item, index) => (
              <Box key={index} className={classes.orderItem} display='flex'>
                <Box flex='1' display='flex' flexDirection='column' justifyContent='space-between'>
                  <Box>{item.name}</Box>
                  <Box display='flex' justifyContent='flex-end' alignItems='center'>
                    <Box fontSize={21}>
                      {priceDisplayMode === 1
                        ? item.current_price.price_unit_without_tax
                        : item.price}
                    </Box>
                    {currencyName}<Box ml={1}>{hanldeShowTaxNotIncluded(item)}</Box>
                  </Box>
                </Box>
                <Box
                  px={1}
                  flex='0 0 140px'
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Button
                    padding='0'
                    borderRadius='50%'
                    bgcolor='#E4E1B0'
                    fgcolor='#000000'
                    classes={{
                      root: classes.customButton,
                    }}
                    onClick={() => handleDecrement(index)}
                  >
                    ー
                  </Button>
                  <Box
                    display='flex'
                    alignItems='flex-end'
                    fontSize={36}
                    fontWeight='fontWeightBold'
                  >
                    {item.quantity}
                    <Box fontSize={13} fontWeight='fontWeightRegular'>
                      個
                    </Box>
                  </Box>
                  <Button
                    padding='0'
                    borderRadius='50%'
                    bgcolor='#F2994B'
                    fgcolor='#ffffff'
                    classes={{
                      root: classes.customButton,
                    }}
                    onClick={() => handleIncrement(index)}
                  >
                    ＋
                  </Button>
                </Box>
              </Box>
            ))}

          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />
        </PageInnerContainer>

        {/* Footer: button back and button order */}
        <OrderFooter
          bgColor='#FFA04B'
          padding='6px'
          lengthOfPreOrderList={orderList.length}
          numberOfOrders={getTotal()}
          buttonBack={() => backToMenu()}
          buttonOrder={() => setIsShowConfirmOrder(true)}
        />

        {/* Modal confirm order */}
        <ModalConfirmOrder
          open={isShowConfirmOrder}
          orders={orderList}
          onClose={() => setIsShowConfirmOrder(false)}
          onSubmit={() => goToOrder()}
          isSubmitLoading={isSubmitLoading}
        />
        {/* END Modal confirm order */}
      </PageInnerWrap>
    </PageContainer>
  );
};

export default PagePreOrder;
