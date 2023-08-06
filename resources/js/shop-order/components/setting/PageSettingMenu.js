import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router';

// Base Components
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import ModalDetailMenuSetting from './ModalDetailMenuSetting';
import CustomSelectorBase from '../../../shared/components/CustomSelectorBase';
import PageInnerWrap from 'js/shared-order/components/PageInnerWrap';
import Footer from 'js/shared-order/components/Footer';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import ButtonCustom from 'js/shared/components/Button';
import PageSettingAllMenus from './PageSettingAllMenus';
import Waiting from 'js/shared/components/Waiting';

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Components(Material-UI)
import {makeStyles} from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  Button,
  Box,
  OutlinedInput,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@material-ui/core';
import {Add} from '@material-ui/icons';

// Utils
import Utils from 'js/shared/utils';
import {renderUrlImageS3} from 'js/utils/helpers/image';
import {
  validateParentCategory,
  validateChildCategory,
  validateName,
  validatePrice,
} from './itemSettingMenu/validationSettingManyMenus';
import {INITIAL_ORDER_FLG_OFF} from 'js/utils/helpers/const';
import {formatPrice} from "../../../utils/helpers/number";

const useStyles = makeStyles(() => ({
  contentWrap: {
    position: 'absolute',
    width: '100%',
    top: '64px',
    height: 'calc(100% - 64px)',
    display: 'flex',
    padding: '8px 16px 0px',
  },
  head: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '90px',
    '@media (max-width: 850px)': {
      paddingBottom: '175px',
    },
    '@media (max-width: 600px)': {
      paddingBottom: '300px',
    },
  },
  headBar: {
    '@media (max-width: 600px)': {
      flexWrap: 'wrap',
    },
  },
  select: {
    width: 232,
    color: '#828282',
    fontSize: '20px',
    height: '40px',
    marginRight: '24px',
    alignSelf: 'center',
    '@media (max-width: 960px)': {
      marginBottom: '10px',
      width: '232px !important',
    },
    '@media (max-width: 1024px)': {
      width: 200,
    },
  },
  input: {
    padding: '5px',
    height: '40px',
    width: 232,
    marginRight: '14px',
    color: '#828282',
    size: '20px',
    alignSelf: 'center',
    '@media (max-width: 1024px)': {
      width: '220px',
    },
    '@media (max-width: 960px)': {
      marginBottom: '10px',
      width: '232px !important',
      alignSelf: 'start',
    },
  },
  tableHead: {
    backgroundColor: '#DADADA',
  },
  
  tableCell: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
    minWidth: '160px',
  },
  tableCellImage: {
    fontSize: '16px',
    color: '#828282',
    textDecorationLine: 'underline',
  },
  button: {
    background: '#FFA04B',
    color: '#FFFFFF',
    borderRadius: '28px',
    textAlign: 'center',
    padding: '5px 32px',
    '&:hover': {
      background: '#FFA04B',
    },
    '@media (max-width: 600px)': {
      padding: '5px 5px',
    },
  },
  
  buttonController: {
    color: '#fff',
    borderRadius: '28px',
    padding: '12px 0',
    fontSize: '18px',
    width: '252px',
    textAlign: 'center',
  },
  buttonAdd: {
    background: '#FFA04B',
    '&:hover': {
      background: '#FFA04B',
    },
  },
  buttonEditAll: {
    background: '#FFF',
    border: '3px solid #FFA04B',
    color: '#FFA04B',
    padding: '9px 0',
    '&:hover': {
      background: '#FFF',
    },
  },
  buttonBack: {
    background: '#828282',
    '&:hover': {
      background: '#828282',
    },
  },
  search: {
    cursor: 'pointer',
    '@media (max-width: 600px)': {
      marginBottom: '10px',
    },
  },
  menuName: {
    minWidth: '250px',
  },
  breakLine: {
    borderTop: '3px rgb(130 130 130 / 50%) solid',
    paddingTop: 10,
  },
  wrapButton: {
    '& button': {
      margin: '20px 0',
      marginRight: 8,
      '@media (max-width: 960px)': {
        margin: '10px 0',
        marginRight: 8,
      },
    },
  },
  requiredColumn: {
    fontSize: 12,
    fontWeight: 400,
    border: '1px #000 solid',
    width: 40,
    textAlign: 'center',
    marginBottom: 4
  }
}));

const DEFAULT_CATEGORY_VALUE = -1;
const DEFAULT_LARGE_CATEGORY = {
  value: DEFAULT_CATEGORY_VALUE,
  label: '--- Danh mục chính ---',
  smallCategories: [],
};
const DEFAULT_SMALL_CATEGORY = {
  value: DEFAULT_CATEGORY_VALUE,
  label: '--- Danh mục phụ ---',
};

