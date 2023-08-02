import React, { useState, useEffect, useContext } from 'react';
import { find } from 'lodash';

// Base Components
import CustomSelectorBase from 'js/shared/components/CustomSelectorBase';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import Dialog from 'js/shared-order/components/Dialog';
import ModalSelectMenuImage from './ModalSelectMenuImage';

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopApiService from 'js/shop/shop-api-service';

// Components(Material-UI)
import {
  Table,
  TableBody,
  Button,
  Tabs,
  Tab,
  Box,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  OutlinedInput,
  TextareaAutosize
} from '@material-ui/core';
import { Add } from '@material-ui/icons';

// Utils
import Utils from 'js/shared/utils';
import { renderUrlImageS3 } from 'js/utils/helpers/image';
import {
  MENU_STATUS,
  ROUND_DOWN,
  hanldePriceFractionMode,
  formatPriceWhileTyping,
} from 'js/utils/helpers/const';
import { useStylesSettingManyMenus } from './itemSettingMenu/settingManyMenusStyle.js';

const DEFAULT_CATEGORY_VALUE = -1;
const DEFAULT_LARGE_CATEGORY = {
  value: DEFAULT_CATEGORY_VALUE,
  label: 'Danh mục lớn',
  smallCategories: [],
};
const DEFAULT_SMALL_CATEGORY = {
  value: DEFAULT_CATEGORY_VALUE,
  label: 'Danh mục nhỏ',
};

const MENU_DEFAULT = {
  name: '',
  price: '',
  parentCategory: {
    value: DEFAULT_CATEGORY_VALUE,
  },
  childCategory: {
    value: DEFAULT_CATEGORY_VALUE,
  },
  childCategories: [DEFAULT_SMALL_CATEGORY],
  parentCategories: [DEFAULT_LARGE_CATEGORY],
  main_image_path: null,
  m_images: [],
  add_images: [],
  delete_images: [],
  all_images: [],
  tax_value: 0,
  status: MENU_STATUS.STATUS_ONSALE,
  m_tax_id: null,
};

