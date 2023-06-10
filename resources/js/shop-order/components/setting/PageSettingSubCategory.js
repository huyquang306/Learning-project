import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import Utils from 'js/shared/utils';
import { find } from 'lodash';

// Base Components
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import PageInnerWrap from 'js/shared-order/components/PageInnerWrap';
import Footer from 'js/shared-order/components/Footer';
import CustomSelectorBase from '../../../shared/components/CustomSelectorBase';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import FlashMessage from 'js/shared-order/components/FlashMessage';

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  Button,
  Box,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import ModalDetailSubCategorySetting from './ModalDetailSubCategorySetting';

const useStyles = makeStyles(() => ({
  container: {
    height: 'auto',
    overflowX: 'auto',
  },
  select: {
    width: '232px',
    color: '#828282',
    fontSize: '20px',
    height: '40px',
    marginRight: '24px',
  },
  tableHead: {
    background: '#DADADA',
    color: '#000',
    fontWeight: 600,
    fontSize: '16px',
  },
  tableCell: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
    background: '#fff',
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
  buttonBack: {
    background: '#828282',
    '&:hover': {
      background: '#828282',
    },
  },
  pageInner: {
    padding: '20px 100px',
    height: 'auto !important',
    '@media (max-width: 600px)': {
      padding: '20px 20px',
    },
  },
  breakLine: {
    borderTop: '3px rgb(130 130 130 / 50%) solid',
    paddingTop: 10,
  },
}));

const PageSettingSubCategory = (props) => {
  const classes = useStyles(props);
  const parentCategoryId = props.match.params.categoryId;
  const [parentCategory, setParentCategory] = useState({
    code: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const history = useHistory();
  const [shop] = useContext(ShopInfoContext);
  const [categoryDetail, setCategoryDetail] = useState({});
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  useEffect(() => {
    getSubCategories();
  }, [props.match.params.categoryId]);

  const getSubCategories = async (parentCategories = []) => {
    if (parentCategories.length === 0) {
      const parent_category_params = {
        tier_number: 1,
        parent_id: 0,
      };
      const categories = await getCategories(parent_category_params);
      parentCategories = categories.map((category) => {
        return { id: category.id, value: category.code, label: category.name };
      });
      parentCategories.unshift({
        id: 0,
        value: 0,
        label: 'Tất cả',
      });
      setParentCategories(parentCategories);

      let parentCategory = find(parentCategories, { id: parseInt(parentCategoryId) });
      if (!Utils.isNil(parentCategory)) {
        parentCategory.code = parentCategory.value;
        setParentCategory(parentCategory);
      }
    }

    const sub_category_params = {
      tier_number: 2,
    };
    if (parseInt(parentCategoryId) !== 0) {
      sub_category_params.parent_id = parentCategoryId;
    }
    const categories = await getCategories(sub_category_params);
    const subCategories = categories.map((category) => {
      category.parent = find(parentCategories, { id: category.parent_id });
      return category;
    });
    setCategories(subCategories);
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

  const parentCategoryChanged = (event) => {
    const parentCategory = find(parentCategories, { value: event.target.value });
    if (!Utils.isNil(parentCategory)) {
      history.push(`/setting/category/${parentCategory.id}/subcategory/list`);
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

  return (
    <PageContainer padding='0px'>
      <HeaderAppBar title='Danh mục thực đơn' />

      <PageInnerWrap>
        <PageInnerContainer className={classes.pageInner}>
          <Box paddingBottom='75px'>
            <Box>
              <CustomSelectorBase
                className={classes.select}
                value={parentCategory.code}
                optionArray={parentCategories}
                id='parentCategory'
                name='parentCategory'
                onChange={(event) => parentCategoryChanged(event)}
              />
            </Box>
            <Box mt='20px'>
              <TableContainer component={Paper} className={classes.container}>
                <Table stickyHeader aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        classes={{
                          root: classes.tableHead,
                        }}
                        align='center'
                      >
                        Danh mục chính
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tableHead,
                        }}
                        align='center'
                      >
                        Danh mục phụ
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tableHead,
                        }}
                        align='center'
                      >
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories &&
                      categories.map((category, index) => (
                        <TableRow key={index}>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align='left'
                            component='th'
                            scope='row'
                          >
                            {category.parent.label}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align='left'
                          >
                            {category.name}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align='center'
                          >
                            <Button
                              className={classes.button}
                              onClick={() => {
                                setShowModal(true);
                                setCategoryDetail(category);
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
          </Box>

          <ModalDetailSubCategorySetting
            open={showModal}
            categoryDetail={categoryDetail}
            parentCategories={parentCategories}
            parentCategory={parentCategory}
            onClose={() => setShowModal(false)}
            getSubCategories={getSubCategories}
            showWarningMessage={showWarningMessage}
            showSuccessMessage={showSuccessMessage}
          />

          <Footer padding={'10px'}>
            <Box textAlign='center' className={classes.breakLine}>
              <Grid spacing={5} container justify={'center'}>
                <Grid item>
                  <Button
                    onClick={() => history.push('/setting/category/list')}
                    className={`${classes.buttonController} + ' ' + ${classes.buttonBack}`}
                  >
                    Quay lại
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    onClick={() => {
                      setShowModal(true);
                      setCategoryDetail({});
                    }}
                    className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                  >
                    <Add /> Thêm danh mục
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Footer>

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

PageSettingSubCategory.propTypes = {
  match: PropTypes.object,
};

PageSettingSubCategory.defaultProps = {
  match: {},
};
export default PageSettingSubCategory;
