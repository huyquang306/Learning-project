import React, {useContext, useEffect, useState} from 'react';
import moment from 'moment';
moment.locale('ja');

// Base Components
import {
  Box,
  Button, Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/admin/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import BasicPagination from 'js/utils/components/pagination/BasicPagination';
import DatePickerCustom from 'js/admin/components/DatePickerCustom';
import ModalShopDetail from './ModalShopDetail';
import ModalServicePlanCondition from './ModalServicePlanCondition';
import CircularProgress from '@material-ui/core/CircularProgress';

// Services
import AdminApiService from 'js/admin/actions/admin-api-service';

// Context
import GlobalContext from 'js/admin/GlobalContext';

// Styles
import {shopListStyles as useStyles} from 'js/admin/pages/ShopListPage/styles';

// Utils
import { PAYMENT_METHOD_NAMES } from 'js/utils/components/Admin/const';
import { phoneNumberFormat } from 'js/utils/helpers/phoneNumber';
import { YEAR_MONTH_FORMAT, YEAR_MONTH_DAY_FORMAT } from 'js/utils/helpers/timer';
import AdminUtils from 'js/admin/utils';

const PAGINATION_DEFAULT = {
  current_page: 1,
  last_pages: 1,
  per_page: 20,
  total: 1,
};

const ShopListPage = (props) => {
  const classes = useStyles(props);

  // Context
  const {dispatch} = useContext(GlobalContext);

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [shops, setShops] = useState([]);
  const [pagination, setPagination] = useState(PAGINATION_DEFAULT);
  const [filter, setFilter] = useState({
    inputDate: moment().subtract(1, 'month').format(YEAR_MONTH_FORMAT),
  });

  const [selectedShop, setSelectedShop] = useState(null);
  const [modalShopDetailStatus, setModalShopDetailStatus] = useState(false);
  const [modalServicePlansStatus, setModalServicePlansStatus] = useState(false);

  useEffect(() => {
    getShops(1, filter.inputDate);
  }, []);

  const getShops = async (currentPage = 1, date = null) => {
    setIsLoading(true);
    try {
      let filterData = {
        page: currentPage,
        from: date
          ? moment(date).startOf('month').format(YEAR_MONTH_DAY_FORMAT)
          : moment().startOf('month').format(YEAR_MONTH_DAY_FORMAT),
        to: date
          ? moment(date).endOf('month').format(YEAR_MONTH_DAY_FORMAT)
          : moment().endOf('month').format(YEAR_MONTH_DAY_FORMAT),
      };
      const response = await AdminApiService.getShops(filterData);
      const {data = [], pagination: pag = PAGINATION_DEFAULT} = response;
      setShops(data);
      setPagination(pag);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // TODO: translate
      showWarningMessage('get shops errors');
    }
  };

  const showWarningMessage = (message) => {
    dispatch({
      type: 'UPDATE_TOAST',
      payload: {
        isShow: true,
        message: message,
        status: 'warning',
      },
    });
  };

  const showSuccessMessage = (message) => {
    dispatch({
      type: 'UPDATE_TOAST',
      payload: {
        isShow: true,
        message: message,
        status: 'success',
      },
    });
  };

  const onChangePage = (event, value) => getShops(value);

  const handleFilterChange = (month) => {
    setFilter({ ...filter, inputDate: month });
    getShops(pagination.current_page, month)
  };

  const renderPaymentMethod = (shop) => {
    let result = 'Miễn phí/-';

    // Check currentMonth or a month ago
    const isCurrentMonth = moment().format('YYYY-MM') === filter?.inputDate && shop?.payment_method && shop.service_plan;
    if (isCurrentMonth) {
      return `${shop.service_plan.name}/${PAYMENT_METHOD_NAMES[shop.payment_method]}`;
    }

    // Check has billing in filter month
    const {billings_in_month} = shop;
    const isSetServicePlanInFilterMonth = billings_in_month && billings_in_month.length && shop.payment_method
      && billings_in_month[0].service
      && Number(billings_in_month[0].service.price) > 0;
    if (isSetServicePlanInFilterMonth) {
      const {service, payment_method} = billings_in_month[0];

      return `${shop.service_plan.name}/${PAYMENT_METHOD_NAMES[payment_method]}`;
    }
    
    if (billings_in_month?.length) {
      const {payment_method} = billings_in_month[0];
      
      return `${shop.service_plan.name}/${PAYMENT_METHOD_NAMES[payment_method]}`;
    }
    
    return result;
  };

  const getUsageQRCode = (shop) =>{
    const isCurrentMonth = moment().format('YYYY-MM') === filter?.inputDate ? true : false
    const totalQRCode = parseInt(shop?.billings_in_month?.reduce(
      (sum, currentValue) => sum + Number(currentValue.total_qr_number), 0) ?? 0);

    if (isCurrentMonth) {
      return shop.usageQRCodeInMonth;
    }

    return totalQRCode;
  }
  
  return (
    <PageContainer padding='0px'>
      <HeaderAppBar title='Danh sách cửa hàng'/>
      <PageInnerContainer padding='0px'>
        <Box m={2} display='flex' alignItems='center'>
          <Grid container>
            <Grid item xs={12} sm={12} />
            <Grid item xs={12} sm={8} className={classes.filterBox}>
              <DatePickerCustom month={filter.inputDate} onChange={(month) => handleFilterChange(month)}/>
            </Grid>
            <Grid item xs={12} sm={4} className={classes.textAlignEnd}>
              <Button
                className={ `${classes.button} ${classes.buttonSearch}` }
                onClick={() => setModalServicePlansStatus(true)}
              >
                Các dịch vụ
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box m={2}>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label='simple table'>
              <TableHead>
                <TableRow classes={{ root: classes.tableHead }}>
                  <TableCell classes={{ root: classes.tableCellHead }} align='center'>Tên cửa hàng</TableCell>
                  <TableCell classes={{ root: classes.tableCellHead }} align='center'>Địa chỉ</TableCell>
                  <TableCell classes={{ root: classes.tableCellHead }} align='center'>Số điện thoại</TableCell>
                  <TableCell classes={{ root: classes.tableCellHead }} align='center'>Số QR</TableCell>
                  <TableCell classes={{ root: classes.tableCellHead }} align='center'>Gói DV/Phương thức thanh toán</TableCell>
                  <TableCell classes={{ root: classes.tableCellHead }} align='center'>Trạng thái thanh toán</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  isLoading ? (
                    <TableRow
                      key='loading'
                    >
                      <TableCell
                        classes={{root: classes.tableCell}}
                        align='center'
                        colSpan={6}
                      >
                        <CircularProgress style={{ marginLeft: 10, width: 20, height: 20 }} />
                      </TableCell>
                    </TableRow>
                  ) : null
                }
                {!isLoading && shops && shops.map((shop, shopIndex) => (
                  <TableRow
                    key={shopIndex}
                    className={classes.shopItemHover}
                    onClick={() => {
                      setSelectedShop(shop);
                      setModalShopDetailStatus(true);
                    }}
                  >
                    <TableCell classes={{root: classes.tableCell}} align='center'>
                      {shop.name}
                    </TableCell>
                    <TableCell classes={{root: classes.tableCell}} align='center'>
                      {shop.prefecture}
                    </TableCell>
                    <TableCell classes={{root: `${classes.tableCell} ${classes.noBreakLine}`}} align='center'>
                      {phoneNumberFormat(shop.phone_number)}
                    </TableCell>
                    <TableCell classes={{root: classes.tableCell}} align='center'>
                      {getUsageQRCode(shop)}
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCell }} align='center'>
                      {
                        renderPaymentMethod(shop)
                      }
                    </TableCell>
                    <TableCell classes={{ root: `${classes.tableCell} ${classes.noBreakLine}` }} align='center'>
                      {AdminUtils.renderPaymentStatus(shop.billings_in_month, filter.inputDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <BasicPagination
            currentPage={pagination.current_page}
            totalPage={pagination.last_pages}
            onChange={onChangePage}
          />
        </Box>
      </PageInnerContainer>

      {
        modalShopDetailStatus && (
          <ModalShopDetail
            open={modalShopDetailStatus}
            onClose={() => {
              setModalShopDetailStatus(false);
              setSelectedShop(null);
            }}
            shop={selectedShop}
            showWarningMessage={showWarningMessage}
            showSuccessMessage={showSuccessMessage}
            getShopsCurrentPage={() => getShops(pagination.current_page)}
          />
        )
      }

      <ModalServicePlanCondition
        open={modalServicePlansStatus}
        onClose={() => setModalServicePlansStatus(false)}
        showWarningMessage={showWarningMessage}
        showSuccessMessage={showSuccessMessage}
      />
    </PageContainer>
  );
};

ShopListPage.propTypes = {};
export default ShopListPage;
