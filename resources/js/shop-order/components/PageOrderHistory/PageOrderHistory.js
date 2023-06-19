/**
 * Page Order History
 */
import React, { useState, useEffect, useContext } from 'react';
import { useStylesOrderHistory as useStyles, stylesOrderHistory as styles } from './styles';

// Services
import ShopAuthService from 'js/shop/shop-auth-service';
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import PageOrderHistoryContext from './PageOrderHistoryContext';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import ButtonCustom from 'js/shared-order/components/Button';
import CustomSelectorBase from 'js/shared/components/CustomSelectorBase';
import ModalDetailOrderHistory from './ModalDetailOrderHistory';
import Waiting from 'js/shared/components/Waiting';
import FlashMessage from 'js/shared-order/components/FlashMessage';

// Components(Material-UI)
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
  Input,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import SyncIcon from '@material-ui/icons/Sync';
import Pagination from '@material-ui/lab/Pagination';

import { ORDER_HISTORY_PAGINATION, S3_URL } from 'js/utils/helpers/const';

import { isEmpty } from 'lodash';
import moment from 'moment';
moment.locale('vi');

// Utils
import { ORDER_TYPE, ORDER_GROUP_STATUS } from 'js/utils/helpers/courseHelper';

const ORDER_STATUS = {
  STATUS_ORDER: 0,
  STATUS_FINISH: 1,
  STATUS_CANCEL: 2,
};

