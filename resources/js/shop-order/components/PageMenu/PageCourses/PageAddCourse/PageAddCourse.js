import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Utils from 'js/shared/utils';
import { checkCourseValidation } from './validationCourse';

// Components(Material-UI)
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Tabs,
  Tab,
  TableHead,
  Grid,
  Button,
  OutlinedInput,
  Input,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { Add, Close } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { find } from 'lodash';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import PageInnerWrap from 'js/shared-order/components/PageInnerWrap';
import Footer from 'js/shared-order/components/Footer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import IOSSwitch from 'js/utils/components/Switch/IOSSwitch';
import Modal from 'js/shared-order/components/Modal';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import CustomSelectorBase from 'js/shared/components/CustomSelectorBase';

// Styles
import { useStylesPageAddCourse } from './styles';

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ModalMenusList from './ModalMenusList';
import ModalUploadSingleImage from 'js/shared/components/ModalUploadSingleImage';
import ButtonCustom from 'js/shared-order/components/Button';
import { isEmpty } from 'lodash';
import ShopApiService from 'js/shop/shop-api-service';

// Helper
import {
  INITIAL_PROPOSE_FLG,
  SHOP_ALERT_FLG,
  USER_ALERT_FLG,
  SHOP_END_TIME_ALERT_FLG,
  USER_END_TIME_ALERT_FLG,
} from 'js/utils/helpers/courseHelper';
import { hanldePriceFractionMode } from 'js/utils/helpers/const';
import { renderUrlImageS3 } from 'js/utils/helpers/image';

const COURSE_PRICE_NUMBER = 3;
const STATUS_ACTIVE = 'active';
const STATUS_INACTIVE = 'inactive';
const TIME_BLOCK_TAB_KEY = 0;
const MENU_TAB_KEY = 1;
const TYPE_ONCHANGE_INPUT_BLOCK = 'course_price';
const TYPE_ONCHANGE_INPUT_CHILD_COURSE = 'child_course';
const TYPE_ONCHANGE_INPUT_MENU = 'menu';

const defaultCoursePrice = (status = STATUS_INACTIVE) => {
  return {
    hash_id: null,
    block_time_start: '09:00',
    block_time_finish: '15:00',
    unit_price: '',
    status: status,
    tax_rate: 0.1,
    m_tax_id: null,
    tax_value: null,
  };
};

const defaultChildExtendCourse = {
  hash_id: null,
  name: '延長料金',
  time_block_unit: '',
  list_course_prices: [
    {
      hash_id: null,
      block_time_start: '00:00',
      block_time_finish: '23:59',
      unit_price: '',
      tax_rate: 0.1,
      tax_value: null,
      m_tax_id: null,
      status: STATUS_ACTIVE,
    },
  ],
};

const GREATER_THAN_0_INPUT_NAME = ['time_block_unit', 'unit_price'];

const initCourse = {
  hash_id: null,
  name: '',
  time_block_unit: 60,
  file: null,
  s_image_folder_path: null,
  list_course_prices: [
    defaultCoursePrice(STATUS_ACTIVE),
    defaultCoursePrice(),
    defaultCoursePrice(),
  ],
  list_menus: [],
  list_child_courses: [defaultChildExtendCourse],
  alert_notification_time: '',
  initial_propose_flg: INITIAL_PROPOSE_FLG.STATUS_OFF,
  user_alert_flg: USER_ALERT_FLG.STATUS_ON,
  shop_alert_flg: SHOP_ALERT_FLG.STATUS_ON,
  user_end_time_alert_flg: USER_END_TIME_ALERT_FLG.STATUS_ON,
  shop_end_time_alert_flg: SHOP_END_TIME_ALERT_FLG.STATUS_ON,
};

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color='default' {...props} />);

