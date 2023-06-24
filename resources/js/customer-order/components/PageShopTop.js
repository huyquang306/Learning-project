/**
 * Page Store Top
 */

// React
import React, {useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';

// Material UI component
import { Grid, Box, List } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Library
import Utils from 'js/shared/utils';
import moment from 'moment';
import 'moment-timezone';
import { isSuccessOrderMenu, removeSuccessOrderMenu } from 'js/customer-order/utils/ordermenu';
moment.locale('vi');
import { setCookie } from 'js/utils/components/cookie/cookie.js';

// Component
import HeaderAppBar from './HeaderAppBar';

// Component shared
import PageContainer from '../../shared/components/PageContainer';
import PageInnerContainer from '../../shared/components/PageInnerContainer';
import ModalErrorOrderCheckedOut from './ModalErrorOrderCheckedOut';
import ModalSuccessOrderMenu from './ModalSuccessOrderMenu';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import { isEmpty } from 'lodash';
import { ORDER_TYPE, ORDER_STATUS, ORDER_GROUP_STATUS } from 'js/utils/helpers/courseHelper';

// Style
const useStyles = makeStyles({
  btnWhite: {
    display: 'block',
    fontSize: '20px',
    color: '#FFA04B',
    textDecoration: 'none',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '20px 0',
  },
  btnSecond: {
    display: 'block',
    fontSize: '20px',
    color: '#FFA04B',
    textDecoration: 'none',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '20px 0',
  },
  boxButtonTop: {
    backgroundColor: '#ffffff',
    border: '2px solid rgb(255, 160, 75)',
    textAlign:'center',
  },
  numberOrder: {
    position: 'absolute',
    right: '5px',
    top: '-19px',
    width: '38px',
    height: '38px',
    backgroundColor: 'red',
    borderRadius: '50%',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#F2F2F2',
    textAlign: 'center',
    lineHeight: '38px',
  },
  gridItem: {
    width: '100%',
    height: '128px',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '18px',
    textDecoration: 'none',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    backgroundColor: 'rgba(255, 160, 75, 0.48)',
  },
  courseItem: {
    width: '50%',
    paddingRight: '16px !important',
    paddingTop: '16px !important',
  },
  categoryItem: {
    width: '50%',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  menuCourseItem: {
    width: '100%',
    height: '128px',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '18px',
    textDecoration: 'none',
    fontWeight: 'bold',
    textAlign: 'center',
    border: '2px solid rgb(255, 160, 75)',
    backgroundColor: '#fff',
    color: 'rgb(255, 160, 75)',
  },
  actionFooter: {
    display: 'block',
    fontSize: '20px',
    textDecoration: 'none',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    alignItems: 'center',
  },
  shopName: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  timeRemain: {
    padding: '2px',
    backgroundColor: 'rgba(255, 160, 75, 0.48)',
    color: '#333333',
    borderRadius: '5px',
    fontSize: '16px',
  },
  sticky: {
    backgroundColor: '#FFF',
    position: 'sticky',
    top: '-30px',
    width: '100%',
    zIndex: 100,
  },
  imageInstagram: {
    display: 'inline',
    padding: '20px 0',
    width: '15vw',
  }
});

const PageShopTop = () => {
  const classes = useStyles();
  const history = useHistory();
  const { shop_hash_id } = useParams();
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const ordergroup_hash_id =
    params.get('ordergroup_hash_id') || localStorage.getItem('ordergroupHash');
  const isCheckout = params.get('isCheckout');
  const shop_name = params.get('shop_name') || localStorage.getItem('shopName');
  const table_code = params.get('table_code') || localStorage.getItem('tableCode');
  const keyStoragePreOrderList = `${shop_hash_id}:${ordergroup_hash_id}:preOrderList`;
  const APP_ID = 'appid';
  const APP_TOKEN = 'apptoken'
  const INSTAGRAM_USER_ID = 'instagramuserid'

  // local state
  const [courseHashId, setCourseHashId] = useState();
  const [remainTimeCourse, setRemainTimeCourse] = useState(null);
  const [alertNotificationTime, setAlertNotificationTime] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const [showModalError, setShowModalError] = useState(false);
  const [courseInfo, setCourseInfo] = useState([]);
  const [orderGroupInfo, setOrderGroupInfo] = useState([]);
  const [numberOfOrderCourse, setNumberOfOrderCourse] = useState(0);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [isSuccessOrder, setIsSuccessOrder] = useState(false);
  const [instagramLink, setInstagramLink] = useState([]);
  const [displayCourseMenu, setDisplayCourseMenu] = useState(true);

  const saveTransactionInfo = (shopHash, shopName = '', ordergroupHash, tableCode = '') => {
    localStorage.setItem('shopHash', shopHash);
    localStorage.setItem('shopName', shopName);
    localStorage.setItem('tableCode', tableCode);
    if (ordergroupHash != null) {
      localStorage.setItem('ordergroupHash', ordergroupHash);
    }
  };

  const saveInstagramInfo = (instagram) => {
    localStorage.setItem('instagram_link', instagram.link);
    localStorage.setItem('instagram_comment', instagram.comment);
    localStorage.setItem('instagram_hash_tag', instagram.hash_tag);
  }

  const saveAppId = (app_id) => {
    setCookie(APP_ID, app_id);
  }

  const saveToken = (token) => {
    setCookie(APP_TOKEN, token);
  }

  const saveInstagramUserId = (user_id) => {
    setCookie(INSTAGRAM_USER_ID, user_id);
  }

  const getOrdersNumber = () => {
    let total = 0;
    let preOrderList = JSON.parse(localStorage.getItem(keyStoragePreOrderList));

    if (!preOrderList) return total;

    preOrderList.forEach(order => {
      total = total + order.quantity;
    });

    return total;
  };

  useEffect(() => {
    // getInstagramLink();
  }, []);


  useEffect(() => {
    if (isCheckout && isCheckout == 1) {
      setShowModalError(true);
    } else {
      saveTransactionInfo(shop_hash_id, shop_name, ordergroup_hash_id, table_code);
      let category_param = {
        tier_number: 1,
        parent_id: 0,
      };

      CustomerOrderApiService.getCategoryList(shop_hash_id, category_param).then((response) => {
        setParentCategories(response);
      });
    }
  }, []);

  useEffect(() => {
    // Get info of ordergroup
    getInfoOfOrdergroup();
  }, []);

  useEffect(() => {
    if (courseHashId) {
      getCourseInfo();
    }
  }, [courseHashId]);

  useEffect(() => {
    if (!isEmpty(courseInfo)) {
      let nowDateTime = moment().tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss');
      let nowMomentJp = moment(nowDateTime, 'YYYY-MM-DD HH:mm:ss');
      let endTime = 0;
      let alertNotificationTime = 0;

      if (courseHashId && courseInfo.time_block_unit > 0) {
        const orderHasMainCourse = Array.isArray(orderGroupInfo?.orders)
          ? orderGroupInfo.orders?.find((order) => !Utils.isEmpty(order.m_course))
          : [];
        let numberExtendCourse = orderGroupInfo.orders.filter(
          (order) => order.order_type == ORDER_TYPE.ORDER_EXTEND_COURSE).length;
        let timeOrderCourse = courseInfo.time_block_unit;
        let extendCourseTime = orderGroupInfo?.extend_course_time || 0;
        alertNotificationTime = courseInfo.alert_notification_time || 0;

        if (extendCourseTime > 0 && numberExtendCourse > 0) {
          timeOrderCourse += parseInt(extendCourseTime) * parseInt(numberExtendCourse);
        }
        // Count end time
        if (orderHasMainCourse?.ordered_at) {
          endTime = moment(orderHasMainCourse?.ordered_at).add(timeOrderCourse, 'minutes');
          setNumberOfOrderCourse(orderHasMainCourse.quantity);
        }
      }

      if (endTime && endTime != 0) {
        setRemainTimeCourse(Math.round(moment.duration(endTime.diff(nowMomentJp)).asMinutes()));
        setAlertNotificationTime(alertNotificationTime);
      }
    }
  }, [courseInfo, orderGroupInfo]);

  useEffect(() => {
    if (isSuccessOrderMenu()) {
      setIsSuccessOrder(true);
      removeSuccessOrderMenu();
    }
  }, []);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      const response = await CustomerOrderApiService.getListOfCourse(shop_hash_id);
      if (!response.length) {
        setDisplayCourseMenu(false);
      }
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const getInstagramLink = async () => {
    try{
      const response = await CustomerOrderApiService.getInstagramLink(shop_hash_id)
      if (response.instagram_link) {
        setInstagramLink(response.instagram_link.find(insta => insta.name === 'instagram'));
        saveInstagramInfo(response.instagram_link.find(insta => insta.name === 'instagram'));
        saveAppId(response.app_id);
        saveToken(response.token);
        saveInstagramUserId(response.instagram_user_id);
      }
    } catch (error) {
      showWarningMessage(error.message);
    }
  }

  const getInfoOfOrdergroup = async () => {
    try {
      const response = await CustomerOrderApiService.getStatusOrdergroup(shop_hash_id, ordergroup_hash_id);
      if (response) {
        setOrderGroupInfo(response);
        const orderHasMainCourse = Array.isArray(response?.orders)
          ? response.orders?.find((order) => !Utils.isEmpty(order.m_course)
          && order.order_type == ORDER_TYPE.ORDER_COURSE
          && order.status !== ORDER_STATUS.STATUS_CANCEL)
          : [];
        if (!Utils.isEmpty(orderHasMainCourse)){
          setCourseHashId(response?.course_hash_id);
        }
        // When payment is completed
        if (response.status && response.status >= ORDER_GROUP_STATUS.CHECKED_OUT) {
          history.push('/' + shop_hash_id + '/thanks-for-customer');
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

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  document.body.style = 'background: #FFF;';
  return (
    <PageContainer padding="0" height='auto'>
      <HeaderAppBar title="" />
      <PageInnerContainer padding="0px 0px 0px 0px" height='calc(100% - 43px)'>
        <Box id="shop-or-header" className={ classes.sticky }>
          {/* Banner shop name */}
          <Box textAlign="center" py={4}>
            <Box display="inline-block">
              <p className={classes.shopName}>{decodeURI(shop_name) || ''}</p>
            </Box>
          </Box>
          {/* End Banner */}

          {/* Header select */}
          <Box display="flex">
            <Box flex="1" className={classes.boxButtonTop}>
            { instagramLink && instagramLink.link
              ? <Link to={'/' + shop_hash_id + '/order/list'} className={classes.btnWhite}>
                  <br />
                </Link>
              : <Link to={'/' + shop_hash_id + '/order/list'} className={classes.btnWhite}>
                  Các món đã gọi
                </Link>
            }
            </Box>
            <Box flex="1" position="relative" className={classes.boxButtonTop} style={{ borderLeft: 'none'}}>
            { instagramLink && instagramLink.link
              ? <Link to={'/' + shop_hash_id + '/pre_order/list'} className={classes.btnSecond}>
                <br />
              </Link>
              : <Link to={'/' + shop_hash_id + '/pre_order/list'} className={classes.btnSecond}>
                Các món đang chọn
            </Link>
          }
            {getOrdersNumber() > 0 && (
                <Box className={classes.numberOrder}>{getOrdersNumber()}</Box>
              )}
            </Box>
            {/* Instagram Menu */}
            { instagramLink && instagramLink.link && (
            <Box flex="1" position="relative" className={classes.boxButtonTop} style={{ borderLeft: 'none'}}>
              <Link to={'/' + shop_hash_id + '/instagram/' + instagramLink.link.replace('https://www.instagram.com/', '').replace('/', "")} >
                <img
                  src={`${process.env.MIX_ASSETS_PATH}/img/shared/instagram.png`}
                  alt="instagram"
                  className={classes.imageInstagram}
                />
              </Link>
            </Box>
            )}
          </Box>
        {/* end header select */}
        </Box>

        <List pt={1} style={{
          paddingBottom: '20px',
          paddingTop: '8px',
          paddingLeft: '8px',
          paddingRight: '8px',
          overflowX: 'hidden', }}>
          <Grid container spacing={2} style={{ width: '100%', margin: '0px' }}>
            <Grid item xs={6} className={classes.categoryItem}>
              <Link to={'/' + shop_hash_id + '/recommend/menu/list'} className={classes.gridItem}>
                Gợi ý của cửa hàng
              </Link>
            </Grid>
            {/* Order Course */}
            {(courseHashId) ?
              (
                <Grid item xs={6} className={classes.categoryItem}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Grid className={classes.menuCourseItem}>
                        {courseInfo.name}
                        <Grid item xs={12} style={{ flex: 0 }}>
                          {numberOfOrderCourse}名
                        </Grid>
                        {!!remainTimeCourse &&
                          remainTimeCourse > 0 &&
                          !!alertNotificationTime &&
                          remainTimeCourse <= alertNotificationTime && (
                            <Grid item xs={12} className={classes.timeRemain} style={{ flex: 0 }}>
                              あと残り:{remainTimeCourse}分
                            </Grid>
                          )}
                        {/* Display over time */}
                        {!!remainTimeCourse && remainTimeCourse <= -1 && (
                          <Grid item xs={12} className={classes.timeRemain} style={{ flex: 0 }}>
                            時間オーバー:{Math.abs(remainTimeCourse)}分
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ) : ((displayCourseMenu) ? (
                <Grid item xs={6} className={classes.categoryItem}>
                  <Link
                    to={'/' + shop_hash_id + '/course/list'}
                    className={classes.gridItem}
                  >
                    Các set ăn
                  </Link>
                </Grid>
              ) : (<div></div>))
            }
            {parentCategories &&
              parentCategories.map((item, index) => (
                <Grid item xs={6} key={index} className={classes.categoryItem}>
                  <Link
                    to={'/' + shop_hash_id + '/category/' + item.code + '/menu/list'}
                    className={classes.gridItem}
                  >
                    {item.name}
                  </Link>
                </Grid>
              ))}
          </Grid>
        </List>

        <ModalErrorOrderCheckedOut open={showModalError} onClose={() => setShowModalError(false)} />

        {/* Modal show success order menu */}
        <ModalSuccessOrderMenu
          open={ isSuccessOrder }
          onClose={ () => setIsSuccessOrder(false) }
        />

        <FlashMessage
          isOpen={toast.isShow}
          onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
          status={toast.status}
          message={toast.message}
        />
      </PageInnerContainer>
    </PageContainer>
  );
};

export default PageShopTop;
