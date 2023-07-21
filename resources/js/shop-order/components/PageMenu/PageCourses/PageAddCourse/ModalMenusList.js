import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// Utils
import Utils from 'js/shared/utils';
import { renderUrlImageS3 } from 'js/utils/helpers/image';

// Component
import Modal from 'js/shared-order/components/Modal';
import CustomSelectorBase from 'js/shared/components/CustomSelectorBase';
import Waiting from 'js/shared/components/Waiting';

// Context
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Components(Material-UI)
import {
  Box,
  Button,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import Checkbox from '@material-ui/core/Checkbox';
import { useStylesModalMenuList } from './styles';
import { Search } from '@material-ui/icons';
import ModalDetailMenuSetting from 'js/shop-order/components/setting/ModalDetailMenuSetting';

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

const DEFAULT_NONE_CATEGORY_VALUE = -1;
const DEFAULT_INITIAL_ORDER_FLAG = 0;
const DEFAULT_NONE_CATEGORY_OPTION = {
  value: DEFAULT_NONE_CATEGORY_VALUE,
  label: 'Tất cả',
};

const filterMenuDefault = {
  category_id: DEFAULT_NONE_CATEGORY_VALUE,
  name: '',
};

const ModalMenusList = (props) => {
  const classes = useStylesModalMenuList(props);
  const [shop] = useContext(ShopInfoContext);

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [list_menus, setMenus] = useState([]);
  // key word search
  const [filterMenu, setFilterMenu] = useState(filterMenuDefault);
  // search result
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isShowDetailMenu, setIsShowDetailMenu] = useState(false);
  const [detailMenu, setDetailMenu] = useState({});
  const [chooseMenusHashId, setChooseMenusHashId] = useState([]);

  const makeCategoriesOption = () => {
    let options = categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
    options.unshift(DEFAULT_NONE_CATEGORY_OPTION);

    return options;
  };

  useEffect(() => {
    if (props.open) {
      getCategories();
      getMenus();

      // reset
      setFilterMenu(filterMenuDefault);
      setFilteredMenus([]);
      setChooseMenusHashId([]);
    }
  }, [props.open]);

  useEffect(() => {
    handleSearch();
  }, [list_menus]);

  const getMenus = async () => {
    setIsLoading(true);
    try {
      const menusRes = await ShopOrderApiService.getMasterMenus(shop.hashId, {});
      const menusDB = menusRes
        .filter((menu) => menu.initial_order_flg === DEFAULT_INITIAL_ORDER_FLAG)
        .map((menu) => {
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

      const filteredMenusBySelectedMenus = menusDB.filter((menu) => {
        const selectedMenu = props.selectedMenus.find(
          (selectMenu) => selectMenu.hash_id === menu.hash_id
        );

        return !selectedMenu;
      });
      setMenus(filteredMenusBySelectedMenus);
    } catch (error) {
      props.showWarningMessage(JSON.stringify(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async () => {
    const parent_category_params = {
      tier_number: 1,
      parent_id: 0,
    };
    await ShopOrderApiService.getCategories(shop.hashId, parent_category_params)
      .then((categories) => {
        setCategories(categories);
      })
      .catch((error) => {
        props.showWarningMessage(JSON.stringify(error.message));
      });
  };

  const onChangeInput = (event) => {
    let newFilterMenu = Utils.cloneDeep(filterMenu);
    const { target } = event;
    const name = target.getAttribute('name');
    newFilterMenu[name] = target.value;

    setFilterMenu(newFilterMenu);
  };

  const onChangeOption = (event) => {
    let newFilterMenu = Utils.cloneDeep(filterMenu);
    const { target } = event;
    newFilterMenu.category_id = target.value;

    setFilterMenu(newFilterMenu);
  };

  const actionModal = () => {
    return (
      <Box textAlign='center' paddingBottom='10px'>
        <Button
          onClick={onCloseChooseMenus}
          className={`${classes.buttonController} ${classes.buttonBack}`}
        >
          Quay lại
        </Button>
        <Button className={`${classes.buttonController} ${classes.buttonAdd}`} onClick={onAddMenus}>
          <Add /> Thêm
        </Button>
      </Box>
    );
  };

  const onCloseChooseMenus = () => {
    setFilterMenu(filterMenuDefault);
    props.onClose();
  };

  const onClickShowDetailMenu = (menu) => {
    ShopOrderApiService.getMenu(shop.hashId, menu.hash_id, {})
      .then((response) => {
        setDetailMenu(response);
      })
      .catch((error) => {
        props.showWarningMessage(JSON.stringify(error.message));
      });
    setIsShowDetailMenu(true);
  };

  const onChangeToggleAddMenu = (menuHashId) => {
    let newCloneMenus = Utils.cloneDeep(list_menus);
    let newChooseMenusHashId = Utils.cloneDeep(chooseMenusHashId);
    let selectedMenu = chooseMenusHashId.find((hashId) => hashId === menuHashId);
    if (selectedMenu) {
      newChooseMenusHashId = newChooseMenusHashId.filter((hashId) => hashId !== menuHashId);
    } else {
      newChooseMenusHashId.push(menuHashId);
    }
    setChooseMenusHashId(newChooseMenusHashId);

    const newMenus = newCloneMenus.map((menu) => {
      if (menu.hash_id === menuHashId) {
        return {
          ...menu,
          chooseStatus: menu?.chooseStatus !== true,
        };
      }

      return menu;
    });
    setMenus(newMenus);
  };

  const onAddMenus = () => {
    let selectedMenus = list_menus.filter((menu) => chooseMenusHashId.includes(menu.hash_id));
    props.onAddMenus(selectedMenus);
    setFilterMenu(filterMenuDefault);
    setChooseMenusHashId([]);
    props.onClose();
  };

  const handleSearch = () => {
    // filter by cate selected
    const filteredMenusInCateFilter = list_menus.filter((menu) => {
      let check = false;
      if (filterMenu.category_id !== DEFAULT_NONE_CATEGORY_VALUE) {
        let checkMenuInCategory = menu.m_menu_category.find(
          (m_cate) => m_cate.id === filterMenu.category_id
        );
        if (checkMenuInCategory) {
          check = true;
        }
      } else {
        check = true;
      }

      return check;
    });
    // filter by name
    const resultMenus = filteredMenusInCateFilter.filter((menu) => {
      let check = false;
      if (
        !filterMenu.name ||
        menu.name.includes(filterMenu.name) ||
        menu.name.toLowerCase().includes(filterMenu.name.toLowerCase())
      ) {
        check = true;
      }

      return check;
    });
    setFilteredMenus(resultMenus);
  };

  return (
    <>
      <Modal
        actions={actionModal()}
        open={props.open}
        maxWidth='2500px'
        maxHeight='2000px'
        title='Danh sách món ăn'
        onClose={props.onClose}
      >
        <Box m={2} mb={0} className={classes.headerActions}>
          <Box display='flex'>
            <Box className={classes.boxSelect}>
              <CustomSelectorBase
                id='selectCategoryOption'
                className={classes.select}
                value={filterMenu?.category_id?.toString()}
                optionArray={makeCategoriesOption()}
                onChange={onChangeOption}
              />
            </Box>
            <Input
              name='name'
              type='text'
              defaultValue={filterMenu.name}
              disableUnderline={true}
              classes={{ root: classes.rootDate }}
              onChange={onChangeInput}
              placeholder='Tên món ăn'
            />
            <Search className={classes.search} onClick={handleSearch} />
          </Box>
        </Box>

        <Box p={2} pb={0} pt={0}>
          <TableContainer component={Paper} className={classes.container}>
            <Table stickyHeader aria-label='blocks table'>
              <TableHead>
                <TableRow classes={{ root: classes.tableHead }}>
                  {/* status */}
                  <TableCell
                    classes={{ root: classes.tableCell }}
                    align='center'
                    style={{ minWidth: '120px' }}
                  >
                  
                  </TableCell>

                  {/* category */}
                  <TableCell
                    classes={{ root: classes.tableCell }}
                    align='center'
                    style={{ minWidth: '160px' }}
                  >
                    Danh mục
                  </TableCell>

                  {/* name */}
                  <TableCell
                    classes={{ root: classes.tableCell }}
                    align='center'
                    style={{ minWidth: '160px' }}
                  >
                    Tên món
                  </TableCell>

                  {/* cost */}
                  <TableCell
                    classes={{ root: classes.tableCell }}
                    align='center'
                    style={{ minWidth: '120px' }}
                  >
                    Giá
                  </TableCell>

                  {/* image */}
                  <TableCell
                    classes={{ root: classes.tableCell }}
                    align='center'
                    style={{ minWidth: '160px' }}
                  >
                    Ảnh
                  </TableCell>

                  {/* action */}
                  <TableCell
                    classes={{ root: classes.tableCell }}
                    align='center'
                    style={{ minWidth: '160px' }}
                  >
                  
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMenus
                  ? filteredMenus.map((menu) => (
                      <TableRow key={menu.hash_id}>
                        <TableCell align='center' component='th' scope='row'>
                          <Checkbox
                            checked={menu?.chooseStatus === true}
                            color='primary'
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                            onChange={() => onChangeToggleAddMenu(menu.hash_id)}
                          />
                        </TableCell>

                        <TableCell align='center' component='th' scope='row'>
                          {menu.m_menu_category.map((category, category_index) => (
                            <Box mt={1} key={category_index}>
                              {category.name}
                            </Box>
                          ))}
                        </TableCell>

                        <TableCell align='center' component='th' scope='row'>
                          {menu.name}
                        </TableCell>

                        <TableCell align='center' component='th' scope='row'>
                          {menu.price}
                          {shop?.mShopPosSetting?.m_currency?.name}
                        </TableCell>

                        <TableCell align='center' component='th' scope='row'>
                          {menu?.main_image ? (
                            <img
                              src={renderUrlImageS3(menu?.main_image?.s_image_path)}
                              className={classes.imageMenu}
                            />
                          ) : (
                            <u>No setting</u>
                          )}
                        </TableCell>

                        <TableCell align='center' component='th' scope='row'>
                          <Button
                            className={`${classes.button} ${classes.buttonDetail}`}
                            onClick={() => onClickShowDetailMenu(menu)}
                          >
                            Chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
      <Waiting isOpen={isLoading} />

      <ModalDetailMenuSetting
        open={isShowDetailMenu}
        menuData={detailMenu}
        onClose={() => setIsShowDetailMenu(false)}
        getMenus={getMenus}
        showWarningMessage={props.showWarningMessage}
      />
    </>
  );
};

// PropTypes
ModalMenusList.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAddMenus: PropTypes.func,
  selectedMenus: PropTypes.array,
  showWarningMessage: PropTypes.func,
};

// defaultProps
ModalMenusList.defaultProps = {
  open: false,
  selectedMenus: [],
  onClose: () => {},
  onAddMenus: () => {},
  showWarningMessage: () => {},
};

export default ModalMenusList;
