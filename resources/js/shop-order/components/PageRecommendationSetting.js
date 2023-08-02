import React, { useState, useEffect, useContext } from 'react';
import {
  Grid,
  Card,
  Box,
  CardContent,
  CardActions,
  Typography,
  OutlinedInput,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { find, cloneDeep } from 'lodash';
import Utils from 'js/shared/utils';
import { useHistory } from 'react-router';

// Component Share
import PageContainer from 'js/shared/components/PageContainer';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import Button from 'js/shared/components/Button';
import CustomSelectorBase from 'js/shared/components/CustomSelectorBase';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import Modal from 'js/shared-order/components/Modal';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerWrap from 'js/shared-order/components/PageInnerWrap';
import Footer from 'js/shared-order/components/Footer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import Dialog from 'js/shared-order/components/Dialog';
import defaultMenuImage from 'js/assets/images/no-image.png';
import Waiting from 'js/shared/components/Waiting';

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Utils
import { renderUrlImageS3 } from 'js/utils/helpers/image';
import { MENU_STATUS } from 'js/utils/helpers/const';

const useStyles = makeStyles({
  cardRoot: {
    textAlign: 'center',
    width: '100%',
    boxShadow: 'none',
  },
  cardContentRoot: {
    padding: '20px 30px 28px',
    backgroundColor: '#E0E0E0',
  },
  cardActionRoot: {
    padding: '8px 40px',

    '& .MuiButtonBase-root': {
      margin: 0,
      fontSize: '18px',
    },
  },
  typographyRoot: {
    fontSize: '20px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  image: {
    position: 'relative',

    '&:before': {
      content: '""',
      display: 'block',
      paddingTop: 'calc(100% * 165 / 256 )',
    },

    '& img': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      objectFit: 'cover',
    },
  },
  imageNoSetting: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(to top left, rgba(130,130,130,0) 0%, rgba(130,130,130,0) calc(50% - 0.8px), rgba(130,130,130,1) 50%, rgba(130,130,130,0) calc(50% + 0.8px), rgba(130,130,130,0) 100%), linear-gradient(to top right, rgba(130,130,130,0) 0%, rgba(130,130,130,0) calc(50% - 0.8px), rgba(130,130,130,1) 50%, rgba(130,130,130,0) calc(50% + 0.8px), rgba(130,130,130,0) 100%)',
    backgroundColor: '#C4C4C4',
  },
  input: {
    color: '#4F4F4F',
    fontSize: '20px',
    height: '48px',
    borderRadius: '4px',
  },
  select: {
    height: '48px',
  },
  container: {
    '@media (max-width: 600px)': {
      justifyContent: 'center',
    },
  },
  buttonSearch: {
    '@media (max-width: 600px)': {
      padding: '8px 10px',
      width: '120px',
    },
  },
  buttonDelete: {
    '@media (max-width: 600px)': {
      padding: '8px 10px',
      width: '120px',
      margin: '5px',
    },
  },
  pageInnerWrap: {
    height: 'auto !important',
  },
});

