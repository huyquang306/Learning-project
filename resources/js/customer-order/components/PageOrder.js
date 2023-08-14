/**
 * Page Order
 */

// React
import React, { useState, Fragment, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';

// Material UI component
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

// Component
import HeaderAppBar from './HeaderAppBar';
import PageInnerWrap from './PageInnerWrap';
import Footer from './Footer';
import Modal from './Modal';

// Component shared
import Button from '../../shared/components/Button';
import PageContainer from '../../shared/components/PageContainer';
import PageInnerContainer from '../../shared/components/PageInnerContainer';
import Dialog from 'js/shared-order/components/Dialog';
import FlashMessage from 'js/shared-order/components/FlashMessage';

// Utils
import { ORDER_TYPE, ORDER_GROUP_STATUS, ORDER_STATUS } from 'js/utils/helpers/courseHelper';
import Utils from 'js/shared/utils';
import { onSendNotifyCustomerRequestCheckout, onConnectWebSocket } from 'js/utils/helpers/socket';

// Library
import moment from 'moment';
import {formatPrice} from "../../utils/helpers/number";
moment.locale('vi');

// Style
const useStyles = makeStyles({
  btnFooter: {
    fontWeight: 600,
    padding: '8px 20px',
    width: '145px',
    margin: '3px',
    '& a': {
      color: 'rgb(255, 160, 75)',
      'text-decoration': 'none',
    },
  },
  table: {
    boxShadow: 'none',
  },
  orderInfoCommon: {
    marginLeft: '15px',
    padding: '2px',
    '& span': {
      fontSize: '20px',
      fontWeight: 'bold',
    },
  },
  cancelOrder: {
    display: 'unset',
    color: 'red',
    marginLeft: '-10px',
  },
});

const StyledTableCell = withStyles(() => ({
  head: {
    fontSize: '16px',
    borderColor: '#FFA04B',
  },
  body: {
    border: 0,
    padding: '8px',
  },
}))(TableCell);

const PageOrder = () => {
  const [showDialog, setShowDialog] = useState(false);
  const classes = useStyles();
  const history = useHistory();

  // local state
  const [orderList, setOrderList] = useState([]);
  const [tableName, setTableName] = useState('');
  const { shop_hash_id } = useParams();
  const ordergroup_hash_id = localStorage.getItem('ordergroupHash');
  const [courseHashId, setCourseHashId] = useState();
  const [numberOfCustomer, setNumberOfCustomer] = useState();
  const [extendCourseFlag, setExtendCourseFlag] = useState();
  const [courseInfo, setCourseInfo] = useState([]);
  const [statusOrder, setStatusOrder] = useState();
  const [invoiceCode, setInvoiceCode] = useState();
  const [isShowModal, setIsShowModal] = useState(false);
  const [priceDisplayMode, setPriceDisplayMode] = useState();
  const [currencyName, setCurrencyName] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  const getTotalPrice = () => {
    let total = 0;
    const keyname = priceDisplayMode === 1 ? 'price_unit_without_tax' : 'price_unit_with_tax';

    if (orderList.length > 0) {
      console.log(orderList);
      total = orderList
        .filter((item) => item.status !== ORDER_STATUS.STATUS_CANCEL)
        .reduce((subtotal, item) =>
          item?.is_menu_in_course ? subtotal : (subtotal + item.current_price[keyname] * item.quantity), 0);
    }

    return total;
  };

  useEffect(() => {
    CustomerOrderApiService.getOrderList(shop_hash_id, ordergroup_hash_id)
      .then((response) => {
        setOrderList(response.orders);
        setTableName(response.code_tables);

      })
      .catch(() => {
        history.push('/' + shop_hash_id + '/thanks-for-customer');
      });
    // Get info course
    getInfoOfOrdergroup();
    //Get shop tax info
    getShopTaxInfo();
  }, []);

  useEffect(() => {
    if (courseHashId) {
      getCourseInfo();
    }
  }, [courseHashId, extendCourseFlag]);

  const getShopTaxInfo = async () => {
    try {
      const response = await CustomerOrderApiService.getShopTaxInfo(shop_hash_id);
      setPriceDisplayMode(response?.price_display_mode);
      setCurrencyName(response?.mCurrency?.name)
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const getInfoOfOrdergroup = async () => {
    try {
      const response = await CustomerOrderApiService.getStatusOrdergroup(
        shop_hash_id,
        ordergroup_hash_id
      );
      if (response) {
        setNumberOfCustomer(response.number_of_customers);
        setExtendCourseFlag(response.extend_course_flag);
        setStatusOrder(response.status);
        setInvoiceCode(response.invoice_code);
        const orderHasMainCourse = Array.isArray(response?.orders)
          ? response.orders?.find(
              (order) =>
                !Utils.isEmpty(order.m_course) &&
                order.order_type == ORDER_TYPE.ORDER_COURSE &&
                order.status !== ORDER_STATUS.STATUS_CANCEL
            )
          : [];
        if (!Utils.isEmpty(orderHasMainCourse)) {
          setCourseHashId(response?.course_hash_id);
        }
      }
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const getCourseInfo = async () => {
    try {
      const response = await CustomerOrderApiService.getDetailCourse(shop_hash_id, courseHashId);
      if (response) {
        setCourseInfo(response);
      }
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const goToCheckout = () => {
    setIsSubmitLoading(true);
    CustomerOrderApiService.payRequest(shop_hash_id, ordergroup_hash_id)
      .then(() => {
        onSendNotifyCustomerRequestCheckout(shop_hash_id);
        history.push('/' + shop_hash_id + '/billing');
        setIsSubmitLoading(false);
      })
      .catch(() => {
        history.push('/' + shop_hash_id + '/thanks-for-customer');
        setIsSubmitLoading(false);
      });
  };

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  const getOrderCourse = () =>
    orderList.find((order) => order.order_type === ORDER_TYPE.ORDER_COURSE);

  const hanldeShowTaxNotIncluded = (value) => {
    if (priceDisplayMode === 1) {
      if (!value.price <= 0)
        return '(Miễn thuế)';
    }
  };

  return (
    <PageContainer padding='0' height='auto' minHeight='auto'>
      <HeaderAppBar title='Các món đã gọi' />
      <PageInnerWrap height='auto'>
        <PageInnerContainer padding='0px 0px 80px 0px'>
          <Box p={1}>
            <Fragment>
              {tableName && <Box className={classes.orderInfoCommon}>Bàn: {tableName}</Box>}
              {numberOfCustomer && (
                <Box className={classes.orderInfoCommon}>Số người: {numberOfCustomer}</Box>
              )}
              {invoiceCode && (
                <Box className={classes.orderInfoCommon}>Mã HĐ: {invoiceCode}</Box>
              )}
              <Box className={classes.orderInfoCommon}>
                Tổng tiền: <span>{ getTotalPrice().toLocaleString('en-US') }</span> {currencyName}
                {/*{(priceDisplayMode === 1 && getTotalPrice() > 0)&& '(Miễn thuế)'}*/}
              </Box>
              {courseHashId && courseInfo && getOrderCourse() && (
                <Fragment>
                  <Box className={classes.orderInfoCommon}>Tên: {courseInfo.name}</Box>
                  <Box className={classes.orderInfoCommon}>
                    Thời gian set ăn: {courseInfo.time_block_unit}phút
                  </Box>
                  <Box className={classes.orderInfoCommon}>
                    Thời gian bắt đầu:
                    {moment(getOrderCourse().ordered_at).format('HH:mm DD/MM/YYYY')}
                  </Box>
                </Fragment>
              )}
            </Fragment>

            <TableContainer
              className={classes.table}
              component={Paper}
              style={{ marginTop: '15px' }}
            >
              <Table aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align='center'>Món</StyledTableCell>
                    <StyledTableCell align='right'>Đơn giá</StyledTableCell>
                    <StyledTableCell align='right'>Số lượng</StyledTableCell>
                    <StyledTableCell align='right'>Giá</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderList.map((item, index) => (
                    <Fragment key={index + 1}>
                      {/*<TableRow>*/}
                      {/*  {item.status === 2 ? (*/}
                      {/*    <StyledTableCell component='th' scope='row' colSpan={4}>*/}
                      {/*      ・<span className={classes.cancelOrder}>【Hủy】</span>*/}
                      {/*      {item.name}*/}
                      {/*    </StyledTableCell>*/}
                      {/*  ) : (*/}
                      {/*    <StyledTableCell component='th' scope='row' colSpan={4}>*/}
                      {/*      ・{item.name}*/}
                      {/*    </StyledTableCell>*/}
                      {/*  )}*/}
                      {/*</TableRow>*/}
                      <TableRow>
                        <>
                        {item.status === 2 ? (
                          <StyledTableCell>
                            ・<span className={classes.cancelOrder}>【Hủy】</span>
                            {item.name}
                          </StyledTableCell>
                        ) : (
                          <StyledTableCell>
                            ・{item.name}
                          </StyledTableCell>
                        )}
                        </>
                        {/*<StyledTableCell component='th' scope='row' />*/}
                        <StyledTableCell align='right'>
                          <Box display='flex' justifyContent='flex-end' alignItems='baseline'>
                            {/*{priceDisplayMode === 1*/}
                            {/*  ? item.current_price.price_unit_without_tax*/}
                            {/*  : item.price}*/}
                            { formatPrice(item.price) }
                            <Box fontSize={10}>{currencyName}
                              {/*{hanldeShowTaxNotIncluded(item)}*/}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <Box display='flex' justifyContent='flex-end' alignItems='baseline'>
                            {item.quantity}
                            <Box fontSize={10}></Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <Box display='flex' justifyContent='flex-end' alignItems='baseline'>
                            {/*{(item.status !== ORDER_STATUS.STATUS_CANCEL ? (priceDisplayMode === 1*/}
                            {/*  ? item.current_price.price_unit_without_tax*/}
                            {/*  : item.price) * item?.quantity : '0')}*/}
                            {(item.status !== ORDER_STATUS.STATUS_CANCEL ?
                              formatPrice(item.price * item?.quantity): '0')}
                            <Box fontSize={10}>{currencyName}</Box>
                          </Box>
                        </StyledTableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />
        </PageInnerContainer>

        <Footer bgColor='#FFA04B' padding='6px'>
          <Box display='flex' alignItems='center' justifyContent='space-between'>
            <Button
              bgcolor='#ffffff'
              fgcolor='#333333'
              classes={{
                root: classes.btnFooter,
              }}
              style={{
                borderStyle: 'none',
              }}
            >
              <Link to={`/${shop_hash_id}`}>Quay lại</Link>
            </Button>
            <Box>
              {statusOrder &&
              (statusOrder == ORDER_GROUP_STATUS.REQUEST_CHECKOUT ||
                statusOrder == ORDER_GROUP_STATUS.WAITING_CHECKOUT) ? (
                <Button
                  bgcolor='#ffffff'
                  fgcolor='#333333'
                  classes={{
                    root: classes.btnFooter,
                  }}
                  style={{
                    borderStyle: 'none',
                  }}
                  onClick={() => setIsShowModal(true)}
                >
                  Thanh toán
                </Button>
              ) : (
                <Button
                  bgcolor='#ffffff'
                  fgcolor='#333333'
                  classes={{
                    root: classes.btnFooter,
                  }}
                  style={{
                    borderStyle: 'none',
                  }}
                  onClick={() => setShowDialog(true)}
                >
                  Thanh toán
                </Button>
              )}
            </Box>

            <Dialog
              isOpen={showDialog}
              onClose={(isOpen) => setShowDialog(isOpen)}
              title='Xác nhận'
              message='Bạn chắc chắn muốn kết thúc？'
              onConfirm={() => goToCheckout()}
              isSubmitLoading={isSubmitLoading}
            />
          </Box>
        </Footer>
        {/* Modal waiting payment  */}
        {isShowModal && (
          <Modal
            open={isShowModal}
            title='Thông báo'
            maxWidth='450px'
            minHeight='320px'
            maxHeight='520px'
          >
            <div style={{ marginTop: '35%' }}>
              <Box textAlign='center'>Đang thực hiện thanh toán, vui lòng chờ trong giây lát</Box>

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '35%',
                }}
              >
                <Button
                  title='Quay lại'
                  borderRadius='28px'
                  bgcolor='#828282'
                  borderColor='#828282'
                  width='176px'
                  onClick={() => setIsShowModal(false)}
                />
              </div>
            </div>
          </Modal>
        )}
      </PageInnerWrap>
    </PageContainer>
  );
};

export default PageOrder;
