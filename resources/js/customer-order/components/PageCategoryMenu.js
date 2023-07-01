/**
 * Page Category Menu
 */

// React
import React, { useEffect, useState, Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';
import Utils from 'js/shared/utils';

// Material UI component
import {Box, Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Component
import HeaderAppBar from './HeaderAppBar';
import PageInnerWrap from './PageInnerWrap';
import Modal from './Modal';
import { getCookie } from 'js/utils/components/cookie/cookie.js';

// Component shared
import Button from '../../shared/components/Button';
import PageContainer from '../../shared/components/PageContainer';
import PageInnerContainer from '../../shared/components/PageInnerContainer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import ModalConfirmOrder from './ModalConfirmOrder';
import { setSuccessOrderMenu } from 'js/customer-order/utils/ordermenu';
import OrderFooter from '../../shared/components/OrderFooter';

// Utils
import { onConnectWebSocket, onSendNotifyHasNewOrder } from '../../utils/helpers/socket';
import { MENU_STATUS } from 'js/utils/helpers/const';
import { renderUrlImageS3 } from 'js/utils/helpers/image';

// Style
const useStyles = makeStyles({
  orderItem: {
    padding: '12px 6px 6px',
    marginBottom: '3px',
    backgroundColor: '#F2F2F2',
    fontWeight: 600,
  },
  customButton: {
    minWidth: '53px',
    height: '53px',
    border: 0,
    lineHeight: '57px',
    fontSize: '27px',
    boxShadow: 'rgba(0, 0, 0, 0.3) 1px 1px 1px 0px',
    fontWeight: 600,
  },
  pageLeft: {
    backgroundColor: '#ffffff',
  },
  pageBorderLeft: {
    height: 'calc(100vh - 175px)',
    overflowY: 'scroll',
    position: 'sticky',
    top: '43px',
  },
  pageRight: {
    paddingBottom: '79px',
  },
  categoryItem: {
    display: 'flex',
    width: '130px',
    height: '43px',
    padding: '2px 5px',
    borderRadius: '0px',
    textAlign: 'left',
    boxShadow: 'none',
    color: '#000000',
    fontWeight: 600,
    lineHeight: 1.1,
    borderBottom: '1px solid #BDBDBD',
    backgroundColor: '#ffffff',

    '& .MuiButton-label': {
      justifyContent: 'start',
    },
  },
  categoryActive: {
    backgroundColor: '#FFA04B !important',
  },
  prodItem: {
    position: 'relative',
    border: '1px solid #BDBDBD',
    // width: '33.333%',

    '&:before': {
      content: '""',
      display: 'block',
      paddingTop: 'calc(100% * 173 / 243 )',
    },

    '& img': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      objectFit: 'cover',
    },

    '& .prodName': {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      padding: '1px 5px',
      zIndex: '1',
      backgroundImage: 'linear-gradient(#ffffff, rgba(255,255,255,0.6))',
    },

    '& .menuInfo': {
      position: 'absolute',
      bottom: '0',
      zIndex: '1',
      width: '100%',
      height: '26px',
      backgroundImage: 'linear-gradient(#ffffff, rgba(255,255,255,0.6))',
    },

    '& .prodPrice': {
      position: 'absolute',
      bottom: '0px',
      right: '5px',
      padding: '0 8px',
      color: '#000000',
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'flex-end',
      fontSize: '16px',
      fontWeight: 600,
    },

    '& .outOfCourse': {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'flex-start',
      left: '5px',
      position: 'absolute',
      bottom: '2px',
      padding: '0 8px',
      backgroundColor: '#FFE8A5',
      color: '#4F4F4F',
      borderRadius: '4px',
      fontSize: '14px',
    },
  },
  footerActions: {
    padding: '0px 15px 0px 15px',
    display: 'flex',
    width: '100%',
  },
});

const styles = {
  footerButton: {
    width: '100%',
  },
  container: {
    marginTop: '5px',
    marginLeft: '3px',
  }
};

const DEFAULT_QUANTITY_ORDER = 1;

const PageCategoryMenu = () => {
  const classes = useStyles();
  const history = useHistory();

  const [parentCategory, setParentCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [productList, setProductList] = useState([]);
  const { shop_hash_id, category_hash_id } = useParams();
  const [isShowModal, setIsShowModal] = useState(false);
  const [productSelected, setProductSelected] = useState({});

  const ordergroup_hash_id = localStorage.getItem('ordergroupHash');
  const keyStoragePreOrderList = `${shop_hash_id}:${ordergroup_hash_id}:preOrderList`;
  const [courseHashId, setCourseHashId] = useState();
  const [statusOfOrderGroup, setStatusOfOrderGroup] = useState();
  const [categoryActive, setCategoryActive] = useState(0);
  const [priceDisplayMode, setPriceDisplayMode] = useState();
  const [currencyName, setCurrencyName] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  let preOrderListTempDefault = JSON.parse(localStorage.getItem(keyStoragePreOrderList)) || [];

  // menu order
  const [preOrderListTemp, setPreOrderListTemp] = useState(preOrderListTempDefault);
  const [isShowConfirmOrder, setIsShowConfirmOrder] = useState(false);

  const [allMenus, setAllMenus] = useState([]);
  // get cookie user hash id
  const userHashId = getCookie('userHashId') || '';

  // Connect to endpoint API Gateway
  useEffect(() => {
    // onConnectWebSocket(shop_hash_id);
  }, []);

  useEffect(() => {
    getInfoOfOrdergroup();
    getShopTaxInfo();
  }, []);

  useEffect(() => {
    if (category_hash_id) {
      /** Category menu */
      CustomerOrderApiService.getCategoryInfo(shop_hash_id, category_hash_id).then(
        (parent_category) => {
          setParentCategory(parent_category);
          let category_param = {
            tier_number: 2,
            parent_id: parent_category.id,
          };
          CustomerOrderApiService.getCategoryList(shop_hash_id, category_param).then(
            (sub_categories) => {
              setCategories(sub_categories);
              if (sub_categories && sub_categories.length > 0) {
                showMenu(sub_categories[0]);
              } else {
                setProductList([]);
              }
            }
          );
        }
      );
    } else {
      /** Recommend menu */
      let menuRecommendParam = {
        course_hash_id: courseHashId || '',
      };
      CustomerOrderApiService.getRecommend(shop_hash_id, menuRecommendParam).then((response) => {
        const listCategory = response.categories || [];
        const menus = response.menu;
        setCategories(listCategory);
        setAllMenus(menus);
        if (listCategory.length > 0) {
          showRecommendMenu(listCategory[0], menus);
        } else {
          setProductList([]);
        }
      });
    }
    setCategoryActive(0);
  }, [category_hash_id, courseHashId]);

  const getShopTaxInfo = async () => {
    try {
      const response = await CustomerOrderApiService.getShopTaxInfo(shop_hash_id);
      setPriceDisplayMode(response?.price_display_mode);
      setCurrencyName(response?.mCurrency?.name)
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const showMenu = (category) => {
    let menu_param = {
      category_id: category.id,
      course_hash_id: courseHashId || '',
    };
    CustomerOrderApiService.getMenuList(shop_hash_id, menu_param).then((response) => {
      const products = response.map((v) => {
        let productIndex = preOrderListTemp.findIndex((x) => x.id == v.id);
        if (productIndex > -1) {
          return { ...v, quantity: preOrderListTemp[productIndex].quantity };
        }

        return { ...v, quantity: DEFAULT_QUANTITY_ORDER };
      });
      setProductList(products);
    });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [categoryActive]);

  const showRecommendMenu = (category, menus) => {
    let filterProductList = menus.filter(function (el) {
      return el.category.id === category.id;
    });
    const products = filterProductList.map((v) => {
      let productIndex = preOrderListTemp.findIndex((x) => x.id == v.id);
      if (productIndex > -1) {
        return { ...v, quantity: preOrderListTemp[productIndex].quantity };
      }

      return { ...v, quantity: DEFAULT_QUANTITY_ORDER };
    });
    setProductList(products);
  };

  const handleShowMenu = (category, index) => {
    setCategoryActive(index);
    category_hash_id ? showMenu(category) : showRecommendMenu(category, allMenus);
  };

  const getTotal = () => {
    let total = 0;
    let preOrderList = JSON.parse(localStorage.getItem(keyStoragePreOrderList));
    if (!preOrderList) return total;
    preOrderList.forEach(function (order) {
      total = total + order.quantity;
    });
    return total;
  };

  const goToOrder = () => {
    setIsSubmitLoading(true);
    const clonePreOrderListTemp = preOrderListTemp.map((item) => {
      return {
        ...item,
        user_hash_id: userHashId || '',
        course_hash_id: courseHashId || '',
      };
    });
    const param_data = {
      orders: clonePreOrderListTemp,
    };
    CustomerOrderApiService.createOrder(shop_hash_id, ordergroup_hash_id, param_data)
      .then(() => {
        localStorage.setItem(keyStoragePreOrderList, JSON.stringify([]));
        setSuccessOrderMenu();
        history.push('/' + shop_hash_id);
        // Push notification for shop update realtime data
        onSendNotifyHasNewOrder(shop_hash_id);
        setIsSubmitLoading(false);
      })
      .catch(() => {
        history.push('/thanks-for-customer');
        setIsSubmitLoading(false);
      });
  };

  const handleDecrement = () => {
    let product = Utils.cloneDeep(productSelected);
    const { quantity } = product;
    product.quantity =
      quantity && quantity > DEFAULT_QUANTITY_ORDER ? quantity - 1 : DEFAULT_QUANTITY_ORDER;

    setProductSelected(product);
  };

  const handleIncrement = () => {
    let product = Utils.cloneDeep(productSelected);
    const { quantity } = product;
    product.quantity = quantity ? quantity + 1 : DEFAULT_QUANTITY_ORDER;

    setProductSelected(product);
  };

  const handleSavePreOrderList = () => {
    let product = Utils.cloneDeep(productSelected);
    let products = Utils.cloneDeep(productList);
    let preOrderList = Utils.cloneDeep(preOrderListTemp);

    if (preOrderList == null) preOrderList = [];
    let preOrderListIndex = preOrderList.findIndex((x) => x.id == product.id);
    if (preOrderListIndex > -1) {
      preOrderList[preOrderListIndex] = product;
    } else {
      preOrderList.push(product);
    }

    let productIndex = products.findIndex((x) => x.id == product.id);
    if (productIndex > -1) products[productIndex] = product;

    preOrderList = preOrderList.map(({ hash_id: menu_hash_id, ...rest }) => ({
      menu_hash_id,
      ...rest,
    }));

    setProductSelected(product);
    setProductList(products);
    setPreOrderListTemp(preOrderList);
    localStorage.setItem(keyStoragePreOrderList, JSON.stringify(preOrderList));

    setIsShowModal(false);
  };

  const handleSelectProduct = (product) => {
    let selectedProductClone = Utils.cloneDeep(product);
    let preOrderListIndex = preOrderListTemp.findIndex(
      (order) => order.id == selectedProductClone.id
    );
    if (preOrderListIndex > -1) {
      product.quantity = preOrderListIndex.quantity;
    } else {
      product.quantity = DEFAULT_QUANTITY_ORDER;
    }
    setProductSelected(selectedProductClone);
    setIsShowModal(true);
  };

  const getInfoOfOrdergroup = async () => {
    try {
      const response = await CustomerOrderApiService.getStatusOrdergroup(
        shop_hash_id,
        ordergroup_hash_id
      );
      if (response) {
        setCourseHashId(response.course_hash_id);
        setStatusOfOrderGroup(response.status);
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

  const backToMenu = () => {
    history.push('/' + shop_hash_id);
  };

  const ModalActions = () => {
    return (
      <Box className={classes.footerActions}>
        <Button
          bgcolor='#828282'
          fgcolor='#ffffff'
          borderRadius='30px'
          padding='12px 20px'
          style={styles.footerButton}
          onClick={() => setIsShowModal(false)}
        >
          Quay lại
        </Button>
        <Button
          bgcolor='#f2994b'
          fgcolor='#ffffff'
          borderRadius='30px'
          padding='12px 20px'
          style={styles.footerButton}
          onClick={handleSavePreOrderList}
        >
          OK
        </Button>
      </Box>
    );
  };

  const displayPriceOfMenu = (product) => {
    if (courseHashId) {
      if (product.is_belong_to_course == 0) {
        return (
          <Fragment>
            <Box className='outOfCourse'>単品</Box>
            <Box className='prodPrice'>
              {priceDisplayMode === 1
                ? product.current_price.price_unit_without_tax
                : product.price}{' '}
              <Box fontSize={16}>{currencyName}</Box> <Box ml={1}>{(priceDisplayMode === 1 &&  product.price > 0) && '(chưa thuế)'}</Box>
            </Box>
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <Box className='prodPrice' style={{ textDecoration: 'line-through' }}>
              <Box fontSize={11}>コース単価</Box>
              <Box fontSize={16}>0{currencyName}</Box>
            </Box>
          </Fragment>
        );
      }
    } else {
      return (
        <Fragment>
          <Box className='prodPrice'>
            {priceDisplayMode === 1 ? product.current_price.price_unit_without_tax : product.price}
            <Box fontSize={16}>{currencyName}</Box> <Box ml={1}>{(priceDisplayMode === 1 &&  product.price > 0) && '(chưa thuế)'}</Box>
          </Box>
        </Fragment>
      );
    }
  };

  return (
    <PageContainer padding='0' height='auto' minHeight='auto'>
      <HeaderAppBar title={category_hash_id ? parentCategory.name : 'おすすめ'} />
      <PageInnerWrap height='auto'>
        <PageInnerContainer padding='0px 0px 0px 0px' height='auto'>
          <Box display='flex'>
            <Box width={130} className={classes.pageLeft}>
              <Box className={classes.pageBorderLeft}>
                {categories &&
                  categories.map((item, index) => (
                    <Button
                      className={`${classes.categoryItem} ${
                        categoryActive === index && classes.categoryActive
                      }`}
                      key={index}
                      onClick={() => handleShowMenu(item, index)}
                    >
                      {item.name}
                    </Button>
                  ))}
              </Box>
            </Box>

            <Box flex={1} className={classes.pageRight}>
              {/*<Box>*/}
              <Grid container style={styles.container}>
                {productList &&
                  productList
                    .filter((item) => item.status === MENU_STATUS.STATUS_ONSALE)
                    .map((product, index) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={index}
                        className={classes.prodItem}
                        onClick={() => handleSelectProduct(product)}
                      >
                        <Box className='prodName' fontSize={16} fontWeight={600}>
                          {product.name}
                        </Box>
                        {product?.main_image ? (
                          <img src={renderUrlImageS3(product?.main_image?.m_image_path)} />
                        ) : (
                          <img
                            src={`${process.env.MIX_ASSETS_PATH}/img/shared/noimage.png`}
                            alt='banner'
                          />
                        )}
                        {/* display price of menu */}
                        <Box className='menuInfo'>{displayPriceOfMenu(product)}</Box>
                      </Grid>
                    ))}
              </Grid>
              {/*</Box>*/}
            </Box>
          </Box>

          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />
        </PageInnerContainer>

        {/* Footer: button back and button order */}
        <OrderFooter
          bgColor='#FFA04B'
          padding='6px'
          lengthOfPreOrderList={preOrderListTemp.length}
          statusOfOrderGroup={statusOfOrderGroup}
          numberOfOrders={getTotal()}
          buttonBack={() => backToMenu()}
          buttonOrder={() => setIsShowConfirmOrder(true)}
        />

        {/* Modal product  */}
        {isShowModal && (
          <Modal
            title='Chi tiết'
            open={isShowModal}
            actions={ModalActions()}
            maxHeight='456px'
            maxWidth='330px'
            onClose={() => setIsShowModal(false)}
          >
            <Box fontWeight={600} fontSize={20} mb={2}>
              {productSelected.name}
            </Box>
            <Box className={classes.prodItem}>
              {productSelected?.main_image ? (
                <img src={renderUrlImageS3(productSelected?.main_image?.s_image_path)} />
              ) : (
                <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/noimage.png`} alt='banner' />
              )}
            </Box>
            <Box mt={1} />

            <Box display='flex' alignItems='center' justifyContent='space-between'>
              <Button
                padding='0'
                borderRadius='50%'
                bgcolor='#E4E1B0'
                fgcolor='#000000'
                classes={{
                  root: classes.customButton,
                }}
                onClick={() => handleDecrement()}
              >
                ー
              </Button>
              <Box display='flex' alignItems='baseline' fontSize={55} fontWeight='fontWeightBold'>
                {productSelected.quantity}
                <Box fontSize={23} fontWeight='fontWeightRegular'>
                </Box>
              </Box>
              <Button
                padding='0'
                borderRadius='50%'
                bgcolor='#F2994B'
                fgcolor='#ffffff'
                classes={{
                  root: classes.customButton,
                }}
                onClick={() => handleIncrement()}
              >
                ＋
              </Button>
            </Box>
          </Modal>
        )}
        {/* END Modal product  */}

        {/* Modal confirm order */}
        <ModalConfirmOrder
          open={isShowConfirmOrder}
          orders={preOrderListTemp}
          onClose={() => setIsShowConfirmOrder(false)}
          onSubmit={() => goToOrder()}
          isSubmitLoading={isSubmitLoading}
        />
        {/* END Modal confirm order */}
      </PageInnerWrap>
    </PageContainer>
  );
};

export default PageCategoryMenu;
