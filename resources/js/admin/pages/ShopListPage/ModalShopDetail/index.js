import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Services
import AdminApiService from 'js/admin/actions/admin-api-service';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import {
  Box,
  Button, FormControlLabel, ListItemIcon,
  Paper, Radio, RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import BasicPagination from 'js/utils/components/pagination/BasicPagination';
import ModalErrorDownGradePlan from 'js/admin/pages/ShopListPage/ModalErrorDownGradePlan';
import ModalConfirmChangeShopStatus from 'js/admin/pages/ShopListPage/ModalConfirmChangeShopStatus';

// styles
import { useStylesShopItem as useStyles } from './styles';

// utils
import Utils from 'js/shared/utils';
import AdminUtils from 'js/admin/utils';
import {PAYMENT_METHOD_TYPES, PAYMENT_STATUS, FUNCTIONS_CODE} from 'js/utils/components/Payment/paymentConst';
import {currencyFormat} from 'js/utils/helpers/number';
import CircularProgress from '@material-ui/core/CircularProgress';
import { phoneNumberFormat } from 'js/utils/helpers/phoneNumber';
import {formatPrice} from "../../../../utils/helpers/number";

const PAGINATION_DEFAULT = {
  current_page: 1,
  last_pages: 1,
  per_page: 20,
  total: 1,
};

const ModalShopDetail = (props) => {
  const classes = useStyles();
  const {shop, showWarningMessage, showSuccessMessage, getShopsCurrentPage} = props;

  // Local state
  const [isSubmit, setIsSubmit] = useState(false);
  const [shopData, setShopData] = useState({});
  const [pagination, setPagination] = useState(PAGINATION_DEFAULT);
  const [billings, setBillings] = useState([]);
  const [servicePlans, setServicePlans] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({
    stripe_customer_id: '',
    name: '',
    zip_code: '',
    address: '',
    phone: '',
    email: '',
    payment_method: null,
    acceptTerm: false,
  });
  const [selectedServicePlanId, setSelectedServicePlanId] = useState(null);
  const [modalErrorDownGradeStatus, setModalErrorDownGradeStatus] = useState(false);
  const [modalChangeShopStatus, setModalChangeShopStatus] = useState(false);

  useEffect(() => {
    if (props.open) {
      getShopData();
    }
  }, [props.open]);

  useEffect(() => {
    if (shopData.hash_id) {
      getServicePlans();
      getShopBillings();
      getCustomerPayment();
    }
  }, [shopData]);

  const getShopData = async () => {
    try {
      const response = await AdminApiService.getShop(shop.hash_id);
      await setShopData(response);
    } catch (error) {
      // TODO: translate
      showWarningMessage('get shop error');
    }
  };

  const getShopBillings = async (currentPage = 1) => {
    try {
      const filterData = {
        page: currentPage,
      };
      const response = await AdminApiService.getShopBillings(shop.hash_id, filterData);
      const {data = [], pagination: pag = PAGINATION_DEFAULT} = response;
      setBillings(data);
      setPagination(pag);
    } catch (error) {
      // TODO: translate
      showWarningMessage('get shop billings errors');
    }
  };

  const getServicePlans = async () => {
    try {
      const response = await AdminApiService.getServicePlans();
      setServicePlans(response);
      if (shopData.service_plan) {
        setSelectedServicePlanId(shopData.service_plan.id);
      } else if (response.length) {
        setSelectedServicePlanId(response[0].id);
      }
    } catch (e) {
      showWarningMessage(e.message);
    }
  };

  const getCustomerPayment = async () => {
    try {
      const response = await AdminApiService.getCustomerPayment(shop.hash_id);
      if (response) {
        let newPaymentInfo = Utils.cloneDeep(paymentInfo);
        const {
          name,
          zip_code,
          address,
          phone,
          email,
          id,
        } = response;
        newPaymentInfo.stripe_customer_id = id;
        newPaymentInfo.name = name;
        newPaymentInfo.zip_code = zip_code;
        newPaymentInfo.address = address;
        newPaymentInfo.phone = phone;
        newPaymentInfo.email = email;
        newPaymentInfo.payment_method = shopData.payment_method;
        setPaymentInfo(newPaymentInfo);
      }
    } catch (e) {
      showWarningMessage(e.message);
    }
  };

  const onChangePage = (event, value) => getShopBillings(value);

  const renderActions = () => (
    <>
      <ButtonCustom
        title='Đóng'
        borderRadius='28px'
        bgcolor='#828282'
        borderColor='#828282'
        width='176px'
        onClick={props.onClose}
      />
      <Button
        className={classes.buttonSubmit}
        disabled={selectedServicePlanId === shopData?.service_plan?.id || !paymentInfo.stripe_customer_id || isSubmit || !shopData.is_active}
        onClick={handleSubmitServicePlan}
      >
        Lưu
        {
          isSubmit ? <CircularProgress  style={{ marginLeft: 10, width: 20, height: 20 }}/> : null
        }
      </Button>
    </>
  );

  const handleSubmitServicePlan = async () => {
    // Check over limit plan
    const {usageQRCodeInMonth} = shopData;
    const newSelectedPlan = servicePlans.find(planTmp => planTmp.id === selectedServicePlanId);
    const conditions = newSelectedPlan.r_function_conditions;
    const qrCondition = conditions.find(conTmp => conTmp.m_function.code === FUNCTIONS_CODE.qr);
    if (qrCondition) {
      const maxLimit = qrCondition ? qrCondition.restricted_value : null;
      if (maxLimit && maxLimit < usageQRCodeInMonth) {
        setModalErrorDownGradeStatus(true);

        return;
      }
    }

    try {
      await AdminApiService.updateShopServicePlan(shop.hash_id, selectedServicePlanId);
      props.onClose();
      showSuccessMessage('Thay đổi thông tin thành công');
      setIsSubmit(false);
      getShopsCurrentPage();
    } catch (error) {
      setIsSubmit(false);
      // TODO: translate
      showWarningMessage('Thay đổi thông tin thất bại');
    }
  };

  const handleChangeServicePlan = (event) => {
    const {target} = event;
    const {value} = target;
    setSelectedServicePlanId(parseInt(value));
  };

  const renderPaymentMethod = () => {
    if (paymentInfo.payment_method) {
      switch (paymentInfo.payment_method.toString()) {
        case PAYMENT_METHOD_TYPES.card:
          return 'Thẻ ngân hàng';
        case PAYMENT_METHOD_TYPES.invoice:
          return 'Thanh toán hóa đơn';
        default: return '';
      }
    }

    return '';
  };
  
  const renderYearMonth = (date = null) => date
    ? moment(date).format('YYYY/MM')
    : moment().format('YYYY/MM');

  const handleSubmitCancelOrReopenShop = async () => {
    if (shopData.is_active) {
      // shop active, change to cancel
      try {
        await AdminApiService.cancelShop(shop.hash_id);
        // TODO: translate
        showSuccessMessage('Dừng sử dụng dịch vụ thành công');
        props.onClose();
      } catch (error) {
        // TODO: translate
        showWarningMessage('Có lỗi xảy ra');
      }
    } else {
      // shop canceled, change to active
      try {
        await AdminApiService.reopenShop(shop.hash_id);
        // TODO: translate
        showSuccessMessage('Tiếp tục sử dụng dịch vụ thành công');
        props.onClose();
      } catch (error) {
        // TODO: translate
        showWarningMessage('Có lỗi xảy ra');
      }
    }
  };

  const renderCurrentMonthBilling = () => {
    const currentMonth = moment().format('YYYY/MM');
    const isHasBillingCurrentMonth = billings.find(billing => billing
      && moment(billing.start_date).format('YYYY/MM') === currentMonth
    );
    if (isHasBillingCurrentMonth) return null;

    return (
      <TableRow key='current-month'>
        <TableCell classes={{root: classes.tableCell}} align='center'>
          {renderYearMonth()}
        </TableCell>
        <TableCell classes={{root: classes.tableCell}} align='center'>
          {shopData.usageQRCodeInMonth}
        </TableCell>
        <TableCell classes={{root: classes.tableCell}} align='center'>
          {/*{*/}
          {/*  shopData.total_orders_number !== undefined && shopData.total_customer_payment !== undefined*/}
          {/*    ? `${currencyFormat(shopData.total_orders_number)}/${currencyFormat(shopData.total_customer_payment)}`*/}
          {/*    : null*/}
          {/*}*/}
          {
            formatPrice(parseInt(shopData.shop_total_payment))
          }
        </TableCell>
        <TableCell classes={{root: classes.tableCell}} align='center'>
          {
            AdminUtils.renderPaymentStatus(
              shopData.billings_in_month,
              currentMonth
            )
          }
        </TableCell>
      </TableRow>
    );
  }

  const renderLastMonthBilling = () => {
    const lastMonth = moment().subtract(1, 'month').format('YYYY/MM');
    const isHasLastMonth = billings.find(billing => billing
      && moment(billing.start_date).format('YYYY/MM') === lastMonth
    );

    if (isHasLastMonth) return null;
    const {last_month} = shopData;

    if (last_month) {
      const {total_orders_number, total_customer_payment, usageQRCodeInMonth} = last_month;

      if (total_orders_number && total_customer_payment && usageQRCodeInMonth) {
        return (
          <TableRow key={`lastMonth${lastMonth}`}>
            <TableCell classes={{root: classes.tableCell}} align='center'>
              {lastMonth}
            </TableCell>
            <TableCell classes={{root: classes.tableCell}} align='center'>
              {currencyFormat(usageQRCodeInMonth)}
            </TableCell>
            <TableCell classes={{root: classes.tableCell}} align='center'>
              {/*{currencyFormat(total_orders_number)}/{currencyFormat(total_customer_payment)}*/}
              {
                formatPrice(parseInt(shopData.shop_total_payment))
              }
            </TableCell>
            <TableCell classes={{root: classes.tableCell}} align='center'>
              {AdminUtils.renderPaymentStatus(null, lastMonth)}
            </TableCell>
          </TableRow>
        );
      }
    }

    return null;
  };

  const getUsageQRCode = (billing) => {
    const currentMonth = moment().format('YYYY/MM');
    const isHasBillingCurrentMonth = moment(billing.target_month).format('YYYY/MM') === currentMonth;
    if (isHasBillingCurrentMonth) {
      return currencyFormat(shopData?.usageQRCodeInMonth ?? 0);
    }

    return currencyFormat(billing?.total_qr_number ?? 0);
  }

  return (
    <Modal
      open={props.open}
      actions={renderActions()}
      maxHeight='80vh'
      minHeight='80vh'
      maxWidth='75%'
    >
      <Box className={classes.contentDetail} ml={3} mr={5} mt={3}>
        <Box mt={2}>
          <Box className={classes.fwBold}>
            <Box>===Thông tin cửa hàng===</Box>

            <Box className={classes.boxRow} display='flex' alignItems='center'>
              <Box width='50%'>
                ID <span className={classes.colonMargin}>:</span> {shop.hash_id}
              </Box>
              <Box width='50%' display='flex' alignItems='center' whiteSpace='nowrap'>
                <Box mr={2}>Gói dịch vụ <span className={classes.colonMargin}>:</span> </Box>

                <RadioGroup
                  name='service_plan'
                  onChange={handleChangeServicePlan}
                  value={selectedServicePlanId}
                >
                  <ListItemIcon>
                    {
                      servicePlans.map((servicePlan, servicePlanIndex) => (
                        <FormControlLabel
                          key={servicePlanIndex}
                          value={servicePlan.id}
                          control={
                            <Radio
                              disableRipple
                              checked={servicePlan.id === selectedServicePlanId}
                              classes={{checked: classes.radioChecked, root: classes.radioStyle}}
                            />
                          }
                          label={AdminUtils.removeServicePlanHardText(servicePlan.name)}
                          disabled={!paymentInfo.stripe_customer_id || !shopData.is_active}
                        />
                      ))
                    }
                  </ListItemIcon>
                </RadioGroup>
              </Box>
            </Box>

            <Box className={classes.boxRow} display='flex' alignItems='center'>
              <Box width='50%'>
                Tên cửa hàng <span className={classes.colonMargin}>:</span> {shopData.name}
              </Box>
              <Box width='50%'>
                Ngày tham gia <span className={classes.colonMargin}>:</span> {moment(shopData.created_at).format('YYYY/MM/DD')}
              </Box>
            </Box>

            <Box className={classes.boxRow} display='flex' alignItems='center'>
              <Box width='50%'>
                Số điện thoại <span className={classes.colonMargin}>:</span> {phoneNumberFormat(shopData.phone_number)}
              </Box>
            </Box>

            <Box className={classes.boxRow}> Địa chỉ <span className={classes.colonMargin}>:</span> {shopData.address}</Box>

            <Box className={classes.boxPaymentRow}>===Thông tin thanh toán===</Box>

            <Box className={classes.boxRow} display='flex' alignItems='center'>
              <Box width='50%'>
                Tên <span className={classes.colonMargin}>:</span> {paymentInfo.name}
              </Box>
              <Box width='50%'>
                Email <span className={classes.colonMargin}>:</span> {paymentInfo.email}
              </Box>
            </Box>

            <Box className={classes.boxRow} display='flex' alignItems='center'>
              <Box width='50%'>
                Số điện thoại <span className={classes.colonMargin}>:</span> {paymentInfo.phone ? phoneNumberFormat(paymentInfo.phone) : ''}
              </Box>
              <Box width='50%'>
                Phương thức thanh toán <span className={classes.colonMargin}>:</span> {renderPaymentMethod()}
              </Box>
            </Box>

            <Box className={classes.boxRow} display='flex' alignItems='center'>
              <Box width='50%'>
                Zip code <span className={classes.colonMargin}>:</span> {AdminUtils.getFormatZipCode(paymentInfo.zip_code)} {paymentInfo.address}
              </Box>
              <Box width='50%'>
                <Button
                  variant='contained'
                  className={`${classes.buttonSelect} ${shopData.is_active ? classes.buttonSelectActive : ''}`}
                  onClick={() => setModalChangeShopStatus(true)}
                  disabled={shopData.is_active}
                >Hoạt động</Button>
                <Button
                  variant='contained'
                  className={`${classes.buttonSelect} ${!shopData.is_active ? classes.buttonSelectActive : ''}`}
                  onClick={() => setModalChangeShopStatus(true)}
                  disabled={!shopData.is_active}
                >Đã khóa</Button>
              </Box>
            </Box>
          </Box>

          {/* billings */}
          <TableContainer className={classes.boxTableRow} component={Paper}>
            <Table stickyHeader aria-label='simple table'>
              <TableHead>
                <TableRow classes={{ root: classes.tableHead }}>
                  <TableCell classes={{ root: classes.tableCellHead }} align='center'>Tháng</TableCell>
                  <TableCell classes={{ root: classes.tableCellHead }} align='center'>Số QR</TableCell>
                  <TableCell classes={{ root: classes.tableCellHead }} align='center'>Số tiền thanh toán</TableCell>
                  <TableCell classes={{ root: classes.tableCellHead }} align='center'>Trạng thái</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {/* Current month */}
                {renderCurrentMonthBilling()}

                {/* Last month */}
                {/*{renderLastMonthBilling()}*/}

                {/* Older months */}
                {
                  billings && billings.length ? billings.map((billing, billingIndex) => (
                    <TableRow key={billingIndex}>
                      <TableCell classes={{root: classes.tableCell}} align='center'>
                        {billing.target_month ? renderYearMonth(billing.target_month) : ''}
                      </TableCell>
                      <TableCell classes={{root: classes.tableCell}} align='center'>
                        {getUsageQRCode(billing)}
                      </TableCell>
                      <TableCell classes={{root: classes.tableCell}} align='center'>
                        {/*{currencyFormat(billing.total_orders_number)}/{currencyFormat(billing.total_customer_payment)}*/}
                        {
                          formatPrice(parseInt(shopData.shop_total_payment))
                        }
                      </TableCell>
                      <TableCell classes={{root: classes.tableCell}} align='center'>
                        {
                          AdminUtils.renderPaymentStatus(
                            billing,
                            moment(billing.start_date).format('YYYY/MM')
                          )
                        }
                      </TableCell>
                    </TableRow>
                  )) : null
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <BasicPagination
          currentPage={pagination.current_page}
          totalPage={pagination.last_pages}
          onChange={onChangePage}
        />
      </Box>

      <ModalErrorDownGradePlan
        open={modalErrorDownGradeStatus}
        onClose={() => setModalErrorDownGradeStatus(false)}
      />

      <ModalConfirmChangeShopStatus
        open={modalChangeShopStatus}
        onClose={() => setModalChangeShopStatus(false)}
        handleSubmit={handleSubmitCancelOrReopenShop}
      />
    </Modal>
  );
};

// PropTypes
ModalShopDetail.propTypes = {
  open: PropTypes.bool,
  shop: PropTypes.object,
  onClose: PropTypes.func,
  getShopsCurrentPage: PropTypes.func,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalShopDetail.defaultProps = {
  open: false,
  shop: {},
  onClose: () => {},
  getShopsCurrentPage: () => {},
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalShopDetail;
