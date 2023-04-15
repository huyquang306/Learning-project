/**
 * Shop Table List - Order List
 */

import React, { useState, useEffect, useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useStylesOrderManager as useStyles, stylesOrderManager as styles } from './styles';

import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import PageTableListContext from './PageTableListContext';
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCore from 'js/shared/components/Button';
import ButtonCustom from 'js/shared-order/components/Button';
import ModalOrderDetail from './ModalChildren';

// Components(Material-UI)
import { Box, Grid, GridList } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

// Library
import moment from 'moment';

// Utils
import Utils from 'js/shared/utils';
import { ORDER_STATUS } from 'js/utils/helpers/courseHelper';
import { MENU_STATUS } from 'js/utils/helpers/const';
import { renderUrlImageS3 } from 'js/utils/helpers/image';

const COURSE_MENU_STATUS_ACTIVE = 'active';
const DEFAULT_QUANTITY_ORDER = 1;
const ORDER_COURSE_STATUS_CANCEL= 'cancel';
const LIST_FREE_ORDER = 1;
const CHILDREN_CATEGORY = 2;
const CHANGE_ORDER = 3;

const ModalOrderManager = (props) => {
  const classes = useStyles();

  const [shop] = useContext(ShopInfoContext);
  const { setToast, setWaiting, state, dispatch } = useContext(PageTableListContext);

  const [loading, setLoading] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [listSubCategory, setListSubCategory] = useState([]);
  const [listChildrenCategory, setListChildrenCategory] = useState([]);
  const [listPreOrder, setListPreOrder] = useState([]);

  let listPreOrderOldDefault = [];
  let orderGroup = null;
  let course = null;
  if (!Utils.isEmpty(state.ordergroup)) {
    orderGroup = state.ordergroup;
    if (!Utils.isEmpty(orderGroup.orders)) {
      listPreOrderOldDefault = orderGroup.orders.filter(order => [
        ORDER_STATUS.STATUS_ORDER,
        ORDER_STATUS.STATUS_CANCEL,
        ORDER_STATUS.STATUS_SHIPPING,
      ].includes(order.status));
      // Set course info
      let orderCourse = orderGroup.orders.find((order) => !Utils.isEmpty(order.m_course));
      course = orderCourse?.m_course;
      if (orderCourse?.status === ORDER_STATUS.STATUS_CANCEL) {
        course.status = ORDER_COURSE_STATUS_CANCEL;
      }
    }
  }
  const [listPreOrderOld, setListPreOrderOld] = useState(listPreOrderOldDefault);
  const [listPreOrderRemove, setListPreOrderRemove] = useState([]);
  const [orderDetail, setOrderDetail] = useState({
    isShow: false,
    data: { name: '', quantity: DEFAULT_QUANTITY_ORDER, s_image_folder_path: '' },
  });

  useEffect(() => {
    getInitCategory();
  }, [shop]);

  const addActiveToArray = (data, isInit) => {
    return data.map((item, index) => ({ ...item, active: index === 0 && isInit ? true : false }));
  };

  const getInitCategory = () => {
    setLoading(true);
    ShopOrderApiService.getCategories(shop.hashId)
      .then((result) => {
        if (result) {
          setListCategory(addActiveToArray(result, true));
          ShopOrderApiService.getCategories(shop.hashId, {
            tier_number: 2,
            parent_id: result[0].id,
          })
            .then((result) => {
              if (result) {
                setListSubCategory(addActiveToArray(result, true));

                let params = {
                  category_id: result[0].id,
                };
                if (course) {
                  params.course_hash_id = course?.hash_id;
                }
                ShopOrderApiService.getMasterMenus(shop.hashId, params)
                  .then(result => {
                    setLoading(false);
                    if (result) {
                      setListChildrenCategory(result);
                    }
                  }).catch(error => {
                    setLoading(false);
                    console.error('[ModalOrderManager] getInitCategory error', error);
                  });
              }
            })
            .catch((error) => {
              console.error('[ModalOrderManager] getInitCategory error', error);
            });
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('[ModalOrderManager] getInitCategory error', error);
      });
  };

  const changeActive = (data, index) => {
    let result = Utils.cloneDeep(data);
    result.forEach((item, idx) => {
      index === idx ? (item.active = true) : (item.active = false);
    });
    return result;
  };

  const handleButtonCategoryClick = (index) => () => {
    setListCategory(changeActive(listCategory, index));
    ShopOrderApiService.getCategories(shop.hashId, {
      tier_number: 2,
      parent_id: listCategory[index].id,
    })
      .then((result) => {
        if (result && result.length) {
          setListSubCategory(addActiveToArray(result, true));

          let params = {
            category_id: result[0].id,
          };
          if (course) {
            params.course_hash_id = course?.hash_id;
          }
          ShopOrderApiService.getMasterMenus(shop.hashId, params)
            .then(result => {
              if (result) {
                setListChildrenCategory(result);
              } else {
                setListChildrenCategory([]);
              }
            }).catch(error => {
              setListChildrenCategory([]);
              console.error('[ModalOrderManager] handleButtonCategoryClick error', error);
            });
        } else {
          setListSubCategory([]);
          setListChildrenCategory([]);
        }
      })
      .catch((error) => {
        setListSubCategory([]);
        console.error('[ModalOrderManager] handleButtonCategoryClick error', error);
      });
  };

  const handleButtonSubCategoryClick = (index) => () => {
    setListSubCategory(changeActive(listSubCategory, index));

    let params = {
      category_id: listSubCategory[index].id,
    };
    if (course) {
      params.course_hash_id = course?.hash_id;
    }
    ShopOrderApiService.getMasterMenus(shop.hashId, params)
      .then(result => {
        if (result) {
          setListChildrenCategory(result);
        } else {
          setListChildrenCategory([]);
        }
      }).catch(error => {
        setListChildrenCategory([]);
        console.error('[ModalOrderManager] handleButtonSubCategoryClick error', error);
      });
  };

  const handleButtonSubRemoveClick = (data, index, isOld) => () => {
    let result = Utils.cloneDeep(data);
    isOld && setListPreOrderRemove([...listPreOrderRemove, result[index].id]);
    isOld ? (result[index].status = ORDER_STATUS.STATUS_CANCEL) : result.splice(index, 1);
    isOld ? setListPreOrderOld(result) : setListPreOrder(result);
  };

  const handleButtonChildrenCategoryClick = (item) => () => {
    let foundIndex = listPreOrder.findIndex((x) => x.menu_hash_id === item.hash_id);
    let order = {
      isShow: true,
      data: { ...item, quantity: DEFAULT_QUANTITY_ORDER },
    };

    if (foundIndex > -1) {
      order.data.quantity = listPreOrder[foundIndex].quantity;
    }
    setOrderDetail(order);
  };

  const handleDecrement = () => {
    let order = Utils.cloneDeep(orderDetail);
    const { quantity } = order.data;
    order.data.quantity = quantity > DEFAULT_QUANTITY_ORDER ? quantity - 1 : DEFAULT_QUANTITY_ORDER;
    setOrderDetail(order);
  };

  const handleIncrement = () => {
    let order = Utils.cloneDeep(orderDetail);
    order.data.quantity += 1;
    setOrderDetail(order);
  };

  const onConfirmOrderDetail = () => {
    let data = Utils.cloneDeep(listPreOrder);
    let foundIndex = data.findIndex((x) => x.menu_hash_id === orderDetail.data.hash_id);
    if (foundIndex > -1) {
      /** If it exists, update the number of dishes */
      orderDetail.data.quantity > 0
        ? (data[foundIndex].quantity = orderDetail.data.quantity)
        : data.splice(foundIndex, 1);
    } else if (orderDetail.data.quantity > 0) {
      let newMenuOrder = {
        time: Date.now(),
        name: orderDetail.data.name,
        menu_hash_id: orderDetail.data.hash_id,
        quantity: orderDetail.data.quantity,
      };
      if (checkMenuInCourse(orderDetail.data, CHANGE_ORDER)) {
        newMenuOrder.course_hash_id = course.hash_id;
      }
      data = [...data, newMenuOrder];
    }
    setListPreOrder(data);
  };

  const handleButtonSaveClick = () => {
    let isUpdate = false;
    const listPreOrderRequest = listPreOrder.map(
      ({ menu_hash_id, quantity, course_hash_id = null }) => ({
        menu_hash_id,
        quantity,
        course_hash_id,
      })
    );

    let data = { orders: listPreOrderRequest };

    if (state.ordergroup && state.ordergroup.status > 0) {
      isUpdate = true;
      data = {
        add_menu: listPreOrderRequest,
        cancel_orders: listPreOrderRemove,
      };
    }
    setWaiting(true);
    ShopOrderApiService.order(shop.hashId, state.ordergroup.hash_id, data, isUpdate)
      .then(() => {
        setWaiting(false);
        dispatch({ type: 'REFRESH' });
        props.onClose();
      })
      .catch((error) => {
        setWaiting(false);
        console.error('[ModalOrderManager] handleButtonSaveClick error', error);
        setToast({ isShow: true, status: 'error', message: error.message });
      });
  };

  const loadingCategories = () => {
    return Array.from(new Array(4)).map((i, index) => (
      <Skeleton key={`${i}+${index}`} width={100} height={40} style={{ marginRight: '10px' }} />
    ));
  };

  const renderListCategory = () => {
    const categories = listCategory.map((category, index) => (
      <ButtonCustom
        key={index}
        title={category.name}
        borderRadius="6px"
        bgcolor={category.active ? '#FFA04B' : '#F2F2F2'}
        borderColor={category.active ? '#FFA04B' : '#000000'}
        fgcolor={category.active ? '#FFFFFF' : '#4F4F4F'}
        margin="5px"
        padding="5px 2px"
        fontSize="12px"
        onClick={handleButtonCategoryClick(index)}
      />
    ));
    return (
      <GridList className={classes.gridList} cellHeight={'auto'} spacing={2}>
        {loading ? loadingCategories() : categories}
      </GridList>
    );
  };

  const loadingSubCategories = () => {
    return Array.from(new Array(6)).map((i, index) => (
      <Skeleton key={`${i}+${index}`} width={'100%'} height={40} />
    ));
  };

  const renderListSubCategory = () => {
    const subCategories = listSubCategory.map((subCategory, index) => (
      <li
        key={index}
        className={subCategory.active ? 'active' : ''}
        onClick={handleButtonSubCategoryClick(index)}
      >
        {subCategory.name}
      </li>
    ));
    return (
      <div className={classes.subCategoryLeft}>
        <ul>{loading ? loadingSubCategories() : subCategories}</ul>
      </div>
    );
  };

  const renderListPreOrder = (data, isOld = false) => {
    const preOrders = data.map((item, index) => (
      <div className={classes.itemMenu} key={index}>
        {item.status && item.status === ORDER_STATUS.STATUS_CANCEL ? (
          <div className={classes.cancelOrder}>【取消】</div>
        ) : (
          <div className={classes.menuStatus}>
            <span />
          </div>
        )}
        <div className={classes.menuInfo}>
          <div className={classes.menuInfoLeft}>
            {item.status === ORDER_STATUS.STATUS_ORDER ||
            item.status === ORDER_STATUS.STATUS_CANCEL ? (
              <div className={classes.menuTime}>{moment(item.updated_at).format('HH:mm')}</div>
            ) : (
              <div className={classes.menuTime}>{moment(item.time).format('HH:mm')}</div>
            )}
            <div className={classes.menuName}>
              {item.name} {checkMenuInCourse(item, LIST_FREE_ORDER) ? '(コース内)' : null}
            </div>
          </div>
          <div className={classes.menuOrder}>
            <div className={classes.menuNumber}>
              {item.quantity}
              <span>個</span>
            </div>
            {item.status && item.status === ORDER_STATUS.STATUS_CANCEL ? (
              <Fragment></Fragment>
            ) : (
              <button
                className={classes.menuButtonOrder}
                onClick={handleButtonSubRemoveClick(data, index, isOld)}
              >
                キャンセル
              </button>
            )}
          </div>
        </div>
      </div>
    ));
    return preOrders;
  };

  const renderFooterActions = () => {
    return (
      <>
        <ButtonCustom
          customClass={classes.button}
          title="戻る"
          style={styles.buttonFooter}
          bgcolor="#828282"
          onClick={props.onClose}
        />
        <ButtonCustom
          customClass={classes.button}
          title="保存する"
          style={styles.buttonFooter}
          bgcolor="#FFA04B"
          onClick={handleButtonSaveClick}
        />
      </>
    );
  };

  const loadingMenu = () => {
    return Array.from(new Array(7)).map((i, index) => (
      <Box key={`${i}+${index}`} style={{ padding: '5px' }}>
        <Skeleton variant="rect" width={75} height={75} />
      </Box>
    ));
  };

  const checkMenuInCourse = (menu, menuType = null) => {
    if (menuType && course?.status === ORDER_COURSE_STATUS_CANCEL) {
      if (menuType === CHILDREN_CATEGORY || menuType === CHANGE_ORDER) {
        return false;
      } else if (menuType === LIST_FREE_ORDER && menu.amount != 0 && menu.price != 0) {
        return false;
      }
    }
    let menuInCourse = null;
    if (course && course?.list_menus) {
      menuInCourse = course.list_menus.find(
        (menuTmp) => menuTmp.hash_id === menu.hash_id || menuTmp.hash_id === menu.menu_hash_id
      );
      if (menuInCourse) {
        return menuInCourse.course_menu_status === COURSE_MENU_STATUS_ACTIVE;
      }
    }

    return false;
  };

  return (
    <Modal
      open={props.open}
      title="注文追加・キャンセル"
      onClose={props.onClose}
      actions={renderFooterActions()}
      customClass={classes.modalOrderContent}
    >
      <div className={classes.modalContent}>
        <Grid container>
          <Grid className={classes.contentLeft} item xs={12} sm={6}>
            <Box className={classes.sideBarCategory}>{renderListCategory()}</Box>
            <div className={classes.subCategory}>
              {renderListSubCategory()}

              <div className={classes.subCategoryRight}>
                <GridList
                  cellHeight={80}
                  className={classes.gridListChildrenCategory}
                  cols={3}
                  spacing={6}
                >
                  {loading
                    ? loadingMenu()
                    : listChildrenCategory
                      .filter((item) => item.status === MENU_STATUS.STATUS_ONSALE)
                      .map((item, index) => (
                        <Box key={index} className={classes.foodBox}>
                          <button
                            className={classes.buttonChildrenCategory}
                            onClick={handleButtonChildrenCategoryClick(item)}
                          >
                            {item.name}
                            {checkMenuInCourse(item, CHILDREN_CATEGORY) ? (
                              <Box className={classes.showCourseBox}>コース内</Box>
                            ) : null}
                          </button>
                        </Box>
                      ))}
                </GridList>
              </div>
            </div>
          </Grid>

          <Grid className={classes.contentLeft} item xs={12} sm={6}>
            <div className={classes.headerRight}>注文一覧</div>
            <div className={classes.menu}>
              {renderListPreOrder(listPreOrderOld, true)}
              {renderListPreOrder(listPreOrder, false)}
            </div>
          </Grid>
        </Grid>
      </div>
      <ModalOrderDetail
        isOpen={orderDetail.isShow}
        title={orderDetail.data.name}
        onClose={(isOpen) => {
          setOrderDetail({ ...orderDetail, isShow: isOpen });
        }}
        onConfirm={onConfirmOrderDetail}
        customClass={classes.smallModalCard}
      >
        <Box display="flex" alignItems="center" className={classes.prodItem}>
          {orderDetail?.data?.main_image ? (
            <img style={styles.thumbnail} src={renderUrlImageS3(orderDetail?.data?.main_image?.s_image_path)} />
          ) : (
            <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/noimage.png`} alt="banner" />
          )}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <ButtonCore
            padding="0"
            borderRadius="50%"
            classes={{ root: classes.customButton }}
            style={{ background: '#E4E1B0', color: '#333333' }}
            onClick={handleDecrement}
          >
            ー
          </ButtonCore>
          <Box display="flex" alignItems="baseline" fontSize={50} fontWeight="fontWeightBold">
            {orderDetail.data.quantity}
            <Box fontSize={23} fontWeight="fontWeightRegular">
              個
            </Box>
          </Box>
          <ButtonCore
            padding="0"
            borderRadius="50%"
            bgcolor="#F2994B"
            fgcolor="#ffffff"
            classes={{ root: classes.customButton }}
            onClick={handleIncrement}
          >
            ＋
          </ButtonCore>
        </Box>
      </ModalOrderDetail>
    </Modal>
  );
};

// PropTypes
ModalOrderManager.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

// defaultProps
ModalOrderManager.defaultProps = {
  open: false,
  onClose: () => {},
};

export default ModalOrderManager;
