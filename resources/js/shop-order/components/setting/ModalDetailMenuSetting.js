import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Utils from 'js/shared/utils';
import { find } from 'lodash';

// Component
import Modal from '../../../shared-order/components/Modal';
import ButtonCustom from '../../../shared-order/components/Button';
import CustomSelectorBase from '../../../shared/components/CustomSelectorBase';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import ModalSelectMenuImage from './ModalSelectMenuImage';
import ModalShowDetailImage from './ModalShowDetailImage';
import Dialog from 'js/shared-order/components/Dialog';
import SettingPriceTab from './itemSettingMenu/SettingPriceTab';
import Waiting from 'js/shared/components/Waiting';

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopApiService from 'js/shop/shop-api-service';

// Components(Material-UI)
import {
  Button,
  Box,
  Grid,
  OutlinedInput,
  Tabs,
  Tab,
  Divider,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';

import defaultMenuImage from 'js/assets/images/no-image.png';

import {
  MENU_STATUS,
  round,
  roundUp,
  roundDown,
  showtaxValue,
} from 'js/utils/helpers/const';

// Utils
import { renderUrlImageS3 } from 'js/utils/helpers/image';

import { useStylesSettingMenu } from './itemSettingMenu/styles.js';
import {
  validateParentCategory,
  validateChildCategory,
  validateName,
  validatePrice,
  validateCookTime,
} from './itemSettingMenu/validationSettingMenu';
import {ArrowRight} from "@material-ui/icons";
import {formatPriceWhileTyping} from "../../../utils/helpers/const";

const SETTING_PRICE_TAB = 2;
const SETTING_PLACE_TAB = 1;
const SETTING_IMAGE_TAB = 0;

const ROUND_DOWN = 0;
const ROUND_UP = 1;
const MENU_DEFAULT = {
  name: '',
  price: '',
  parentCategory: {
    value: '',
  },
  childCategory: {
    value: '',
  },
  initial_order_flg: 0,
  main_image_path: null,
  m_images: [],
  add_images: [],
  delete_images: [],
  all_images: [],
  estimated_preparation_time: '',
  cookPlace: {
    value: '',
  },
  tax_value: 0,
  status: MENU_STATUS.STATUS_ONSALE,
  m_tax_id: null,
  m_shop_business_hour_prices: [],
};

const ModalDetailMenuSetting = (props) => {
  const classes = useStylesSettingMenu();

  // Local state
  const [showModal, setShowModal] = useState(false);
  const [showModalDetail, setShowModalDetails] = useState(false);
  const [indexImageClicked, setIndexImageClicked] = useState(0);
  const [menuData, setMenuData] = useState(MENU_DEFAULT);
  const [shop] = useContext(ShopInfoContext);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [cookPlaces, setCookPlaces] = useState([]);
  const [inProgress, setInProgress] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmOffSale, setConfirmOffSale] = useState(false);
  const [isCopyData, setIsCopyData] = useState(false);
  const [tab, setTab] = useState(SETTING_IMAGE_TAB);
  const [taxType, setTaxType] = useState([]);
  const [taxPercentageValue, setTaxPercentageValue] = useState(0);
  const [priceFractionMode, setPriceFractionMode] = useState(ROUND_DOWN);
  const [businessHours, setBusinessHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mainImagePath, setMainImagePath] = useState(null);
  const [draftDataSettingPrice, setDraftDataSettingPrice] = useState({
    m_shop_business_hour_id: '',
    m_shop_business_hour: [],
    price: '',
    tax_value: '',
    display_flg: 1,
  });

  useEffect(() => {
    if (props.open) {
      getDatas();
    } else {
      setMenuData(MENU_DEFAULT);
    }
  }, [props.open, props.menuData]);

  const getDatas = async () => {
    setLoading(true);
    const parentCategoryParams = {
      tier_number: 1,
      parent_id: 0,
    };
    const categories = await getCategories(parentCategoryParams);
    const parentCates = categories.map((category) => {
      return { id: category.id, value: category.code, label: category.name };
    });
    setParentCategories(parentCates);

    // Get list cook places of shop
    getShopCookPlaces();

    // get business hours
    const businessHoursTmp = shop?.m_business_hours?.map((item) => {
      return {
        ...item,
        value: item.hash_id,
        label: `${item.name} (${item?.start_time?.slice(0, 5)} - ${item?.finish_time?.slice(
          0,
          5
        )})`,
      };
    });
    setBusinessHours(businessHoursTmp);
    setDraftDataSettingPrice({
      ...draftDataSettingPrice,
      m_shop_business_hour: businessHours[0],
      m_shop_business_hour_id: businessHours[0]?.id,
    });

    // get shop info
    const shopTaxInfo = await ShopApiService.getShopTaxInfo(shop?.hashId);
    setPriceFractionMode(shopTaxInfo?.price_fraction_mode);

    // get tax options
    const taxsRes = await ShopApiService.getTaxOptions(shop?.hashId);
    const taxTypes = taxsRes.map((item) => {
      return { id: item.id, label: item.name, value: Number(item.tax_rate) };
    });
    setTaxType(taxTypes);

    let menuDetailClone = Utils.cloneDeep(menuData);
    if (props.menuData && props.menuData.hash_id) {
      menuDetailClone = await ShopOrderApiService.getMenu(shop?.hashId, props.menuData.hash_id);
    }
    const taxOption = find(taxsRes, { id: props?.menuData?.m_tax_id });
    if (taxOption) {
      menuDetailClone.m_tax = taxOption;
      menuDetailClone.m_tax_id = taxOption.id;
      setTaxPercentageValue(Number(taxOption?.tax_rate));
    } else if (props?.menuData?.m_tax_id == 0) {
      const taxZeroOption = taxsRes.find((taxTmp) => taxTmp.tax_rate == 0);
      if (taxZeroOption) {
        menuDetailClone.m_tax = taxZeroOption;
        menuDetailClone.m_tax_id = taxZeroOption.id;
      }
      setTaxPercentageValue(0);
    } else {
      const taxTenOption = taxsRes.find((taxTmp) => taxTmp.tax_rate == 0.1);
      if (taxTenOption) {
        menuDetailClone.m_tax = taxTenOption;
        menuDetailClone.m_tax_id = taxTenOption.id;
      }
      setTaxPercentageValue(0.1);
    }

    fillMenuData(Utils.cloneDeep(menuDetailClone));
  };

  const handleValueBeforeRound = (price, percenTaxValue) => {
    return (price * 100 * percenTaxValue) / (100 + 100 * percenTaxValue);
  };

  const hanldePriceFractionMode = (value, decimals) => {
    return priceFractionMode === ROUND_DOWN
      ? roundDown(value, decimals)
      : priceFractionMode === ROUND_UP
      ? roundUp(value, decimals)
      : round(value, decimals);
  };

  const cloneMenuData = () => {
    let newMenuData = Utils.cloneDeep(menuData);
    newMenuData.m_images = menuData.m_images;
    newMenuData.main_image_path = menuData?.main_image_path;

    return newMenuData;
  };

  const fillMenuData = async (menu) => {
    if (Utils.isNil(menu.name)) {
      menu.name = '';
    }
    if (Utils.isNil(menu.price)) {
      menu.price = '';
    }
    if (Utils.isNil(menu.estimated_preparation_time)) {
      menu.estimated_preparation_time = '';
    }
    if (menu?.m_menu_category?.length === 1 || menu?.m_menu_category?.length === 2) {
      const parentCategory = find(menu.m_menu_category, { tier_number: 1 });
      const childCategory = find(menu.m_menu_category, { tier_number: 2 });
      if (!Utils.isNil(parentCategory)) {
        menu.parentCategory = {
          id: parentCategory.id,
          value: parentCategory.code,
          label: parentCategory.name,
        };

        const childCategoryParams = {
          tier_number: 2,
          parent_id: parentCategory.id,
        };
        const categories = await getCategories(childCategoryParams);
        const childCategories = categories.map((category) => {
          return { id: category.id, value: category.code, label: category.name };
        });
        if (!Utils.isNil(childCategory)) {
          menu.childCategory = {
            id: childCategory.id,
            value: childCategory.code,
            label: childCategory.name,
          };
        }
        setChildCategories(childCategories);
        // set cook place selected
        const cookPlace = menu.cook_place;
        if (!Utils.isNil(cookPlace)) {
          menu.cookPlace = {
            id: cookPlace.id,
            value: cookPlace.hash_id,
            label: cookPlace.name,
          };
        }
        setMenuData(menu);
      }
    } else {
      menu.parentCategory = {
        value: '',
      };
      menu.childCategory = {
        value: '',
      };
    }
    if (!menu?.m_images?.length) {
      menu['all_images'] = [];
    } else {
      const imagesClone = menu?.m_images?.map((item) => item.image_path);
      menu['all_images'] = [...imagesClone];
    }
    menu['add_images'] = [];
    menu['delete_images'] = [];
    setMenuData(menu);
    setMainImagePath(props?.menuData?.main_image?.m_image_path || props?.menuData?.main_image?.image_path);
    setLoading(false);
  };

  const resetMenuData = () => {
    setMenuData(MENU_DEFAULT);
    setChildCategories([]);
  };

  const resetDraftDataSettingPrice = () => {
    setDraftDataSettingPrice({
      m_shop_business_hour_id: businessHours[0]?.id,
      m_shop_business_hour: businessHours[0],
      price: '',
      tax_value: '',
      display_flg: 1,
    });
  };

  const setMenuFiles = (file) => {
    if (file) {
      let addImages = menuData?.add_images;
      let allImages = menuData?.all_images;
      const newMenuData = cloneMenuData();
      addImages.push(file);
      allImages.push(file);
      newMenuData.add_images = addImages;
      newMenuData.all_images = allImages;
      if (!menuData.main_image_path) {
        newMenuData.main_image_path = addImages[0];
        setMainImagePath(addImages[0]);
      }
      setMenuData(newMenuData);
    }
  };

  const saveMenu = () => {
    let errors = [];
    validateName(menuData, errors);
    validateParentCategory(menuData, errors);
    validateChildCategory(menuData, errors);
    validatePrice(menuData, errors);
    validateCookTime(menuData, errors);
    if (errors.length > 0) {
      props.showWarningMessage(errors[0]);
    } else {
      const oldMenu = props.menuData;
      const oldRecommendMenu = oldMenu.status === MENU_STATUS.STATUS_ONSALE && oldMenu.is_recommend;
      if (menuData.status === MENU_STATUS.STATUS_OFFSALE && oldRecommendMenu) {
        setConfirmOffSale(true);
      } else {
        updateMenu();
      }
    }
  };

  const updateMenu = async () => {
    let updateMenuData = {
      name: menuData.name,
      price: menuData.price,
      status: menuData.status || MENU_STATUS.STATUS_ONSALE,
      estimated_preparation_time: menuData.estimated_preparation_time || null,
      shop_cook_place_id: menuData.cookPlace?.id || null,
      is_recommend: menuData.status === MENU_STATUS.STATUS_OFFSALE ? 0 : menuData.is_recommend,
      m_menu_category_ids: [menuData.parentCategory.id, menuData.childCategory.id],
      tax_value: menuData.tax_value,
      m_shop_business_hour_prices: menuData.m_shop_business_hour_prices || [],
      m_tax_id: menuData.m_tax_id,
      add_images: menuData.add_images,
      delete_images: menuData.delete_images,
      m_images: [],
      main_image_path: menuData.main_image_path,
      initial_order_flg: menuData.initial_order_flg
    };

    if (isCopyData) {
      updateMenuData.s_image_folder_path = menuData.s_image_folder_path;
      updateMenuData.m_image_folder_path = menuData.m_image_folder_path;
      updateMenuData.l_image_folder_path = menuData.l_image_folder_path;
    }
    setInProgress(true);
    try {
      if (Object.keys(props.menuData).length === 0 || isCopyData) {
        await ShopOrderApiService.createMenu(shop.hashId, updateMenuData);
        props.showSuccessMessage('Thêm món ăn thành công');
        setIsCopyData(false);
        if (!isCopyData) {
          resetMenuData();
        }
      } else {
        await ShopOrderApiService.updateMenu(shop.hashId, props.menuData.hash_id, updateMenuData);
        props.showSuccessMessage('Cập nhật thành công');
      }
      setInProgress(false);
      props.getFilterMenu();
      props.onClose();
      setTab(SETTING_IMAGE_TAB);
    } catch (error) {
      setInProgress(false);
      props.showWarningMessage(error.message.replace('Error: ', ''));
    }
  };

  const handleConfirmOffSale = () => {
    updateMenu();
  };

  const copyData = () => {
    const newMenuData = cloneMenuData();
    newMenuData.name = newMenuData.name + ` (Copy)`;
    newMenuData.all_images = [];
    newMenuData.main_image_path = null;
    setMainImagePath(null);
    setMenuData(newMenuData);
    setIsCopyData(true);
  };

  const actionModal = () => {
    return (
      <Box textAlign='center'>
        <ButtonCustom
          title='Đóng'
          borderRadius='28px'
          bgcolor='#828282'
          borderColor='#828282'
          width='176px'
          onClick={() => {
            setMenuData(MENU_DEFAULT);
            props.onClose();
            setIsCopyData(false);
            resetDraftDataSettingPrice();
            setTab(SETTING_IMAGE_TAB);
          }}
        />
        <ButtonCustom
          title='Lưu'
          borderRadius='28px'
          bgcolor='#FFA04B'
          borderColor='#FFA04B'
          width='176px'
          onClick={() => {
            saveMenu();
            resetDraftDataSettingPrice();
          }}
          disabled={inProgress}
        />
      </Box>
    );
  };

  const parentCategoryChanged = async (event) => {
    const newMenuData = cloneMenuData();
    const parentCategory = find(parentCategories, { value: event.target.value });
    if (!Utils.isNil(parentCategory)) {
      newMenuData.parentCategory = parentCategory;

      const childCategoryParams = {
        tier_number: 2,
        parent_id: parentCategory.id,
      };
      const categories = await getCategories(childCategoryParams);
      newMenuData.childCategory = {
        value: '',
      };
      const childCategories = categories.map((category) => {
        return { id: category.id, value: category.code, label: category.name };
      });
      setMenuData(newMenuData);
      setChildCategories(childCategories);
    } else {
      newMenuData.parentCategory = {
        value: '',
      };
      newMenuData.childCategory = {
        value: '',
      };
      setMenuData(newMenuData);
      setChildCategories([]);
    }
  };

  const getCategories = (params) => {
    return new Promise((resolve) => {
      ShopOrderApiService.getCategories(shop.hashId, params)
        .then((categories) => {
          resolve(categories);
        })
        .catch((error) => {
          props.showWarningMessage(error.message);
        });
    });
  };

  const getShopCookPlaces = async () => {
    try {
      const listCookPlaces = await ShopOrderApiService.getCookPlaces(shop.hashId);
      const listCookPlacesSelect = listCookPlaces.map((listCookPlace) => {
        return { id: listCookPlace.id, value: listCookPlace.hash_id, label: listCookPlace.name };
      });
      setCookPlaces(listCookPlacesSelect);
    } catch (error) {
      props.showWarningMessage(error.message);
    }
  };

  const childCategoryChanged = (event) => {
    const newMenuData = cloneMenuData();
    const childCategory = find(childCategories, { value: event.target.value });
    if (!Utils.isNil(childCategory)) {
      newMenuData.childCategory = childCategory;
    } else {
      newMenuData.childCategory = {
        value: '',
      };
    }
    setMenuData(newMenuData);
  };

  const inputChanged = (event) => {
    const newMenuData = cloneMenuData();
    const { name, value } = event.target;
    newMenuData[name] = value;
    if (name === 'price') {
      newMenuData['tax_value'] = hanldePriceFractionMode(
        handleValueBeforeRound(value, taxPercentageValue),
        0
      );
    }
    setMenuData(newMenuData);
  };

  const onChangeCheckBox = (event) => {
    const { name, checked } = event.target;
    const newMenuData = cloneMenuData();
    newMenuData[name] = checked ? 1 : 0;
    // If initial_order_flg ON, status must be onsale
    if (name === 'initial_order_flg' && checked) {
      newMenuData.status = MENU_STATUS.STATUS_ONSALE;
    }
    setMenuData(newMenuData);
  };

  const handleOnKeyBlur = (event) => {
    const newMenuData = cloneMenuData();
    const {name, value} = event.target;
    newMenuData[name] = isNaN(value) ? '' : Number(value);
    setMenuData(newMenuData);
  }

  const cookPlaceChanged = (event) => {
    const newMenuData = cloneMenuData();
    const cookPlace = find(cookPlaces, { value: event.target.value });
    if (!Utils.isNil(cookPlace)) {
      newMenuData.cookPlace = cookPlace;
    } else {
      newMenuData.cookPlace = {
        value: '',
      };
    }
    setMenuData(newMenuData);
  };

  const onChangeTabStatus = (event, tabValue) => {
    const newMenuData = cloneMenuData();
    newMenuData.status = tabValue;
    // If status must be offsale, initial_order_flg must be OFF
    if (tabValue === MENU_STATUS.STATUS_OFFSALE) {
      newMenuData.initial_order_flg = 0;
    }
    setMenuData(newMenuData);
  };

  const handleDraftSettingPrice = (event) => {
    const { checked, name, value } = event.target;

    if (name === 'is_show') {
      checked
        ? setDraftDataSettingPrice({ ...draftDataSettingPrice, display_flg: 1 })
        : setDraftDataSettingPrice({ ...draftDataSettingPrice, display_flg: 0 });
    }

    if (name === 'draft_price') {
      setDraftDataSettingPrice({
        ...draftDataSettingPrice,
        price: value,
        tax_value: hanldePriceFractionMode(
          handleValueBeforeRound(Number(value), taxPercentageValue),
          0
        ),
      });
    }

    if (name === 'time') {
      const businessHour = find(businessHours, { value: value });
      setDraftDataSettingPrice({
        ...draftDataSettingPrice,
        m_shop_business_hour: businessHour,
        m_shop_business_hour_id: businessHour?.id,
      });
    }
  };

  const deleteMenu = () => {
    if (Object.keys(props.menuData).length > 0) {
      setShowDialog(true);
    } else {
      props.showWarningMessage('Có lỗi xảy ra');
    }
  };

  const execDeleteMenu = () => {
    setInProgress(true);
    ShopOrderApiService.deleteMenu(shop.hashId, props.menuData.hash_id)
      .then(() => {
        setInProgress(false);
        props.showSuccessMessage('Xóa thành công');
        props.getFilterMenu();
        props.onClose();
      })
      .catch((error) => {
        setInProgress(false);
        props.showWarningMessage(error.message);
      });
  };

  const onChangeTab = (event, tabValue) => {
    setTab(tabValue);
  };

  const taxTypeChanged = (event) => {
    const newMenuData = cloneMenuData();
    const { value } = event.target;
    const m_tax_id = find(taxType, { value: value });
    const businessHourPrices = newMenuData?.m_shop_business_hour_prices?.map((item) => {
      return {
        ...item,
        tax_value: hanldePriceFractionMode(handleValueBeforeRound(Number(item.price), value), 0),
      };
    });
    newMenuData['m_shop_business_hour_prices'] = businessHourPrices;
    setTaxPercentageValue(value);
    newMenuData['tax_value'] = hanldePriceFractionMode(
      handleValueBeforeRound(newMenuData?.price, value),
      0
    );
    newMenuData['m_tax_id'] = m_tax_id?.id;
    setDraftDataSettingPrice({
      ...draftDataSettingPrice,
      tax_value: hanldePriceFractionMode(
        handleValueBeforeRound(Number(draftDataSettingPrice.price), value),
        0
      ),
    });
    setMenuData(newMenuData);
  };

  const handleRemoveSettingPrice = (key) => {
    const newMenuData = cloneMenuData();
    newMenuData['m_shop_business_hour_prices'].splice(key, 1);
    setMenuData(newMenuData);
  };

  const addNewSettingPrice = () => {
    const errors = [];
    const newMenuData = cloneMenuData();
    validatePrice({ ...draftDataSettingPrice }, errors);

    if (errors.length > 0) {
      props.showWarningMessage(errors[0]);
      return;
    }

    if (!draftDataSettingPrice?.m_shop_business_hour) {
      props.showWarningMessage('Vui lòng chọn khung giờ');
      return;
    }

    const checkBusinessHourPrice = find(newMenuData?.m_shop_business_hour_prices, {
      m_shop_business_hour_id: draftDataSettingPrice?.m_shop_business_hour?.id,
    });
    if (checkBusinessHourPrice) {
      props.showWarningMessage('Các khung giờ không được trùng nhau');
      return;
    }
    newMenuData['m_shop_business_hour_prices'] = [
      ...(newMenuData?.m_shop_business_hour_prices || []),
      {
        ...draftDataSettingPrice,
        price: Number(draftDataSettingPrice.price),
        m_shop_business_hour_id: draftDataSettingPrice?.m_shop_business_hour?.id,
      },
    ];
    setDraftDataSettingPrice({
      m_shop_business_hour_id: businessHours[0]?.id,
      m_shop_business_hour: businessHours[0],
      price: '',
      tax_value: '',
      display_flg: 1,
    });
    setMenuData(newMenuData);
  };

  const handleCheckBoxTime = (event, key) => {
    const { checked } = event.target;
    let newMenuData = cloneMenuData();
    if (checked) {
      newMenuData['m_shop_business_hour_prices'][key]['display_flg'] = 1;
    } else {
      newMenuData['m_shop_business_hour_prices'][key]['display_flg'] = 0;
    }
    setMenuData(newMenuData);
  };

  const setMainImage = () => {
    let newMenuData = Utils.cloneDeep(menuData);
    if (newMenuData?.main_image_path === newMenuData?.all_images[indexImageClicked]) {
      newMenuData.main_image_path = null;
      setMainImagePath(null);
    } else {
      newMenuData.main_image_path = newMenuData?.all_images[indexImageClicked];
      setMainImagePath(newMenuData?.all_images[indexImageClicked]);
    }
    setMenuData(newMenuData);
  };

  const execDeleteImage = () => {
    let newMenuData = Utils.cloneDeep(menuData);
    let imageDeleted = [];
    if (newMenuData?.all_images[indexImageClicked] === newMenuData?.main_image_path) {
      imageDeleted = newMenuData?.all_images.splice(indexImageClicked, 1);
      newMenuData['main_image_path'] = newMenuData.all_images[0];
      setMainImagePath(newMenuData.all_images[0])
    } else {
      imageDeleted = newMenuData?.all_images.splice(indexImageClicked, 1);
    }
    const indexImageDeletedOfAddImages = newMenuData?.add_images?.indexOf(imageDeleted[0]);
    newMenuData?.delete_images.push(imageDeleted[0]);
    if (indexImageDeletedOfAddImages !== -1) {
      newMenuData?.add_images.splice(indexImageDeletedOfAddImages, 1);
    }
    setMenuData(newMenuData);
  };

  return (
    <>
      {!loading ? (
        <Modal
          actions={actionModal()}
          open={props.open}
          title='Chi tiết món ăn'
          maxWidth={showModal || showModalDetail ? '850px' : '1000px'}
          maxHeight={showModal || showModalDetail ? '30vh' : '65vh'}
          minHeight='460px'
          overflowY='auto'
        >
          <Box mt={2} mr={2} className={classes.modalContent}>
            <Grid container justify={'flex-end'} spacing={2}>
              
              {/*<Grid item>*/}
              {/*  <Button*/}
              {/*    className={classes.buttonHeader}*/}
              {/*    onClick={() => {*/}
              {/*      copyData(false);*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    Tạo món mới*/}
              {/*  </Button>*/}
              {/*</Grid>*/}
              
              <Grid
                item
                style={{ paddingRight: '24px' }}
              >
                <Button
                  className={classes.buttonDelete}
                  variant='outlined'
                  onClick={deleteMenu}
                  disabled={inProgress || Object.keys(props.menuData).length === 0}
                >
                  Xóa
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box className={classes.contentDetail} ml={3} mr={5} mt={1}>
            <Grid container spacing={2} className='wrap-menu-common'>
              <Grid item md={8} sm={12} className='menu-common'>
                <Grid container spacing={2}>
                  <Grid item sm={2} xs={12}>
                    Tên món
                  </Grid>
                  <Grid item sm={10} xs={12}>
                    <OutlinedInput
                      id='name'
                      name='name'
                      value={menuData.name}
                      className={classes.input}
                      labelWidth={0}
                      onChange={(event) => inputChanged(event)}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item sm={2} xs={12}>
                    <Box mt={1} mb={-1}>
                      Danh mục
                    </Box>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <CustomSelectorBase
                      className={classes.select}
                      value={menuData.parentCategory.value}
                      optionArray={parentCategories}
                      id='parent-category'
                      name='parentCategory'
                      onChange={(event) => parentCategoryChanged(event)}
                    />
                  </Grid>
                  <Grid item sm={2} xs={12}>
                    <Box alignSelf='center' textAlign='center' height='100%' paddingTop='10px'>
                     <ArrowRight />
                    </Box>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <CustomSelectorBase
                      className={classes.select}
                      value={menuData.childCategory.value}
                      optionArray={childCategories}
                      id='child-category'
                      name='childCategory'
                      onChange={(event) => childCategoryChanged(event)}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item sm={2} xs={12}>
                    <Box mt={1} mb={-1}>
                      Giá
                    </Box>
                  </Grid>
                  <Grid item sm={10} xs={12}>
                    <OutlinedInput
                      id='price'
                      name='price'
                      value={menuData.price}
                      className={`${classes.input} + ' ' + ${classes.inputPrice}`}
                      classes={{
                        input: classes.inputPrice,
                      }}
                      labelWidth={0}
                      onChange={(event) => inputChanged(event)}
                      onBlur={(event) => handleOnKeyBlur(event)}
                    />
                  </Grid>
                  {/*<Grid item sm={5} xs={12}>*/}
                    {/*<Box display='flex' className='select-options-tax-value'>*/}
                    {/*  <CustomSelectorBase*/}
                    {/*    className={`${classes.select} select-tax-options`}*/}
                    {/*    value={taxPercentageValue}*/}
                    {/*    optionArray={taxType}*/}
                    {/*    id='tax-type'*/}
                    {/*    name='tax-type'*/}
                    {/*    onChange={(event) => taxTypeChanged(event)}*/}
                    {/*  />*/}
                      {/*<Box*/}
                      {/*  mt={1}*/}
                      {/*  ml={1}*/}
                      {/*  whiteSpace='nowrap'*/}
                      {/*  className={classes.textShowTax}*/}
                      {/*  width='50%'*/}
                      {/*>*/}
                        {/*{showtaxValue(*/}
                        {/*  hanldePriceFractionMode(Number(menuData?.tax_value), 0) || 0,*/}
                        {/*  shop?.mShopPosSetting?.m_currency?.name*/}
                        {/*)}*/}
                      {/*</Box>*/}
                    {/*</Box>*/}
                  {/*</Grid>*/}
                </Grid>

                <Grid container spacing={2} className='public-status'>
                  <Grid item sm={2} xs={12}>
                    <Box mt={1} mb={-1}>
                      Trạng thái
                    </Box>
                  </Grid>
                  <Grid item sm={10} xs={12}>
                    <Box display='inline-block' mr={2}>
                      <Tabs
                        value={menuData?.status}
                        onChange={onChangeTabStatus}
                        aria-label='simple tabs example'
                        name='status'
                        TabIndicatorProps={{ style: { display: 'none' } }}
                      >
                        <Tab
                          label='On sale'
                          id='public'
                          value={MENU_STATUS.STATUS_ONSALE}
                          className={`${classes.customTab} ${classes.customTabLeft}`}
                        />
                        <Tab
                          label='Off sale'
                          id='private'
                          value={MENU_STATUS.STATUS_OFFSALE}
                          className={`${classes.customTab} ${classes.customTabRight}`}
                        />
                      </Tabs>
                    </Box>
                    <Box display='inline-block'>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={menuData?.initial_order_flg ? true : false}
                            name='initial_order_flg'
                            value={menuData?.initial_order_flg}
                            color='default'
                          />
                        }
                        label={<Box style={{ fontSize: 14 }}>Đặt gợi ý</Box>}
                        onChange={onChangeCheckBox}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={4} xs={12}>
                <img
                  id='file'
                  name='file'
                  className={classes.mainImage}
                  width={'300px'}
                  height={'auto'}
                  src={mainImagePath ? `${renderUrlImageS3(mainImagePath)}` : defaultMenuImage}
                />
              </Grid>
            </Grid>
            <Box className={`${classes.head} wrap-multiple-tabs`}>
              <Tabs
                value={tab}
                onChange={onChangeTab}
                aria-label='simple tabs example'
                TabIndicatorProps={{ style: { display: 'none' } }}
              >
                {/*<Tab label='Giá theo giờ' id='price-tab' value={SETTING_PRICE_TAB} />*/}
                {/*<Tab label='Nơi thực hiện' id='place-tab' value={SETTING_PLACE_TAB} />*/}
                <Tab label='Hình ảnh' id='image-tab' value={SETTING_IMAGE_TAB} />
              </Tabs>
            </Box>
            <Divider className={classes.horizontalLines} />

            <Box className={classes.wrapTabs} mt={2}>
              {/*{tab === SETTING_PLACE_TAB && (*/}
              {/*  <Box mt={2} ml={1}>*/}
              {/*    <Grid container spacing={2}>*/}
              {/*      <Grid md={9} sm={12}>*/}
              {/*        <Grid container spacing={2}>*/}
              {/*          <Grid item sm={4} xs={12}>*/}
              {/*            Thời gian thực hiện*/}
              {/*          </Grid>*/}
              {/*          <Grid item sm={3} xs={11}>*/}
              {/*            <OutlinedInput*/}
              {/*              id='estimated_preparation_time'*/}
              {/*              name='estimated_preparation_time'*/}
              {/*              value={menuData.estimated_preparation_time}*/}
              {/*              className={`${classes.input} + ' ' + ${classes.inputPrice}`}*/}
              {/*              classes={{*/}
              {/*                input: classes.inputPrice,*/}
              {/*              }}*/}
              {/*              labelWidth={0}*/}
              {/*              onChange={(event) => inputChanged(event)}*/}
              {/*            />*/}
              {/*          </Grid>*/}
              {/*          <Grid item sm={1} xs={1}>*/}
              {/*            <Box mt={1} fontWeight='400'>*/}
              {/*              phút*/}
              {/*            </Box>*/}
              {/*          </Grid>*/}
              {/*          <Grid item sm={4} xs={12}></Grid>*/}
              {/*        </Grid>*/}
              {/*        <Grid container spacing={2}>*/}
              {/*          <Grid item sm={4} xs={12}>*/}
              {/*            Bếp thực hiện*/}
              {/*          </Grid>*/}
              {/*          <Grid item sm={3} xs={12}>*/}
              {/*            <CustomSelectorBase*/}
              {/*              className={classes.select}*/}
              {/*              value={menuData.cookPlace?.value}*/}
              {/*              optionArray={cookPlaces}*/}
              {/*              id='cook-place'*/}
              {/*              name='cookPlaces'*/}
              {/*              onChange={(event) => cookPlaceChanged(event)}*/}
              {/*            />*/}
              {/*          </Grid>*/}
              {/*          <Grid item sm={5} xs={12}></Grid>*/}
              {/*        </Grid>*/}
              {/*      </Grid>*/}
              {/*      <Grid md={3} sm={12}></Grid>*/}
              {/*    </Grid>*/}
              {/*  </Box>*/}
              {/*)}*/}

              {/*{tab === SETTING_PRICE_TAB && (*/}
              {/*  <SettingPriceTab*/}
              {/*    menuData={menuData}*/}
              {/*    draftDataSettingPrice={draftDataSettingPrice}*/}
              {/*    handleDraftSettingPrice={handleDraftSettingPrice}*/}
              {/*    hanldePriceFractionMode={hanldePriceFractionMode}*/}
              {/*    shop={shop}*/}
              {/*    addNewSettingPrice={addNewSettingPrice}*/}
              {/*    handleCheckBoxTime={handleCheckBoxTime}*/}
              {/*    handleRemoveSettingPrice={handleRemoveSettingPrice}*/}
              {/*    businessHours={businessHours}*/}
              {/*  />*/}
              {/*)}*/}

              {tab === SETTING_IMAGE_TAB && (
                <Box mt={2} ml={1}>
                  <Grid container spacing={2}>
                    <Grid item sm={3} xs={12}>
                      <Box height='100%' display='flex' alignItems='center'>
                        Hình ảnh chính
                      </Box>
                    </Grid>
                    <Grid item sm={9} xs={12} className='wrap-content-images'>
                      <Box display='flex' className={classes.scrollContent}>
                        {menuData?.all_images?.map((item, key) => {
                          const isMainImage = item === menuData?.main_image_path;
                          return (
                            <Box
                              key={key}
                              mr={1}
                              position='relative'
                              style={{
                                border: isMainImage && '5px solid #4eff04',
                              }}
                            >
                              <img
                                width={isMainImage ? '90px' : '100px'}
                                height={isMainImage ? '90px' : '100px'}
                                src={renderUrlImageS3(item)}
                                className={classes.image}
                                onClick={() => {
                                  setShowModalDetails(true);
                                  setIndexImageClicked(key);
                                }}
                              />
                              {isMainImage && (
                                <Box
                                  position='absolute'
                                  top={0}
                                  color='#FFF'
                                  style={{ background: '#5de48b' }}
                                >
                                
                                </Box>
                              )}
                            </Box>
                          );
                        })}
                        <ButtonCustom
                          borderRadius='4px'
                          variant='outlined'
                          borderColor='#FFA04B'
                          width='100px'
                          margin='0'
                          padding='33px 0'
                          bgcolor='#FFF'
                          fgcolor='#FFA04B'
                          onClick={() => setShowModal(true)}
                          disabled={menuData?.all_images?.length >= 5}
                        >
                          +Thêm
                        </ButtonCustom>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>

          <ModalSelectMenuImage
            open={showModal}
            onClose={() => setShowModal(false)}
            setMenuFiles={setMenuFiles}
          />

          <ModalShowDetailImage
            open={showModalDetail}
            onClose={() => setShowModalDetails(false)}
            files={menuData?.all_images}
            mainImage={menuData?.main_image_path}
            showSuccessMessage={() => props.showSuccessMessage('Xóa thành công')}
            showWarningMessage={() => props.showWarningMessage('Lỗi tải xuống')}
            indexImageClicked={indexImageClicked}
            setMainImage={setMainImage}
            execDeleteImage={execDeleteImage}
          />

          <Dialog
            isOpen={showDialog}
            onClose={(isOpen) => setShowDialog(isOpen)}
            title='Xóa món ăn'
            message='Bạn có chắc chắn muốn xóa món này không?'
            onConfirm={() => execDeleteMenu()}
          />
          <Dialog
            isOpen={confirmOffSale}
            onClose={(isOpen) => setConfirmOffSale(isOpen)}
            title='Xác nhận'
            message='Bạn có chắc chắn muốn xóa món khỏi danh sách món được phục vụ không?'
            onConfirm={handleConfirmOffSale}
          />
        </Modal>
      ) : (
        <Waiting isOpen={loading} />
      )}
    </>
  );
};

// PropTypes
ModalDetailMenuSetting.propTypes = {
  open: PropTypes.bool,
  menuData: PropTypes.object,
  onClose: PropTypes.func,
  getMenus: PropTypes.func,
  getFilterMenu: PropTypes.func,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalDetailMenuSetting.defaultProps = {
  open: false,
  menuData: {},
  onClose: () => {},
  getMenus: () => {},
  getFilterMenu: () => {},
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalDetailMenuSetting;
