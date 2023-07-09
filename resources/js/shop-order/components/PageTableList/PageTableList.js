import React, { useState, useEffect, useContext, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';
moment.locale('vi');
import { sortBy } from 'lodash';
import PubSub from 'pubsub-js';
import { isMobile } from 'react-device-detect';
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Services
import ShopAuthService from 'js/shop/shop-auth-service';
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopApiService from 'js/shop/shop-api-service';

// Context
import PageTableListContext, { pageReducer, formatAmount } from './PageTableListContext';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared-order/components/PageInnerContainer';
import TableCard from 'js/shared-order/components/TableCard';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import Waiting from 'js/shared/components/Waiting';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import ModalRegisterCustomer from './ModalRegisterCustomer';
import ModalWaittingPaymentRequest from './ModalWaittingPaymentRequest';
import ModalPaymentRequest from './ModalPaymentRequest';
import ModalSubmitPaymentRequest from './ModalSubmitPaymentRequest';
import PageOrderManager from './PageOrderManager';
import ModalRegisterPaymentMethod from 'js/utils/components/Payment/ModalRegisterPaymentMethod';
import ModalReachQRLimitPoint from 'js/utils/components/Payment/ModalReachQRLimitPoint';
import ModalOrderDetail from './ModalOrderDetail';

// Common AWS WebSocket components
import { onConnectWebSocket } from 'js/utils/helpers/socket';

// Components(Material-UI)
import { Button, Box, Link as ButtonLink, ClickAwayListener } from '@material-ui/core';
import ModalAnnouncementsSetting from 'js/shop-order/components/PageTableList/ModalAnnouncements/ModalAnnouncementsSetting';

// Styles
import { useStylesPageTableList as useStyles } from './styles';

// Icons
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';

// Utils
import Utils from 'js/shared/utils';
import { ORDER_STATUS, ORDER_GROUP_STATUS } from 'js/utils/helpers/courseHelper';
import { PUB_SUB_KEY, makeRandomId } from 'js/utils/helpers/const';
import {ALARM_AUDIO_PATH} from "../../../utils/helpers/const";
const DEFAULT_QUANTITY_ORDER = 1;
const MAX_CHARACTER_SHOP_NAME = 12;

const DetailTableSiderbarItem = (props) => {
  const classes = useStyles(props);
  const [shop] = useContext(ShopInfoContext);

  const {
    title,
    children,
    type,
    showModal,
    dataSidebar,
    onClickToOrder,
    onClickToWaittingPayment,
    onClickToPayment,
    renderMenuOrder,
    totalAmount,
    onClickToRemoveWaittingPayment,
    handleChangeOrders,
    totalAmountDraft,
    disabledButtonOrder,
    handleShowMenu,
    ...rest
  } = props;

  const showBorder = dataSidebar?.ordergroup?.orders?.length;

  return (
    <Box className={classes.info} position='relative'>
      <Box className={classes.tableInfoContent}>
        <Box display='flex' className={classes.tableInfoDetail}>
          <Box flexGrow={1} className={classes.headerText}>
            Trạng thái
          </Box>
          {!showModal.order && (
            <Button
              className={`${classes.tableInfoRightButton}
                ${
                  dataSidebar?.ordergroup?.code_tables !== '?' &&
                  !Utils.isEmpty(dataSidebar?.ordergroup)
                    ? ' active'
                    : ' '
                }`}
              variant='contained'
              onClick={() => {
                if (parseInt(dataSidebar?.ordergroup?.status) === ORDER_GROUP_STATUS.WAITING_CHECKOUT) {
                  return onClickToRemoveWaittingPayment();
                } else {
                  handleShowMenu(false)
                  return onClickToOrder();
                }
              }}
              {...rest}
            >
              {parseInt(dataSidebar?.ordergroup?.status) == ORDER_GROUP_STATUS.WAITING_CHECKOUT
                ? 'Hủy thanh toán'
                : 'Thay đổi'}
            </Button>
          )}
        </Box>
        <Box
          className={`${classes.orderGroupDetail} ${showBorder && classes.borderTopGroupOrder} orderGroupDetail`}
        >
          {renderMenuOrder}
        </Box>
        <Box className={classes.paymentInfo}>
          <Box
            display='flex'
            className={classes.tableInfoDetail}
            alignItems={'center'}
            margin={'5px'}
          >
            <Box width={'30%'}></Box>
            <Box width={'30%'} textAlign={'center'}>
              Tổng tiền
            </Box>
            <Box width={'40%'} textAlign={'right'}>
              {showModal?.order
                ? formatAmount(totalAmountDraft)
                : totalAmount && totalAmount !== '0'
                ? totalAmount
                : ''}
              {shop?.mShopPosSetting?.m_currency?.name}
            </Box>
          </Box>
          {!showModal?.order && (
            <Box mt={{xs: 2, sm: 6}}>
              <Button
                variant='contained'
                className={`${classes.button}
                ${
                  dataSidebar?.ordergroup?.code_tables !== '?' &&
                  !Utils.isEmpty(dataSidebar?.ordergroup)
                    ? ' active'
                    : ' '
                }`}
                onClick={() => {
                  if (parseInt(dataSidebar?.ordergroup?.status) === ORDER_GROUP_STATUS.WAITING_CHECKOUT) {
                    return onClickToPayment();
                  } else {
                    return onClickToWaittingPayment();
                  }
                }}
                style={{ padding: '3px 18px' }}
                {...rest}
              >
                {title}
              </Button>
            </Box>
          )}

          {showModal.order && (
            <Box mt={{xs: 2, sm: 6}}>
              <Button
                variant='contained'
                className={`${classes.button}
                ${
                  dataSidebar?.ordergroup?.code_tables !== '?' &&
                  !Utils.isEmpty(dataSidebar?.ordergroup)
                    ? ' active'
                    : ' '
                } buttonChangeOrder`}
                disabled={disabledButtonOrder ? true : false}
                onClick={handleChangeOrders}
                style={{ padding: '3px 18px' }}
              >
                Gọi thêm món
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

DetailTableSiderbarItem.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  dataSidebar: PropTypes.object,
  children: PropTypes.node,
  onClickToOrder: PropTypes.func,
  onClickToWaittingPayment: PropTypes.func,
  onClickToPayment: PropTypes.func,
  renderMenuOrder: PropTypes.array,
  totalAmount: PropTypes.string,
  onClickToRemoveWaittingPayment: PropTypes.func,
};

const TableInfoSiderbar = (props) => {
  const classes = useStyles(props);
  const { title, state, timeAgo, handleShowMenu, showModal, ...rest } = props;

  return (
    <>
      <Box className={classes.hiddenMenu} onClick={() => handleShowMenu(false)}>
        ＞＞Đóng＞＞
      </Box>
      <Box className={classes.tableInfo}>
        <Box className={classes.tableInfoContent}>
          <Box display='flex' className={classes.tableInfoDetail}>
            <Box flexGrow={1} className={classes.headerText}>
              {`Bàn: ${
                Utils.isEmpty(state.ordergroup)
                  ? state.table.code || '?'
                  : state.ordergroup.code_tables
              }`}
            </Box>
            {state.ordergroup.code_tables !== '?' &&
              !Utils.isEmpty(state.ordergroup) &&
              !showModal.order && (
                <Button
                  className={`${classes.tableInfoRightButton} ${' active'}`}
                  variant='contained'
                  {...rest}
                >
                  Mã QR
                </Button>
              )}
          </Box>
          {state.ordergroup.code_tables !== '?' && !Utils.isEmpty(state.ordergroup) && (
            <>
              <Box
                className={[classes.tableInfoDetail, classes.headerText].join(' ')}
                style={{ paddingRight: '20px' }}
              >{`Số lượng: ${state.ordergroup.number_of_customers} người`}</Box>
              <Box className={[classes.tableInfoDetail, classes.headerText].join(' ')}>
                Thời gian đặt bàn: {' '}
                <span>
                  {' ' + moment(state.ordergroup.created_at_utc).format('HH:mm')}
                  {/*{timeAgo ? ` ${timeAgo}` : ''}*/}
                </span>
              </Box>
            </>
          )}
        </Box>
        {(Utils.isEmpty(state.ordergroup) || state.ordergroup.code_tables === '?') && (
          <Button
            variant='contained'
            className={`${classes.button} ${
              state.ordergroup.code_tables !== '?' ? ' active' : ' '
            }`}
            {...rest}
            style={{ padding: '3px 18px' }}
          >
            {title}
          </Button>
        )}
      </Box>
    </>
  );
};

TableInfoSiderbar.propTypes = {
  title: PropTypes.string,
  state: PropTypes.object,
  timeAgo: PropTypes.number,
  showModal: PropTypes.object,
  handleShowMenu: PropTypes.func,
};

const PageTableList = (props) => {
  const classes = useStyles(props);
  const childRef = useRef();

  const [shop] = useContext(ShopInfoContext);
  const authUser = ShopAuthService.getUserAuthStatus();
  const authContext = useContext(ShopAuthService.context);

  // Local state
  const [waiting, setWaiting] = useState(false);
  const [registerMethodOpen, setRegisterMethodOpen] = useState(false);
  const [qrLimitPointModalStatus, setQrLimitPointModalStatus] = useState(false);
  const [servicePlans, setServicePlans] = useState([]);
  const [showModal, setShowModal] = useState({
    register: false,
    order: false,
    waitingPayment: false,
    payment: false,
    submitPayment: false,
  });
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [infoPayment, setInfoPayment] = useState(null);
  // announcements state
  const [isShowAnnouncements, setIsShowAnnouncements] = useState(false);
  const [listPreOrderRemove, setListPreOrderRemove] = useState([]);
  const [listPreOrderUpdate, setListPreOrderUpdate] = useState([]);
  const [listNewMenus, setListNewMenus] = useState([]);
  const [listPreOrder, setListPreOrder] = useState([]);
  const [courseOrder, setCourseOrder] = useState(null);
  const [disabledButtonOrder, setDisabledButtonOrder] = useState(true);

  const [state, dispatch] = useReducer(pageReducer, {
    ordergroup: {
      tables: [],
      orders: [],
      number_of_customers: '?',
      code_tables: '?',
      created_at_utc: null,
      status: null,
    },
    table: { hash_id: '' },
    totalAmount: 0,
    isRefresh: true,
    screenName: '',
    refreshAt: '',
    tableGroupName: { firstId: '', name: '' },
  });

  const [allOrders, setAllOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [ordergroups, setOrdergroups] = useState([]);
  const [dataSidebar, setDataSidebar] = useState({
    ordergroup: { tables: [], orders: [], number_of_customers: '?', code_tables: '?' },
    table: {},
    totalAmount: 0,
  });
  const [totalAmountDraft, setTotalAmountDraft] = useState(0);

  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  const [orderDetail, setOrderDetail] = useState({
    isShow: false,
    data: { name: '', quantity: DEFAULT_QUANTITY_ORDER, s_image_folder_path: '' },
  });

  const [timeAgo, setTimeAgo] = useState(null);
  const [shopTaxInfo, setShopTaxInfo] = useState({});
  const [accessToken, setAccessToken] = useState('');

  // Refresh data after paying on popup end time
  useEffect(() => {
    PubSub.subscribe(PUB_SUB_KEY.KEY_FRESH_PAYMENT_ORDERGROUP, refreshDataAfterPayment);
  }, []);

  const refreshDataAfterPayment = (msg, data) => {
    if (msg === PUB_SUB_KEY.KEY_FRESH_PAYMENT_ORDERGROUP && !Utils.isEmpty(data)) {
      setToast({ isShow: true, status: 'success', message: 'Thanh toán thành công!' });
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
    }
  };

  // Refresh data order after update quantity of order on popup end time
  useEffect(() => {
    PubSub.subscribe(PUB_SUB_KEY.KEY_FRESH_UPDATE_ORDER, refreshDataAfterUpdateOrder);
  }, [PubSub.subscribe(PUB_SUB_KEY.KEY_FRESH_UPDATE_ORDER, refreshDataAfterUpdateOrder)]);

  const refreshDataAfterUpdateOrder = (msg, data) => {
    if (msg === PUB_SUB_KEY.KEY_FRESH_UPDATE_ORDER && !Utils.isEmpty(data)) {
      dispatch({ type: 'REFRESH' });
    }
  };
  
  useEffect(() => {
    getAccessToken();
  }, []);

  // Connect to endpoint API Pusher
  useEffect(() => {
    // onConnectWebSocket(shop.hashId);
    if (accessToken == '') {
      return;
    }
    
    // window.Pusher = Pusher;
    const echo = new Echo({
      broadcaster: 'pusher',
      key: process.env.MIX_PUSHER_APP_KEY,
      cluster: process.env.MIX_PUSHER_APP_CLUSTER,
      forceTLS: true,
      auth: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
    });
    
    echo.channel(`order.created.${shop.hashId}`)
      .listen('OrderCreated', (e) => {
        const sound = new Howl({
          src: ALARM_AUDIO_PATH,
          volume: 10, // 1000%
        });
        sound.play();
        dispatch({ type: 'REFRESH' });
      });
  }, [accessToken]);

  // Refresh data after has new order
  useEffect(() => {
    PubSub.subscribe(PUB_SUB_KEY.KEY_FRESH_NEW_ORDER, refreshDataWhenHasNewOrder);
  }, []);

  //get shop tax info
  useEffect(() => {
    getShopTaxInfo();
  }, []);

  const getShopTaxInfo = async () => {
    let shopDataInfo = await ShopApiService.getShopTaxInfo(shop?.hashId);

    setShopTaxInfo(shopDataInfo);
  };
  
  const getAccessToken = async () => {
    const token = await ShopApiService.authService.getIdToken();
    
    setAccessToken(token);
  }

  const refreshDataWhenHasNewOrder = (msg, data) => {
    if (msg === PUB_SUB_KEY.KEY_FRESH_NEW_ORDER && !Utils.isEmpty(data)) {
      dispatch({ type: 'REFRESH' });
      PubSub.publish(PUB_SUB_KEY.RING_ALARM, null);
    }
  };

  useEffect(() => {
    if (!showModal.order) {
      // Only update allOrders state before come to new order screen
      const sortData = sortBy(state.ordergroup.orders, 'status').filter(
        (order) => order.status !== ORDER_STATUS.STATUS_CANCEL
      );
      const addNewkeyData = sortData.map((order) => {
        return {...order, new_hash_id: makeRandomId(16)};
      });
      setAllOrders(addNewkeyData);
    }
    /** Update immediately upon status change */
    handleTimeAgo(state.ordergroup.created_at);
    const timer = setInterval(() => {
      /** Updated periodically: {REFRESH_CYCLE_TIME_AGO}ms */
      handleTimeAgo(state.ordergroup.created_at);
    }, Utils.REFRESH_CYCLE_TIME_AGO());
    return () => clearInterval(timer);
  }, [state]);

  useEffect(() => {
    const timerRefreshData = setInterval(() => {
      /** Updated periodically: {REFRESH_CYCLE_DATA}ms */
      console.debug(
        '[PageTableList] REFRESH_CYCLE_DATA',
        Utils.REFRESH_CYCLE_DATA(),
        authContext.isSignedIn
      );
      if (shop.hashId && authContext.isSignedIn) {
        fetchData();
      }
    }, Utils.REFRESH_CYCLE_DATA());
    return () => clearInterval(timerRefreshData);
  });

  useEffect(() => {
    if (state.isRefresh && shop.hashId && authUser.statusCode > 0) {
      fetchData();
    }
    if (!showModal.order) {
      // Only update all state below before back to table list screen
      setListPreOrderRemove([]);
      setListNewMenus([]);
      setListPreOrder([]);
      setListPreOrderUpdate([]);
      setCourseOrder(null);
    }
  }, [shop, state, authUser]);

  useEffect(() => {
    // getServicePlans();
  }, [shop]);

  useEffect(() => {
    const orderGroups = state?.ordergroup?.orders?.filter(
      (order) => order.status !== ORDER_STATUS.STATUS_CANCEL
    );
    const totalAmountDraftClone = allOrders
      ?.filter((item) => item.status !== ORDER_STATUS.STATUS_CANCEL)
      ?.reduce((partialSum, _item) => partialSum + Number(_item.quantity) * Number(_item.price), 0);
    setTotalAmountDraft(totalAmountDraftClone);

    const quantityOfAllOrders = allOrders?.reduce(
      (partialSum, _item) => partialSum + Number(_item.quantity),
      0
    );

    const quantityOfOrdergroup = orderGroups?.reduce(
      (partialSum, _item) => partialSum + Number(_item.quantity),
      0
    );

    const listNewCancelOrders = allOrders?.filter(
      (item) => item.status === ORDER_STATUS.STATUS_CANCEL
    );
    const listOldCancelOrders = orderGroups?.filter(
      (item) => item.status === ORDER_STATUS.STATUS_CANCEL
    );

    orderGroups?.length !== allOrders.length ||
    state?.totalAmount !== totalAmountDraftClone ||
    listNewCancelOrders.length !== listOldCancelOrders.length ||
    quantityOfAllOrders !== quantityOfOrdergroup
      ? setDisabledButtonOrder(false)
      : setDisabledButtonOrder(true);
  }, [allOrders]);

  useEffect(() => {
    if (!showModal.order) {
      document.getElementsByClassName('wrapperContent')[0].style.overflowY = 'auto';
    }
  }, [showModal.order]);

  const fetchData = () => {
    console.debug('[PageTableList] fetchData');
    ShopOrderApiService.getTables(shop.hashId)
      .then((result) => {
        if (result.length > 0) {
          setTables(result);
          /**
           * status: '0,1,2'
           * ---------------------
           * 'STATUS_ORDER'   => '0'
           * 'STATUS_FINISH'  => '1'
           * 'STATUS_CANCEL'  => '2'
           * 'SHIPPING'       => '3'
           * 'SHIPPED'        => '4'
           */
          ShopOrderApiService.getOrderGroupSummary(shop.hashId, false, { status: '0,1,2,3,4' })
            .then((result) => {
              setOrdergroups(result);
            })
            .catch((error) => {
              setToast({ isShow: true, status: 'error', message: error.message });
              console.error('[PageTableList] getInit error', error);
            });
        }
      })
      .catch((error) => {
        setToast({ isShow: true, status: 'error', message: error.message });
        console.error('[PageTableList] getInit error', error);
      });
  };

  const getServicePlans = async () => {
    const servicePlansRes = await ShopApiService.getServicePlans();
    setServicePlans(servicePlansRes);
  };

  const handleTimeAgo = (date) => {
    if (date) {
      let nowDateTime = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
      let nowMomentJp = moment(nowDateTime, 'YYYY-MM-DD HH:mm:ss');
      setTimeAgo(
        Math.round(
          moment.duration(nowMomentJp.diff(moment(date, 'YYYY-MM-DD HH:mm:ss'))).asMinutes()
        )
      );
    }
  };

  const handleButtonSelectTableClick = (ordergroup, tableGroupName, table) => {
    dispatch({ type: 'UPDATE', payload: { ordergroup, table, refresh: false, tableGroupName } });
    handleTimeAgo(ordergroup.created_at);
    handleShowMenu(true);
  };

  const renderTables = () => {
    return tables.map((table) => {
      return (
        <TableCard
          key={table.hash_id}
          table={table}
          filterStatus={[0, 1, 2, 3, 4]}
          onClick={(ordergroup, tableGroupName) => {
            handleButtonSelectTableClick(ordergroup, tableGroupName, table)
          }}
        />
      );
    });
  };

  const handleModal = (key, value) => () => {
    setShowModal({ ...showModal, [key]: value });
  };

  const handleWaittingPayment = (orderGroup) => () => {
    // Get orders have not been served
    const ordersNotFinished = getOrdersNotFinished(orderGroup);
    if (!Utils.isEmpty(ordersNotFinished)) {
      // Show modal warning
      setShowModal({ ...showModal, waitingPayment: true });
    } else {
      // Update status of ordergroup = 3 (waitting payment - stop order)
      updateWaittingPayment(orderGroup, true);
    }
  };

  const getOrdersNotFinished = (orderGroup) => {
    return Array.isArray(orderGroup?.orders)
      ? orderGroup.orders?.filter(
        (order) => [ORDER_STATUS.STATUS_ORDER, ORDER_STATUS.STATUS_SHIPPING].includes(order.status)
      )
      : [];
  };

  const updateWaittingPayment = async (orderGroup, status) => {
    try {
      setWaiting(true);
      const data = { flag: status };
      const response = await ShopOrderApiService.waittingPayment(
        shop.hashId,
        orderGroup.hash_id,
        data
      );
      if (response) {
        setWaiting(false);
        setToast({ isShow: true, status: 'success', message: 'Cập nhật thành công' });
        dispatch({ type: 'REFRESH' });
      }
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
    }
  };

  const hanldeChangeQuantity = (item) => {
    let order = {
      isShow: true,
      data: { ...item },
    };
    setOrderDetail(order);
  };

  const renderMenuOrder = () => {
    if (allOrders && allOrders.length > 0) {
      const orders = sortBy(allOrders, 'status');
      const elementMenuOrder = orders.map((order, index) => {
        let status = '';
        let label = '';
        const clickAllowed =
          order?.status !== ORDER_STATUS.STATUS_CANCEL &&
          order?.status !== ORDER_STATUS.STATUS_FINISH &&
          showModal.order;

        if (
          order.status === ORDER_STATUS.STATUS_ORDER ||
          order.status === ORDER_STATUS.STATUS_SHIPPING
        ) {
          status = 'preparing';
          label = 'Chuẩn bị';
        } else if (
          order.status === ORDER_STATUS.STATUS_FINISH ||
          order.status === ORDER_STATUS.STATUS_SHIPPED
        ) {
          status = 'finished';
          label = 'Đã xong';
        } else {
          status = 'cancelled';
          label = 'Hủy';
        }

        return (
          <div
            key={index}
            className={classes.menuItem}
            onClick={() => {
              if (clickAllowed) return hanldeChangeQuantity(order);
            }}
          >
            <div className={classes.menuItemRight}>
              <div className={`${classes.labelStatus} ${status}`}>
                {/*<span>{label}</span>*/}
              </div>
              <div className={classes.orderName}>{order.name}</div>
            </div>
            <div className={classes.orderInfo}>
              <div className={classes.quantityItem}>{order.quantity}</div>
              <div className={classes.amountItem}>
                {order.amount}
                {shop?.mShopPosSetting?.m_currency?.name}
              </div>
            </div>
          </div>
        );
      });

      return elementMenuOrder;
    }
  };

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const isShowOnlyIconButton = () => isMobile && shop?.name?.length >= MAX_CHARACTER_SHOP_NAME;

  const headerRightContent = () => {
    return (
      <div className={classes.headerActions}>
        <ButtonLink
          className={`${classes.buttonHeader} ${isShowOnlyIconButton() ? classes.roundBorder : ''}`}
          onClick={() => setIsShowAnnouncements(true)}
        >
          <AssignmentOutlinedIcon></AssignmentOutlinedIcon>
          {
            isShowOnlyIconButton() ? null : <span>Tin tức</span>
          }
        </ButtonLink>

        <ClickAwayListener onClickAway={handleClickAway}>
          <div className={`${classes.buttonDropDown}`}>
            <button
              type='button'
              className={isShowOnlyIconButton() ? classes.roundBorder : ''}
              onClick={handleClick}
            >
              <HelpOutlineOutlinedIcon></HelpOutlineOutlinedIcon>
              {isShowOnlyIconButton() ? null : <span>Phản hồi/Thắc mắc</span>}
            </button>

            {open ? (
              <div className={classes.dropdown}>
                <div className={classes.dropdownItem}>
                  <a
                    className={classes.linkContact}
                    target='_blank'
                    href={process.env.MIX_CONTACT_LINK}
                    onClick={handleClick}
                    rel='noreferrer noopener'
                  >
                    <EmailOutlinedIcon></EmailOutlinedIcon>
                    Email
                  </a>
                </div>

                <div className={classes.dropdownItem}>
                  <a
                    className={classes.linkContact}
                    target='_blank'
                    href={process.env.MIX_MANUAL_LINK}
                    onClick={handleClick}
                    rel='noreferrer noopener'
                  >
                    <div className={classes.iconArrow}>
                      <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/arrow.PNG`} />
                    </div>
                    Liên hệ
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </ClickAwayListener>
      </div>
    );
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

  const handleShowMenu = (isShow) => {
    setIsShowMenu(isShow);
  };

  // Shop plan free in shop name
  const renderShopName = () => {
    let planName = '';
    if (shop.service_plan) {
      planName = shop.service_plan.name;
    } else {
      const freePlan = servicePlans.find((planTmp) => parseFloat(planTmp.price) == 0.0);
      if (freePlan) {
        planName = freePlan.name;
      }
    }

    return planName ? (
      <Box display='flex' alignItems='center' flexDirection={{xs: 'column', sm: 'row'}}>
        <Box className={classes.shopName}>{shop.name}</Box>
        <Box className={classes.planName}>{planName}</Box>
      </Box>
    ) : (
      shop.name
    );
  };

  return (
    <PageTableListContext.Provider
      value={{
        waiting,
        setWaiting,
        toast,
        setToast,
        dataSidebar,
        setDataSidebar,
        tables,
        state,
        dispatch,
        ordergroups,
        setOrdergroups,
        courseOrder,
        setCourseOrder,
        allOrders,
        setAllOrders,
        listPreOrderRemove,
        setListPreOrderRemove,
        listPreOrderUpdate,
        setListPreOrderUpdate,
        listNewMenus,
        setListNewMenus,
        listPreOrder,
        setListPreOrder,
      }}
    >
      <PageContainer padding='0px'>
        <div className={classes.root}>
          <HeaderAppBar title={renderShopName()} headerRightContent={headerRightContent()} />

          <PageInnerContainer backgroundColor={showModal.order ? '#FFF' : '#E0E0E0'}>
            <div className={classes.row}>
              <div className={`${classes.content} wrapperContent`}>
                <Box className={classes.boxShowSideBar}>
                  <Box className={`${classes.showMenu} ${!disabledButtonOrder ? 'redText' : ''}`} onClick={() => handleShowMenu(true)}>
                    {disabledButtonOrder ? '＜＜Mở＜＜' : '＜＜Xác nhận đặt món'}
                  </Box>
                </Box>

                {!showModal.order && <div className={classes.contentTable}>{renderTables()}</div>}

                {showModal.order && (
                  <PageOrderManager
                    showWarningMessage={showWarningMessage}
                    showSuccessMessage={showSuccessMessage}
                    backtoTableList={handleModal('order', false)}
                    renderMenuOrder={renderMenuOrder}
                    showModal={showModal}
                    handleShowMenu={handleShowMenu}
                    ref={childRef}
                  />
                )}
              </div>

              <div className={`${classes.sideBar} ${isShowMenu ? classes.menuMobile : ''}`}>
                <TableInfoSiderbar
                  type='register'
                  title='Chi tiết bàn'
                  state={state}
                  timeAgo={timeAgo}
                  disabled={state.ordergroup.code_tables === '?'}
                  showModal={showModal}
                  onClick={handleModal('register', true)}
                  handleShowMenu={handleShowMenu}
                />

                <DetailTableSiderbarItem
                  title={
                    state.ordergroup.status &&
                    parseInt(state.ordergroup.status) === ORDER_GROUP_STATUS.WAITING_CHECKOUT
                      ? 'Thanh toán'
                      : 'Kết thúc'
                  }
                  dataSidebar={state}
                  onClickToOrder={handleModal('order', true)}
                  onClickToWaittingPayment={handleWaittingPayment(state.ordergroup)}
                  onClickToPayment={handleModal('payment', true)}
                  renderMenuOrder={renderMenuOrder([0])}
                  disabled={Utils.isEmpty(state.ordergroup) || state.ordergroup.code_tables === '?'}
                  totalAmount={formatAmount(state.totalAmount)}
                  handleChangeOrders={() => childRef.current.handleButtonSaveClick()}
                  showModal={showModal}
                  totalAmountDraft={totalAmountDraft}
                  disabledButtonOrder={disabledButtonOrder}
                  handleShowMenu={handleShowMenu}
                  onClickToRemoveWaittingPayment={() =>
                    updateWaittingPayment(state.ordergroup, false)
                  }
                />
              </div>
            </div>
          </PageInnerContainer>
        </div>

        {showModal.register && (
          <ModalRegisterCustomer
            open={showModal.register}
            onClose={handleModal('register', false)}
            setRegisterMethodOpen={setRegisterMethodOpen}
            setQrLimitPointModalStatus={setQrLimitPointModalStatus}
          />
        )}
        {showModal.waitingPayment && (
          <ModalWaittingPaymentRequest
            open={showModal.waitingPayment}
            onClose={handleModal('waitingPayment', false)}
          />
        )}
        {showModal.payment && (
          <ModalPaymentRequest
            open={showModal.payment}
            onClose={handleModal('payment', false)}
            handleModal={handleModal('submitPayment', true)}
            getInfoPayment={(value) => setInfoPayment(value)}
            shopTaxInfo={shopTaxInfo}
          />
        )}
        {showModal.submitPayment && (
          <ModalSubmitPaymentRequest
            open={showModal.submitPayment}
            onClose={handleModal('submitPayment', false)}
            infoPayment={infoPayment}
            closeModalPayment={() => {
              setShowModal({ ...showModal, submitPayment: false, payment: false });
            }}
          />
        )}
      </PageContainer>
      <Waiting isOpen={waiting} />

      <ModalAnnouncementsSetting
        open={isShowAnnouncements}
        shop={shop}
        setToast={setToast}
        onClose={() => setIsShowAnnouncements(false)}
      />

      <ModalRegisterPaymentMethod
        open={registerMethodOpen}
        onClose={() => {
          setQrLimitPointModalStatus(false);
          setRegisterMethodOpen(false);
        }}
        showWarningMessage={showWarningMessage}
        showSuccessMessage={showSuccessMessage}
        isQrLimitInPoints={qrLimitPointModalStatus}
      />

      <ModalReachQRLimitPoint
        open={qrLimitPointModalStatus}
        onClose={() => setQrLimitPointModalStatus(false)}
        onShowChangeServicePlan={() => setRegisterMethodOpen(true)}
      />

      <ModalOrderDetail orderDetail={orderDetail} setOrderDetail={setOrderDetail} />

      <FlashMessage
        isOpen={toast.isShow}
        onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
        status={toast.status}
        message={toast.message}
      />
      {/* <Dialog isOpen={toast.isShow}
        onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
        title='Title'
        message='Content'
        onConfirm={() => console.log('onConfirm')}
        /> */}
    </PageTableListContext.Provider>
  );
};

PageTableList.propTypes = {};
export default PageTableList;