const PageRecommendationSetting = () => {
  const classes = useStyles();

  const history = useHistory();
  const [shop] = useContext(ShopInfoContext);

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [recommendationDetail, setRecommendationDetail] = useState({
    parentCategory: {
      value: '',
    },
    childCategory: {
      value: '',
    },
    menu: {
      value: '',
      s_image_folder_path: '',
      m_image_folder_path: '',
      l_image_folder_path: '',
      main_image_path: null,
    },
  });
  const [searchMenu, setSearchMenu] = useState({
    name: '',
  });
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [showDialog, setShowDialog] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    getRecommendations();
    getParentCategories();
  }, [getRecommendations, getParentCategories]);

  const getRecommendations = async () => {
    try {
      let recommendationsRes = await ShopOrderApiService.getMasterMenus(shop.hashId, { is_recommend: 1 });
      recommendationsRes.push({
        name: 'No setting',
        status: MENU_STATUS.STATUS_ONSALE,
      });
      recommendationsRes = transformMenu(recommendationsRes);
      setRecommendations(recommendationsRes);
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const getParentCategories = async () => {
    const parentCategoryParams = {
      tier_number: 1,
      parent_id: 0,
    };
    const categories = await getCategories(parentCategoryParams);
    const parentCategories = categories.map((category) => {
      return { id: category.id, value: category.code, label: category.name };
    });
    setParentCategories(parentCategories);
  };

  const getCategories = (params) => {
    return new Promise((resolve) => {
      ShopOrderApiService.getCategories(shop.hashId, params)
        .then((categories) => {
          resolve(categories);
        })
        .catch((error) => {
          showWarningMessage(error.message);
        });
    });
  };

  const parentCategoryChanged = async (event) => {
    const newRecommendationDetail = cloneDeep(recommendationDetail);
    const parentCategory = find(parentCategories, { value: event.target.value });
    if (!Utils.isNil(parentCategory)) {
      newRecommendationDetail.parentCategory = parentCategory;

      const childCategoryParams = {
        tier_number: 2,
        parent_id: parentCategory.id,
      };
      const categories = await getCategories(childCategoryParams);
      newRecommendationDetail.childCategory = {
        value: '',
      };
      newRecommendationDetail.menu = {
        value: '',
      };
      const childCategories = categories.map((category) => {
        return { id: category.id, value: category.code, label: category.name };
      });
      setRecommendationDetail(newRecommendationDetail);
      setChildCategories(childCategories);
    } else {
      newRecommendationDetail.parentCategory = {
        value: '',
      };
      newRecommendationDetail.childCategory = {
        value: '',
      };
      newRecommendationDetail.menu = {
        value: '',
      };
      setRecommendationDetail(newRecommendationDetail);
      setChildCategories([]);
    }
  };

  const childCategoryChanged = async (event) => {
    const newRecommendationDetail = cloneDeep(recommendationDetail);
    const childCategory = find(childCategories, { value: event.target.value });
    if (!Utils.isNil(childCategory)) {
      newRecommendationDetail.childCategory = childCategory;

      let menus = await getMenus({
        category_id: childCategory.id,
      });
      menus = menus.filter((menu) => menu.status === MENU_STATUS.STATUS_ONSALE);
      menus = transformMenu(menus);
      if (menus.length === 0) {
        newRecommendationDetail.menu = {
          value: '',
        };
        setRecommendationDetail(newRecommendationDetail);
      }
      setMenus(menus);
    } else {
      newRecommendationDetail.childCategory = {
        value: '',
      };
    }
    setRecommendationDetail(newRecommendationDetail);
  };

  const menuChanged = (event) => {
    const newRecommendationDetail = cloneDeep(recommendationDetail);
    const menu = find(menus, { value: event.target.value });
    if (!Utils.isNil(menu)) {
      newRecommendationDetail.menu = menu;
    } else {
      newRecommendationDetail.menu = {
        value: '',
      };
    }
    setRecommendationDetail(newRecommendationDetail);
  };

  const getMenus = async (params) => {
    setIsLoading(true);
    try {
      return await ShopOrderApiService.getMasterMenus(shop.hashId, params);
    } catch (error) {
      showWarningMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const transformMenu = (menus_response) => menus_response.map((menu) => {
    menu.value = menu.hash_id;
    menu.label = menu.name;
    if (!Utils.isNil(menu.s_image_folder_path) && menu.s_image_folder_path !== '') {
      menu.s_image_folder_path = renderUrlImageS3(menu.s_image_folder_path);
    }
    if (!Utils.isNil(menu.m_image_folder_path) && menu.m_image_folder_path !== '') {
      menu.m_image_folder_path = renderUrlImageS3(menu.m_image_folder_path);
    }
    if (!Utils.isNil(menu.l_image_folder_path) && menu.l_image_folder_path !== '') {
      menu.l_image_folder_path = renderUrlImageS3(menu.l_image_folder_path);
    }

    return menu;
  });

  const searchNameMenuChanged = (event) => {
    const newSearchMenu = cloneDeep(searchMenu);
    newSearchMenu[event.target.name] = event.target.value;
    setSearchMenu(newSearchMenu);
  };

  const execSearchMenu = async () => {
    if (!Utils.isNil(recommendationDetail.childCategory.id)) {
      searchMenu.category_id = recommendationDetail.childCategory.id;
      let menus = await getMenus(searchMenu);
      menus = transformMenu(menus);
      recommendationDetail.menu = {
        value: '',
      };
      setRecommendationDetail(recommendationDetail);
      setMenus(menus);
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

  const markMenuAsRecommend = async () => {
    if (Utils.isNil(recommendationDetail.menu.id)) {
      showWarningMessage('Vui lòng chọn một món ăn');
    } else {
      let updateMenuData = {
        name: recommendationDetail.menu.name,
        price: recommendationDetail.menu.price,
        tax_value: recommendationDetail.menu.tax_value,
        status: recommendationDetail.menu.status,
        main_image_path: recommendationDetail.menu.main_image_path,
      };
      updateMenuData.m_menu_category_ids = [];
      updateMenuData.m_menu_category_ids.push(recommendationDetail.parentCategory.id);
      updateMenuData.m_menu_category_ids.push(recommendationDetail.childCategory.id);
      updateMenuData.is_recommend = 1;

      setInProgress(true);
      try {
        await ShopOrderApiService.updateMenuInfo(
          shop.hashId,
          recommendationDetail.menu.hash_id,
          updateMenuData
        );
        setInProgress(false);
        showSuccessMessage('Cập nhật thành công');
        getRecommendations();
        handleCloseModal();
      } catch (error) {
        setInProgress(false);
        showWarningMessage(error.message);
      }
    }
  };

  const removeMenuRecommend = () => {
    if (Utils.isNil(recommendationDetail.menu.id)) {
      showWarningMessage('Bạn không thể xóa đề xuất cho món ăn này');
    } else {
      setShowDialog(true);
    }
  };

  const handleRemoveMenuRecommend = () => {
    let updateMenuData = {
      name: recommendationDetail.menu.name,
      price: recommendationDetail.menu.price,
      status: recommendationDetail.menu.status,
    };
    updateMenuData.m_menu_category_ids = [];
    updateMenuData.m_menu_category_ids.push(recommendationDetail.parentCategory.id);
    updateMenuData.m_menu_category_ids.push(recommendationDetail.childCategory.id);
    updateMenuData.is_recommend = 0;
    updateMenuData.main_image = recommendationDetail.main_image;
    updateMenuData.main_image_path = recommendationDetail.main_image_path;

    setInProgress(true);
    ShopOrderApiService.updateMenu(shop.hashId, recommendationDetail.menu.hash_id, updateMenuData)
      .then(() => {
        setInProgress(false);
        showSuccessMessage('Cập nhật thành công');
        getRecommendations();
        handleCloseModal();
      })
      .catch((error) => {
        setInProgress(false);
        showWarningMessage(error.message);
      });
  };

  const handleShowDetail = async (recommendation) => {
    if (
      Utils.isNil(recommendation.id) ||
      Utils.isNil(recommendation.m_menu_category) ||
      recommendation.m_menu_category.length === 0
    ) {
      recommendation.parentCategory = {
        value: '',
      };
      recommendation.childCategory = {
        value: '',
      };
      recommendation.menu = {
        value: '',
        image: '',
      };
    }

    if (!Utils.isNil(recommendation.id)) {
      if (
        !Utils.isNil(recommendation.m_menu_category) &&
        (recommendation.m_menu_category.length === 1 || recommendation.m_menu_category.length === 2)
      ) {
        const parentCategory = find(recommendation.m_menu_category, { tier_number: 1 });
        const childCategory = find(recommendation.m_menu_category, { tier_number: 2 });
        if (!Utils.isNil(parentCategory)) {
          recommendation.parentCategory = parentCategory;
          recommendation.parentCategory.value = parentCategory.code;
          recommendation.parentCategory.label = parentCategory.name;

          const childCategoryParams = {
            tier_number: 2,
            parent_id: parentCategory.id,
          };
          const categories = await getCategories(childCategoryParams);
          const childCategories = categories.map((category) => {
            return { id: category.id, value: category.code, label: category.name };
          });
          if (!Utils.isNil(childCategory)) {
            recommendation.childCategory = childCategory;
            recommendation.childCategory.value = childCategory.code;
            recommendation.childCategory.label = childCategory.name;

            let menus = await getMenus({
              category_id: childCategory.id,
            });
            menus = menus.filter((menu) => menu.status === MENU_STATUS.STATUS_ONSALE);
            menus = transformMenu(menus);
            setMenus(menus);
            recommendation.menu = recommendation;
          }
          setChildCategories(childCategories);
          setRecommendationDetail(recommendation);
        }
      }
    }
    setRecommendationDetail(recommendation);
    setModalDetail(true);
  };

  const handleCloseModal = () => {
    setModalDetail(false);
  };

  const ActionsModal = () => {
    return (
      <Grid container spacing={4} justify='center'>
        <Grid item xs={6} sm={3}>
          <Box display='flex' justifyContent='center'>
            <Button
              bgcolor='#828282'
              borderColor='#828282'
              borderRadius='28px'
              fullWidth
              onClick={handleCloseModal}
            >
              Quay lại
            </Button>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box display='flex' justifyContent='center'>
            <Button
              bgcolor='#FFA04B'
              borderColor='#FFA04B'
              borderRadius='28px'
              fullWidth
              onClick={markMenuAsRecommend}
              disabled={inProgress}
            >
              Lưu
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <PageContainer padding='0'>
      <HeaderAppBar title='Món ăn đề xuất' />
      <PageInnerWrap className={classes.pageInnerWrap}>
        <PageInnerContainer padding='30px'>
          <Grid
            container
            spacing={4}
            style={{ marginBottom: '120px' }}
            className={classes.container}
          >
            {recommendations &&
              recommendations.map(
                (recommendation, index) =>
                  recommendation.status === MENU_STATUS.STATUS_ONSALE && (
                    <Grid item sm={4} key={index}>
                      <Card
                        className={classes.cardRoot}
                        onClick={() => {
                          handleShowDetail(recommendation);
                        }}
                      >
                        <CardContent className={classes.cardContentRoot}>
                          <Typography className={classes.typographyRoot}>{`Đề xuất ${
                            index + 1
                          }`}</Typography>

                          <Box mt={4} mb={2}>
                            <Typography className={classes.typographyRoot}>
                              {recommendation.name}
                            </Typography>
                          </Box>

                          <Box className={classes.image}>
                            {recommendation?.main_image ? (
                              <img
                                src={renderUrlImageS3(recommendation?.main_image?.l_image_path)}
                                alt={`${recommendation.name} ${index}`}
                              />
                            ) : (
                              <Box className={classes.imageNoSetting} />
                            )}
                          </Box>
                        </CardContent>

                        <CardActions className={classes.cardActionRoot}>
                          <Button
                            bgcolor='#FFA04B'
                            borderColor='#FFA04B'
                            borderRadius='28px'
                            padding='8px 20px'
                            fullWidth
                          >
                            Xem
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  )
              )}
          </Grid>

          <Footer>
            <Box display='flex' justifyContent='center'>
              <Button
                bgcolor='#828282'
                borderColor='#828282'
                borderRadius='28px'
                style={{ fontSize: '18px', minWidth: '200px' }}
                onClick={() => history.push('/menus/setting')}
              >
                Quay lại
              </Button>
            </Box>
          </Footer>
        </PageInnerContainer>
      </PageInnerWrap>

      <Modal
        open={modalDetail}
        title='Chi tiết'
        actions={ActionsModal()}
        onClose={handleCloseModal}
      >
        <Box px={3} py={2}>
          <Grid container spacing={2} justify='space-between' alignItems='center'>
            <Grid item sm={9} xs={12}>
              <Grid alignItems='center' style={{ display: 'flex' }}>
                <Grid item sm={8}>
                  <OutlinedInput
                    id='search-name-menu'
                    name='name'
                    value={searchMenu.name}
                    className={classes.input}
                    labelWidth={0}
                    placeholder=''
                    onChange={(event) => searchNameMenuChanged(event)}
                    fullWidth
                  />
                </Grid>
                <Grid item sm={4}>
                  <Button
                    bgcolor='#F2F2F2'
                    borderColor='#4F4F4F'
                    fgcolor='#4F4F4F'
                    borderRadius='28px'
                    style={{ borderWidth: '1px', marginLeft: '10px' }}
                    onClick={execSearchMenu}
                    disabled={inProgress}
                    classes={{ root: classes.buttonSearch }}
                  >
                    Tìm kiếm
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item sm={3} xs={12}>
              <Box display='flex' justifyContent='flex-end'>
                <Button
                  bgcolor='#F2F2F2'
                  borderColor='#4F4F4F'
                  fgcolor='#4F4F4F'
                  borderRadius='28px'
                  onClick={removeMenuRecommend}
                  style={{ borderWidth: '1px' }}
                  disabled={inProgress || !recommendationDetail.id}
                  classes={{ root: classes.buttonDelete }}
                >
                  Xóa
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2} justify='center'>
            <Grid item sm={8}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs={4}>
                  Danh mục chính
                </Grid>
                <Grid item xs={8}>
                  <CustomSelectorBase
                    className={classes.select}
                    fullWidth
                    value={recommendationDetail.parentCategory.value}
                    optionArray={parentCategories}
                    id='parent-category'
                    name='parentCategory'
                    onChange={(event) => parentCategoryChanged(event)}
                  />
                </Grid>
                <Grid item xs={4}>
                  Danh mục phụ
                </Grid>
                <Grid item xs={8}>
                  <CustomSelectorBase
                    className={classes.select}
                    fullWidth
                    value={recommendationDetail.childCategory.value}
                    optionArray={childCategories}
                    id='child-category'
                    name='childCategory'
                    onChange={(event) => childCategoryChanged(event)}
                  />
                </Grid>
                <Grid item xs={4}>
                  Tên món
                </Grid>
                <Grid item xs={8}>
                  <CustomSelectorBase
                    className={classes.select}
                    id='menu'
                    name='menu'
                    optionArray={menus}
                    fullWidth
                    value={recommendationDetail.menu.value}
                    onChange={(event) => menuChanged(event)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={4}>
              <Box height='100%' display='flex' alignItems='center' justifyContent='center'>
                <img
                  src={
                    recommendationDetail?.menu?.main_image ? renderUrlImageS3(
                      recommendationDetail?.menu?.main_image?.m_image_path ||
                        recommendationDetail?.menu?.main_image?.image_path
                    ) : defaultMenuImage
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Waiting isOpen={isLoading} />

      <FlashMessage
        isOpen={toast.isShow}
        onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
        status={toast.status}
        message={toast.message}
      />

      <Dialog
        isOpen={showDialog}
        onClose={(isOpen) => setShowDialog(isOpen)}
        title='Xác nhận'
        message='Bạn có muốn xóa đề xuất cho món ăn này không?'
        onConfirm={() => handleRemoveMenuRecommend()}
      />
    </PageContainer>
  );
};

export default PageRecommendationSetting;