const PageAddCourse = (props) => {
  const classes = useStylesPageAddCourse(props);
  const { courseHashId = null } = useParams();
  const [shop] = useContext(ShopInfoContext);
  const history = useHistory();
  const [tab, setTab] = useState(TIME_BLOCK_TAB_KEY);
  const [isShowChooseMenus, setIsShowChooseMenus] = useState(false);
  const [isShowChooseImage, setIsShowChooseImage] = useState(false);
  const [isShowDeleteCourse, setIsShowDeleteCourse] = useState(false);
  const [taxType, setTaxType] = useState([]);
  const [selectedDeleteCoursePrices, setSelectedDeleteCoursePrices] = useState([]);

  const currencyName = shop?.mShopPosSetting?.m_currency?.name;

  // delete menu modal
  const [selectedMenu, setSelectedMenu] = useState({
    isShow: false,
    menu: null,
  });
  const [newCourse, setNewCourse] = useState(initCourse);
  const [fileUpload, setFileUpload] = useState({
    file: null,
    filePreview: null,
  });
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [shopTaxInfo, setShopTaxInfo] = useState({});

  useEffect(() => {
    if (courseHashId) {
      getDetailCourse();
    }
    getTaxOptions();
  }, [courseHashId]);

  //get shop tax info
  useEffect(() => {
    getShopTaxInfo();
  }, []);

  const getShopTaxInfo = async () => {
    let shopDataInfo = await ShopApiService.getShopTaxInfo(shop?.hashId);
    setShopTaxInfo(shopDataInfo);
  }

  const getTaxOptions = async () => {
    const taxsRes = await ShopApiService.getTaxOptions(shop?.hashId);
    const taxTypes = taxsRes.map((item) => {
      return { id: item.id, label: item.name, value: Number(item.tax_rate) };
    });
    setTaxType(taxTypes);
  };

  const getDetailCourse = async () => {
    try {
      const response = await ShopOrderApiService.getCourse(shop.hashId, courseHashId);
      response.list_course_prices = makeCoursePrices(response.list_course_prices);
      if (isEmpty(response.list_child_courses)) {
        response.list_child_courses = [defaultChildExtendCourse];
      }
      if (response.s_image_folder_path) {
        setFileUpload({
          file: null,
          filePreview: renderUrlImageS3(response.s_image_folder_path),
        });
      }
      setNewCourse(response);
    } catch (error) {
      setNewCourse(null);
      showWarningMessage('Không tìm thấy set ăn');
    }
  };

  const makeCoursePrices = (timeBlocksResponse = []) => {
    let newTimeBlocks = Utils.cloneDeep(timeBlocksResponse);
    let timeBlockMissing = COURSE_PRICE_NUMBER - timeBlocksResponse.length;
    if (timeBlockMissing > 0) {
      for (let newBlockNumber = 1; newBlockNumber <= timeBlockMissing; newBlockNumber++) {
        let newBlock = defaultCoursePrice();

        if (timeBlockMissing === COURSE_PRICE_NUMBER && newBlockNumber === 1) {
          newBlock.status = STATUS_ACTIVE;
        }
        newTimeBlocks.push(newBlock);
      }
    }

    return newTimeBlocks;
  };

  const showWarningMessage = (message) => {
    let newMessage = message;
    if (message === 'Error: Not Found') {
      newMessage = 'Không tìm thấy';
    }

    setToast({
      isShow: true,
      message: newMessage,
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

  const handleOnKeyBlur = (event, type = '', index = null) => {
    let newCourseClone = Utils.cloneDeep(newCourse);
    const { target } = event;
    const name = target.getAttribute('name');
    let value = target.value;

    if (type === TYPE_ONCHANGE_INPUT_BLOCK) {
      if (newCourseClone?.list_course_prices[index]) {
        newCourseClone.list_course_prices[index][name] = Number(value).toString();
      }
    } else {
      if (value !== '') {
        newCourseClone.list_child_courses[index]['list_course_prices'][index][name] = Number(
          value
        ).toString();
      } else {
        newCourseClone.list_child_courses[index]['list_course_prices'][index][name] = value
      }
    }
    setNewCourse(newCourseClone);
  };

  const onChangeInput = (event, type = '', index = null) => {
    let newCourseClone = Utils.cloneDeep(newCourse);
    const priceFractionMode = shopTaxInfo?.price_fraction_mode;

    const { target } = event;
    const name = target.getAttribute('name');
    let value = target.value;

    if (GREATER_THAN_0_INPUT_NAME.includes(name) && parseInt(value) < 0) {
      value = 1;
    }
    if (type === TYPE_ONCHANGE_INPUT_BLOCK) {
      const taxOption = find(taxType, {
        value: newCourseClone.list_course_prices[index]['tax_rate'],
      });
      if (newCourseClone?.list_course_prices[index]) {
        newCourseClone.list_course_prices[index][name] = value;

        if (!isNaN(value) && Number(value) !== 0) {
          newCourseClone.list_course_prices[index]['tax_value'] = hanldePriceFractionMode(
            handleValueBeforeRound(
              Number(value),
              Number(newCourseClone.list_course_prices[index]['tax_rate'])
            ),
            0,
            priceFractionMode
          );
        }

        if (!newCourseClone.list_course_prices[index]['m_tax_id']) {
          newCourseClone.list_course_prices[index]['m_tax_id'] = taxOption.id;
        }
      }
    } else if (type === TYPE_ONCHANGE_INPUT_CHILD_COURSE) {
      const taxOption = find(taxType, {
        value: newCourseClone.list_child_courses[index]['list_course_prices'][0]['tax_rate'],
      });

      if (newCourseClone?.list_child_courses[index]) {
        if (name === 'unit_price') {
          newCourseClone.list_child_courses[index]['list_course_prices'][index][name] = value;
        } else {
          newCourseClone.list_child_courses[index][name] = value;
        }

        if (!isNaN(value) && name !== 'time_block_unit') {
          newCourseClone.list_child_courses[index]['list_course_prices'][0][
            'tax_value'
          ] = hanldePriceFractionMode(
            handleValueBeforeRound(
              Number(value),
              Number(newCourseClone.list_child_courses[index]['list_course_prices'][0]['tax_rate'])
            ),
            0,
            priceFractionMode
          );
        }
      }

      if (!newCourseClone.list_child_courses[index]['list_course_prices'][0]['m_tax_id']) {
        newCourseClone.list_child_courses[index]['list_course_prices'][0]['m_tax_id'] =
          taxOption.id;
      }
    } else if (type === TYPE_ONCHANGE_INPUT_MENU) {
      if (newCourseClone?.list_menus[index]) {
        newCourseClone.list_menus[index][name] = value;
      }
    } else {
      newCourseClone[name] = value;
    }
    setNewCourse(newCourseClone);
  };

  const handleValueBeforeRound = (price, percenTaxValue) => {
    return (price * 100 * percenTaxValue) / (100 + 100 * percenTaxValue);
  };

  const taxTypeChanged = (event, type, index) => {
    let newCourseClone = Utils.cloneDeep(newCourse);
    const priceFractionMode = shopTaxInfo?.price_fraction_mode;
    const { value } = event.target;
    const taxOption = find(taxType, { value: value });

    if (type === TYPE_ONCHANGE_INPUT_CHILD_COURSE) {
      newCourseClone.list_child_courses[index]['list_course_prices'][0]['tax_rate'] = value;
      newCourseClone.list_child_courses[index]['list_course_prices'][0][
        'tax_value'
      ] = hanldePriceFractionMode(
        handleValueBeforeRound(
          Number(newCourseClone.list_child_courses[index]['list_course_prices'][0].unit_price),
          Number(value)
        ),
        0,
        priceFractionMode
      );
      newCourseClone.list_child_courses[index]['list_course_prices'][0]['m_tax_id'] = taxOption.id;
    } else {
      newCourseClone.list_course_prices[index]['tax_rate'] = value;
      newCourseClone.list_course_prices[index]['tax_value'] = hanldePriceFractionMode(
        handleValueBeforeRound(
          Number(newCourseClone.list_course_prices[index].unit_price),
          Number(value)
        ),
        0,
        priceFractionMode
      );
      newCourseClone.list_course_prices[index]['m_tax_id'] = taxOption.id;
    }
    setNewCourse(newCourseClone);
  };

  const onChangeCheckBox = (event) => {
    let newCourseClone = Utils.cloneDeep(newCourse);
    const { target } = event;
    const name = target.getAttribute('name');
    if (target.checked) {
      newCourseClone[name] = 1;
    } else {
      newCourseClone[name] = 0;
    }

    setNewCourse(newCourseClone);
  };

  const onChangeEndTimeAlertFlg = (event) => {
    let newCourseClone = Utils.cloneDeep(newCourse);
    const { target } = event;
    if (target.checked) {
      newCourseClone.user_end_time_alert_flg = USER_END_TIME_ALERT_FLG.STATUS_ON;
      newCourseClone.shop_end_time_alert_flg = SHOP_END_TIME_ALERT_FLG.STATUS_ON;
    } else {
      newCourseClone.user_end_time_alert_flg = USER_END_TIME_ALERT_FLG.STATUS_OFF;
      newCourseClone.shop_end_time_alert_flg = SHOP_END_TIME_ALERT_FLG.STATUS_OFF;
    }

    setNewCourse(newCourseClone);
  };

  const prepareCourseBeforeUpload = (course) => {
    let newCourseClone = Utils.cloneDeep(course);
    newCourseClone.list_course_prices = newCourseClone.list_course_prices.filter(
      (coursePrice) =>
        coursePrice.block_time_start && coursePrice.block_time_finish && coursePrice.unit_price
    );
    newCourseClone.list_child_courses = newCourseClone.list_child_courses.filter(
      (childCourse) =>
        childCourse.time_block_unit && childCourse['list_course_prices'][0].unit_price
    );
    newCourseClone.list_menus = newCourseClone.list_menus.map((menu) => ({
      course_hash_id: newCourseClone?.hash_id || '',
      menu_hash_id: menu.hash_id,
      status: menu.status,
    }));
    if (fileUpload.file) {
      newCourseClone.file = fileUpload.file;
    }

    if (selectedDeleteCoursePrices) {
      newCourseClone.list_delete_course_prices = selectedDeleteCoursePrices;
    }

    return newCourseClone;
  };

  const onChangeStatus = async (event, type = '', index = null) => {
    let newCourseClone = Utils.cloneDeep(newCourse);
    const { target } = event;
    let checkedStatus = target.checked ? STATUS_ACTIVE : STATUS_INACTIVE;
    // filter time block has data

    if (type === TYPE_ONCHANGE_INPUT_BLOCK) {
      if (newCourseClone?.list_course_prices[index]) {
        newCourseClone.list_course_prices[index].status = checkedStatus;
      }
    } else if (type === TYPE_ONCHANGE_INPUT_MENU) {
      if (newCourseClone?.list_menus[index]) {
        newCourseClone.list_menus[index].status = checkedStatus;
      }
    }

    setNewCourse(newCourseClone);
  };

  const onChangeImageCourse = (image) => {
    if (image && image?.file) {
      setFileUpload({
        file: image.file,
        filePreview: image.base64Image,
      });
    }
  };

  const onChangeTab = (event, tabValue) => {
    setTab(tabValue);
  };

  const onAddMenus = async (selectedMenus) => {
    let newCourseClone = Utils.cloneDeep(newCourse);
    const newSelectedMenus = selectedMenus.map((menu) => ({
      ...menu,
      status: STATUS_ACTIVE,
    }));
    newCourseClone.list_menus = newCourseClone.list_menus.concat(newSelectedMenus);
    const submitMenus = selectedMenus.map((menu) => ({
      menu_hash_id: menu.hash_id,
      status: STATUS_ACTIVE,
    }));
    setNewCourse(newCourseClone);
    if (newCourse.hash_id) {
      setIsSubmitLoading(true);
      try {
        await ShopOrderApiService.addMenusToCourse(shop.hashId, newCourse.hash_id, submitMenus);
        setIsSubmitLoading(false);
  
        showSuccessMessage('Thêm món ăn thành công');
      } catch (error) {
        setIsSubmitLoading(false);
      }
    }
  };

  const onSubmit = async () => {
    let newCourseClone = Utils.cloneDeep(newCourse);
    let errors = checkCourseValidation(newCourseClone, tab === MENU_TAB_KEY, shop);
    if (errors.length > 0) {
      showWarningMessage(errors[0]);

      return;
    }

    // filter time block has data
    newCourseClone = prepareCourseBeforeUpload(newCourseClone);

    if (newCourse.hash_id) {
      // update course
      try {
        setIsSubmitLoading(true);
        // update block
        // Check if delete child course
        if (newCourse.list_child_courses[0].hash_id && newCourse.list_child_courses[0].time_block_unit === '') {
          await ShopOrderApiService.deleteCourse(
            shop.hashId,
            newCourse.list_child_courses[0].hash_id);
        }

        let responseBlock = await ShopOrderApiService.updateBlocksInCourse(
          shop.hashId,
          newCourse.hash_id,
          newCourseClone
        );
        
        //update Menu
        const responseMenuCourse = await ShopOrderApiService.updateMenusInCourse(
          shop.hashId,
          newCourse.hash_id,
          newCourseClone
        );
        newCourseClone = Utils.cloneDeep(newCourse);
        newCourseClone.list_course_prices = makeCoursePrices(responseBlock.list_course_prices);
        if (isEmpty(responseBlock.list_child_courses)) {
          newCourseClone.list_child_courses = [defaultChildExtendCourse];
        } else {
          newCourseClone.list_child_courses = responseBlock.list_child_courses;
        }
        newCourseClone.list_menus = responseMenuCourse.list_menus;
        newCourse.s_image_folder_path = responseMenuCourse.s_image_folder_path;
        delete newCourseClone.isRemoveImage;
        setFileUpload({
          file: null,
          filePreview: fileUpload.filePreview,
        });
        setNewCourse(newCourseClone);
        setIsSubmitLoading(false);

        showSuccessMessage('Cập nhật thành công');
      } catch (error) {
        setIsSubmitLoading(false);
        showWarningMessage(error.message);
      }

      return;
    }

    // create course
    try {
      setIsSubmitLoading(true);
      const response = await ShopOrderApiService.createCourse(shop.hashId, newCourseClone);
      newCourseClone = Utils.cloneDeep(newCourse);
      delete newCourseClone.isRemoveImage;
      newCourseClone.list_course_prices = makeCoursePrices(response.list_course_prices);
      if (isEmpty(response.list_child_courses)) {
        newCourseClone.list_child_courses = [defaultChildExtendCourse];
      } else {
        newCourseClone.list_child_courses = response.list_child_courses;
      }
      newCourseClone.hash_id = response.hash_id;
      newCourse.s_image_folder_path = response.s_image_folder_path;
      setFileUpload({
        file: null,
        filePreview: fileUpload.filePreview,
      });
      setNewCourse(newCourseClone);
      setIsSubmitLoading(false);

      showSuccessMessage('Tạo set ăn thành công');
    } catch (error) {
      setIsSubmitLoading(false);
      showWarningMessage(error.message);
    }
  };

  const onDeleteCourse = async () => {
    try {
      await ShopOrderApiService.deleteCourse(shop.hashId, newCourse.hash_id);

      setIsShowDeleteCourse(false);
      showSuccessMessage('Xóa set ăn thành công');
      setTimeout(() => {
        history.push('/menus/courses');
      }, 1500);
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const actionModalDeleteCourse = () => {
    return (
      <Box textAlign='center'>
        <ButtonCustom
          title='Không'
          borderRadius='28px'
          bgcolor='#828282'
          borderColor='#828282'
          width='176px'
          onClick={() => setIsShowDeleteCourse(false)}
        />
        <ButtonCustom
          title='Đồng ý'
          borderRadius='28px'
          bgcolor='#FFA04B'
          borderColor='#FFA04B'
          width='176px'
          onClick={onDeleteCourse}
        />
      </Box>
    );
  };

  const onSelectDeleteCoursePrice = (coursePriceHashId, indexBlock) => {
    let newCourseClone = Utils.cloneDeep(newCourse);
    newCourseClone.list_course_prices[indexBlock] = defaultCoursePrice();

    if (coursePriceHashId) {
      let selectedCoursePrices = selectedDeleteCoursePrices;
      selectedCoursePrices.push(coursePriceHashId);
      setSelectedDeleteCoursePrices(selectedCoursePrices);
    }

    setNewCourse(newCourseClone);
  }

  const onCancelDeleteMenu = () => {
    setSelectedMenu({
      isShow: false,
      menu: null,
    });
  };

  const onDeleteMenu = async () => {
    try {
      setIsSubmitLoading(true);
      let response = await ShopOrderApiService.deleteMenuInCourse(
        shop.hashId,
        newCourse.hash_id,
        selectedMenu.menu.hash_id
      );
      let newCourseClone = Utils.cloneDeep(newCourse);
      newCourseClone.list_menus = response.list_menus;
      setNewCourse(newCourseClone);
      setIsSubmitLoading(false);

      showSuccessMessage('削除しました。');
      setSelectedMenu({
        isShow: false,
        menu: null,
      });
    } catch (error) {
      setIsSubmitLoading(false);
      showWarningMessage(error.message);
    }
  };

  const actionModalDeleteMenu = () => {
    return (
      <Box textAlign='center'>
        <ButtonCustom
          title='Không'
          borderRadius='28px'
          bgcolor='#828282'
          borderColor='#828282'
          width='176px'
          onClick={onCancelDeleteMenu}
        />
        <ButtonCustom
          title='Đồng ý'
          borderRadius='28px'
          bgcolor='#FFA04B'
          borderColor='#FFA04B'
          width='176px'
          onClick={onDeleteMenu}
        />
      </Box>
    );
  };

  const handleRemoveImage = () => {
    let newCourseClone = Utils.cloneDeep(newCourse);
    newCourseClone.isRemoveImage = true;
    setNewCourse(newCourseClone);
    setFileUpload({
      file: null,
      filePreview: null,
    });
  };

  return (
    <PageContainer padding='0px' height='auto' minHeight='auto'>
      {/* Change background color body and unset minHeight */}
      <style>{'body { background-color: white }'}</style>

      <HeaderAppBar title='Chi tiết set ăn' />
      <PageInnerWrap height='auto'>
        <PageInnerContainer padding={'8px 16px'} height='auto'>
          {courseHashId && !newCourse ? (
            <p>Không tìm thấy set ăn</p>
          ) : (
            <>
              <Box flex={1} className={classes.head}>
                <Grid spacing={5} container>
                  <Grid item xs={12} sm={6}>
                    <Box mt={2} display='flex' alignItems='center'>
                      <Box width='20%'>Tên</Box>
                      <Box width='80%'>
                        <OutlinedInput
                          type='text'
                          name='name'
                          value={newCourse.name}
                          labelWidth={0}
                          placeholder=''
                          className={classes.inputHead}
                          onChange={onChangeInput}
                        />
                      </Box>
                    </Box>

                    <Box mt={2} display='flex' alignItems='center'>
                      <Box width='20%'>Thời gian</Box>
                      <Box width='80%'>
                        <OutlinedInput
                          type='number'
                          inputProps={{
                            max: 1000,
                            min: 0,
                            step: 10,
                          }}
                          endAdornment='phút'
                          name='time_block_unit'
                          value={newCourse.time_block_unit}
                          labelWidth={0}
                          placeholder='60'
                          className={classes.inputHead}
                          onChange={onChangeInput}
                        />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box className={classes.previewBlock} mt={2}>
                      <Button
                        variant='contained'
                        component='label'
                        className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                        onClick={() => setIsShowChooseImage(true)}
                      >
                        Hình ảnh
                      </Button>
                      <Box className={classes.previewImg}>
                        {fileUpload.filePreview ? (
                          <>
                            <img className={classes.imageUploadHead} src={fileUpload.filePreview} />
                            <Button
                              className={classes.buttonRemoveImage}
                              onClick={handleRemoveImage}
                            >
                              <Close />
                            </Button>
                          </>
                        ) : null}
                      </Box>
                      <Box>
                        {newCourse.hash_id ? (
                          <Box className={classes.deleteBlock} mt={2}>
                            <Button
                              type='button'
                              className={classes.deleteButton}
                              onClick={() => setIsShowDeleteCourse(true)}
                            >
                              Xóa
                            </Button>
                          </Box>
                        ) : null}
                      </Box>
                    </Box>

                    {/* Xác nhận 5 phút trước khi kết thúc */}
                    <Box mt={2} display='flex' alignItems='center'>
                      <Box className={classes.switchBox}>
                        <IOSSwitch
                          checked={
                            newCourse.shop_end_time_alert_flg ===
                              SHOP_END_TIME_ALERT_FLG.STATUS_ON ||
                            newCourse.user_end_time_alert_flg === SHOP_END_TIME_ALERT_FLG.STATUS_ON
                              ? true
                              : false
                          }
                          onChange={(e) => onChangeEndTimeAlertFlg(e)}
                        />
                        <Box>Thông báo 5 phút trước khi kết thúc</Box>
                      </Box>
                      <Box className={classes.options}>
                        <Box style={{ padding: '0 20px ' }}>（</Box>
                        <Box>
                          <Grid item xs={12}>
                            <Grid
                              container
                              alignContent='center'
                              style={{ justifyContent: 'center' }}
                            >
                              <FormControlLabel
                                control={
                                  <GreenCheckbox
                                    checked={newCourse.user_end_time_alert_flg ? true : false}
                                    onChange={onChangeCheckBox}
                                    name='user_end_time_alert_flg'
                                    value={newCourse.user_end_time_alert_flg}
                                  />
                                }
                                label='Báo cho khách hàng'
                              />
                              <FormControlLabel
                                control={
                                  <GreenCheckbox
                                    checked={newCourse.shop_end_time_alert_flg ? true : false}
                                    onChange={onChangeCheckBox}
                                    name='shop_end_time_alert_flg'
                                    value={newCourse.shop_end_time_alert_flg}
                                  />
                                }
                                label='Báo cho cửa hàng'
                              />
                            </Grid>
                          </Grid>
                        </Box>
                        <Box>）</Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box flex={1} className={classes.head}>
                <Tabs
                  value={tab}
                  onChange={onChangeTab}
                  aria-label='simple tabs example'
                  TabIndicatorProps={{ style: { display: 'none' } }}
                >
                  <Tab
                    label='Thời gian'
                    id='blocks-tab'
                    value={TIME_BLOCK_TAB_KEY}
                    className={`${classes.customTab} ${classes.customTabLeft}`}
                  />
                  <Tab
                    label='Món ăn'
                    id='menus-tab'
                    value={MENU_TAB_KEY}
                    className={`${classes.customTab} ${classes.customTabRight}`}
                  />
                </Tabs>
              </Box>

              <Box flex={1} className={classes.head}>
                <Box mt={1}>
                  {tab === TIME_BLOCK_TAB_KEY ? (
                    <TableContainer component={Paper} className={classes.container}>
                      <Table stickyHeader aria-label='blocks table'>
                        <TableHead>
                          <TableRow classes={{ root: classes.tableHead }}>
                            {/* status */}
                            <TableCell classes={{ root: classes.tableCell }} width='10%'>
                              Trạng thái
                            </TableCell>

                            {/* name */}
                            <TableCell classes={{ root: classes.tableCell }} width='15%'>
                              Tên
                            </TableCell>

                            {/* time */}
                            <TableCell classes={{ root: classes.tableCell }} width='30%'>
                              Thời gian
                            </TableCell>

                            {/* cost */}
                            <TableCell classes={{ root: classes.tableCell }} width='15%'>
                              Giá (Bao gồm thuế)
                            </TableCell>
                            <TableCell classes={{ root: classes.tableCell }} width='15%'>
                              <Box textAlign='center'>Thuế</Box>
                            </TableCell>
                            <TableCell classes={{ root: classes.tableCell }} width='20%'>
                              <Box whiteSpace='nowrap' textAlign='center'>
                                Tiền thuế
                              </Box>
                            </TableCell>

                            <TableCell
                              classes={{ root: classes.tableCell }}
                              width="10%"
                            >
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.isArray(newCourse?.list_course_prices)
                            ? newCourse.list_course_prices.map((block, indexBlock) => (
                                <TableRow key={indexBlock}>
                                  <TableCell component='th' scope='row'>
                                    <IOSSwitch
                                      checked={block.status === STATUS_ACTIVE}
                                      onChange={(e) =>
                                        onChangeStatus(e, TYPE_ONCHANGE_INPUT_BLOCK, indexBlock)
                                      }
                                    />
                                  </TableCell>

                                  <TableCell
                                    component='th'
                                    scope='row'
                                    style={{ minWidth: '160px' }}
                                  >
                                    Giá cơ bản {indexBlock + 1}
                                  </TableCell>

                                  <TableCell component='th' scope='row'>
                                    <Box display={'flex'}>
                                      <Input
                                        className={classes.inputTimer}
                                        type='time'
                                        value={block.block_time_start}
                                        disableUnderline={true}
                                        inputProps={{
                                          step: 300, // 5 min
                                        }}
                                        disabled={block.status !== STATUS_ACTIVE}
                                        name='block_time_start'
                                        onChange={(e) =>
                                          onChangeInput(e, TYPE_ONCHANGE_INPUT_BLOCK, indexBlock)
                                        }
                                      />
                                      <Box className={classes.middleTimer}>~</Box>
                                      <Input
                                        className={classes.inputTimer}
                                        type='time'
                                        value={block.block_time_finish}
                                        disableUnderline={true}
                                        inputProps={{
                                          step: 300, // 5 min
                                        }}
                                        disabled={block.status !== STATUS_ACTIVE}
                                        name='block_time_finish'
                                        onChange={(e) =>
                                          onChangeInput(e, TYPE_ONCHANGE_INPUT_BLOCK, indexBlock)
                                        }
                                      />
                                    </Box>
                                  </TableCell>

                                  <TableCell component='th' scope='row'>
                                    <Box display={'flex'} alignItems={'center'}>
                                      <OutlinedInput
                                        type='number'
                                        inputProps={{
                                          max: 99999,
                                          min: 1,
                                        }}
                                        value={block.unit_price}
                                        labelWidth={0}
                                        className={classes.inputBlockCost}
                                        classes={{
                                          input: classes.inputBlockCostInput,
                                        }}
                                        placeholder='0'
                                        disabled={block.status !== STATUS_ACTIVE}
                                        name='unit_price'
                                        onChange={(e) =>
                                          onChangeInput(e, TYPE_ONCHANGE_INPUT_BLOCK, indexBlock)
                                        }
                                        onBlur={(e) =>
                                          handleOnKeyBlur(e, TYPE_ONCHANGE_INPUT_BLOCK, indexBlock)
                                        }
                                      />
                                      {currencyName}
                                    </Box>
                                  </TableCell>

                                  <TableCell component='th' scope='row'>
                                    <CustomSelectorBase
                                      className={classes.selectTaxOptions}
                                      value={Number(block.tax_rate)}
                                      optionArray={taxType}
                                      id='tax-type'
                                      name='tax_rate'
                                      disabled={block.status !== STATUS_ACTIVE}
                                      onChange={(e) =>
                                        taxTypeChanged(e, TYPE_ONCHANGE_INPUT_BLOCK, indexBlock)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell component='th' scope='row'>
                                    <Box textAlign='center'>
                                      {block.tax_value || 0} &nbsp;
                                      {currencyName}
                                    </Box>
                                  </TableCell>

                                  <TableCell component="th" scope="row" >
                                    <Button
                                      type="button"
                                      className={classes.deleteButton}
                                      onClick={() => onSelectDeleteCoursePrice(block.hash_id, indexBlock)}
                                    >
                                      Xóa
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            : null}

                          {/* block extends */}
                          {Array.isArray(newCourse?.list_child_courses)
                            ? newCourse.list_child_courses.map((childCourse, indexCourse) => (
                                <TableRow
                                  key='block_extend_time_time'
                                  className={classes.tableRowGray}
                                >
                                  <TableCell component='th' scope='row'></TableCell>

                                  <TableCell component='th' scope='row'>
                                    Phí gia hạn
                                  </TableCell>

                                  <TableCell component='th' scope='row'>
                                    <Box display={'flex'}>
                                      <OutlinedInput
                                        type='number'
                                        name='time_block_unit'
                                        labelWidth={0}
                                        placeholder='60'
                                        inputProps={{
                                          max: 1000,
                                          min: 0,
                                          step: 10,
                                        }}
                                        className={classes.inputExtendTime}
                                        value={childCourse.time_block_unit}
                                        onChange={(e) =>
                                          onChangeInput(
                                            e,
                                            TYPE_ONCHANGE_INPUT_CHILD_COURSE,
                                            indexCourse
                                          )
                                        }
                                      />
                                      <Box style={{ margin: 'auto 0' }}>phút</Box>
                                    </Box>
                                  </TableCell>

                                  <TableCell component='th' scope='row'>
                                    <Box display={'flex'} alignItems={'center'}>
                                      <OutlinedInput
                                        type='number'
                                        name='unit_price'
                                        labelWidth={0}
                                        className={classes.inputBlockCost}
                                        placeholder='0'
                                        inputProps={{
                                          max: 99999,
                                          min: 1,
                                        }}
                                        classes={{
                                          input: classes.inputBlockCostInput,
                                        }}
                                        value={childCourse.list_course_prices[0]?.unit_price}
                                        onChange={(e) =>
                                          onChangeInput(
                                            e,
                                            TYPE_ONCHANGE_INPUT_CHILD_COURSE,
                                            indexCourse
                                          )
                                        }
                                        onBlur={(e) =>
                                          handleOnKeyBlur(
                                            e,
                                            TYPE_ONCHANGE_INPUT_CHILD_COURSE,
                                            indexCourse
                                          )
                                        }
                                      />
                                      {currencyName}
                                    </Box>
                                  </TableCell>
                                  <TableCell component='th' scope='row'>
                                    <CustomSelectorBase
                                      className={classes.selectTaxOptions}
                                      value={childCourse.list_course_prices[0] && Number(childCourse.list_course_prices[0].tax_rate)}
                                      optionArray={taxType}
                                      id='tax-type'
                                      name='tax_rate'
                                      onChange={(e) =>
                                        taxTypeChanged(
                                          e,
                                          TYPE_ONCHANGE_INPUT_CHILD_COURSE,
                                          indexCourse
                                        )
                                      }
                                    />
                                  </TableCell>
                                  <TableCell component='th' scope='row'>
                                    <Box textAlign='center'>
                                      {childCourse.list_course_prices[0]?.tax_value || 0}
                                      {currencyName}
                                    </Box>
                                  </TableCell>

                                  <TableCell component="th" scope="row"></TableCell>
                                </TableRow>
                              ))
                            : null}
                          {/* END block extends */}

                          {/* alert time */}
                          <TableRow key='alert_time_table' className={classes.tableRowGray}>
                            <TableCell component='th' scope='row'></TableCell>

                            <TableCell component='th' scope='row'>
                              Thông báo
                            </TableCell>

                            <TableCell component='th' scope='row'>
                              <Box display={'flex'}>
                                <OutlinedInput
                                  type='number'
                                  name='alert_notification_time'
                                  labelWidth={0}
                                  inputProps={{
                                    max: 1000,
                                    min: 0,
                                    step: 10,
                                  }}
                                  placeholder='60'
                                  className={classes.inputAlertTime}
                                  value={newCourse.alert_notification_time}
                                  onChange={onChangeInput}
                                />
                                <Box style={{ margin: 'auto 0' }}>Thông báo trước khi kết thúc</Box>
                              </Box>
                            </TableCell>
                            <TableCell component='th' scope='row'>
                              <Grid item xs={12}>
                                <Grid container justify='flex-start'>
                                  <FormControlLabel
                                    control={
                                      <GreenCheckbox
                                        checked={newCourse.user_alert_flg ? true : false}
                                        onChange={onChangeCheckBox}
                                        name='user_alert_flg'
                                        value={newCourse.user_alert_flg}
                                      />
                                    }
                                    label='Báo cho khách hàng'
                                  />
                                  <FormControlLabel
                                    control={
                                      <GreenCheckbox
                                        checked={newCourse.shop_alert_flg ? true : false}
                                        onChange={onChangeCheckBox}
                                        name='shop_alert_flg'
                                        value={newCourse.shop_alert_flg}
                                      />
                                    }
                                    label='Báo cho cửa hàng'
                                  />
                                </Grid>
                              </Grid>
                            </TableCell>
                            <TableCell component='th' scope='row'></TableCell>
                            <TableCell component='th' scope='row'></TableCell>
                          </TableRow>
                          {/* END alert time */}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <TableContainer component={Paper} className={classes.container}>
                      <Table stickyHeader aria-label='simple table'>
                        <TableHead>
                          <TableRow classes={{ root: classes.tableHead }}>
                            {/* status */}
                            <TableCell
                              classes={{ root: classes.tableCell }}
                              style={{ minWidth: '120px' }}
                            >
                              Trạng thái
                            </TableCell>

                            {/* name */}
                            <TableCell
                              classes={{ root: classes.tableCell }}
                              style={{ minWidth: '120px' }}
                            >
                              Tên
                            </TableCell>

                            {/* time */}
                            <TableCell
                              classes={{ root: classes.tableCell }}
                              style={{ minWidth: '160px' }}
                            >
                              Thời gian
                            </TableCell>

                            {/* image */}
                            <TableCell
                              classes={{ root: classes.tableCell }}
                              style={{ minWidth: '160px' }}
                            >
                              Ảnh
                            </TableCell>

                            {/* action */}
                            <TableCell
                              classes={{ root: classes.tableCell }}
                              style={{ minWidth: '160px' }}
                            >
                              Thao tác
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {newCourse && newCourse?.list_menus
                            ? newCourse.list_menus.map((menu, indexMenu) => (
                                <TableRow key={indexMenu}>
                                  <TableCell component='th' scope='row' width='10%'>
                                    <IOSSwitch
                                      checked={menu.status === STATUS_ACTIVE}
                                      onChange={(e) =>
                                        onChangeStatus(e, TYPE_ONCHANGE_INPUT_MENU, indexMenu)
                                      }
                                    />
                                  </TableCell>

                                  <TableCell component='th' scope='row' width='20%'>
                                    {menu.m_menu_category.map((category, category_index) => (
                                      <Box mt={1} key={category_index}>
                                        {category.name}
                                      </Box>
                                    ))}
                                  </TableCell>

                                  <TableCell component='th' scope='row' width='30%'>
                                    {menu.name}
                                  </TableCell>
                                  <TableCell component="th" scope="row" width="10%">
                                    {menu.main_image ? (
                                      <img
                                        src={renderUrlImageS3(menu?.main_image?.s_image_path || menu?.main_image?.image_path)}
                                        className={classes.imageMenuItem}
                                      />
                                    ) : (
                                      <u>No setting</u>
                                    )}
                                  </TableCell>

                                  <TableCell component='th' scope='row' width='30%'>
                                    <Button
                                      className={`${classes.button} ${classes.buttonCopy}`}
                                      onClick={() => {
                                        setSelectedMenu({
                                          isShow: true,
                                          menu: menu,
                                        });
                                      }}
                                    >
                                      Xóa
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            : null}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Box>

              <Footer padding='10px'>
                <Box textAlign='center'>
                  <Grid spacing={5} container justify='center'>
                    <Grid item>
                      <Button
                        onClick={() => history.push('/menus/courses')}
                        className={`${classes.buttonController} ${classes.buttonBack}`}
                      >
                        Quay lại
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        className={`${classes.buttonController} ${classes.buttonAdd}`}
                        onClick={onSubmit}
                        disabled={
                          !(
                            newCourse.name &&
                            newCourse.time_block_unit &&
                            newCourse.time_block_unit > 0
                          ) || isSubmitLoading
                        }
                      >
                        Lưu
                        {isSubmitLoading ? (
                          <CircularProgress style={{ marginLeft: 10, width: 20, height: 20 }} />
                        ) : null}
                      </Button>
                    </Grid>
                    {tab === 1 ? (
                      <Grid item>
                        <Button
                          className={`${classes.buttonController} ${classes.buttonAdd}`}
                          onClick={() => setIsShowChooseMenus(true)}
                        >
                          <Add /> Thêm
                        </Button>
                      </Grid>
                    ) : null}
                  </Grid>
                </Box>
              </Footer>

              <ModalMenusList
                open={isShowChooseMenus}
                onClose={() => setIsShowChooseMenus(false)}
                onAddMenus={onAddMenus}
                selectedMenus={newCourse.list_menus}
                showWarningMessage={showWarningMessage}
              />

              {/* modal delete course */}
              <Modal
                actions={actionModalDeleteCourse()}
                open={isShowDeleteCourse}
                title='Xóa set ăn'
                onClose={() => setIsShowDeleteCourse(false)}
              >
                <div className={classes.centerModal}>
                  <h2>Bạn có chắc chắn muốn xóa set ăn này không?</h2>
                </div>
              </Modal>

              {/* modal delete menu */}
              <Modal
                actions={actionModalDeleteMenu()}
                open={selectedMenu.isShow}
                title='Xóa món ăn trong set'
                onClose={onCancelDeleteMenu}
              >
                <div className={classes.centerModal}>
                  <h2>Bạn có chắc chắn muốn xóa món này khỏi set ăn？</h2>
                </div>
              </Modal>

              <ModalUploadSingleImage
                title='Hình ảnh'
                open={isShowChooseImage}
                onClose={() => setIsShowChooseImage(false)}
                onChangeFile={(image) => onChangeImageCourse(image)}
              />
            </>
          )}

          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />
        </PageInnerContainer>
      </PageInnerWrap>
    </PageContainer>
  );
};

PageAddCourse.propTypes = {};
export default PageAddCourse;
