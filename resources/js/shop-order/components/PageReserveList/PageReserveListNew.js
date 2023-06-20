import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { sortBy } from 'lodash';
import PubSub from 'pubsub-js';
import moment from 'moment';
moment.locale('vi');

// Components(Material-UI)
import {
  Box,
  Grid,
  Drawer,
} from '@material-ui/core';
import RightSidebarFilter from './components/RightSidebarFilter';
import HiddenRightSidebarFilter from './components/HiddenRightSidebarFilter';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import MainOrdersComponent from 'js/shop-order/components/PageReserveList/components/MainOrdersComponent';
import StaffOrdersComponent from 'js/shop-order/components/PageReserveList/components/StaffOrdersComponent';
import { useStylesNewReserve as useStyles } from './newStyles';
import ModalChangeOrderShipping from './ModalChangeOrderShipping';
import ModalChangeStatusOrder from './components/ModalChangeStatusOrder';
import TimeAndCookPlacesFilter from './components/TimeAndCookPlacesFilter';

// Services
import ShopAuthService from 'js/shop/shop-auth-service';
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Utils
import Utils from 'js/shared/utils';
import { DATE_TIME_SECONDS_FORMAT } from 'js/utils/helpers/timer';
import {ORDER_TYPE, ORDER_STATUS} from 'js/utils/helpers/courseHelper';
import {ALL_COOK_PLACE_VALUE, ALL_STAFFS_VALUE} from 'js/utils/helpers/dishupHelper';
import { PUB_SUB_KEY } from 'js/utils/helpers/const';
import {onConnectWebSocket} from 'js/utils/helpers/socket';

const NOTIFICATION_STATUS_KEY = 'dishup-notification-status';
const FILTER_SORT_BY_TABLE_CODE = 'table_code';
const FILTER_SORT_BY_CREATED_AT = 'create_at';
const DEFAULT_FILTER = {
  cook_place: ALL_COOK_PLACE_VALUE,
  sortBy: FILTER_SORT_BY_CREATED_AT,
  isPriorityFirstOrder: true,
  isCanceled: true,
  isShipped: true,
  isShipping: true,
  selectedStaff: ALL_STAFFS_VALUE,
};

