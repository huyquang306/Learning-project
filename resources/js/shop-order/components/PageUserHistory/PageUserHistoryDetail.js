/**
 * Page Order History
 */
import React, { useState, useEffect, useContext } from 'react';
import Utils from 'js/shared/utils';
import { useHistory, useParams } from 'react-router';

// Services
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import PageUserOrderHistoryContext from './PageUserOrderHistoryContext';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import Waiting from 'js/shared/components/Waiting';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import Footer from 'js/shared-order/components/Footer';

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
  Grid,
  Button,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import moment from 'moment';
moment.locale('vi');

// Styles
import { userManagementStyles as useStyles, stylesOrderHistory as styles } from './styles';

const PageUserHistoryDetail = (props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const { userHashId } = useParams();
  const [shop] = useContext(ShopInfoContext);
  const [waiting, setWaiting] = useState(false);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [userDetailHitoryOrders, setUserDetailHitoryOrders] = useState([]);
  const [filter, setFilter] = useState({
    timeStart: '',
    timeEnd: '',
  });

  useEffect(() => {
    getUserDetailHitory(userHashId);
  }, [getUserDetailHitory]);

  const getUserDetailHitory = async (userHashId, params = {}) => {
    try {
      const response = await ShopOrderApiService.getUserDetailHitory(
        shop.hashId,
        userHashId,
        params
      );
      if (response) {
        setUserDetailHitoryOrders(response);
      }
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const formatAmount = (number, n = 0, x = 3) => {
    let reg = '\\d(?=(\\d{' + x + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return number ? number.toFixed(n).replace(new RegExp(reg, 'g'), '$&,') : 0;
  };

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  const inputChanged = (event) => {
    let newData = Utils.cloneDeep(filter);
    let attribute = event.target.getAttribute('name');
    newData[attribute] = event.target.value;
    setFilter(newData);
  };

  const execFilterTime = () => {
    getUserDetailHitory(userHashId, filter);
  };

  return (
    <PageUserOrderHistoryContext.Provider value={{ setWaiting, setToast }}>
      <PageContainer padding='0px'>
        <HeaderAppBar title='ユーザーの詳細' />
        <PageInnerContainer padding={'8px 16px'}>
          <Box flex={1} className={classes.head}>
            <Box className={classes.headerActions}>
              <Box className={classes.filterBlockDetail}>
                <Box className={classes.dateInputDetail}>
                  <Box className={classes.headerTitle}>開始日</Box>
                  <Input
                    id='timeStart'
                    type='date'
                    name='timeStart'
                    defaultValue={filter.timeStart}
                    disableUnderline={true}
                    classes={{ root: `${classes.rootDate} pageDetail` }}
                    onChange={(event) => inputChanged(event)}
                  />
                </Box>
                <Box className={classes.dateInputDetail}>
                  <Box className={classes.headerTitle}>完了日</Box>
                  <Input
                    id='timeEnd'
                    type='date'
                    name='timeEnd'
                    defaultValue={filter.timeEnd}
                    disableUnderline={true}
                    classes={{ root: `${classes.rootDate} pageDetail` }}
                    onChange={(event) => inputChanged(event)}
                  />
                  <Search className={classes.search} onClick={execFilterTime}></Search>
                </Box>
              </Box>
            </Box>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label='table'>
                <TableBody>
                  {userDetailHitoryOrders.map((item, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell colSpan={6} style={styles.cellHeader}>
                          <span style={styles.cellTitle}>#{index + 1}</span>
                          <span style={styles.cellTitle}>{item.start_time}</span>
                          <span style={styles.cellTitle}>人:&nbsp;{item.number_of_customers}</span>
                          <span style={styles.cellTitle}>
                            {formatAmount(item.total_billing)}
                            {shop?.mShopPosSetting?.m_currency?.name}
                          </span>
                        </TableCell>
                      </TableRow>
                      {item.menus.map((row, idx) => {
                        return (
                          <TableRow key={`${index}-${idx}`} style={{ opacity: 1 }}>
                            <TableCell align='left' width={'35%'} size='small'>
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
                              align='center'
                              width={'10%'}
                              size='small'
                              style={{ minWidth: '160px' }}
                            >
                              <p style={styles.cellContent}>
                                {formatAmount(row.price_unit)}{' '}
                                {shop?.mShopPosSetting?.m_currency?.name}
                              </p>
                            </TableCell>
                            <TableCell
                              align='left'
                              width={'8%'}
                              size='small'
                              style={{ minWidth: '80px' }}
                            >
                              <p style={styles.cellContent}>{row.quantity} 個</p>
                            </TableCell>
                            <TableCell align='right' width={120} size='small'>
                              <p style={styles.cellContent}>
                                {formatAmount(row.amount)} {shop?.mShopPosSetting?.m_currency?.name}
                              </p>
                            </TableCell>
                            <TableCell component='th' scope='row' padding='none'>
                              {row.status === 2 ? (
                                <p style={styles.cellContent} align={'center'}>
                                  {row.updated_at}
                                </p>
                              ) : (
                                <p style={styles.cellContent} align={'center'}>
                                  {row.ordered_at}
                                </p>
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
          </Box>

          <Footer padding={'10px'}>
            <Box mt={5} textAlign='center'>
              <Grid spacing={5} container justify={'center'}>
                <Grid item>
                  <Button
                    onClick={() => history.goBack()}
                    className={`${classes.buttonController} + ' ' + ${classes.buttonBack}`}
                  >
                    戻る
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Footer>

          <Waiting isOpen={waiting} />

          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />
        </PageInnerContainer>
      </PageContainer>
    </PageUserOrderHistoryContext.Provider>
  );
};

PageUserHistoryDetail.propTypes = {};
export default PageUserHistoryDetail;
