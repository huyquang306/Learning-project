import React, { useState, useEffect, useContext, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useStylesOrderManager as useStyles, stylesOrderManager as styles } from './styles';

import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import PageTableListContext, { formatAmount } from './PageTableListContext';
import ShopOrderApiService, { ENDPOINTS } from 'js/shop-order/shop-order-api-service';

// Component
import ButtonCore from 'js/shared/components/Button';
import ButtonCustom from 'js/shared-order/components/Button';
import ModalOrderDetail from './ModalChildren';
import ModalAddNewMenu from './ModalAddNewMenu';
import ModalConfirmUpdate from './ModalChildren';

// Components(Material-UI)
import { Box, Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import CheckIcon from '@material-ui/icons/Check';

// Utils
import Utils from 'js/shared/utils';
import {
  ORDER_STATUS,
  COURSE_STATUS_ACTIVE,
  COURSE_AVAILABLE_FLAG_TRUE,
  getBlockNearestNow,
} from 'js/utils/helpers/courseHelper';
import { MENU_STATUS, makeRandomId, getHourPriceNearestNow } from 'js/utils/helpers/const';
import { renderUrlImageS3 } from 'js/utils/helpers/image';

const COURSE_MENU_STATUS_ACTIVE = 'active';
const DEFAULT_QUANTITY_ORDER = 1;
const ORDER_COURSE_STATUS_CANCEL = 'cancel';
const LIST_FREE_ORDER = 1;
const CHILDREN_CATEGORY = 2;
const CHANGE_ORDER = 3;
const LIMIT_MENU_NAME_CHARACTERS = 20;
const WIDTH_OF_BUTTON_CATEGORY = 150;
const MAX_OF_CATEGORY_ABLE_MOVE = 2.5;
const MAX_WIDTH_MOBILE_DEVICE = 600;

const PageOrderManager = forwardRef((props, ref) => {
  const classes = useStyles();
  const {renderMenuOrder, showModal, handleShowMenu} = props;  
  const [shop] = useContext(ShopInfoContext);
  const currencyName = shop?.mShopPosSetting?.m_currency?.name;

  const {
    setToast,
    setWaiting,
    state,
    dispatch,
    courseOrder,
    setCourseOrder,
    allOrders,
    setAllOrders,
    listPreOrderRemove,
    listPreOrderUpdate,
    listNewMenus,
    setListNewMenus,
    listPreOrder,
    setListPreOrder,
  } = useContext(PageTableListContext);

  const [loading, setLoading] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [listSubCategory, setListSubCategory] = useState([]);
  const [listChildrenCategory, setListChildrenCategory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModalAddNewMenu, setShowModalAddNewMenu] = useState(false);
  const [isConfirmUpdateNumberCourse, setIsConfirmUpdateNumberCourse] = useState(false);
  const [showArrowOfLargeCate, setShowArrowOfLargeCate] = useState(false);
  const [showArrowOfSubCate, setShowArrowOfSubCate] = useState(false);
  const [courseDetail, setCourseDetail] = useState(null);
  const [orderDetail, setOrderDetail] = useState({
    isShow: false,
    data: { name: '', quantity: DEFAULT_QUANTITY_ORDER, s_image_folder_path: '' },
  });

  let orderGroup = null;
  let course = null;
  if (!Utils.isEmpty(state.ordergroup)) {
    orderGroup = state.ordergroup;
    if (!Utils.isEmpty(orderGroup.orders)) {
      // Set course info
      let orderCourse = orderGroup.orders.find(
        (order) => !Utils.isEmpty(order.m_course) && order.status !== ORDER_STATUS.STATUS_CANCEL
      );
      course = orderCourse && {
        ...orderCourse?.m_course,
        is_course: true,
        is_update_course: true,
        quantity: orderCourse?.quantity,
      };
      if (orderCourse?.status === ORDER_STATUS.STATUS_CANCEL) {
        course.status = ORDER_COURSE_STATUS_CANCEL;
      }
    }
  }

  useEffect(() => {
    getInitCategory();
  }, [shop]);

  useEffect(() => {
    const totalWidthLargeChild = listCategory.length * 140;
    const totalWidthSubChild = listSubCategory.length * 180;

    if (document.getElementsByClassName('wrapperButtons')) {
      const parentWidth = document.getElementsByClassName('wrapperButtons')[0].offsetWidth;
      totalWidthLargeChild > parentWidth
        ? setShowArrowOfLargeCate(true)
        : setShowArrowOfLargeCate(false);
      totalWidthSubChild > parentWidth ? setShowArrowOfSubCate(true) : setShowArrowOfSubCate(false);
    }
  });

  useEffect(() => {
    if (showModal.order) {
      document.getElementsByClassName('wrapperContent')[0].scrollTo(0, 0);
      document.getElementsByClassName('wrapperContent')[0].style.overflowY = 'hidden';
    }
  }, []);
  
  useImperativeHandle(ref, () => ({
    handleButtonSaveClick: handleButtonSaveClick,
  }));

  const addActiveToArray = (array, isInit) => array.map(
    (item, index) => ({ ...item, active: index === 0 && isInit ? true : false })
  );
  const getInitCategory = async () => {
    setLoading(true);
    const listCategories = [
      {
        name: 'Gợi ý',
        short_name: 'recommend',
        tier_number: 1,
      },
      {
        name: 'Set ăn',
        short_name: 'courses',
        tier_number: 1,
      },
    ];
    try {
      const largeCategories = await ShopOrderApiService.getCategories(shop.hashId);
      const recommendMenus = await ShopOrderApiService.getMasterMenus(shop.hashId, {
        is_recommend: 1,
      });
      const recommendMenusClone = recommendMenus.map((menu) => {
        return { ...menu, isNewOrder: true };
      });
      const masterCourses = await ShopOrderApiService.getMasterCourses(
        shop.hashId,
        COURSE_STATUS_ACTIVE,
        COURSE_AVAILABLE_FLAG_TRUE
      );
      const masterCoursesClone = masterCourses.map((course) => {
        return {
          ...course,
          new_hash_id: makeRandomId(16),
          is_course: true,
          number_of_customers: state?.ordergroup?.number_of_customers,
        };
      });

      listCategories.push(...largeCategories);

      setListCategory(addActiveToArray(listCategories, true));
      setListChildrenCategory(recommendMenusClone);
      setRecommendations(recommendMenusClone);
      setCourses(course ? [course] : masterCoursesClone);
    } catch (error) {
      props.showWarningMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const changeActive = (array, indexActive) => {
    let result = Utils.cloneDeep(array);
    result.forEach((category, index) => {
      category.active = indexActive === index ? true : false;
    });

    return result;
  };

  const handleButtonCategoryClick = (index) => async () => {
    setListCategory(changeActive(listCategory, index));
    if (index === 0) {
      // Case: recommendation item selected
      setListChildrenCategory(recommendations);
      setListSubCategory([]);
      return;
    }

    if (index === 1) {
      // Case: course item selected
      setListChildrenCategory(courses);
      setListSubCategory([]);
      return;
    }
    setLoading(true);

    try {
      let params = {};
      const largeCategory = await ShopOrderApiService.getCategories(shop.hashId, {
        tier_number: 2,
        parent_id: listCategory[index].id,
      });

      if (largeCategory && largeCategory.length) {
        setListSubCategory(addActiveToArray(largeCategory, true));

        params = {
          category_id: largeCategory[0].id,
        };
        if (course) {
          params.course_hash_id = course?.hash_id;
        }
      } else {
        setListChildrenCategory([]);
        setListSubCategory([]);
        return;
      }

      const childCategories = await ShopOrderApiService.getMasterMenus(shop.hashId, params);
      const childCategoriesClone = childCategories.map((menu) => {
        return { ...menu, isNewOrder: true };
      });
      if (childCategories) {
        setListChildrenCategory(childCategoriesClone);
      } else {
        setListChildrenCategory([]);
      }
    } catch (error) {
      props.showWarningMessage(error.message);
      setListChildrenCategory([]);
      setListSubCategory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonSubCategoryClick = (index) => async () => {
    setListSubCategory(changeActive(listSubCategory, index));

    let params = {
      category_id: listSubCategory[index].id,
    };
    if (course) {
      params.course_hash_id = course?.hash_id;
    }

    try {
      const childCategories = await ShopOrderApiService.getMasterMenus(shop.hashId, params);
      const childCategoriesClone = childCategories.map((item) => {
        return { ...item, isNewOrder: true };
      });
      if (childCategories) {
        setListChildrenCategory(childCategoriesClone);
      } else {
        setListChildrenCategory([]);
      }
    } catch (error) {
      setListChildrenCategory([]);
      props.showWarningMessage(error.message);
    }
  };

  const handleButtonChildrenCategoryClick = (dataOrder) => () => {
    // compare key new_hash_id for new order and hash_id for old order
    const keyCompare = dataOrder?.is_course ? 'hash_id' : 'menu_hash_id';
    let foundIndex = null;

    if (dataOrder?.is_course) {
      foundIndex = allOrders.findIndex((order) => order[keyCompare] === dataOrder.hash_id);
    } else {
      foundIndex = allOrders.findIndex(
        (order) => order[keyCompare] === dataOrder.hash_id && order.isNewOrder
      );
    }

    // number_of_customers for new order course, DEFAULT_QUANTITY_ORDER for new order menu
    let order = {
      isShow: true,
      data: { ...dataOrder, quantity: dataOrder?.number_of_customers || DEFAULT_QUANTITY_ORDER },
    };

    if (foundIndex > -1) {
      order.data.quantity = allOrders[foundIndex].quantity;
    }
    setOrderDetail(order);
  };

  const handleDecrement = () => {
    let order = Utils.cloneDeep(orderDetail);
    const { quantity } = order.data;
    // Case: min quantity is 1 for course, and 0 for menu
    const minQuantity = orderDetail?.data?.is_course ? DEFAULT_QUANTITY_ORDER : 0;
    order.data.quantity = quantity > minQuantity ? quantity - 1 : minQuantity;
    setOrderDetail(order);
  };

  const handleIncrement = () => {
    let order = Utils.cloneDeep(orderDetail);
    order.data.quantity += 1;
    setOrderDetail(order);
  };

  const updateCourse = async (dataOrder) => {
    let courseOrderClone = Utils.cloneDeep(courseOrder);
    const allOrdersClone = Utils.cloneDeep(allOrders);
    const indexInAllOrders = allOrdersClone.findIndex(
      (order) => order.hash_id === dataOrder.hash_id && order.status !== ORDER_STATUS.STATUS_CANCEL
    );
    let listPreOrderClone = Utils.cloneDeep(listPreOrder);

    const blockNearest = getBlockNearestNow(dataOrder);
    let newCourseOrder = {
      time: Date.now(),
      name: dataOrder.name,
      course_hashId: dataOrder.hash_id,
      hash_id: dataOrder.hash_id,
      quantity: dataOrder.quantity,
      amount: Number(blockNearest.unit_price) * Number(dataOrder.quantity),
      price: blockNearest.unit_price,
      origin_price: Number(blockNearest.unit_price),
      status: ORDER_STATUS.STATUS_ORDER,
      m_menu: {
        m_image_folder_path: dataOrder.m_image_folder_path,
      },
    };

    try {
      const response = await ShopOrderApiService.getCourse(shop.hashId, dataOrder.hash_id);
      setCourseDetail(response);
      if (indexInAllOrders > -1) {
        // Case: dataOrder exist in allOrders
        if (dataOrder.quantity > 0) {
          courseOrderClone = { ...dataOrder, ...newCourseOrder };
          if (dataOrder?.is_update_course) {
            // Case: dataOrder exist in ordergroup
            courseOrderClone.id = allOrdersClone[indexInAllOrders]?.id;
          }
          allOrdersClone[indexInAllOrders].quantity = dataOrder.quantity;
          allOrdersClone[indexInAllOrders].amount = !checkMenuInCourse(dataOrder, CHANGE_ORDER)
            ? Number(allOrdersClone[indexInAllOrders].price) * Number(dataOrder.quantity)
            : 0;
        }
        setCourseOrder(courseOrderClone);
      } else if (dataOrder.quantity > 0) {
        const courseFilter = allOrdersClone.filter(
          (item) => item.course_hashId && item.course_hashId !== ''
        );
        if (courseFilter.length > 0) {
          // Case: exist only 1 course in all orders, if dataOrder not exist in all orders => remove course
          const courseIndex = allOrdersClone.findIndex(
            (item) => courseFilter[0]?.course_hashId === item?.course_hashId
          );
          allOrdersClone.splice(courseIndex, 1);
        }
        setCourseOrder(dataOrder);
        allOrdersClone.push(newCourseOrder);
      }
      if (!course && dataOrder.hash_id !== courseDetail?.hash_id) {
        // Case: order new course and dataOrder different from course exist in all orders
        allOrdersClone.map((order, index) => {
          const indexPreOrder = listPreOrderClone.findIndex(_order => _order.menu_hash_id === order.menu_hash_id && order.isNewOrder);

          if (order.isNewOrder) {
            // Case: update order is new order and is not order with out menu 
            if (checkMenuInCourse(order, CHANGE_ORDER, response)) {
              // Case: update price of menu in course in all orders = 0
              allOrdersClone[index].amount = 0;
              allOrdersClone[index].price = 0;
              if (indexPreOrder > -1) {
                // Case: update price of menu in course in list preorder = 0
                listPreOrderClone[indexPreOrder].price = 0;
                listPreOrderClone[indexPreOrder].course_hash_id = response.hash_id;
              }
            } else {
              // Case: update price of menu not in course in all orders = origin_price
              allOrdersClone[index].amount = Number(order.origin_price || order.price_unit) * Number(order.quantity) ;
              allOrdersClone[index].price = Number(order.origin_price || order.price_unit);
              if (indexPreOrder > -1) {
                // Case: update price of menu not in course in list pre order = origin_price
                listPreOrderClone[indexPreOrder].price = order.origin_price;
                listPreOrderClone[indexPreOrder].course_hash_id = null;
              }
            }
          }
        })
        setListPreOrder([...listPreOrderClone]);
      }
      setAllOrders([...allOrdersClone]);
    } catch (error) {
      setCourseDetail(null);
      props.showWarningMessage('コースが見つかりません。');
    }
  };

  const onConfirmOrderDetail = (dataOrder, isNewMenu = false) => {
    let newMenuOrder = {};
    let listPreOrderClone = Utils.cloneDeep(listPreOrder);
    let listNewMenusClone = Utils.cloneDeep(listNewMenus);
    const allOrdersClone = Utils.cloneDeep(allOrders);
    let indexInPreOrder = listPreOrderClone.findIndex((order) => order.menu_hash_id === dataOrder.hash_id);
    let indexInAllOrders = null;

    if (dataOrder.isNewOrder) {
      indexInAllOrders = allOrdersClone.findIndex(
        (order) => order.menu_hash_id === dataOrder.hash_id && order.isNewOrder
      );
    } else {
      indexInAllOrders = allOrdersClone.findIndex(
        (order) => order.menu_hash_id === dataOrder.hash_id
      );
    }

    if (dataOrder.is_course) {
      if (course) {
        course?.quantity === dataOrder?.quantity
          ? updateCourse(dataOrder)
          : setIsConfirmUpdateNumberCourse(true);

      } else {
        state?.ordergroup?.number_of_customers === dataOrder?.quantity
          ? updateCourse(dataOrder)
          : setIsConfirmUpdateNumberCourse(true);
      }

      return;
    }

    if (indexInAllOrders > -1) {
      // Case: order exist in all orders
      if (dataOrder.quantity > 0) {
        // Case: update if quantity > 0
        if (indexInPreOrder > -1) {
          // Case: update order in list preorder
          listPreOrderClone[indexInPreOrder].quantity = dataOrder.quantity;
          listPreOrderClone[indexInPreOrder].amount = !checkMenuInCourse(dataOrder, CHANGE_ORDER)
            ? Number(dataOrder.price) * Number(dataOrder.quantity)
            : 0;
        }
        allOrdersClone[indexInAllOrders].quantity = dataOrder.quantity;
        allOrdersClone[indexInAllOrders].amount = !checkMenuInCourse(dataOrder, CHANGE_ORDER)
          ? Number(allOrdersClone[indexInAllOrders].price) * Number(dataOrder.quantity)
          : 0;
      } else {
        // Case: remove order if quantity of order = 0
        indexInPreOrder > -1 && listPreOrderClone.splice(indexInPreOrder, 1);
        allOrdersClone.splice(indexInAllOrders, 1);
      }
      setAllOrders([...allOrdersClone]);
    } else if (dataOrder.quantity > 0) {
      // Case: order is new one and not exist in all orders
      const amount =
        Number(
          getHourPriceNearestNow(dataOrder)
            ? Number(getHourPriceNearestNow(dataOrder).replace(/,/g, ''))
            : dataOrder.price
        ) * Number(dataOrder.quantity);
      const price = getHourPriceNearestNow(dataOrder)
        ? Number(getHourPriceNearestNow(dataOrder).replace(/,/g, ''))
        : dataOrder.price;

      newMenuOrder = {
        time: Date.now(),
        name: dataOrder.name,
        menu_hash_id: dataOrder.hash_id,
        quantity: dataOrder.quantity,
        new_hash_id: makeRandomId(16),
        isNewOrder: !isNewMenu && true,
        amount: amount,
        price: price,
        origin_price: price,
        status: ORDER_STATUS.STATUS_ORDER,
        m_menu: {
          main_image_path: dataOrder.main_image_path,
          m_image_folder_path: dataOrder.m_image_folder_path,
        },
      };

      if (checkMenuInCourse(dataOrder, CHANGE_ORDER)) {
        newMenuOrder.course_hash_id = course?.hash_id || courseDetail?.hash_id;
        newMenuOrder.price = 0;
        newMenuOrder.amount = 0;
      }
      if (!isNewMenu) {
        // Case: dataOrder is not order without menu
        listPreOrderClone = [...listPreOrderClone, newMenuOrder];
      } else {
        // Case: dataOrder is order without menu
        listNewMenusClone = [...listNewMenusClone, dataOrder];
      }

      setAllOrders([...allOrdersClone, isNewMenu ? dataOrder : newMenuOrder]);
    } else {
      return;
    }

    !isNewMenu && setListPreOrder([...listPreOrderClone]);
    isNewMenu && setListNewMenus(listNewMenusClone);
    renderMenuOrder();
  };

  const getUncommonElements = (left, right, compareFunction) =>
    left.filter((leftValue) => !right.some((rightValue) => compareFunction(leftValue, rightValue)));

  const handleButtonSaveClick = async () => {
    let isUpdate = false;

    const listPreOrderRemoveClone = listPreOrderRemove.map((item) => {
      return { id: item };
    });

    // Filter items that have been truly updated in ordergroup
    const listPreOrderUpdateRequest = getUncommonElements(
      listPreOrderUpdate,
      listPreOrderRemoveClone,
      (a, b) => a.id === b.id
    );

    const listNewMenusRequest = listNewMenus.map(
      ({ menu_name, price, quantity, tax_value, tax_rate }) => ({
        menu_name,
        price,
        quantity,
        tax_value,
        tax_rate,
      })
    );

    const listPreOrdersRequest = listPreOrder.map(
      ({ menu_hash_id, quantity, course_hash_id = null}) => ({
        menu_hash_id,
        quantity,
        course_hash_id
      })
    );

    let data = { orders: listPreOrdersRequest, add_without_menus: listNewMenusRequest };

    if (courseOrder?.is_update_course) {
      // Case: update ordered course in ordergroup, push info into listPreOrderUpdateRequest array
      listPreOrderUpdateRequest.push({
        id: courseOrder?.id,
        quantity: courseOrder?.quantity,
      });
    }

    if (state.ordergroup && state.ordergroup.status > 0) {
      isUpdate = true;
      data = {
        add_menu: [...listPreOrdersRequest],
        update_orders: listPreOrderUpdateRequest,
        cancel_orders: listPreOrderRemove,
        add_without_menus: listNewMenusRequest,
      };
    }

    let listTableId = [];
    let blockNearest = getBlockNearestNow(courseOrder);
    let endpoints = ENDPOINTS.PUT_ORDER_GROUP;
    let params = [shop.hashId, state?.ordergroup?.hash_id];
    state?.ordergroup?.tables?.map((item) => listTableId.push(item.hash_id));
    let formData = {
      add_hash_id: listTableId,
      number_of_customers: state.ordergroup.number_of_customers,
      course_hash_id: courseOrder && courseOrder?.hash_id,
      course_price_hash_id: blockNearest && blockNearest.hash_id,
      number_of_customers_of_course: courseOrder && Number(courseOrder.quantity),
      is_update_initial_menu_orders: false,
    };

    setWaiting(true);
    try {
      if (courseOrder && !courseOrder?.is_update_course) {
        await ShopOrderApiService.request(endpoints, params, formData);
      }
      await ShopOrderApiService.order(shop.hashId, state.ordergroup.hash_id, data, isUpdate);
      dispatch({ type: 'REFRESH' });
      props.backtoTableList();
      handleShowMenu(false);
    } catch (error) {
      setListChildrenCategory([]);
      setToast({ isShow: true, status: 'error', message: error.message });
    } finally {
      setWaiting(false);
    }
  };

  const renderListCategory = () => {
    const categories = listCategory.map((category, index) => (
      <Box
        key={index}
        className={`${classes.largeCateButton} ${
          index !== listCategory.length - 1 && 'borderRight'
        }`}
      >
        <Box display='inline-block' position='relative'>
          {category.active && <Box className={`${classes.breakLine} breakLine`}></Box>}
          <ButtonCustom
            key={index}
            title={category.name}
            borderRadius='0px'
            bgcolor='#FFF'
            fgcolor={category.active ? '#FFA04B' : '#000'}
            margin='0'
            padding='0px'
            fontSize='12px'
            customClass={classes.buttonCategory}
            onClick={handleButtonCategoryClick(index)}
          />
        </Box>
      </Box>
    ));

    return <Box className={`${classes.wrapButtonGroup} buttonLargeGroup`}>{categories}</Box>;
  };

  const handelScrollButtonGroup = (side, typeButton) => {
    const buttonGroupName = typeButton === 'large' ? 'buttonLargeGroup' : 'buttonSmallGroup';
    const widthDevice = window.innerWidth > 0 ? window.innerWidth : screen.width;

    if (side === 'left') {
      document.getElementsByClassName(buttonGroupName)[0].scrollLeft -=
        widthDevice < MAX_WIDTH_MOBILE_DEVICE
          ? WIDTH_OF_BUTTON_CATEGORY
          : WIDTH_OF_BUTTON_CATEGORY * MAX_OF_CATEGORY_ABLE_MOVE;
    } else {
      document.getElementsByClassName(buttonGroupName)[0].scrollLeft +=
        widthDevice < MAX_WIDTH_MOBILE_DEVICE
          ? WIDTH_OF_BUTTON_CATEGORY
          : WIDTH_OF_BUTTON_CATEGORY * MAX_OF_CATEGORY_ABLE_MOVE;
    }
  };


  const loadingSubCategories = () => Array.from(new Array(6)).map((i, index) => (
    <Skeleton key={`${i}+${index}`} width={'100%'} height={40} />
  ));

  const renderListSubCategory = () => {
    const subCategories = listSubCategory.map((subCategory, index) => (
      <ButtonCustom
        key={index}
        borderRadius='0px'
        bgcolor={subCategory.active ? '#FFA04B' : '#FFF'}
        borderColor='#FFA04B'
        fgcolor={subCategory.active ? '#FFFFFF' : '#000'}
        margin='5px'
        padding='6px 16px'
        customClass={`${classes.buttonCategory} ${subCategory.active && 'noneBoxShadow'}`}
        fontSize='12px'
        onClick={handleButtonSubCategoryClick(index)}
      >
        {subCategory.active && <CheckIcon />}
        {subCategory.name}
      </ButtonCustom>
    ));

    return (
      <Box className={`${classes.wrapButtonGroup} buttonSmallGroup`}>
        {loading ? loadingSubCategories() : subCategories}
      </Box>
    );
  };

  const renderHeadContent = () => {
    return (
      <Box
        display='flex'
        justifyContent={{xs: 'center', md: 'space-between'}}
        alignItems='center'
        flexDirection='row'
        mt={{xs: 2, sm: 0}}
      >
        <Box whiteSpace='nowrap'>
          <ButtonCustom
            title='＜＜ Quay lại'
            borderRadius='4px'
            bgcolor='#FFF'
            fgcolor='#000'
            padding='8px 25px'
            margin='5px'
            customClass={`${classes.buttonCategory} backToTableList`}
            fontSize='12px'
            borderColor='#000'
            onClick={() => props.backtoTableList()}
          />
        </Box>
        <Box my={{ xs: 1, md: 0 }} mr={1}>Bàn: {state?.ordergroup?.code_tables}</Box>
        <Box whiteSpace='nowrap'>
          <ButtonCustom
            title='Gọi thêm món'
            borderRadius='4px'
            bgcolor='#FFF'
            fgcolor='#86be27'
            borderColor='#86be27'
            margin='5px'
            customClass={`${classes.buttonCategory} borderWidthBold`}
            fontSize='12px'
            onClick={() => setShowModalAddNewMenu(true)}
          />
        </Box>
      </Box>
    );
  };

  const loadingMenu = () =>
    Array.from(new Array(7)).map((i, index) => (
      <Box key={`${i}+${index}`} style={{ padding: '5px' }}>
        <Skeleton variant='rect' width={75} height={75} />
      </Box>
    ));

  // Old logic
  const checkMenuInCourse = (menu, menuType = null, courseData = null) => {
    const courseCompare = courseData !== null ? courseData : courseDetail ? courseDetail : course;
    if (menuType && courseCompare?.status === ORDER_COURSE_STATUS_CANCEL) {
      if (menuType === CHILDREN_CATEGORY || menuType === CHANGE_ORDER) {
        return false;
      } else if (menuType === LIST_FREE_ORDER && menu.amount != 0 && menu.price != 0) {
        return false;
      }
    }
    let menuInCourse = null;
    if (courseCompare && courseCompare?.list_menus) {
      menuInCourse = courseCompare.list_menus.find(
        (menuTmp) => menuTmp.hash_id === menu.hash_id || menuTmp.hash_id === menu.menu_hash_id
      );
      if (menuInCourse) {
        return menuInCourse.course_menu_status === COURSE_MENU_STATUS_ACTIVE;
      }
    }

    return false;
  };

  const showMenuName = (menuName) =>
    menuName.length > LIMIT_MENU_NAME_CHARACTERS
      ? menuName.substring(0, LIMIT_MENU_NAME_CHARACTERS) + '...'
      : menuName;

  const renderPrice = (menu) => {
    return checkMenuInCourse(menu, CHILDREN_CATEGORY)
      ? 0
      : getBlockNearestNow(menu)
      ? formatAmount(getBlockNearestNow(menu)?.unit_price)
      : getHourPriceNearestNow(menu)
      ? getHourPriceNearestNow(menu)
      : formatAmount(menu.price)
  }

  return (
    <>
      <Grid container className={classes.container}>
        <Grid className={classes.contentLeft} item xs={12}>
          <Box>{renderHeadContent()}</Box>

          <Box mt={2} px={2} pt={2} className={classes.backgroundGrey}>
            <Box py={0.5} className={`${classes.backgroundWhite} wrapperButtons`}>
              <Box position='relative' display='flex' alignItems='center'>
                <Box
                  fontSize={16}
                  ml={1}
                  onClick={() => handelScrollButtonGroup('left', 'large')}
                  className={classes.pointer}
                >
                  {showArrowOfLargeCate && '◀︎'}
                </Box>
                {renderListCategory()}
                <Box
                  fontSize={16}
                  mr={1}
                  onClick={() => handelScrollButtonGroup('right', 'large')}
                  className={classes.pointer}
                >
                  {showArrowOfLargeCate && '▶︎'}
                </Box>
              </Box>
              {listSubCategory.length > 0 && (
                <>
                  <Box className={classes.breakLine} style={{ margin: '8px auto' }}></Box>
                  <Box position='relative' display='flex' alignItems='center'>
                    <Box
                      fontSize={16}
                      ml={1}
                      onClick={() => handelScrollButtonGroup('left', 'small')}
                      className={classes.pointer}
                    >
                      {showArrowOfSubCate && '◀︎'}
                    </Box>
                    {renderListSubCategory()}
                    <Box
                      fontSize={16}
                      mr={1}
                      onClick={() => handelScrollButtonGroup('right', 'small')}
                      className={classes.pointer}
                    >
                      {showArrowOfSubCate && '▶︎'}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          <Box className={`${classes.wrapFoodBox} ${listSubCategory.length > 0 ? 'hasSubCate' : ''}`} pb={2} px={2}>
            <Grid container>
              {loading
                ? loadingMenu()
                : listChildrenCategory
                  .filter(
                    (item) =>
                      item.status === MENU_STATUS.STATUS_ONSALE ||
                      item.status === COURSE_MENU_STATUS_ACTIVE
                  )
                  .map((item, index) => (
                    <Grid item xs={6} sm={3} md={2} key={index} className={classes.foodBox}>
                      <ButtonCustom
                        className={classes.buttonChildrenCategory}
                        onClick={handleButtonChildrenCategoryClick(item)}
                      >
                        <Box>
                          <Box mb={1}>{showMenuName(item.name)}</Box>
                          <Box fontSize={16}>
                            {renderPrice(item)}
                            {currencyName}
                          </Box>
                        </Box>
                        {checkMenuInCourse(item, CHILDREN_CATEGORY) ? (
                          <Box className={classes.showCourseBox}>コース内</Box>
                        ) : null}
                      </ButtonCustom>
                    </Grid>
                  ))
              }
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <ModalOrderDetail
        isOpen={orderDetail.isShow}
        title={orderDetail.data.name}
        onClose={(isOpen) => {
          setOrderDetail({ ...orderDetail, isShow: isOpen });
        }}
        onConfirm={() => onConfirmOrderDetail(orderDetail.data)}
        customClass={classes.smallModalCard}
      >
        <Box display='flex' alignItems='center' className={classes.prodItem}>
          {orderDetail?.data?.m_image_folder_path || orderDetail?.data?.main_image_path ? (
            <img
              style={styles.thumbnail}
              src={renderUrlImageS3(
                orderDetail?.data?.m_image_folder_path || orderDetail?.data?.main_image_path
              )}
            />
          ) : (
            <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/noimage.png`} alt='banner' />
          )}
        </Box>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <ButtonCore
            padding='0'
            borderRadius='50%'
            classes={{ root: classes.customButton }}
            style={{ background: '#E4E1B0', color: '#333333' }}
            onClick={handleDecrement}
          >
            ー
          </ButtonCore>
          <Box display='flex' alignItems='baseline' fontSize={50} fontWeight='fontWeightBold'>
            {orderDetail.data.quantity}
            {/*<Box fontSize={23} fontWeight='fontWeightRegular'>*/}
            {/*  {orderDetail?.data?.is_course ? '' : ''}*/}
            {/*</Box>*/}
          </Box>
          <ButtonCore
            padding='0'
            borderRadius='50%'
            bgcolor='#F2994B'
            fgcolor='#ffffff'
            classes={{ root: classes.customButton }}
            onClick={handleIncrement}
          >
            ＋
          </ButtonCore>
        </Box>
      </ModalOrderDetail>
      <ModalAddNewMenu
        showModalAddNewMenu={showModalAddNewMenu}
        setShowModalAddNewMenu={setShowModalAddNewMenu}
        onConfirmOrderDetail={onConfirmOrderDetail}
        showWarningMessage={props.showWarningMessage}
      />
      {isConfirmUpdateNumberCourse && (
        <ModalConfirmUpdate
          isOpen={isConfirmUpdateNumberCourse}
          title='お知らせ'
          onClose={(isOpen) => {
            setIsConfirmUpdateNumberCourse(isOpen);
          }}
          onConfirm={() => updateCourse(orderDetail?.data)}
          onCancel={() => setIsConfirmUpdateNumberCourse(false)}
          customClass={classes.smallModalCard}
        >
          <Box>
            <Box textAlign='center' className={classes.boxContent}>
              <Box>コースの注文数を変更しますか？</Box>
            </Box>
          </Box>
        </ModalConfirmUpdate>
      )}
    </>
  );
});

// PropTypes
PageOrderManager.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  renderMenuOrder: PropTypes.func,
  showWarningMessage: PropTypes.func,
  backtoTableList: PropTypes.func,
  handleShowMenu: PropTypes.func
};

// defaultProps
PageOrderManager.defaultProps = {
  open: false,
  onClose: () => {},
  renderMenuOrder: () => {},
  showWarningMessage: () => {},
  backtoTableList: () => {},
  handleShowMenu: () => {}
};

export default PageOrderManager;
