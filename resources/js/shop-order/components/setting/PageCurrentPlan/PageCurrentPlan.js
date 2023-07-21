import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Base Components
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import ModalRegisterPaymentMethod from 'js/utils/components/Payment/ModalRegisterPaymentMethod';
import BasicPagination from 'js/utils/components/pagination/BasicPagination';
import Footer from 'js/shared-order/components/Footer';
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

// Components(Material-UI)
import { Button, Box, Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

// Services
import ShopApiService from 'js/shop/shop-api-service';
import PaymentApiService from 'js/utils/components/Payment/payment-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopAuthService from 'js/shop/shop-auth-service';

// Utils
import Utils from 'js/shared/utils';
import { useStylesPageCurrentPlan } from './style';
import {
  PAYMENT_METHOD_TYPES,
  formatNumberWithCommas,
  getPlanCondition,
  FUNCTIONS_CODE
} from 'js/utils/components/Payment/paymentConst';

// Library
import moment from 'moment';
moment.locale('vi');

const PageCurrentPlan = (props) => {
  const classes = useStylesPageCurrentPlan(props);
  const history = useHistory();
  // Context
  const [shop] = useContext(ShopInfoContext);
  // Url param
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const urlCurrentPage = params.get('current_page') || 1;
  // local state
  const [shopData, setShopData] = useState({});
  const [servicePlans, setServicePlans] = useState([]);
  const [updateMethodOpen, setUpdateMethodOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    stripeCustomerId: '',
    name: '',
    zipCode: '',
    address: '',
    phone: '',
    email: '',
    payment_method: PAYMENT_METHOD_TYPES.invoice,
    description: '',
    acceptTerm: false,
  });
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    last_pages: 0,
    current_page: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenCancelModal, setIsOpenCancelModal] = useState(false);
  const [acceptTermCancel, setAcceptTermCancel] = useState(false);
  const [isCancelSuccess, setIsCancelSuccess] = useState(false);
  const [qrInfo, setQrInfo] = useState(null);
  const [overLimitQRInfo, setOverLimitQRInfo] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    getShopData();
    getServicePlans();
    getCustomerPayment();
    getBillingDetailHistory();
  }, [shop]);

  useEffect(()=> {
    if (isOpenCancelModal) {
      setAcceptTermCancel(false);
    }
  }, [isOpenCancelModal]);

  const getShopData = async () => {
    const shopRes = await ShopApiService.getShop(shop.hashId);
    setSelectedPlan(shopRes?.service_plan);
    console.log(selectedPlan)
    console.log(shopRes)
    getQrInformation(shopRes, shopRes?.service_plan);
    setShopData(shopRes);
  };

  const getBillingDetailHistory = async (page = 1) => {
    try {
      let data = {};
      if (page) {
        data.page = page || urlCurrentPage;
      } else if (urlCurrentPage) {
        data.page = urlCurrentPage;
      }
      const response = await ShopOrderApiService.getBillingDetailHistory(shop.hashId, data);
      if (response) {
        setTableData(response.data);
        setPagination(response.pagination);
      }
    } catch (e) {
      setToast(e.message);
    }
  };

  const getCustomerPayment = async () => {
    try {
      const response = await PaymentApiService.getCustomerPayment(shop.hashId);
      if (response) {
        let newPaymentInfo = Utils.cloneDeep(paymentInfo);
        const { name, zip_code, address, phone, email, description, id } = response;
        newPaymentInfo.stripeCustomerId = id;
        newPaymentInfo.name = name;
        newPaymentInfo.zipCode = zip_code;
        newPaymentInfo.address = address;
        newPaymentInfo.phone = phone;
        newPaymentInfo.email = email;
        newPaymentInfo.description = description;
        setPaymentInfo(newPaymentInfo);
      }
    } catch (e) {
      setToast(e.message);
    }
  };

  const getServicePlans = async () => {
    const servicePlansRes = await ShopApiService.getServicePlans();
    setServicePlans(servicePlansRes);
  };

  const getQrInformation = (shopRes, selectedPlan) => {
    let qrInformation = 0;
    let overLimitQRCost = 0;
    const qrCondition = getPlanCondition(shopRes?.service_plan, FUNCTIONS_CODE.qr);
    const limitQRPayment = Number(qrCondition?.restricted_value) ?? 0;
    if (selectedPlan?.id) {
      if (qrCondition?.restricted_value) {
        // Case: limit QR
        const extendPrice = Number(qrCondition?.m_function?.m_service_plan_options[0].additional_price) ?? 0;
        if (extendPrice) {
          // Case: limit QR and can extend QR
          qrInformation = `${shopRes.usageQRCodeInMonth}/${limitQRPayment}`;
          if (shopRes.usageQRCodeInMonth > limitQRPayment) {
            qrInformation = `${shopRes.usageQRCodeInMonth}/${limitQRPayment}(超過${
              shopRes.usageQRCodeInMonth - limitQRPayment
            })`;
            overLimitQRCost = (parseInt(shopRes.usageQRCodeInMonth) - limitQRPayment) * parseInt(extendPrice);
          }
        } else {
          // Case: limit QR and cannot extend QR
          const numberOfQRRemaining = limitQRPayment - shopRes.usageQRCodeInMonth > 0
            ? limitQRPayment - shopRes.usageQRCodeInMonth
            : 0;
          qrInformation = `${shopRes.usageQRCodeInMonth}/${limitQRPayment} (Còn lại ${numberOfQRRemaining})`;
        }
      } else {
        // Case: no limit QR
        qrInformation = `${shopRes.usageQRCodeInMonth}(Không giới hạn)`;
      }
    }
    setQrInfo(qrInformation);
    setOverLimitQRInfo(overLimitQRCost);
  }
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

  const onChangePage = (event, value) => {
    pushParameterToUrl(value);
    getBillingDetailHistory(value);
  };

  const pushParameterToUrl = (page) => {
    const parameters = [];
    if (page) {
      parameters.push(`current_page=${page}`);
    } else if (pagination.current_page) {
      parameters.push(`current_page=${pagination.current_page}`);
    }
    history.push({
      search: '?' + parameters.join('&'),
    });
  };

  const confirmCancelContract = async () => {
    try {
      setIsLoading(true);
      const response = await ShopApiService.cancelContractShop(shop.hashId);
      if (!response?.is_active) {
        setIsLoading(false);
        setIsCancelSuccess(true);
      }
    } catch (e) {
      showWarningMessage(e.message);
    }
  };

  const confirmCancelAndLogout = async () => {
    ShopAuthService.signOut();
  };

  const calculateTotalAmount = (billing) => {
    const totalAmount = parseInt(billing?.reduce(
      (sum, currentValue) => sum + Number(currentValue.price), 0) ?? 0);
    return totalAmount;
  }

  const modalCancelActions = () => {
    return (
      <>
        <ButtonCustom
          title="Quay lại"
          bgcolor="#828282"
          borderColor="#828282"
          borderRadius="28px"
          width="176px"
          padding="8px 0px"
          onClick={() => setIsOpenCancelModal(false)}
        />
        <ButtonCustom
          title="Đồng ý"
          borderRadius="28px"
          bgcolor="#F2994A"
          borderColor="#F2994A"
          width="176px"
          onClick={confirmCancelContract}
          disabled={!acceptTermCancel || false}
        />
      </>
    );
  };

  const cancelSuccessActions = () => {
    return (
      <ButtonCustom
        title="Xác nhận hủy dịch vụ"
        borderRadius="28px"
        bgcolor="#F2994A"
        borderColor="#F2994A"
        width="176px"
        onClick={confirmCancelAndLogout}
      />
    );
  };

  return (
    <PageContainer padding="0px" width="100%">
      <HeaderAppBar title="Gói dịch vụ - Hóa đơn" />
      <PageInnerContainer padding="0px 0px 25px 0px">
        <Box pr={20} pl={20} pt="20px" pb="90px" className={classes.container}>
          {selectedPlan && (
            <>
              <Box mt={1} display="flex" alignItems="center">
                <Box width="20%" className={classes.textBold}>
                  Đã dùng trong tháng
                </Box>
                <Box width="80%" fontSize={'14px'}>
                </Box>
              </Box>

              <Box flex={1}>
                <Grid spacing={5} container justify="center">
                  <Grid item xs={6}>
                    <Box mt={2} display="flex" alignItems="center">
                      <Box width="40%" className={classes.ItemName}>
                        Gói dịch vụ
                      </Box>
                      <Box width="60%" className={classes.ItemValue}>
                        {/*<a href="#" target="_blank" className={classes.itemLink}>*/}
                          {selectedPlan.name}
                        {/*</a>*/}
                      </Box>
                    </Box>

                    <Box mt={2} display="flex" alignItems="center">
                      <Box width="40%" className={classes.ItemName}>
                        Số QR/Giới hạn
                      </Box>
                      <Box width="60%" className={classes.ItemValue}>
                        {qrInfo}
                      </Box>
                    </Box>

                    <Box mt={2} display="flex" alignItems="center">
                      <Box width="40%" className={classes.ItemName}>
                        Số tiền cần thanh toán
                      </Box>
                      <Box width="60%" className={classes.ItemValue}>
                        {formatNumberWithCommas(calculateTotalAmount(shop?.billings_in_month))} ₫
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box mt={2} display="flex" alignItems="center">
                      <Box width="40%" className={classes.ItemName}>
                        Phí dịch vụ
                      </Box>
                      <Box width="60%" className={classes.ItemValue}>
                        {formatNumberWithCommas(parseInt(shop?.service_plan?.price))} ₫
                      </Box>
                    </Box>

                    <Box mt={2} display="flex" alignItems="center">
                      <Box width="40%" className={classes.ItemName}>
                        Số QR quá giới hạn
                      </Box>
                      <Box width="60%" className={classes.ItemValue}>
                        {formatNumberWithCommas(overLimitQRInfo)}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box
                mt={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginTop={'20px'}
              >
                <Box width="40%" className={classes.textBold}>
                  Lịch sử thanh toán
                </Box>
                <BasicPagination
                  currentPage={pagination.current_page}
                  totalPage={pagination.last_pages}
                  onChange={onChangePage}
                />
              </Box>

              <Box mt={1}>
                <table className={classes.table}>
                  <thead>
                    <tr>
                      <th className={classes.tableHeader}>Thời gian</th>
                      <th className={classes.tableHeader}>Gói dịch vụ</th>
                      <th className={classes.tableHeader}>Phí dịch vụ</th>
                      <th className={classes.tableHeader}>Số QR sử dụng</th>
                      <th className={classes.tableHeader}>Số QR vượt quá</th>
                      <th className={classes.tableHeader}>Số tiền đã thanh toán</th>
                      <th className={classes.tableHeader}>Hóa đơn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.length > 0 &&
                      tableData.map((data, index) => (
                        <tr key={index}>
                          <td className={`${classes.tableDetail} ${classes.textCenter}`}>
                            {moment(data.target_month).format('YYYY/MM')}
                          </td>
                          <td className={`${classes.tableDetail} ${classes.textCenter}`}>
                            {data.service_name}
                          </td>
                          <td className={`${classes.tableDetail} ${classes.textRight}`}>
                            {data.basic_price} ₫
                          </td>
                          <td className={`${classes.tableDetail} ${classes.textRight}`}>
                            {data.total_qr_number}
                          </td>
                          <td className={`${classes.tableDetail} ${classes.textRight}`}>
                            {data.extend_price} ₫
                          </td>
                          <td className={`${classes.tableDetail} ${classes.textRight}`}>
                            {data.total_price} ₫
                          </td>
                          <td className={`${classes.tableDetail} ${classes.textCenter}`}>
                          {
                            data.total_price != 0 && 
                            <a
                              href={`${data.invoice_url}`}
                              target="_blank"
                              className={classes.itemLink}
                            >
                              <GetAppIcon />
                            </a>
                          }
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Box>

              <Box
                mt={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginTop={'20px'}
              >
                {/*<Box width="40%" fontSize={'14px'}>*/}
                {/*  ＊：無料月のため、請求金額は０円です。*/}
                {/*</Box>*/}
                <BasicPagination
                  currentPage={pagination.current_page}
                  totalPage={pagination.last_pages}
                  onChange={onChangePage}
                />
              </Box>
            </>
          )}

          <Footer padding="20px 10px">
            <Grid container justify="center" spacing={5}>
              <Grid item>
                <Button
                  onClick={() => history.push('/setting')}
                  className={`${classes.buttonController} + ' ' + ${classes.buttonBack}`}
                  disabled={isLoading}
                >
                  Quay lại
                </Button>
              </Grid>
              <Grid item>
                <Button
                  className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                  onClick={() => setUpdateMethodOpen(true)}
                  disabled={isLoading}
                >
                  Thay đổi gói
                </Button>
              </Grid>
              <Grid item>
                <Button
                  className={`${classes.buttonController} + ' ' + ${classes.buttonCancel}`}
                  onClick={() => setIsOpenCancelModal(true)}
                  disabled={isLoading}
                >
                  Hủy dịch vụ
                </Button>
              </Grid>
            </Grid>
          </Footer>
        </Box>

        <ModalRegisterPaymentMethod
          open={updateMethodOpen}
          originalServicePlan={shop?.service_plan}
          stripeCustomerId={paymentInfo.stripeCustomerId}
          usageQRCodeInMonth={shop.usageQRCodeInMonth}
          isUpdateServicePlan={true}
          onClose={() => setUpdateMethodOpen(false)}
          showWarningMessage={showWarningMessage}
          showSuccessMessage={showSuccessMessage}
        />

        <FlashMessage
          isOpen={toast.isShow}
          onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
          status={toast.status}
          message={toast.message}
        />

        {/* Modal cancel contract */}
        {isOpenCancelModal && (
          <Modal
            title="Lưu ý khi hủy dịch vụ"
            open={isOpenCancelModal}
            actions={modalCancelActions()}
            maxWidth="750px"
            minHeight="250px"
            disableBackdropClick={true}
          >
            <Box textAlign="center">
              <Box className={classes.textHeader}>
                Trước khi dừng sử dụng dịch vụ, vui lòng đánh dấu vào ô “Đồng ý” sau khi xác nhận các nội dung sau.
              </Box>
              <Box className={classes.textDetail}>
                1. Tại thời điểm hủy bỏ, bạn sẽ không thể sử dụng dịch vụ nữa.。
              </Box>
              <Box className={classes.textDetail}>
                2. Ngay cả khi bạn hủy vào giữa tháng, bạn vẫn sẽ bị tính phí sử dụng hàng tháng cho đến tháng hiện tại.
              </Box>
              <Box mt={1} className={classes.boxItems}>
                <Box width="100%">
                  <FormControlLabel
                    control={<Checkbox checked={acceptTermCancel} name="acceptTerm" />}
                    label="Đồng ý"
                    onChange={() => setAcceptTermCancel(!acceptTermCancel)}
                  />
                </Box>
              </Box>
            </Box>
          </Modal>
        )}

        {/* Modal show message cancel contract successfully */}
        {isCancelSuccess && (
          <Modal
            open={isCancelSuccess}
            actions={cancelSuccessActions()}
            maxWidth="450px"
            minHeight="180px"
            disableBackdropClick={true}
            customClass={classes.cardContentCustom}
          >
            <Box textAlign="center" className={classes.boxContent}>
              <Box className={classes.boxDetail}> Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi </Box>
            </Box>
          </Modal>
        )}
      </PageInnerContainer>
    </PageContainer>
  );
};

PageCurrentPlan.propTypes = {};
export default PageCurrentPlan;