const PageReserveListNew = (props) => {
  const classes = useStyles(props);
  const [shop] = useContext(ShopInfoContext);
  const authUser = ShopAuthService.getUserAuthStatus();

  // local state
  const [refresh, setRefresh] = useState({ refreshAt: new Date() });
  const [isShowNoti, setIsShowNoti] = useState(true);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [orders, setOrders] = useState([]);
  const [cookPlaces, setCookPlaces] = useState([]);
  const [notifies, setNotifies] = useState([{id: 1}]);
  const [isShowChangeShipping, setIsChangeShipping] = useState(false);
  const [isShowOrderStatus, setIsShowOrderStatus] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [staffs, setStaffs] = useState([]);
  const [isDrawerRight, setIsDrawerRight] = useState(false);

  useEffect(() => {
    if (shop.hashId && authUser.statusCode > 0) {
      // Auto refresh data in 30s
      fetchData();
      const timerRefreshData = setInterval(() => {
        fetchOrderGroups();
      }, Utils.REFRESH_CYCLE_DATA());

      // enable/disable notifications alert when load page
      const localNotiStatus = (localStorage.getItem(NOTIFICATION_STATUS_KEY) || 'true') === 'true';
      setIsShowNoti(localNotiStatus);

      return () => clearInterval(timerRefreshData);
    }
  }, [shop, authUser]);

  useEffect(() => {
    const timerRefreshData = setInterval(() => {
      if (isShowNoti && notifies.length < 20) {
        const cloneNotifies = Utils.cloneDeep(notifies);
        cloneNotifies.push({id: 1});
        setNotifies(cloneNotifies);
        // showNotification('New order Notify');
      }
    }, 10000);

    return () => clearInterval(timerRefreshData);
  });

  // Connect to endpoint API Gateway
  useEffect(() => {
    // onConnectWebSocket(shop.hashId);
  }, [shop.hashId]);

  // Refresh data order after customer create a new order
  useEffect(() => {
    PubSub.subscribe(PUB_SUB_KEY.KEY_FRESH_NEW_ORDER, fetchOrderGroupsAndRingAlarm);
  }, []);

  const fetchOrderGroupsAndRingAlarm = () => {
    PubSub.publish(PUB_SUB_KEY.RING_ALARM, null);
    fetchOrderGroups();
  };

  const fetchData = () => {
    fetchCookPlaces();
    fetchStaffs();
    fetchOrderGroups();
  };

  const fetchCookPlaces = async () => {
    try {
      const cookPlacesData = await ShopOrderApiService.getCookPlaces(shop.hashId);
      setCookPlaces(cookPlacesData);
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
      console.error('[PageDishUpNew] getCookPlaces error', error);
    }
  };

  const fetchOrderGroups = async () => {
    try {
      const orderGroups = await ShopOrderApiService.getOrderGroupSummary(shop.hashId);
      let ordersData = [];
      orderGroups.forEach(orderGroup => {
        const table_codes = orderGroup.tables.map(table => table.code).join(', ');
        const menuOrders = orderGroup.orders.filter(
          (orderTmp) =>
            orderTmp.order_type === ORDER_TYPE.ORDER_MENU ||
            orderTmp.order_type === ORDER_TYPE.ORDER_WITHOUT_MENU
        );

        const newOrders = menuOrders.map((order, orderIndex) => ({
          ...order,
          table_codes: table_codes,
          isFirstOrder: order.is_first_order,
        }));
        ordersData = ordersData.concat(newOrders);
      });
      setOrders(ordersData);

      // set refresh time
      setRefresh({ refreshAt: new Date() });
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
      console.error('[PageDishUpNew] getOrderGroupSummary error', error);
    }
  };

  const fetchStaffs = async () => {
    try {
      const staffsResponse = await ShopOrderApiService.getStaffs(shop.hashId, {per_page: '*'});
      setStaffs(staffsResponse.data);
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
      console.error('[PageDishUpNew] getStaffs error', error);
    }
  };

  const handleChangeFilter = (name, value) => {
    const newFilter = {
      ...filter,
      [name]: value,
    }
    setFilter(newFilter);
  };

  const handleQueueOrders = (staffHashId) => {
    const staffsClone = Utils.cloneDeep(staffs);
    const staffIndex = staffsClone.findIndex(staffTmp => staffTmp.hash_id === staffHashId);
    if (staffIndex > -1) {
      staffsClone[staffIndex].isQueue = !staffsClone[staffIndex].isQueue;
      setStaffs(staffsClone);
    }
  };

  const handleShowShippingSelect = (order) => {
    setSelectedOrder(order);
    setIsChangeShipping(true);
  };

  const handleChangeOrderStatus = async (status, staffHashId = null) => {
    if (status === ORDER_STATUS.STATUS_SHIPPING && !staffHashId) {
      setToast({ isShow: true, status: 'warning', message: 'Không có nhân viên nào được chọn' });

      return;
    }

    if (selectedOrder && selectedOrder.id) {
      try {
        const data = {
          m_staff_hash_id: staffHashId,
          t_order_id: selectedOrder.id,
          status: status,
        };
        await ShopOrderApiService.changeShipOrderStatus(shop.hashId, data);
        await fetchOrderGroups();
        setSelectedOrder(null);
        setIsChangeShipping(false);
        setIsShowOrderStatus(false);

        setToast({ isShow: true, status: 'success', message: 'Cập nhật trạng thái thành công' });
      } catch (error) {
        setToast({ isShow: true, status: 'error', message: error.message });
        console.error('[PageDishUpNew] changeShipOrderStatus error', error);
      }
    }
  };

  const headerRightContent = () => {
    return (
      <Link to='/reserve/list'>Danh sách</Link>
    );
  };

  const handleFilterOrders = () => {
    let tmpFilteredOrders = Utils.cloneDeep(orders);
    if (!filter.isShipped) {
      tmpFilteredOrders = tmpFilteredOrders.filter(orderTmp => orderTmp.status !== ORDER_STATUS.STATUS_SHIPPED 
        && orderTmp.status !== ORDER_STATUS.STATUS_FINISH);
    }
    if (!filter.isCanceled) {
      tmpFilteredOrders = tmpFilteredOrders.filter(orderTmp => orderTmp.status !== ORDER_STATUS.STATUS_CANCEL);
    }
    if (filter.cook_place !== ALL_COOK_PLACE_VALUE) {
      tmpFilteredOrders = tmpFilteredOrders
        .filter(orderTmp => orderTmp.m_shop_cook_place && orderTmp.m_shop_cook_place.id === filter.cook_place);
    }
    tmpFilteredOrders = sortBy(tmpFilteredOrders, [
      // Priority First Order
      order => filter.isPriorityFirstOrder ? !order.isFirstOrder : true,
      order => {
        return moment(order.ordered_at, DATE_TIME_SECONDS_FORMAT);
      }
    ]);
    if (filter.sortBy === FILTER_SORT_BY_TABLE_CODE) {
      tmpFilteredOrders = sortBy(tmpFilteredOrders, ['table_codes', 'ordered_at']);
    }

    return tmpFilteredOrders;
  };

  const filteredOrders = handleFilterOrders();

  return (
    <PageContainer padding='0px' height='auto' minHeight='auto'>
      <HeaderAppBar title={shop.name} headerRightContent={headerRightContent()}/>

      <PageInnerContainer backgroundColor='#FFF' height='auto' padding='0px'>
        <div className={classes.row}>
          <div className={classes.content}>
            <TimeAndCookPlacesFilter
              filter={filter}
              refresh={refresh}
              cookPlaces={cookPlaces}
              handleChangeFilter={handleChangeFilter}
              setIsDrawerRight={setIsDrawerRight}
              handleRefreshOrders={fetchData}
            />

            {/* Main content */}
            <div className={classes.mainContent}>
              <Grid container>
                <MainOrdersComponent
                  filteredOrders={filteredOrders}
                  filter={filter}
                  handleShowShippingSelect={handleShowShippingSelect}
                  showChangeOrderStatus={order => {
                    setIsShowOrderStatus(true);
                    setSelectedOrder(order);
                  }}
                />

                {
                  filter.isShipping ? (
                    <>
                      <Box
                        component={Grid}
                        item
                        md={1}
                        display={{ xs: 'none', sm: 'none', md: 'block' }}
                        className={classes.mainArrow}
                      >
                        <img
                          src={`${process.env.MIX_ASSETS_PATH}/img/shop/arrow.png`}
                          onClick={() => handleChangeFilter('isShipping', false)}
                          alt=''
                        />
                      </Box>

                      <StaffOrdersComponent
                        staffs={staffs}
                        filter={filter}
                        filteredOrders={filteredOrders}
                        handleShowShippingSelect={handleShowShippingSelect}
                        handleQueueOrders={handleQueueOrders}
                        showChangeOrderStatus={order => {
                          setIsShowOrderStatus(true);
                          setSelectedOrder(order);
                        }}
                        handleChangeOrderStatus={handleChangeOrderStatus}
                      />
                    </>
                  ) : null
                }
              </Grid>
            </div>
            {/* END Main content */}
          </div>

          {/* Desktop sidebar */}
          <div className={classes.sideBar}>
            <RightSidebarFilter
              staffs={staffs}
              filter={filter}
              isShowNoti={isShowNoti}
              setIsShowNoti={setIsShowNoti}
              handleChangeFilter={handleChangeFilter}
            />
          </div>
          {/* END Desktop sidebar */}
        </div>

        {/* Mobile sidebar */}
        <Drawer
          className={classes.drawer}
          anchor='right'
          open={isDrawerRight}
          onClose={() => setIsDrawerRight(false)}
        >
          <HiddenRightSidebarFilter
            staffs={staffs}
            cookPlaces={cookPlaces}
            filter={filter}
            isShowNoti={isShowNoti}
            setIsShowNoti={setIsShowNoti}
            handleChangeFilter={handleChangeFilter}
            setIsDrawerRight={setIsDrawerRight}
          />
        </Drawer>
        {/* END Mobile sidebar*/}
      </PageInnerContainer>

      <ModalChangeOrderShipping
        open={isShowChangeShipping}
        staffs={staffs}
        onClose={() => {
          setIsChangeShipping(false);
          setSelectedOrder(null);
        }}
        handleChangeOrderStatus={handleChangeOrderStatus}
        setToast={setToast}
      />

      <ModalChangeStatusOrder
        open={isShowOrderStatus}
        onClose={() => {
          setIsShowOrderStatus(false);
          setSelectedOrder(null);
        }}
        handleChangeOrderStatus={handleChangeOrderStatus}
        filter={filter}
      />

      <FlashMessage
        isOpen={toast.isShow}
        onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
        status={toast.status}
        message={toast.message}
      />
    </PageContainer>
  );
};

PageReserveListNew.propTypes = {};
export default PageReserveListNew;
