/**
 * 来店情報の登録 | Register Customer Visit Info
 */

import React, { useState, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
import PubSub from 'pubsub-js';

import { useStylesRegisterCustomer as useStyles, stylesRegisterCustomer as styles } from './styles';
import ShopOrderApiService, { ENDPOINTS } from 'js/shop-order/shop-order-api-service';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import CustomSelectorBase from 'js/shared/components/CustomSelectorBase';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import PageTableListContext from './PageTableListContext';
import ModalQRCode from './ModalChildren';
import ModalConfirmUpdate from './ModalChildren';

// Components(Material-UI)
import { Button, Box, Grid, OutlinedInput, InputAdornment } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';

// Services
import ShopApiService from 'js/shop/shop-api-service';

// Utils
import Utils from 'js/shared/utils';
import { checkValidation, validateCustomerNumber } from './validateRegisterCustomerModal';
import {
  INITIAL_PROPOSE_FLG,
  ORDER_TYPE,
  getBlockNearestNow,
  COURSE_STATUS_ACTIVE,
  COURSE_AVAILABLE_FLAG_TRUE,
} from 'js/utils/helpers/courseHelper';
import {
  FUNCTIONS_CODE,
  qrLimitPoints,
  getPlanCondition,
} from 'js/utils/components/Payment/paymentConst';
import { INITIAL_ORDER_FLG_OFF } from 'js/utils/helpers/const';

const NONE_COURSE_OPTION_VALUE = 0;
const DEFAULT_NUMBER_OF_CUSTOMERS = 1;
const MAX_NUMBER_OF_CUSTOMERS = 99;
const ORDER_GROUP_SHOW_ENDED_TIME = 'orderGroupHadShowEndTime';
const KEY_UPDATE_DELETED_ORDERGROUP = 'publishKeyFreshDeletedOrdergroup';
const PROPERTY_NAME_COURSE = 'course';
const PROPERTY_NAME_INITAL_ORDER = 'initial';

const ORDER_STATUS = {
  STATUS_ORDER: 0,
  STATUS_FINISH: 1,
  STATUS_CANCEL: 2,
};

const ModalRegisterCustomer = (props) => {
  const { open } = props;
  const classes = useStyles();

  // Context
  const [shop] = useContext(ShopInfoContext);
  const { setToast, setWaiting, tables, state, dispatch } = useContext(PageTableListContext);

  // Local state
  const [member, setMember] = useState(state.ordergroup.number_of_customers || '');
  const [coursesState, setCoursesState] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(NONE_COURSE_OPTION_VALUE);
  const [orderHasCourse, setOrderHasCourse] = useState([]);
  const [showQRCode, setShowQRCode] = useState({
    isShow: false,
    qrCode: '',
  });
  const [errorsValidate, setErrorsValidate] = useState([]);
  const [isConfirmUpdateNumberCourse, setIsConfirmUpdateNumberCourse] = useState({
    isShow: false,
    isUpdateCourse: false,
  });
  const [isConfirmUpdateInitOrder, setIsConfirmUpdateInitOrder] = useState(false);
  const [shopData, setShopData] = useState({});
  const [formData, setFormData] = useState({
    add_hash_id: [],
    number_of_customers: 0,
    is_update_initial_menu_orders: false,
  });

  useEffect(() => {
    getMasterCourses();
    // setSelectedCourse when update
    if (state?.ordergroup) {
      const m_course = getCourse(state.ordergroup);
      const orderCourse = getOrderHasCourse(state.ordergroup);
      if (m_course?.hash_id) {
        setSelectedCourse(m_course.hash_id);
      }
      if (orderCourse) {
        setOrderHasCourse(orderCourse);
      }

      // first validate
      const errors = checkValidation({
        number_of_customers: member,
      });
      setErrorsValidate(errors);
    }
  }, [shop]);

  useEffect(() => {
    if (open) {
      getShopData();
    }
  }, [open]);

  const getShopData = async () => {
    try {
      const res = await ShopApiService.getShop(shop.hashId);
      setShopData(res);

      return res;
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
    }
  };

  const getCourse = (orderGroup) => {
    return Array.isArray(orderGroup?.orders)
      ? orderGroup.orders?.find(
          (order) =>
            !Utils.isEmpty(order?.m_course) &&
            order.order_type == ORDER_TYPE.ORDER_COURSE &&
            order.status != ORDER_STATUS.STATUS_CANCEL
        )?.m_course
      : [];
  };

  const getInitialMenu = (orderGroup) =>
    Array.isArray(orderGroup?.orders)
      ? orderGroup.orders?.find(
          (order) =>
            !Utils.isEmpty(order?.m_menu) &&
            order.status != ORDER_STATUS.STATUS_CANCEL &&
            order?.m_menu?.initial_order_flg !== INITIAL_ORDER_FLG_OFF
        )
      : {};

  const getOrderHasCourse = (orderGroup) => {
    return Array.isArray(orderGroup?.orders)
      ? orderGroup.orders?.find(
          (order) =>
            !Utils.isEmpty(order.m_course) &&
            order.order_type == ORDER_TYPE.ORDER_COURSE &&
            order.status !== ORDER_STATUS.STATUS_CANCEL
        )
      : [];
  };

  const getMasterCourses = async () => {
    try {
      // Get list available courses now
      const response = await ShopOrderApiService.getMasterCourses(
        shop.hashId,
        COURSE_STATUS_ACTIVE,
        COURSE_AVAILABLE_FLAG_TRUE
      );
      setCoursesState(response);
    } catch (error) {
      console.error('[ModalRegisterCustomer] getCategories error', error);
    }
  };

  const listTable = tables.map(({ hash_id: value, code: label, ...rest }) => ({
    value,
    label,
    ...rest,
  }));

  let selectTablesDefault = [{ label: state.table.code, value: state.table.hash_id }];
  if (!Utils.isEmpty(state.ordergroup)) {
    selectTablesDefault = state.ordergroup.tables.map(
      ({ hash_id: value, code: label, ...rest }) => ({ value, label, ...rest })
    );
  }

  const [selectTables, setSelectTables] = useState(selectTablesDefault);

  const handleButtonAddClick = () => {
    setSelectTables([...selectTables, { label: '', value: '' }]);
  };

  const handleButtonRemoveClick = (index) => () => {
    let data = Utils.cloneDeep(selectTables);
    data.splice(index, 1);
    setSelectTables(data);
  };

  const handleButtonDeleteOrder = () => {
    setWaiting(true);
    ShopOrderApiService.request(
      ENDPOINTS.DELETE_ORDER_GROUP,
      [shop.hashId, state.ordergroup.hash_id],
      null
    )
      .then(() => {
        setWaiting(false);
        dispatch({
          type: 'UPDATE',
          payload: {
            ordergroup: { tables: [], orders: [], number_of_customers: '?', code_tables: '?' },
            table: { hash_id: '' },
            totalAmount: 0,
            refresh: true,
            screenName: '',
            refreshAt: '',
            tableGroupName: { firstId: '' },
          },
        });
        PubSub.publish(KEY_UPDATE_DELETED_ORDERGROUP, state.ordergroup);
        setToast({ isShow: true, status: 'success', message: 'Đã hủy bàn thành công!' });
        // Remove course had show end time
        let orderGroupsShowEndedTime =
          JSON.parse(localStorage.getItem(ORDER_GROUP_SHOW_ENDED_TIME)) || [];
        const index = orderGroupsShowEndedTime.indexOf(state.ordergroup.hash_id);
        if (index > -1) {
          orderGroupsShowEndedTime.splice(index, 1);
          localStorage.setItem(
            ORDER_GROUP_SHOW_ENDED_TIME,
            JSON.stringify(orderGroupsShowEndedTime)
          );
        }
      })
      .catch((error) => {
        setWaiting(false);
        console.error('[ModalRegisterCustomer] handleButtonDeleteOrder error', error);
        setToast({ isShow: true, status: 'error', message: 'Delete order error!' });
      });
    dispatch({ type: 'REFRESH' });
    props.onClose();
  };

  const handleSelectTables = (event, index) => {
    let data = Utils.cloneDeep(selectTables);
    data[index].label = '';
    if (!Utils.isEmpty(listTable)) {
      let findTable = listTable.filter((table) => table.value === event.target.value);
      if (!Utils.isEmpty(findTable)) {
        data[index].label = findTable[0].label;
      }
    }
    data[index].value = event.target.value;
    setSelectTables(data);
  };

  const handleOnChangeMember = (event) => {
    setMember(event.target.value);
  };

  const handleButtonSaveClick = () => {
    const m_course = state?.ordergroup ? getCourse(state.ordergroup) : [];
    const numberOfCustomers = state?.ordergroup?.number_of_customers
      ? state.ordergroup.number_of_customers
      : 0;
    const initial_menu = state?.ordergroup ? getInitialMenu(state.ordergroup) : {};

    if (
      state?.ordergroup &&
      !Utils.isEmpty(m_course) &&
      numberOfCustomers != 0 &&
      numberOfCustomers != member
    ) {
      // Case: update order group has course
      setIsConfirmUpdateNumberCourse({ ...isConfirmUpdateNumberCourse, isShow: true });
    } else if (
      state?.ordergroup &&
      !Utils.isEmpty(initial_menu) &&
      numberOfCustomers != 0 &&
      numberOfCustomers != member
    ) {
      // Case: update order group has initial order
      setIsConfirmUpdateInitOrder(true);
    } else {
      createOrUpdateOrderGroup();
    }
  };

  // Handle update or generate QA code, table
  const createOrUpdateOrderGroup = (
    isUpdateCourse = false,
    isUpdateInitOrder = false,
    propertyName = PROPERTY_NAME_COURSE
  ) => {
    const formDataClone = Utils.cloneDeep(formData);
    const errors = checkValidation({
      number_of_customers: member,
    });
    const initial_menu = state?.ordergroup ? getInitialMenu(state.ordergroup) : {};
    setErrorsValidate(errors);
    if (errors.length > 0) {
      setToast({ isShow: true, status: 'error', message: errors[0] });
      return;
    }

    let listTableId = [];
    let tables = Utils.cloneDeep(selectTables);
    let sortTables = tables.sort((a, b) => (a.label > b.label ? 1 : -1));

    for (let selectTable of sortTables) {
      listTableId.push(selectTable.value);
    }

    let endpoints = ENDPOINTS.POST_ORDER_GROUP;
    let params = [shop.hashId];
    let startTime = null;
    let isUpdate = !Utils.isEmpty(state.ordergroup);
    if (isUpdate) {
      endpoints = ENDPOINTS.PUT_ORDER_GROUP;
      params.push(state.ordergroup.hash_id);
      startTime = state.ordergroup?.start_time;
    }

    formDataClone.add_hash_id = listTableId;
    formDataClone.number_of_customers = Number(member);

    if (propertyName === PROPERTY_NAME_COURSE && isUpdateCourse) {
      formDataClone.number_of_customers_of_course = Number(member);
    }

    if (propertyName === PROPERTY_NAME_INITAL_ORDER) {
      formDataClone.is_update_initial_menu_orders = isUpdateInitOrder;
    }

    if (selectedCourse && selectedCourse !== NONE_COURSE_OPTION_VALUE) {
      const course = coursesState.find((courseTmp) => courseTmp.hash_id === selectedCourse);
      if (course && Utils.isEmpty(orderHasCourse)) {
        let blockNearest = getBlockNearestNow(course, startTime);
        if (blockNearest && blockNearest?.hash_id) {
          formDataClone.course_hash_id = selectedCourse;
          formDataClone.course_price_hash_id = blockNearest.hash_id;
        }
      }
    }
    setFormData(formDataClone);
    if (
      !Utils.isEmpty(initial_menu) &&
      propertyName === 'course' &&
      state?.ordergroup?.number_of_customers != Number(member)
    ) {
      // Case: exist initial_menu and has modal confirm for update initial menu
      setIsConfirmUpdateInitOrder(true);
      return;
    }

    setWaiting(true);

    ShopOrderApiService.request(endpoints, params, formDataClone)
      .then(async (result) => {
        setWaiting(false);
        dispatch({ type: 'REGISTER_UPDATE', payload: { firstId: listTableId[0], refresh: true } });
        // case update, close popup customer register
        if (isUpdate) {
          props.onClose();
        }
        localStorage.setItem('smartOrderURL', result.smart_order_url);
        // set order has course
        if (!Utils.isEmpty(result.orders)) {
          const orderCourse = getOrderHasCourse(result);
          if (orderCourse) {
            setOrderHasCourse(orderCourse);
          }
        }
        // local generate QR code
        // link scan QR code to order detail menu
        let linkOrder = `${shop.hashId}&ordergroup_hash_id=${result.hash_id}&shop_name=${encodeURI(
          shop.name
        )}&table_code=${encodeURI(state.tableGroupName.name)}`;

        if (!isUpdate) {
          // go to register/login screen after scan QR code success
          await QRCode.toDataURL(
            `${result.smart_order_url}/customer-order/register?redirect_url=${linkOrder}`
          )
            .then((url) => {
              setShowQRCode({
                isShow: true,
                qrCode: url,
              });
            })
            .catch((err) => {
              console.error(err);
            });
        }

        const newDataShop = await getShopData();
        checkShowReachQRLimitPointsModal(newDataShop);

        setToast({ isShow: true, status: 'success', message: 'Đặt bàn thành công!' });
      })
      .catch((error) => {
        setWaiting(false);
        if (error.message === 'using_over_plan') {
          // Case registers over free plan
          setToast({
            isShow: true,
            status: 'error',
            message: 'Đã sử dụng quá số lượng QR giới hạn',
          });
          props.setRegisterMethodOpen(true);

          return;
        } else if (error.message === 'using_over_highest_plan') {
          // Case registers over highest plan
          setToast({
            isShow: true,
            status: 'error',
            message: 'Đã sử dụng quá số lượng QR giới hạn',
          });
        } else if (error.message === 'pdo_exception') {
          setToast({ isShow: true, status: 'error', message: 'Lỗi máy chủ' });
        } else {
          setToast({ isShow: true, status: 'error', message: error.message });
        }
      });
  };

  const checkShowReachQRLimitPointsModal = (newDataShop) => {
    const servicePlan = newDataShop.service_plan;
    if (servicePlan) {
      const isFreePlan = servicePlan.price == 0;
      if (isFreePlan) {
        const qrCodeRemaining = getQrCodeRemainingNumber(newDataShop);
        if (qrLimitPoints.includes(qrCodeRemaining)) {
          props.setQrLimitPointModalStatus(true);
        }
      }
    }
  };

  const handleShowQRCode = () => {
    const smartOrderURL = localStorage.getItem('smartOrderURL') || window.location.host;
    // link scan QR code to order detail menu
    let linkOrder = `${shop.hashId}&ordergroup_hash_id=${
      state.ordergroup.hash_id
    }&shop_name=${encodeURI(shop.name)}&table_code=${encodeURI(state.tableGroupName.name)}`;
    if (selectedCourse && selectedCourse !== NONE_COURSE_OPTION_VALUE) {
      const course = coursesState.find((courseTmp) => courseTmp.hash_id === selectedCourse);
      if (course) {
        const start_time = state?.ordergroup?.start_time || null;
        let blockNearest = getBlockNearestNow(course, start_time);
        if (blockNearest) {
          linkOrder += `&course_hash_id=${selectedCourse}&block_hash_id=${blockNearest.hash_id}`;
        }
      }
    }
    // go to register/login screen after scan QR code success
    QRCode.toDataURL(`${smartOrderURL}/customer-order/register?redirect_url=${linkOrder}`)
      .then((url) => {
        setShowQRCode({
          isShow: true,
          qrCode: url,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const renderSelectTables = () => {
    const listSelectTable = selectTables.map((item, index) => (
      <Grid key={index} container spacing={3} alignItems='center'>
        <Grid item sm={4} xs={12} className={classes.inputLabel}>
          Bàn
        </Grid>
        <Grid item sm={7} xs={10} className={classes.inputSelect}>
          <CustomSelectorBase
            id={`table-${index}`}
            style={styles.inputRoot}
            classes={{ select: classes.input }}
            value={selectTables[index].value}
            optionArray={listTable}
            onChange={(event) => handleSelectTables(event, index)}
          />
        </Grid>
        <Grid item sm={1} xs={2} className={classes.buttonAddTable}>
          {index === 0 ? (
            <Button onClick={handleButtonAddClick} size='small'>
              <Add style={styles.iconAdd} />
            </Button>
          ) : (
            <Button onClick={handleButtonRemoveClick(index)} size='small'>
              <Remove style={styles.iconAdd} />
            </Button>
          )}
        </Grid>
      </Grid>
    ));
    return listSelectTable;
  };

  const renderActions = () => {
    return (
      <>
        <ButtonCustom
          customClass={classes.button}
          title='Thoát'
          borderRadius='28px'
          bgcolor='#828282'
          borderColor='#828282'
          width='176px'
          onClick={props.onClose}
        />
        <ButtonCustom
          customClass={classes.button}
          title='Lưu'
          borderRadius='28px'
          bgcolor='#FFA04B'
          borderColor='#FFA04B'
          width='176px'
          onClick={handleButtonSaveClick}
        />
      </>
    );
  };

  const onChangeCourse = (event) => {
    let { value } = event.target;
    const course = coursesState.find((courseTmp) => courseTmp.hash_id === value);
    if (course) {
      let blockNearest = getBlockNearestNow(course);
      if (blockNearest) {
        setSelectedCourse(value);

        return;
      }

      // check orderGroup is selected course
      if (state?.ordergroup) {
        const m_course = getCourse(state.ordergroup);
        if (m_course.hash_id === course.hash_id) {
          setSelectedCourse(value);

          return;
        }
      }
    } else if (value === NONE_COURSE_OPTION_VALUE) {
      setSelectedCourse(value);
      return;
    }

    setToast({
      isShow: true,
      status: 'error',
      message: '選択済みのコースに適切なタイムブロックがありません',
    });
    setSelectedCourse(NONE_COURSE_OPTION_VALUE);
  };

  const getQrCodeRemainingNumber = (newDataShop) => {
    const servicePlan = newDataShop.service_plan;
    if (servicePlan) {
      const qrCondition = servicePlan.r_function_conditions.find(
        (conditionTmp) => conditionTmp.m_function.code === FUNCTIONS_CODE.qr
      );
      if (qrCondition) {
        const limitQrNumber = qrCondition.restricted_value;
        const remain = limitQrNumber - newDataShop.usageQRCodeInMonth;

        return remain > 0 ? remain : 0;
      }
    }

    return 0;
  };

  const coursesOption = useMemo(() => {
    let cloneListCourses = [...coursesState];

    // Soft courses by initial_propose_flg
    let listCoursesSorted = cloneListCourses.sort((a, b) => {
      if (b.initial_propose_flg < a.initial_propose_flg) {
        return -1;
      } else if (b.initial_propose_flg > a.initial_propose_flg) {
        return 1;
      } else {
        return 0;
      }
    });

    let options = [];
    options = listCoursesSorted.map((course) => ({
      label: `${course.name} - ${course.time_block_unit} phút`,
      value: course.hash_id,
    }));
    if (state?.ordergroup?.id) {
      // Case update a ordergroup
      if (selectedCourse && !Utils.isEmpty(orderHasCourse)) {
        // Case orderGroup already order course
        const orderedCourse = getCourse(state.ordergroup);
        options.unshift({
          label: `${orderedCourse.name} - ${orderedCourse.time_block_unit}分`,
          value: orderedCourse.hash_id,
        });
      }
    } else {
      // Case create a new ordergroup
      // set default proposal course
      const firstProposalCourse = !Utils.isEmpty(listCoursesSorted)
        ? listCoursesSorted.find(
            (course) => course.initial_propose_flg == INITIAL_PROPOSE_FLG.STATUS_ON
          )
        : [];

      if (!Utils.isEmpty(firstProposalCourse)) {
        setSelectedCourse(firstProposalCourse?.hash_id);
      }
    }

    options.unshift({
      label: '--- Không có ---',
      value: NONE_COURSE_OPTION_VALUE,
    });

    return options;
  }, [coursesState]);

  const renderQRNumberText = () => {
    if (!shopData.service_plan) {
      return '';
    }
    if (shopData.usageQRCodeInMonth === undefined) {
      return '';
    }

    // eslint-disable-next-line no-irregular-whitespace
    let result = `Số QR đã dùng　${shopData.usageQRCodeInMonth}`;
    const qrCondition = getPlanCondition(shopData.service_plan, FUNCTIONS_CODE.qr);
    const additionalPrice = Number(
      qrCondition?.m_function?.m_service_plan_options[0]?.additional_price
    );
    const isShowLimitQR =
      additionalPrice > 0 || (additionalPrice === 0 && qrCondition?.restricted_value === 0);

    if (!isShowLimitQR) {
      // eslint-disable-next-line no-irregular-whitespace
      result += `　（Còn lại ${getQrCodeRemainingNumber(shopData)} QR）`;
    }

    return result;
  };

  return (
    <Modal open={props.open} title='Chọn bàn' actions={renderActions()}>
      <div className={classes.modalContent}>
        <Box className={classes.boxRegister}>
          <ButtonCustom
            customClass={classes.button}
            title='Mã QR'
            disabled={Utils.isEmpty(state.ordergroup)}
            borderRadius='28px'
            bgcolor='#F2C94C'
            borderColor='#F2C94C'
            onClick={handleShowQRCode}
          />
          <ButtonCustom
            customClass={classes.button}
            title='Hủy bàn'
            disabled={Utils.isEmpty(state.ordergroup)}
            borderRadius='28px'
            bgcolor='#F2C94C'
            borderColor='#F2C94C'
            onClick={handleButtonDeleteOrder}
          />
        </Box>

        <Box className={classes.boxContent}>
          {renderSelectTables()}

          {/* customer number */}
          <Grid container spacing={3} alignItems='center'>
            <Grid item sm={4} xs={12} className={classes.inputLabel}>
              Số người
            </Grid>

            <Grid item sm={7} xs={10} className={classes.inputSelect}>
              <OutlinedInput
                id='outlined-adornment-weight'
                type='number'
                value={member}
                classes={{
                  input: classes.inputNumber,
                  notchedOutline:
                    errorsValidate.length && validateCustomerNumber(member, []).length
                      ? classes.inputNumberWarning
                      : null,
                }}
                labelWidth={0}
                inputProps={{
                  min: DEFAULT_NUMBER_OF_CUSTOMERS,
                  max: MAX_NUMBER_OF_CUSTOMERS,
                }}
                onChange={handleOnChangeMember}
              />
            </Grid>

            <Grid item sm={1} xs={2} />
          </Grid>

          {/* courses select */}
          <Grid container spacing={3} alignItems='center'>
            <Grid item sm={4} xs={12} className={classes.inputLabel}>
              Chọn set ăn
            </Grid>

            <Grid item sm={7} xs={10} className={classes.inputSelect}>
              <CustomSelectorBase
                id='courses-select'
                style={styles.inputRoot}
                value={selectedCourse}
                classes={{ select: classes.input }}
                optionArray={coursesOption}
                onChange={onChangeCourse}
                // disabled when selected course and ordered menu
                disabled={selectedCourse && !Utils.isEmpty(orderHasCourse) ? true : false}
              />
            </Grid>

            <Grid item sm={1} xs={2} />
          </Grid>

          {/* QR code limit info */}
          <Grid container spacing={3} alignItems='center' className={classes.gridInfo}>
            <Box className={classes.gridInfoLink}>{renderQRNumberText()}</Box>
          </Grid>
        </Box>
      </div>

      <ModalQRCode
        isOpen={showQRCode.isShow}
        title='QR Code'
        onClose={(isOpen) => {
          setShowQRCode({ ...showQRCode, isShow: isOpen });
        }}
        customClass={classes.smallModalCard}
      >
        <Box display='flex' justifyContent='center'>
          {showQRCode.qrCode && <img src={showQRCode.qrCode} />}
        </Box>
      </ModalQRCode>

      {isConfirmUpdateNumberCourse.isShow && (
        <ModalConfirmUpdate
          isOpen={isConfirmUpdateNumberCourse.isShow}
          title='Xác nhận'
          isModalConfirmUpdateCourse={true}
          onConfirm={() => createOrUpdateOrderGroup(true, false, PROPERTY_NAME_COURSE)}
          onCancel={() => createOrUpdateOrderGroup(false, false, PROPERTY_NAME_COURSE)}
          customClass={classes.smallModalCard}
        >
          <Box>
            <Box textAlign='center' className={classes.boxContent}>
              <Box>Bạn đang đặt một set ăn</Box>
              <Box>Bạn có muốn thay đổi số lượng set ăn？</Box>
            </Box>
          </Box>
        </ModalConfirmUpdate>
      )}
      {isConfirmUpdateInitOrder && (
        <ModalConfirmUpdate
          isOpen={isConfirmUpdateInitOrder}
          title='Xác nhận'
          isModalConfirmInitOrder={true}
          onConfirm={() => createOrUpdateOrderGroup(false, true, PROPERTY_NAME_INITAL_ORDER)}
          onCancel={() => createOrUpdateOrderGroup(false, false, PROPERTY_NAME_INITAL_ORDER)}
          customClass={classes.smallModalCard}
        >
          <Box>
            <Box textAlign='center' className={classes.boxContent}>
              <Box>Bạn đang đặt món</Box>
              <Box>Bạn có muốn thay đổi số lượng món?</Box>
            </Box>
          </Box>
        </ModalConfirmUpdate>
      )}
    </Modal>
  );
};

// PropTypes
ModalRegisterCustomer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  setRegisterMethodOpen: PropTypes.func,
  setQrLimitPointModalStatus: PropTypes.func,
};

// defaultProps
ModalRegisterCustomer.defaultProps = {
  open: false,
  onClose: () => {},
  setRegisterMethodOpen: () => {},
  setQrLimitPointModalStatus: () => {},
};

export default ModalRegisterCustomer;