const PageMenuSetting = (props) => {
  const classes = useStyles(props);
  const history = useHistory();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [categoriesData, setCategoriesData] = useState([DEFAULT_LARGE_CATEGORY]);
  const [smallCateOptions, setSmallCateOptions] = useState([DEFAULT_SMALL_CATEGORY]);
  const [menusData, setMenusData] = useState([]);
  const [menusDataUpdate, setMenusDataUpdate] = useState([]);
  const [showSettingAllMenus, setShowSettingAllMenus] = useState(false);
  const [errorsMessage, setErrorsMessage] = useState([]);
  const [filterMenu, setFilterMenu] = useState({
    category: DEFAULT_CATEGORY_VALUE,
    selectedSmallCate: DEFAULT_CATEGORY_VALUE,
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [shop] = useContext(ShopInfoContext);
  const [menuData, setMenuData] = useState({});
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  
  useEffect(() => {
    getCategories();
    getMenus();
  }, [getCategories, getMenus]);
  
  const getCategories = async () => {
    const parent_category_params = {
      tier_number: 1,
      parent_id: 0,
    };
    const categoriesDB = await ShopOrderApiService.getCategories(
      shop.hashId,
      parent_category_params
    );
    let categoriesOptions = [];
    categoriesDB.forEach((category) => {
      categoriesOptions.push({
        value: category.id,
        label: category.name,
        smallCategories: category?.childCategories,
      });
    });
    
    categoriesOptions.unshift(DEFAULT_LARGE_CATEGORY);
    setCategoriesData(categoriesOptions);
  };
  
  const getMenus = async (queryParams = {}) => {
    setIsLoading(true);
    try {
      const menusRes = await ShopOrderApiService.getMasterMenus(shop.hashId, queryParams);
      const menus = menusRes.map(menu => {
        if (!Utils.isNil(menu.s_image_folder_path)) {
          menu.image = renderUrlImageS3(menu.s_image_folder_path);
        }
        if (!Utils.isNil(menu.m_image_folder_path)) {
          menu.image = renderUrlImageS3(menu.m_image_folder_path);
        }
        if (!Utils.isNil(menu.l_image_folder_path)) {
          menu.image = renderUrlImageS3(menu.l_image_folder_path);
        }
        
        return menu;
      });
      
      setMenusData(menus);
    } catch (error) {
      console.error('[getMenus] Get menus errors ', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
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
  
  const categoryChanged = (event) => {
    const category = categoriesData.find((cateTmp) => cateTmp.value === event.target.value);
    const newFilterMenu = Utils.cloneDeep(filterMenu);
    if (category) {
      newFilterMenu.category = category.value;
      newFilterMenu.selectedSmallCate = DEFAULT_CATEGORY_VALUE;
      setFilterMenu(newFilterMenu);
      
      // small categories options
      let smallCatesOption = [];
      if (category?.smallCategories) {
        smallCatesOption = category.smallCategories.map((cate) => ({
          value: cate.id,
          label: cate.name,
        }));
      }
      smallCatesOption.unshift(DEFAULT_SMALL_CATEGORY);
      setSmallCateOptions(smallCatesOption);
    }
  };
  
  const handleChangeSmallCate = (event) => {
    const newFilterMenu = Utils.cloneDeep(filterMenu);
    newFilterMenu.selectedSmallCate = event.target.value;
    setFilterMenu(newFilterMenu);
  };
  
  const nameChanged = (event) => {
    const newFilterMenu = Utils.cloneDeep(filterMenu);
    newFilterMenu[event.target.name] = event.target.value;
    setFilterMenu(newFilterMenu);
  };
  
  const execFilterMenu = () => {
    const filterData = {};
    if (filterMenu?.category && filterMenu.category !== DEFAULT_CATEGORY_VALUE) {
      filterData.category_id = filterMenu.category;
    }
    if (filterMenu?.selectedSmallCate !== DEFAULT_CATEGORY_VALUE) {
      filterData.small_category_id = filterMenu.selectedSmallCate;
    }
    if (!Utils.isNil(filterMenu.name) && filterMenu.name !== '') {
      filterData.name = filterMenu.name;
    }
    getMenus(filterData);
  };
  
  const validateManyMenus = () => {
    let errors = [];
    menusDataUpdate?.map((item, index) => {
      validateParentCategory(item, errors, index, 'parentCategory');
      validateChildCategory(item, errors, index, 'childCategory');
      validateName(item, errors, index, 'name');
      validatePrice(item, errors, index, 'price');
    });
    
    const customErros = errors.reduce((arrErrors, error) => {
      const occurs = arrErrors.reduce((n, item, i) => {
        return item.indexRow === error.indexRow ? i : n;
      }, -1);
      
      // If the name is found,
      if (occurs >= 0) {
        // append the current value to its list of values.
        arrErrors[occurs].errorContent = [...arrErrors[occurs].errorContent, error.errorContent];
      } else {
        // add the current item to o (but make sure the value is an array).
        const obj = {
          indexRow: error.indexRow,
          errorContent: [error.errorContent],
        };
        arrErrors = arrErrors.concat([obj]);
      }
      
      return arrErrors;
    }, []);
    
    let fillArrayError = new Array(menusData.length);
    if (customErros.length) {
      customErros.map((item) => (fillArrayError[item.indexRow] = item));
    }
    
    return customErros.length ? fillArrayError : [];
  };
  
  const saveManyMenus = async () => {
    setLoading(true);
    const errorsMessage = validateManyMenus();
    const menusDataTrulyUpdate = menusDataUpdate
      .filter((item) => item.is_update)
      .map((_item) => {
        return {
          id: _item?.id && _item?.id,
          name: _item?.name,
          price: _item?.price,
          tax_value: _item?.tax_value,
          m_tax_id: _item?.m_tax_id,
          add_images: _item?.add_images,
          main_image_path: _item?.main_image_path,
          status: _item.status,
          m_menu_category_ids: [_item.parentCategory.value, _item.childCategory.id],
        };
      });
    if (errorsMessage.length) {
      setErrorsMessage(errorsMessage);
      setLoading(false);
      return;
    }
    
    setErrorsMessage([]);
    
    try {
      if (menusDataTrulyUpdate.length) {
        await ShopOrderApiService.updateMenus(shop.hashId, {menus: menusDataTrulyUpdate});
      }
      showSuccessMessage('Cập nhật thành công');
      setShowSettingAllMenus(false);
    } catch (error) {
      showWarningMessage(error.message);
    } finally {
      execFilterMenu();
      setLoading(false);
    }
  };
  
  return (
    <PageContainer padding='0px' height='auto' minHeight='auto'>
      {/* Change background color body */}
      <style>{'body { background-color: white}'}</style>
      
      <HeaderAppBar title='Danh sách món ăn'/>
      <PageInnerWrap height='auto'>
        <PageInnerContainer padding={'8px 16px'} height='auto'>
          <Box flex={1} className={classes.head}>
            <Box
              display={'flex'}
              alignItems={{xs: 'start', md: 'center'}}
              className={classes.headBar}
              flexDirection={{xs: 'column', md: 'row'}}
              justifyContent='space-between'
            >
              {/* parent cate */}
              <Box display='flex' flexDirection={{xs: 'column', md: 'row'}}>
                <CustomSelectorBase
                  className={classes.select}
                  value={filterMenu.category}
                  optionArray={categoriesData}
                  id='category'
                  name='category'
                  onChange={(event) => categoryChanged(event)}
                />
                
                {/* small cate */}
                <CustomSelectorBase
                  className={classes.select}
                  value={filterMenu.selectedSmallCate}
                  optionArray={smallCateOptions}
                  id='smallCategory'
                  name='smallCategory'
                  onChange={(event) => handleChangeSmallCate(event)}
                />
                
                {/* menu name keyword */}
                <OutlinedInput
                  id='name'
                  name='name'
                  placeholder='Nhập từ khóa'
                  value={filterMenu.name}
                  className={classes.input}
                  labelWidth={0}
                  onChange={(event) => nameChanged(event)}
                />
                <Box whiteSpace='nowrap' className={classes.wrapButton}>
                  <ButtonCustom
                    title='Tìm kiếm'
                    bgcolor='#FFF'
                    borderColor={!showSettingAllMenus && '#FFA04B'}
                    fgcolor='#FFA04B'
                    padding='5px 40px'
                    margin='0'
                    disabled={showSettingAllMenus && true}
                    onClick={execFilterMenu}
                  />
                </Box>
              </Box>
              {!showSettingAllMenus && (
                <Box whiteSpace='nowrap' className={classes.wrapButton}>
                  <ButtonCustom
                    title='Sửa danh mục món'
                    bgcolor='#FFF'
                    borderColor='#FFA04B'
                    fgcolor='#FFA04B'
                    padding='5px 20px'
                    margin='0'
                    onClick={() => history.push('/setting/category/list')}
                  />
                </Box>
              )}
            </Box>
            
            {!showSettingAllMenus && (
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
                          width={'25%'}
                        >
                          Danh mục
                        </TableCell>
                        <TableCell
                          classes={{
                            root: classes.tableCell,
                          }}
                          width={'25%'}
                        >
                          Tên món
                        </TableCell>
                        <TableCell
                          classes={{
                            root: `${classes.tableCell} ${classes.menuName}`,
                          }}
                          width={'15%'}
                        >
                          Giá
                        </TableCell>
                        <TableCell
                          classes={{
                            root: classes.tableCell,
                          }}
                          style={{ textAlign: "center" }}
                          width={'25%'}
                        >
                          Ảnh
                        </TableCell>
                        <TableCell
                          classes={{
                            root: classes.tableCell,
                          }}
                        >
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {menusData &&
                        menusData.map((menu, index) => (
                          <TableRow key={index}>
                            <TableCell
                              classes={{
                                root: classes.tableCell,
                              }}
                              align='left'
                              component='th'
                              scope='row'
                            >
                              {menu.m_menu_category &&
                                menu.m_menu_category.map((category, category_index) => (
                                  <Box mt={1} key={category_index}>
                                    {category.name}
                                  </Box>
                                ))}
                            </TableCell>
                            <TableCell
                              classes={{
                                root: `${classes.tableCell} ${classes.menuName}`,
                              }}
                              align='left'
                            >
                              {menu?.initial_order_flg !== INITIAL_ORDER_FLG_OFF &&
                                <Box className={classes.requiredColumn}></Box>}
                              <Box> {menu.name} </Box>
                            </TableCell>
                            <TableCell
                              classes={{
                                root: classes.tableCell,
                              }}
                              align='left'
                            >
                              {formatPrice(menu.price)}
                              {shop?.mShopPosSetting?.m_currency?.name}
                            </TableCell>
                            <TableCell
                              classes={{
                                root: classes.tableCellImage,
                              }}
                              style={{padding: "10px", display: "flex", justifyContent: "center"}}
                            >
                              {menu?.main_image ? (
                                <img
                                  className={classes.menuImage}
                                  width={'100px'}
                                  height={'86px'}
                                  src={renderUrlImageS3(
                                    menu?.main_image?.l_image_path || menu?.main_image?.image_path
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
                              <Button
                                className={classes.button}
                                onClick={() => {
                                  setShowModal(true);
                                  setMenuData(menu);
                                }}
                              >
                                Chi tiết
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            {showSettingAllMenus && (
              <PageSettingAllMenus
                menusData={menusData}
                categoriesData={categoriesData}
                smallCateOptions={smallCateOptions}
                showWarningMessage={showWarningMessage}
                setMenusDataUpdate={setMenusDataUpdate}
                showSuccessMessage={showSuccessMessage}
                getFilterMenu={execFilterMenu}
                errorsMessage={errorsMessage}
                setLoading={setLoading}
              />
            )}
            
            <Footer padding={'10px'}>
              <Box textAlign='center' className={classes.breakLine}>
                {!showSettingAllMenus ? (
                  <Grid spacing={5} container justify={'center'}>
                    <Grid item>
                      <Button
                        onClick={() => history.push('/menus/setting')}
                        className={`${classes.buttonController} ${classes.buttonBack}`}
                      >
                        Quay lại
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={() => {
                          setShowModal(true);
                          setMenuData({});
                        }}
                        className={`${classes.buttonController} ${classes.buttonAdd}`}
                      >
                        <Add/> Thêm món
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={() => {
                          setShowSettingAllMenus(true);
                          setLoading(true);
                        }}
                        className={`${classes.buttonController} ${classes.buttonEditAll}`}
                      >
                        Chỉnh sửa hàng loạt
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid spacing={5} container justify={'space-around'}>
                    <Grid item>
                      <Button
                        onClick={() => {
                          setShowSettingAllMenus(false);
                          setErrorsMessage([]);
                        }}
                        className={`${classes.buttonController} ${classes.buttonBack}`}
                      >
                        Hủy bỏ
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={saveManyMenus}
                        className={`${classes.buttonController} ${classes.buttonAdd}`}
                      >
                        Lưu tất cả
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Footer>
          </Box>
          <Waiting isOpen={loading}/>
          
          <ModalDetailMenuSetting
            open={showModal}
            menuData={menuData}
            onClose={() => setShowModal(false)}
            getMenus={getMenus}
            getFilterMenu={execFilterMenu}
            showWarningMessage={showWarningMessage}
            showSuccessMessage={showSuccessMessage}
          />
          
          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({...toast, isShow: isOpen})}
            status={toast.status}
            message={toast.message}
          />
        </PageInnerContainer>
      </PageInnerWrap>
      <Waiting isOpen={isLoading}/>
    </PageContainer>
  );
};

PageMenuSetting.propTypes = {};
export default PageMenuSetting;