const PageOrderHistory = (props) => {
  const classes = useStyles(props);

  const [shop] = useContext(ShopInfoContext);
  const authUser = ShopAuthService.getUserAuthStatus();

  const [waiting, setWaiting] = useState(false);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [refresh, setRefresh] = useState({ isRefresh: false, refreshAt: new Date() });
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [orderGroupSummany, setOrderGroupSummany] = useState([]);
  const [orderGroupPagination, setOrderGroupPagination] = useState(null);
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

  const [tables, setTables] = useState([{ value: 0, label: 'テーブル' }]);
  const [categorys, setCategorys] = useState([{ value: 0, label: 'カテゴリ' }]);
  const [filter, setFilter] = useState({
    tableId: 0,
    categoryId: 0,
    timeStart: moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'),
    timeEnd: moment().format('YYYY-MM-DD'),
    limit: ORDER_HISTORY_PAGINATION,
  });

  useEffect(() => {
    if (shop.hashId && authUser.statusCode > 0) {
      ShopOrderApiService.getTables(shop.hashId, {'with-deleted': 1})
        .then((result) => {
          if (result) {
            const listTable = result.map(({ id: value, code: label, ...rest }) => ({
              value,
              label,
              ...rest,
            }));
            listTable.unshift({ value: 0, label: 'テーブル' });
            setTables(listTable);
          }
        })
        .catch((error) => {
          console.error('[app] getTables error', error);
        });

      ShopOrderApiService.getCategories(shop.hashId)
        .then((result) => {
          if (result) {
            const listCategory = result.map(({ id: value, name: label, ...rest }) => ({
              value,
              label,
              ...rest,
            }));
            listCategory.unshift({ value: 0, label: 'カテゴリ' });
            setCategorys(listCategory);
          }
        })
        .catch((error) => {
          console.error('[app] setCategorys error', error);
        });
    }
  }, [shop, refresh, authUser]);

  useEffect(() => {
    if (shop.hashId && authUser.statusCode > 0) {
      getOrderHistories(true, filter);
    }
  }, [shop, authUser, refresh]);

  const getOrderHistories = async (isHistory = false, filterData = {}) => {
    try {
      setWaiting(true);
      // Data Filter
      const dataFilter = Object.assign(
        { status: '0,1,2,3,4' },
        filterData?.tableId != 0 ? { table_id: filterData.tableId } : null,
        filterData?.categoryId != 0 ? { category_id: filterData.categoryId } : null,
        filterData?.timeStart != ''
          ? { time_start: moment(filterData.timeStart).format('YYYY-MM-DD') }
          : null,
        filterData?.timeEnd != ''
          ? { time_end: moment(filterData.timeEnd).format('YYYY-MM-DD') }
          : null,
        filterData?.page ? { page: filterData.page } : 1,
        filterData.limit
      );

      const response = await ShopOrderApiService.getOrderGroupSummary(
        shop.hashId,
        isHistory,
        dataFilter
      );
      if (response) {
        setWaiting(false);
        setOrderGroupSummany(response.data);
        setOrderGroupPagination(response.pagination);
      }
    } catch (error) {
      setWaiting(false);
      setToast({ isShow: true, status: 'error', message: error.message });
    }
  };

  const totalAmount = (data) => {
    if (isEmpty(data)) {
      return 0;
    }
    let totalAmount = 0;
    if (Object.prototype.hasOwnProperty.call(data, 'orders')) {
      if (isEmpty(data.orders)) {
        return totalAmount;
      }
      // total amount from t_order
      totalAmount += data.orders
        .filter(({ status }) => status !== ORDER_STATUS.STATUS_CANCEL)
        .reduce((a, b) => a + (b.amount || 0), 0);
    }
    return totalAmount;
  };

  const formatAmount = (number, n = 0, x = 3) => {
    let reg = '\\d(?=(\\d{' + x + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return number ? number.toFixed(n).replace(new RegExp(reg, 'g'), '$&,') : 0;
  };

  const handleFilterChange = (event) => {
    setFilter({ ...filter, [event.target.id]: event.target.value });
  };

  const handleShowInfoClick = (group, order) => {
    setOrderGroup({ group, order });
    setShowModalDetail(true);
  };

  const filterOrderHistory = () => {
    getOrderHistories(true, filter);
  };

  const handleChangePage = async (event, value) => {
    setFilter({ ...filter, page: value });
    await getOrderHistories(true, { ...filter, page: value });
    window.scrollTo(0, 0);
  };

  const elementHeaderActions = () => {
    return (
      <Box className={classes.headerActions}>
        <Box className={classes.headerSelectBox}>
          <Box className={classes.selectBox}>
            <CustomSelectorBase
              id='tableId'
              className={classes.select}
              value={filter.tableId}
              optionArray={tables}
              onChange={(event) => handleFilterChange(event)}
            />
          </Box>
          <Box className={classes.selectBox}>
            <CustomSelectorBase
              id='categoryId'
              className={classes.select}
              value={filter.categoryId}
              optionArray={categorys}
              onChange={(event) => handleFilterChange(event)}
            />
          </Box>
          <Box className={classes.headerInputTime}>
            <Box className={classes.inputTimeBox}>
              <Input
                id='time'
                type='date'
                defaultValue={filter.timeStart}
                disableUnderline={true}
                classes={{ root: classes.rootDate }}
                onChange={(event) => setFilter({ ...filter, timeStart: event.target.value })}
              />
            </Box>
            <Box className={classes.inputTimeBox}>
              <Input
                id='time'
                type='date'
                defaultValue={filter.timeEnd}
                disableUnderline={true}
                classes={{ root: classes.rootDate }}
                onChange={(event) => setFilter({ ...filter, timeEnd: event.target.value })}
              />
            </Box>
            <Search className={classes.search} onClick={filterOrderHistory}></Search>
          </Box>
        </Box>
        <Box
          display='flex'
          alignItems='center'
          style={{ paddingRight: 10, cursor: 'pointer' }}
          onClick={() => setRefresh({ isRefresh: false, refreshAt: new Date() })}
        >
          <SyncIcon style={{ color: '#DADADA', fontSize: 30 }} />
          <Box textAlign='center'>
            <p style={{ color: '#4F4F4F', fontSize: 12 }}>最終更新時間</p>
            <p style={{ color: '#4F4F4F', fontSize: 20 }}>
              {moment(refresh.refreshAt).format('HH:mm:ss')}
            </p>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderTotalAmountOrderGroup = (orderGroupTmp) => {
    if (orderGroupTmp.status === ORDER_GROUP_STATUS.CHECKED_OUT) {
      return formatAmount(orderGroupTmp.total_billing);
    }

    return formatAmount(totalAmount(orderGroupTmp));
  };

  return (
    <PageOrderHistoryContext.Provider
      value={{ refresh, setRefresh, orderGroup, setOrderGroup, setWaiting, setToast }}
    >
      <PageContainer padding='0px'>
        <HeaderAppBar title='注文履歴' />
        <PageInnerContainer padding={'8px 16px'}>
          {elementHeaderActions()}
          {orderGroupPagination?.total >= ORDER_HISTORY_PAGINATION && (
            <Box className={classes.paginate}>
              <Pagination
                count={orderGroupPagination.last_pages}
                shape='rounded'
                page={orderGroupPagination.current_page}
                onChange={handleChangePage}
              />
            </Box>
          )}
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='table'>
              <TableBody>
                {orderGroupSummany.map((item, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell colSpan={1} style={styles.cellHeader}>
                        <span style={styles.cellTitle}>{item.created_at}</span>
                      </TableCell>
                      <TableCell colSpan={1} style={styles.cellHeader}>
                        <span style={styles.cellTitle}>席:&nbsp;{item.code_tables}</span>
                      </TableCell>
                      <TableCell colSpan={1} style={styles.cellHeader}>
                        <span style={styles.cellTitle}>{renderTotalAmountOrderGroup(item)}{shop?.mShopPosSetting?.m_currency?.name}</span>
                      </TableCell>
                      <TableCell colSpan={1} style={styles.cellHeader}>
                        <span style={styles.cellTitle}>伝票番号:&nbsp;{item.invoice_code}</span>
                      </TableCell>
                      <TableCell colSpan={1} style={styles.cellHeader}>
                        {item.file_path ?
                        <ButtonCustom
                          title="レシート出力"
                          borderRadius="20px"
                          bgcolor="#FFFFFF"
                          fgcolor="#FFA04B"
                          width="100px"
                          padding="5px"
                          margin="5px 0px"
                          fontSize="14px"
                          onClick={()=> window.open(S3_URL + item.file_path, "_blank")}
                        />
                        : null}
                      </TableCell>
                    </TableRow>
                    {item?.orders?.map((row, idx) => {
                      if (
                        filter.categoryId != 0 &&
                        !row?.categories?.some(
                          (category) =>
                            category.tier_number === 1 && category.id === filter.categoryId
                        )
                      ) {
                        return null;
                      }
                      return (
                        <TableRow key={`${index}-${idx}`} style={{ opacity: 1 }}>
                          <TableCell
                            align='left'
                            width={'35%'}
                            style={{ minWidth: '160px' }}
                            size='small'
                          >
                            {row.status === 2 ? (
                              <p style={styles.menuCancel}>
                                <span style={styles.cancelOrder}>【取消】</span>
                                {row.name}
                              </p>
                            ) : (
                              <p style={styles.cellContent}>{row.name}</p>
                            )}
                          </TableCell>
                          <TableCell
                            align='left'
                            width={'8%'}
                            size='small'
                            style={{ minWidth: '160px' }}
                          >
                            <p style={styles.cellContent}>{row.quantity} 個</p>
                          </TableCell>
                          <TableCell
                            align='left'
                            width={'10%'}
                            size='small'
                            style={{ minWidth: '160px' }}
                          >
                            <p style={styles.cellContent}>
                              {formatAmount(row.price_unit)}
                              {shop?.mShopPosSetting?.m_currency?.name}
                            </p>
                          </TableCell>
                          <TableCell>
                            {row.status === 2 ? (
                              <p style={styles.cellContent}>
                                {moment(row.updated_at).format('YYYY/MM/DD HH:mm')}
                              </p>
                            ) : (
                              <p style={styles.cellContent}>
                                {moment(row.ordered_at).format('YYYY/MM/DD HH:mm')}
                              </p>
                            )}
                          </TableCell>
                          <TableCell align='right' width={120} size='small'>
                            {row.order_type === ORDER_TYPE.SERVE_SERVICE_TYPE ? null : (
                              <ButtonCustom
                                title='他操作'
                                borderRadius='12px'
                                bgcolor='#FFA04B'
                                width='100px'
                                padding='5px'
                                margin='5px 0px'
                                fontSize='14px'
                                disabled={row.m_menu?.deleted_at ? true : false}
                                onClick={() => handleShowInfoClick(item, row)}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {showModalDetail && (
            <ModalDetailOrderHistory
              open={showModalDetail}
              onClose={() => setShowModalDetail(false)}
            />
          )}
          <Waiting isOpen={waiting} />
          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />
          {orderGroupPagination?.total >= ORDER_HISTORY_PAGINATION && (
            <Box className={classes.paginate}>
              <Pagination
                count={orderGroupPagination.last_pages}
                shape='rounded'
                page={orderGroupPagination.current_page}
                onChange={handleChangePage}
              />
            </Box>
          )}
        </PageInnerContainer>
      </PageContainer>
    </PageOrderHistoryContext.Provider>
  );
};

PageOrderHistory.propTypes = {};
export default PageOrderHistory;