const PageSettingAllMenu = (props) => {
  const classes = useStylesSettingManyMenus(props);
  const {
    categoriesData,
    showWarningMessage,
    showSuccessMessage,
    setMenusDataUpdate,
    getFilterMenu,
    menusData,
    errorsMessage,
    setLoading,
  } = props;

  const [indexActive, setIndexActive] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showModalSettingImage, setShowModalSettingImage] = useState(false);
  const [errorsArray, setErrorsArray] = useState(errorsMessage);
  const [priceFractionMode, setPriceFractionMode] = useState(ROUND_DOWN);
  const [menusDataTrans, setMenusDataTrans] = useState([]);
  const [isSrcollToBottom, setIsSrcollToBottom] = useState(false);

  const [shop] = useContext(ShopInfoContext);

  useEffect(() => {
    if (!menusData.length) {
      setLoading(false);
    }
    fillMenuData();
  }, [menusData]);

  useEffect(() => {
    setErrorsArray(errorsMessage);
  }, [errorsMessage]);

  useEffect(() => {
    if (errorsMessage.length > 0) {
      document
        .getElementsByClassName('messageError')[0]
        ?.parentElement?.scrollIntoView({ block: 'center' });
    }

    if (isSrcollToBottom) {
      window.scrollTo(0, document.body.scrollHeight);
      setIsSrcollToBottom(false);
    }
  });

  const fillMenuData = async () => {
    // get shop info
    const shopTaxInfo = await ShopApiService.getShopTaxInfo(shop?.hashId);
    setPriceFractionMode(shopTaxInfo?.price_fraction_mode);

    // get tax options
    const taxsRes = await ShopApiService.getTaxOptions(shop?.hashId);
    const taxTenOption = taxsRes.find((taxTmp) => taxTmp.tax_rate == 0.1);
    const categoriesDataClone = Utils.cloneDeep(categoriesData);
    categoriesDataClone[0] = DEFAULT_LARGE_CATEGORY;

    MENU_DEFAULT.m_tax_id = taxTenOption?.id;
    MENU_DEFAULT.m_tax = taxTenOption;
    MENU_DEFAULT.parentCategories = categoriesDataClone;

    const menusTrans = menusData.map((item) => {
      const imagesClone = item?.m_images?.map((item) => item.image_path);
      const parentCategory = find(item.m_menu_category, { tier_number: 1 });
      const childCategory = find(item.m_menu_category, { tier_number: 2 });
      const parentCategoryWithChilds = find(categoriesData, { value: parentCategory?.id || '' });
      const childCategories = parentCategoryWithChilds?.smallCategories?.map((category) => {
        return { id: category.id, value: category.id, label: category.name };
      });

      return {
        ...item,
        all_images: [...imagesClone],
        add_images: [],
        parentCategory: {
          id: parentCategory?.id || '',
          value: parentCategory?.id || '',
          label: parentCategory?.name || '',
        },
        parentCategories: categoriesData.filter((item) => item.value !== DEFAULT_CATEGORY_VALUE),
        childCategories: childCategories,
        childCategory: {
          id: childCategory?.id || '',
          value: childCategory?.id || '',
          label: childCategory?.name || '',
        },
      };
    });

    setMenusDataTrans(menusTrans);
    setMenusDataUpdate(menusTrans);
    setLoading(false);
  };

  const handleValueBeforeRound = (price, percenTaxValue) =>
    (price * 100 * percenTaxValue) / (100 + 100 * percenTaxValue);

  const onChangeTabStatus = (event, value, index) => {
    const newMenuData = Utils.cloneDeep(menusDataTrans);
    newMenuData[index].status = value;
    newMenuData[index].is_update = true;
    setMenusDataTrans(newMenuData);
    setMenusDataUpdate(newMenuData);
  };

  const inputChanged = (event, index) => {
    const newMenuData = Utils.cloneDeep(menusDataTrans);
    let { name, value } = event.target;
    newMenuData[index][name] = value;
    newMenuData[index].is_update = true;
    if (name === 'price') {
      newMenuData[index][name] = parseFloat(String(value).replace(/,/g, ''));
      newMenuData[index]['tax_value'] = hanldePriceFractionMode(
        handleValueBeforeRound(
          parseFloat(String(value).replace(/,/g, '')),
          Number(newMenuData[index]?.m_tax.tax_rate)
        ),
        0,
        priceFractionMode
      );
    }
    setMenusDataTrans(newMenuData);
    setMenusDataUpdate(newMenuData);
  };

  const setMenuFiles = (file) => {
    const newMenuData = Utils.cloneDeep(menusDataTrans);
    if (file) {
      let addImages = newMenuData[indexActive]?.add_images;
      let allImages = newMenuData[indexActive]?.all_images;
      addImages.push(file);
      allImages.push(file);
      newMenuData[indexActive].add_images = addImages;
      newMenuData[indexActive].all_images = allImages;
      newMenuData[indexActive].main_image_path = file;
      newMenuData[indexActive].is_update = true;
      setMenusDataTrans(newMenuData);
      setMenusDataUpdate(newMenuData);
    }
  };

  const parentCategoryChanged = async (event, index) => {
    const newMenuData = Utils.cloneDeep(menusDataTrans);
    const parentCategory = find(categoriesData, { value: event.target.value });
    if (event.target.value === DEFAULT_CATEGORY_VALUE) {
      return;
    }
    if (!Utils.isNil(parentCategory)) {
      newMenuData[index].parentCategory = parentCategory;

      const childCategories = parentCategory?.smallCategories?.map((category) => {
        return { id: category.id, value: category.id, label: category.name };
      });
      newMenuData[index].childCategories = childCategories || [];
      newMenuData[index].childCategory = childCategories[0] || {};
      newMenuData[index].is_update = true;
    } else {
      newMenuData.parentCategory = {
        value: '',
      };
      newMenuData.childCategory = {
        value: '',
      };
    }
    setMenusDataTrans(newMenuData);
    setMenusDataUpdate(newMenuData);
  };

  const childCategoryChanged = (event, index) => {
    const newMenuData = Utils.cloneDeep(menusDataTrans);
    const childCategory = find(newMenuData[index].childCategories, { value: event.target.value });
    if (!Utils.isNil(childCategory)) {
      newMenuData[index].childCategory = childCategory;
      newMenuData[index].is_update = true;
    } else {
      newMenuData[index].childCategory = {
        value: '',
      };
    }
    setMenusDataTrans(newMenuData);
    setMenusDataUpdate(newMenuData);
  };

  const deleteMenu = (index) => {
    setIndexActive(index);
    if (Object.keys(menusDataTrans).length > 0) {
      setShowDialog(true);
    } else {
      showWarningMessage('失敗しました');
    }
  };

  const execDeleteMenu = async () => {
    const newMenuData = Utils.cloneDeep(menusDataTrans);
    const newErrorsArray = Utils.cloneDeep(errorsArray);
    newErrorsArray.splice(indexActive,1);
    const convertNewErrorrArray = newErrorsArray.map((item, index) => {
      if (item && item?.errorContent && item?.indexRow !== index) {
        return { errorContent: item.errorContent  || [], indexRow: index}
      }

      return item || {};
    })

    if (!newMenuData[indexActive].hash_id) {
      newMenuData.splice(indexActive, 1);
      showSuccessMessage('削除しました');
      setMenusDataTrans(newMenuData);
      setMenusDataUpdate(newMenuData);
      setErrorsArray(convertNewErrorrArray);

      return;
    }

    try {
      await ShopOrderApiService.deleteMenu(shop.hashId, menusDataTrans[indexActive].hash_id);
      showSuccessMessage('削除しました');
      getFilterMenu();
      setErrorsArray([]);
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const addNewMenuData = () => {
    const newMenuData = Utils.cloneDeep(menusDataTrans);
    newMenuData.push(MENU_DEFAULT);
    setMenusDataTrans(newMenuData);
    setMenusDataUpdate(newMenuData);
    setIsSrcollToBottom(true);
  }

  const showError = (index) => {
    return (
      errorsArray.length > 0 &&
      errorsArray[index]?.indexRow === index && (
        <Box className={`${classes.messageError} messageError`} whiteSpace='nowrap'>
          {errorsArray[index]?.errorContent[0]}
        </Box>
      )
    );
  };

  return (
    <Box flex={1} className={classes.head}>
      <Box mt={1}>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label='simple table'>
            <TableHead>
              <TableRow
                classes={{
                  root: classes.tableHead,
                }}
              >
                <TableCell
                  classes={{
                    root: classes.tableCell,
                  }}
                >
                  Danh mục
                </TableCell>
                <TableCell
                  classes={{
                    root: classes.tableCell,
                  }}
                >
                  Tên món
                </TableCell>
                <TableCell
                  classes={{
                    root: `${classes.tableCell}`,
                  }}
                >
                  Giá
                </TableCell>
                <TableCell
                  classes={{
                    root: classes.tableCell,
                  }}
                  style={{ textAlign: 'center' }}
                >
                  Ảnh
                </TableCell>
                <TableCell
                  classes={{
                    root: `${classes.tableCell} ${classes.textCenter}`,
                  }}
                  style={{ textAlign: 'center' }}
                >
                  Trạng thái
                </TableCell>
                <TableCell
                  classes={{
                    root: `${classes.tableCell}`,
                  }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menusDataTrans &&
                menusDataTrans.map((menu, index) => (
                  <TableRow key={index}>
                    <TableCell
                      classes={{
                        root: classes.tableCell,
                      }}
                      align='left'
                      component='th'
                      scope='row'
                    >
                      <Box display='flex' flexDirection='column'>
                        <Box>
                          <CustomSelectorBase
                            className={`${classes.select} ${
                              menu.parentCategory.value !== DEFAULT_CATEGORY_VALUE &&
                              classes.fontWeightSelect
                            }`}
                            value={menu.parentCategory.value}
                            optionArray={menu.parentCategories}
                            id='parent-category'
                            name='parentCategory'
                            onChange={(event) => parentCategoryChanged(event, index)}
                          />
                          <CustomSelectorBase
                            className={`${classes.select} ${
                              menu.childCategory.value !== DEFAULT_CATEGORY_VALUE &&
                              classes.fontWeightSelect
                            }`}
                            value={menu.childCategory.value}
                            optionArray={menu.childCategories}
                            id='child-category'
                            name='childCategory'
                            onChange={(event) => childCategoryChanged(event, index)}
                          />
                        </Box>
                        {showError(index)}
                      </Box>
                    </TableCell>
                    <TableCell
                      classes={{
                        root: `${classes.tableCell} ${classes.menuName}`,
                      }}
                      align='left'
                    >
                      <TextareaAutosize
                        maxRows={4}
                        id='name'
                        name='name'
                        value={menu.name}
                        className={`${classes.input} ${classes.textArea}`}
                        labelWidth={0}
                        placeholder=''
                        variant='outlined'
                        onChange={(event) => inputChanged(event, index)}
                      />
                    </TableCell>
                    <TableCell
                      classes={{
                        root: `${classes.tableCell}`,
                      }}
                      align='left'
                    >
                      <OutlinedInput
                        id='price'
                        name='price'
                        value={formatPriceWhileTyping(menu.price)}
                        className={`${classes.input} ${classes.inputPrice}`}
                        classes={{
                          input: classes.inputPrice,
                        }}
                        labelWidth={0}
                        placeholder=''
                        onChange={(event) => inputChanged(event, index)}
                      />
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tableCellImage,
                      }}
                      onClick={() => {
                        if (menu?.all_images?.length >= 5) {
                          showWarningMessage('Số lượng ảnh đã đạt giới hạn, không thể tải thêm');
                          return;
                        }
                        setIndexActive(index);
                        setShowModalSettingImage(true);
                      }}
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      {menu?.main_image || menu?.main_image_path ? (
                        <img
                          className={classes.menuImage}
                          width={'100px'}
                          height={'86px'}
                          src={renderUrlImageS3(
                            menu?.main_image_path
                              ? menu?.main_image_path
                              : menu?.main_image?.l_image_path || menu?.main_image?.image_path
                          )}
                        />
                      ) : (
                        'No setting'
                      )}
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tableCell,
                      }}
                    >
                      <Tabs
                        centered
                        value={menu?.status}
                        onChange={(event, value) => onChangeTabStatus(event, value, index)}
                        aria-label='simple tabs example'
                        name='status'
                        TabIndicatorProps={{ style: { display: 'none' } }}
                        flexContainer
                      >
                        <Tab
                          label='On'
                          id='public'
                          value={MENU_STATUS.STATUS_ONSALE}
                          className={`${classes.customTab} ${classes.customTabLeft}`}
                        />
                        <Tab
                          label='Off'
                          id='private'
                          value={MENU_STATUS.STATUS_OFFSALE}
                          className={`${classes.customTab} ${classes.customTabRight}`}
                        />
                      </Tabs>
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tableCell,
                      }}
                    >
                      <Box width='100%' alignSelf='center' textAlign='center'>
                        <Button
                          variant='outlined'
                          className={classes.buttonDelete}
                          onClick={() => deleteMenu(index)}
                        >
                          Xóa
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box mt={4} textAlign='right'>
        <Button
          onClick={addNewMenuData}
          className={`${classes.buttonController} ${classes.buttonAdd}`}
        >
          <Add /> Thêm món
        </Button>
      </Box>
      <ModalSelectMenuImage
        open={showModalSettingImage}
        onClose={() => setShowModalSettingImage(false)}
        setMenuFiles={setMenuFiles}
      />
      <Dialog
        isOpen={showDialog}
        onClose={(isOpen) => setShowDialog(isOpen)}
        title='Xác nhận'
        message='Bạn chắc chắn muốn xóa món ăn này chứ?'
        onConfirm={() => execDeleteMenu()}
      />
    </Box>
  );
};

PageSettingAllMenu.propTypes = {};
export default PageSettingAllMenu;
