/**
 * Page Reserve List
 */
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PubSub from 'pubsub-js';
import moment from 'moment';
moment.locale('vi');
import { orderBy } from 'lodash';

// Styles
import { useStylesReserve as useStyles, stylesReserve as styles } from './styles';

// Services
import ShopAuthService from 'js/shop/shop-auth-service';
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import PageReserveListContext from './PageReserveListContext';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import ButtonCustom from 'js/shared-order/components/Button';
import CustomSelectorBase from 'js/shared/components/CustomSelectorBase';
import ModalDetailReserve from './ModalDetailReserve';
import Waiting from 'js/shared/components/Waiting';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import CookPlaceSelect from 'js/shop-order/components/PageReserveList/components/CookPlaceSelect';

// Common AWS WebSocket components
// import { onConnectWebSocket } from 'js/utils/helpers/socket';

// Components(Material-UI)
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
  FormControlLabel,
  Checkbox,
  TableHead,
} from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

// Utils
import Utils from 'js/shared/utils';
import { PUB_SUB_KEY } from 'js/utils/helpers/const';
import { ALL_COOK_PLACE_VALUE } from 'js/utils/helpers/dishupHelper';
import { ORDER_TYPE, ORDER_STATUS } from 'js/utils/helpers/courseHelper';

const SORT_OPTIONS = [
  {
    label: 'Mới -> Cũ',
    value: 1,
  },
  {
    label: 'Cũ -> Mới',
    value: 2,
  },
  // {
  //   label: 'Thứ tự bàn (Mới -> Cũ)',
  //   value: 3,
  // },
  // {
  //   label: 'Thứ tự bàn (Cũ -> Mới)',
  //   value: 4,
  // },
];
const DEFAULT_SORT_OPTION = 1;
const DEFAULT_FILTER = {
  cook_place: ALL_COOK_PLACE_VALUE,
  sort_option: DEFAULT_SORT_OPTION,
  showCancelOrders: false,
  showCourseOrder: false,
  showServedOrders: false,
};

