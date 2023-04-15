/**
 * Page Data Dowload
 */

// React
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import Utils from 'js/shared/utils';

// Material UI Component
import {
  Grid,
  Box,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Component Share
import PageContainer from 'js/shared/components/PageContainer';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import Button from 'js/shared/components/Button';
import ButtonCustom from 'js/shared-order/components/Button';

import Modal from 'js/shared-order/components/Modal';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerWrap from 'js/shared-order/components/PageInnerWrap';
import Footer from 'js/shared-order/components/Footer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import Dialog from 'js/shared-order/components/Dialog';

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Style
const useStyles = makeStyles({
  input: {
    color: '#4F4F4F',
    fontSize: '20px',
    height: '48px',
    borderRadius: '4px',
    width: '100%'
  },
  button: {
    margin: 0,
    padding: '3px 36px',
  },
  buttonDelete: {
    margin: '0px 20px 0px 0px',
    background: '#fff',
    color: 'red',
    border: '1px solid red',
    padding: '3px 36px',
    '&:hover': {
      background: '#fff',
    },
    '@media (max-width: 600px)': {
      margin: '0px 0px 10px 0px',
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
  tableWrap: {
    width: '90%',
    margin: '0 auto',
    boxShadow: 'none',
    paddingBottom: '75px',
  },
  tableCell: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
    background: '#ffffff',
    borderRight: '1px rgba(224, 224, 224, 1) solid',
    borderLeft: '1px rgba(224, 224, 224, 1) solid',
    maxWidth: 700
  },
  tableCellHead: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
    background: '#DADADA',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  breakLine: {
    borderTop: '3px rgb(130 130 130 / 50%) solid',
    paddingTop: 10,
  },
});
const DEFAULT_CATEGORY = {
  name: '',
};

const PageCategorySetting = () => {
  const classes = useStyles();

  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [shop] = useContext(ShopInfoContext);
  const [categories, setCategories] = useState([]);
  const [categoryDetail, setCategoryDetail] = useState(DEFAULT_CATEGORY);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const getCategories = async () => {
    const parent_category_params = {
      tier_number: 1,
      parent_id: 0,
    };
    ShopOrderApiService.getCategories(shop.hashId, parent_category_params)
      .then((categories) => {
        setCategories(categories);
      })
      .catch((error) => {
        showWarningMessage(JSON.stringify(error.message));
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

  const nameChanged = (event) => {
    const newcategoryDetail = Utils.cloneDeep(categoryDetail);
    newcategoryDetail[event.target.name] = event.target.value;
    setCategoryDetail(newcategoryDetail);
  };

  const saveCategory = async () => {
    let errors = [];
    validateName(categoryDetail, errors);

    if (errors.length > 0) {
      showWarningMessage(errors);
    } else {
      const saveCategoryData = {
        name: categoryDetail.name,
        tier_number: 1,
      };

      if (categoryDetail.id) {
        try {
          await ShopOrderApiService.updateCategory(shop.hashId, categoryDetail.code, {
            ...categoryDetail,
          });
          showSuccessMessage('更新しました');
          getCategories();
          handleCloseModal();
          setCategoryDetail(DEFAULT_CATEGORY);
        } catch (error) {
          showWarningMessage(error.message.replace('Error: ', ''));
          if (error.result.errorCode === 'not_found') {
            showWarningMessage('カテゴリーが存在しません');
            return;
          }
        }
      } else {
        try {
          await ShopOrderApiService.createCategory(shop.hashId, saveCategoryData);
          showSuccessMessage('作成しました');
          getCategories();
          handleCloseModal();
          setCategoryDetail(DEFAULT_CATEGORY);
        } catch (error) {
          if (error.result.errorCode === 'not_found') {
            showWarningMessage('カテゴリーが存在しません');
            return;
          }
          showWarningMessage(error.message.replace('Error: ', ''));
        }
      }
    }
  };

  const handleDeleteLargeCategory = async () => {
    if (deleteCategory.childCategories.length > 0) {
      showWarningMessage('登録されている小カテゴリーがある為、削除できません');
    } else {
      try {
        await ShopOrderApiService.deleteCategory(shop.hashId, deleteCategory.code);
        showSuccessMessage('削除しました');
        await getCategories();
        setDeleteCategory(null);
        setShowDialog(false);
        setShowModal(false);
      } catch (error) {
        if (error.result.errorCode === 'not_found') {
          showWarningMessage('カテゴリーが存在しません');
          return;
        }
        showWarningMessage(error.message);
      }
    }
  };

  const validateName = (categoryDetail, errors) => {
    const nameValidate = {
      requiredErrorMessage: '大カテゴリーを入力してください',
      maxLength: 10,
      maxLengthErrorMessage: '大カテゴリーは10文字を超えてはなりません',
    };

    if (!Utils.isNil(categoryDetail.name) && categoryDetail.name.trim() !== '') {
      if (categoryDetail.name.length > nameValidate.maxLength) {
        errors.push(nameValidate.maxLengthErrorMessage);
      }
    } else {
      errors.push(nameValidate.requiredErrorMessage);
    }
    return errors;
  };

  const showAllChildCategories = (data) => {
    const nameCategories = data.map((item) => item.name);
    return nameCategories.join(', ');
  };

  const ModalActions = () => {
    return (
      <>
        <ButtonCustom
          title='戻る'
          borderRadius='28px'
          bgcolor='#828282'
          borderColor='#828282'
          width='176px'
          onClick={handleCloseModal}
        />
        <ButtonCustom
          title='保存'
          borderRadius='28px'
          bgcolor='#FFA04B'
          borderColor='#FFA04B'
          width='176px'
          onClick={saveCategory}
        />
      </>
    );
  };

  return (
    <PageContainer padding='0' height='auto' minHeight='auto'>
      {/* Change background color body */}
      <style>{'body { background-color: white}'}</style>

      <HeaderAppBar title='大カテゴリー設定' />
      <PageInnerWrap height='auto'>
        <PageInnerContainer padding='75px 20px' height='auto'>
          <Box>
            <TableContainer component={Paper} className={classes.tableWrap}>
              <Table stickyHeader aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell
                      classes={{
                        root: classes.tableCellHead,
                      }}
                    >
                      大カテゴリー
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tableCellHead,
                      }}
                      align='right'
                    >
                      小カテゴリ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((category, index) => (
                    <TableRow key={index}>
                      <TableCell
                        classes={{
                          root: classes.tableCell,
                        }}
                        component='th'
                        scope='row'
                      >
                        <Box display='flex' justifyContent='space-between'>
                          <Box whiteSpace='nowrap' mr={1}>
                            {category.name}
                          </Box>
                          <Button
                            bgcolor='#FFA04B'
                            borderColor='#FFA04B'
                            borderRadius='28px'
                            classes={{
                              root: classes.button,
                            }}
                            onClick={() => {
                              setCategoryDetail(category);
                              setShowModal(true);
                            }}
                            style={{
                              borderWidth: 1,
                              color: '#ffa04b',
                              background: '#FFF',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            編集
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tableCell,
                        }}
                        align='right'
                      >
                        <Box display='flex' justifyContent='space-between'>
                          <Box mr={2} whiteSpace='nowrap' width='65%' textOverflow='ellipsis' overflow='hidden' textAlign='left'>
                            {category.childCategories.length
                              ? showAllChildCategories(category.childCategories)
                              : 'なし'}
                          </Box>
                          <Button
                            bgcolor='#FFA04B'
                            borderColor='#FFA04B'
                            borderRadius='28px'
                            classes={{
                              root: classes.button,
                            }}
                            onClick={() =>
                              history.push(`/setting/category/${category.id}/subcategory/list`)
                            }
                            style={{
                              borderWidth: 1,
                              color: '#ffa04b',
                              background: '#FFF',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            表示
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </PageInnerContainer>

        <Footer padding='20px 10px'>
          <Box textAlign='center' className={classes.breakLine}>
            <Grid container justify='center' spacing={5}>
              <Grid item>
                <Button
                  onClick={() => history.push('/setting/menu/list')}
                  className={`${classes.buttonController} + ' ' + ${classes.buttonBack}`}
                >
                  戻る
                </Button>
              </Grid>

              <Grid item>
                <Button
                  onClick={() => {
                    setShowModal(true);
                    setCategoryDetail(DEFAULT_CATEGORY);
                  }}
                  className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                >
                  <Add /> 大カテゴリー追加
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Footer>
      </PageInnerWrap>

      <Modal
        open={showModal}
        title={categoryDetail.id ? '大カテゴリー編集' : '大カテゴリー新規追加'}
        actions={ModalActions()}
        onClose={handleCloseModal}
      >
        <Box mt={2}>
          <Box>
            {categoryDetail.id && (
              <Box display='flex' justifyContent={'flex-end'}>
                <Button
                  borderColor='red'
                  borderRadius='28px'
                  fgcolor='red'
                  style={{
                    borderWidth: 1,
                    background: '#FFF',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => {
                    setShowDialog(true);
                    setDeleteCategory(categoryDetail);
                  }}
                >
                  削除
                </Button>
              </Box>
            )}
          </Box>

          <Box mt={3} display={'flex'} alignItems={'center'}>
            <Box className={classes.left} width={'40%'} textAlign={'center'} fontSize={18}>
              大カテゴリー
            </Box>
            <Box width={'40%'} textAlign={'left'}>
              <OutlinedInput
                id='name'
                name='name'
                value={categoryDetail.name}
                className={classes.input}
                placeholder=''
                onChange={(event) => nameChanged(event, categoryDetail)}
              />
            </Box>
          </Box>
        </Box>
      </Modal>

      <FlashMessage
        isOpen={toast.isShow}
        onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
        status={toast.status}
        message={toast.message}
      />
      <Dialog
        isOpen={showDialog}
        onClose={(isOpen) => setShowDialog(isOpen)}
        title='削除'
        message='このアイテムを削除しますか？'
        onConfirm={() => handleDeleteLargeCategory()}
      />
    </PageContainer>
  );
};

export default PageCategorySetting;