const PageReserveList = (props) => {
  const classes = useStyles(props);
  const [shop] = useContext(ShopInfoContext);
  const authUser = ShopAuthService.getUserAuthStatus();
  const [waiting, setWaiting] = useState(false);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [refresh, setRefresh] = useState({ refreshAt: new Date() });
  const [showLoading, setShowLoading] = useState(true);
  const [showModalDetailReserve, setShowModalDetailReserve] = useState(false);
  const [orderGroupSummany, setOrderGroupSummany] = useState([]);
  const [cookPlaces, setCookPlaces] = useState([]);
  const [orderGroup, setOrderGroup] = useState({
    group: {
      id: 0,
      hash_id: '',
      code_tables: '',
      created_at: '',
      created_at_utc: '',
      number_of_customers: '',
      order_blocked: null,
      status: null,
      orders: [],
      tables: [],
    },
    order: {
      amount: 0,
      hash_id: '',
      id: 0,
      name: '',
      name_kana: null,
      ordered_at: '',
      price: 0,
      quantity: 0,
      status: 0,
    },
  });

  const [filter, setFilter] = useState(DEFAULT_FILTER);

  useEffect(() => {
    if (shop.hashId && authUser.statusCode > 0) {
      showLoading && setWaiting(true);
      fetchData();
    }
  }, [shop, authUser]);

  useEffect(() => {
    if (shop.hashId && authUser.statusCode > 0) {
      fetchData();
    }
    fetchCookPlaces();
  }, [shop, authUser, refresh]);

  useEffect(() => {
    const timerRefreshData = setInterval(() => {
      setShowLoading(false);
      setRefresh({ refreshAt: new Date() });
    }, Utils.REFRESH_CYCLE_DATA());
    return () => clearInterval(timerRefreshData);
  });

  // Connect to endpoint API Gateway
  useEffect(() => {
    // onConnectWebSocket(shop.hashId);
  }, []);

  // Refresh data after has new order
  useEffect(() => {
    PubSub.subscribe(PUB_SUB_KEY.KEY_FRESH_NEW_ORDER, refreshDataWhenHasNewOrder);
  }, []);

  const fetchCookPlaces = async () => {
    try {
      const cookPlacesData = await ShopOrderApiService.getCookPlaces(shop.hashId);
      setCookPlaces(cookPlacesData);
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
    }
  };

  const refreshDataWhenHasNewOrder = (msg, data) => {
    if (msg === PUB_SUB_KEY.KEY_FRESH_NEW_ORDER && !Utils.isEmpty(data)) {
      setShowLoading(false);
      setRefresh({ refreshAt: new Date() });
      PubSub.publish(PUB_SUB_KEY.RING_ALARM, null);
    }
  };

  const handleShowInfoClick = (group, order) => {
    setOrderGroup({ group, order });
    setShowModalDetailReserve(true);
  };

  const fetchData = async (filter = {}, isHistory = false) => {
    showLoading && setWaiting(true);

    try {
      const result = await ShopOrderApiService.getOrderGroupSummary(shop.hashId, isHistory, filter);
      if (result) {
        let ordersData = [];
        result?.forEach((orderGroup) => {
          const table_codes = orderGroup.tables.map((table) => table.code).join(', ');
          const newOrders = orderGroup.orders.map((order, orderIndex) => ({
            ...order,
            table_codes: table_codes,
            isFirstOrder: order.is_first_order,
            created_at_utc: orderGroup.created_at_utc,
            info_table: (({ orders, ...o }) => o)(orderGroup),
          }));
          ordersData = ordersData.concat(newOrders);
        });
        setOrderGroupSummany(orderBy(ordersData, ['ordered_at'], ['desc']));
      }
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
    } finally {
      setWaiting(false);
    }
  };

  const handleChangeFilter = (name, data) => {
    const value = typeof data === 'object' ? data.target.checked || data.target.value : data;
    setFilter({ ...filter, [name]: value });
  };

  const handleUpdateOrderClick = (order, ordergroupHashId) => {
    let isUpdate = true;
    let data = {
      update_orders: [
        {
          id: order.id,
          quantity: order.quantity,
          status: 1,
        },
      ],
    };

    ShopOrderApiService.order(shop.hashId, ordergroupHashId, data, isUpdate)
      .then(() => {
        setToast({ isShow: true, status: 'success', message: 'Cập nhật thành công' });
        setRefresh({ refreshAt: new Date() });
      })
      .catch((error) => {
        setToast({ isShow: true, status: 'error', message: error.message });
      });
  };

  const elementDot = () => {
    return <span className={classes.dot} />;
  };

  const elementStatusNew = () => {
    return (
      <div className={classes.statusBox}>
        <p className={classes.status}>Mới</p>
      </div>
    );
  };

  const elementStatusFinish = () => {
    return (
      <div className={classes.statusBox}>
        <p className={classes.status}>完了</p>
      </div>
    );
  };

  const elementStatusCancel = () => {
    return (
      <div className={classes.statusBox}>
        <p className={classes.status}>取消</p>
      </div>
    );
  };

  const elementHeaderActions = () => {
    return (
      <Box className={classes.headerActions} flexDirection={{ xs: 'column', lg: 'row' }}>
        <Box maxWidth={{ xs: '100%', lg: 460 }}>
          <CookPlaceSelect
            filter={filter}
            cookPlaces={cookPlaces}
            handleChangeFilter={handleChangeFilter}
          />
        </Box>
        <Box className={classes.headerFilterBox} my={{ xs: 2, lg: 0 }} mt={{xs: 2, lg: '-2px'}}>
          <Box display='flex' alignItems='center'>
            <CustomSelectorBase
              className={classes.select}
              value={filter.sort_option}
              optionArray={SORT_OPTIONS}
              id='select_sort'
              name='select_sort'
              onChange={(event) => handleChangeFilter('sort_option', event)}
            />
          </Box>
          <Box display='flex' flexWrap={{ xs: 'wrap', lg: 'unset' }}>
            <Box className={classes.filterBox} whiteSpace='nowrap'>
              <FormControlLabel
                style={{ xs: 'marginRight: "10px"', sm: 'marginRight: "16px"' }}
                control={
                  <Checkbox
                    checked={filter.showCancelOrders}
                    onChange={(event) => handleChangeFilter('showCancelOrders', event)}
                    name='checked'
                  />
                }
                label='Đã hủy'
              />
            </Box>
            {/* filter table order courses */}
            <Box className={classes.filterBox} whiteSpace='nowrap'>
              <FormControlLabel
                style={{ xs: 'marginRight: "10px"', sm: 'marginRight: "16px"' }}
                control={
                  <Checkbox
                    checked={filter.showCourseOrder}
                    onChange={(event) => handleChangeFilter('showCourseOrder', event)}
                    name='checked'
                  />
                }
                label='Hiển thị set ăn'
              />
            </Box>
            <Box className={classes.filterBox} whiteSpace='nowrap'>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filter.showServedOrders}
                    onChange={(event) => handleChangeFilter('showServedOrders', event)}
                    name='checked'
                  />
                }
                label='Hiển thị món ăn'
              />
            </Box>
            <Box
              display='flex'
              alignItems='center'
              style={{ paddingRight: 10, cursor: 'pointer' }}
              onClick={() => {
                setShowLoading(true);
                setRefresh({ refreshAt: new Date() });
              }}
            >
              <SyncIcon style={{ color: '#DADADA', fontSize: 30 }} />
              <Box textAlign='center'>
                <p style={{ color: '#4F4F4F', fontSize: 12 }}>Cập nhật lần cuối</p>
                <p style={{ color: '#4F4F4F', fontSize: 20 }}>
                  {moment(refresh.refreshAt).format('HH:mm:ss')}
                </p>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const headerRightContent = () => {
    return <Link to='/reserve/list/new'>Điều hành</Link>;
  };

  const sortData = (data) => {
    let dataSorted = [];

    switch (filter.sort_option) {
      case 2:
        dataSorted = orderBy(data, ['ordered_at'], ['asc']);
        break;
      case 3:
        dataSorted = orderBy(data, ['created_at_utc'], ['desc']);
        break;
      case 4:
        dataSorted = orderBy(data, ['created_at_utc'], ['asc']);
        break;
      default:
        dataSorted = orderBy(data, ['ordered_at'], ['desc']);
    }
    return dataSorted;
  };

  const handleFilterOrders = () => {
    let tmpFilteredOrders = Utils.cloneDeep(orderGroupSummany);

    if (!filter.showCancelOrders) {
      tmpFilteredOrders = tmpFilteredOrders.filter(
        (orderTmp) => orderTmp.status !== ORDER_STATUS.STATUS_CANCEL
      );
    }

    if (!filter.showServedOrders) {
      tmpFilteredOrders = tmpFilteredOrders.filter(
        (orderTmp) => orderTmp.status !== ORDER_STATUS.STATUS_FINISH && orderTmp.status !== ORDER_STATUS.STATUS_SHIPPED
      );
    }

    if (filter.showCourseOrder) {
      tmpFilteredOrders = tmpFilteredOrders.filter(
        (orderTmp) =>
          orderTmp.order_type === ORDER_TYPE.ORDER_COURSE ||
          orderTmp.order_type === ORDER_TYPE.ORDER_EXTEND_COURSE
      );
    }

    if (filter.cook_place !== ALL_COOK_PLACE_VALUE) {
      tmpFilteredOrders = tmpFilteredOrders.filter(
        (orderTmp) =>
          orderTmp.m_shop_cook_place && orderTmp.m_shop_cook_place.id === filter.cook_place
      );
    }

    if (filter.sort_option !== DEFAULT_SORT_OPTION) {
      tmpFilteredOrders = sortData(tmpFilteredOrders);
    }

    return tmpFilteredOrders;
  };

  const orderGroups = handleFilterOrders();

  return (
    <PageReserveListContext.Provider
      value={{ refresh, setRefresh, orderGroup, setOrderGroup, setWaiting, setToast }}
    >
      <PageContainer padding='0px'>
        <HeaderAppBar title='Thực đơn cần phục vụ' headerRightContent={headerRightContent()} />
        <PageInnerContainer padding={'8px 16px'}>
          {elementHeaderActions()}
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='table'>
              <TableHead
                classes={{
                  root: classes.tableHead,
                }}
              >
                <TableRow>
                  <TableCell style={styles.cellHeader}></TableCell>
                  <TableCell style={styles.cellHeader}></TableCell>
                  <TableCell style={styles.cellHeader}>Tên món</TableCell>
                  <TableCell style={styles.cellHeader}>Bàn (số người)</TableCell>
                  <TableCell style={styles.cellHeader}>Thời gian order</TableCell>
                  <TableCell style={styles.cellHeader}></TableCell>
                  <TableCell style={styles.cellHeader}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderGroups.map((row, idx) => {
                  return (
                    <TableRow key={`${row.hash_id}-${idx}`}>
                      <TableCell align='right' width={50} padding='none'>
                        {row.status === ORDER_STATUS.STATUS_ORDER && elementDot()}
                      </TableCell>
                      <TableCell align='left' width={80} padding='none'>
                        <Box whiteSpace='nowrap' minWidth={80}>
                          {row.status === ORDER_STATUS.STATUS_ORDER && elementStatusNew()}
                          {(row.status === ORDER_STATUS.STATUS_FINISH ||
                            row.status == ORDER_STATUS.STATUS_SHIPPED) &&
                            elementStatusFinish()}
                          {row.status === ORDER_STATUS.STATUS_CANCEL && elementStatusCancel()}
                        </Box>
                      </TableCell>
                      <TableCell component='th' scope='row' padding='none'>
                        {row.status === ORDER_STATUS.STATUS_CANCEL ? (
                          <p className={classes.menuName}>
                            <div className={classes.cancelOrder}>【取消】</div>
                            {`${row.name} x ${row.quantity}`}
                          </p>
                        ) : (
                          <p className={classes.menuName}>{`${row.name} x ${row.quantity}`}</p>
                        )}
                      </TableCell>
                      <TableCell component='th' scope='row' padding='none'>
                        <Box className={classes.tableCustomer}>
                          {row.table_codes}（{row.info_table.number_of_customers} người）
                        </Box>
                      </TableCell>
                      <TableCell component='th' align='left' width={150}>
                        <p style={{ color: '#828282', whiteSpace: 'nowrap', textAlign: 'center' }}>
                          {moment(row.ordered_at).format('HH:mm')} (
                          {moment(row.ordered_at, 'YYYY/MM/DD HH:mm').fromNow()})
                        </p>
                      </TableCell>
                      <TableCell align='right' width={120} size='small'>
                        <ButtonCustom
                          disabled={
                            row.status === ORDER_STATUS.STATUS_FINISH ||
                            row.status === ORDER_STATUS.STATUS_CANCEL ||
                            row.status === ORDER_STATUS.STATUS_SHIPPED
                          }
                          title='OK'
                          borderRadius='12px'
                          bgcolor='#FFA04B'
                          width='100px'
                          padding='5px'
                          margin='5px 0px'
                          fontSize='14px'
                          onClick={() => handleUpdateOrderClick(row, row.info_table.hash_id)}
                        />
                      </TableCell>
                      <TableCell align='right' width={120} size='small'>
                        <ButtonCustom
                          title='Chi tiết'
                          borderRadius='12px'
                          bgcolor='#FFA04B'
                          width='100px'
                          padding='5px'
                          margin='5px 0px'
                          fontSize='14px'
                          onClick={() => handleShowInfoClick(row.info_table, row)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {showModalDetailReserve && (
            <ModalDetailReserve
              open={showModalDetailReserve}
              onClose={() => setShowModalDetailReserve(false)}
            />
          )}
          <Waiting isOpen={waiting} />
          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />
        </PageInnerContainer>
      </PageContainer>
    </PageReserveListContext.Provider>
  );
};

PageReserveList.propTypes = {};
export default PageReserveList;
