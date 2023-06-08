import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Utils from 'js/shared/utils';
import { find } from 'lodash';

// Component
import Modal from '../../../shared-order/components/Modal';
import ButtonCustom from '../../../shared-order/components/Button';
import CustomSelectorBase from '../../../shared/components/CustomSelectorBase';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import Dialog from 'js/shared-order/components/Dialog';
import Button from 'js/shared/components/Button';

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Box, OutlinedInput } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  left: {
    fontWeight: 400,
    fontSize: '18px',
    color: '#000',
  },
  select: {
    width: '100%',
    color: '#4F4F4F',
    fontSize: '20px',
    height: '48px',
  },
  input: {
    width: '100%',
    color: '#4F4F4F',
    fontSize: '20px',
    height: '48px',
    borderRadius: '4px',
  },
}));

const ModalDetailSubCategorySetting = (props) => {
  const classes = useStyles();
  const [shop] = useContext(ShopInfoContext);
  const [parentCategories, setParentCategories] = useState([]);
  const [categoryDetail, setCategoryDetail] = useState({
    parentCategory: {
      value: '',
    },
    name: '',
  });
  const [categoryDetailOriginal, setCategoryDetailOriginal] = useState({
    parentCategory: {
      value: '',
    },
    name: '',
  });
  const [inProgress, setInProgress] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (Object.keys(props.categoryDetail).length === 0) {
      getParentCategories();
      resetCategoryData();
    } else {
      fillCategoryData(Utils.cloneDeep(props.categoryDetail));
    }
  }, [props.categoryDetail]);

  const resetCategoryData = () => {
    setCategoryDetail({
      parentCategory: props.parentCategory,
      name: '',
    });
    setCategoryDetailOriginal({
      parentCategory: {
        value: '',
      },
      name: '',
    });
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

  const fillCategoryData = async (category) => {
    const parentCategoryParams = {
      tier_number: 1,
      parent_id: 0,
    };
    const categories = await getCategories(parentCategoryParams);
    const parentCategories = categories.map((category) => {
      return { id: category.id, value: category.code, label: category.name };
    });
    setParentCategories(parentCategories);

    const parentCategory = find(categories, { id: category.parent_id });
    if (!Utils.isNil(parentCategory)) {
      category.parentCategory = {
        id: parentCategory.id,
        value: parentCategory.code,
        label: parentCategory.name,
      };
    }
    setCategoryDetail(category);
    setCategoryDetailOriginal(category);
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

  const parentCategoryChanged = async (event) => {
    const newCategoryDetail = Utils.cloneDeep(categoryDetail);
    const parentCategory = find(parentCategories, { value: event.target.value });
    if (!Utils.isNil(parentCategory)) {
      newCategoryDetail.parentCategory = parentCategory;
    } else {
      newCategoryDetail.parentCategory = {
        value: '',
      };
    }
    setCategoryDetail(newCategoryDetail);
  };

  const validateParentCategory = (categoryDetail, errors) => {
    const parentCategoryValidate = {
      requiredErrorMessage: 'Hãy chọn danh mục chính trước!',
    };

    if (
      Utils.isNil(categoryDetail.parentCategory.value) ||
      categoryDetail.parentCategory.value === ''
    ) {
      errors.push(parentCategoryValidate.requiredErrorMessage);
    }
    return errors;
  };

  const validateName = (categoryDetail, errors) => {
    const nameValidate = {
      requiredErrorMessage: 'Tên danh mục không được để trống',
      maxLength: 50,
      maxLengthErrorMessage: 'Tên danh mục quá dài',
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

  const nameChanged = (event) => {
    const newCategoryDetail = Utils.cloneDeep(categoryDetail);
    newCategoryDetail[event.target.name] = event.target.value;
    setCategoryDetail(newCategoryDetail);
  };

  const saveCategory = () => {
    let errors = [];

    if (categoryDetail.parentCategory.value === 0) {
      props.showWarningMessage('Hãy chọn danh mục chính trước!');
      return;
    }

    validateParentCategory(categoryDetail, errors);

    if (!errors.length) {
      validateName(categoryDetail, errors);
    }

    if (errors.length > 0) {
      props.showWarningMessage(errors);
    } else {
      const saveCategoryData = {
        tier_number: 2,
        parent_id: categoryDetail.parentCategory.id,
        name: categoryDetail.name,
      };

      setInProgress(true);
      if (props.categoryDetail.code) {
        ShopOrderApiService.updateCategory(shop.hashId, props.categoryDetail.code, saveCategoryData)
          .then(() => {
            props.showSuccessMessage('Cập nhật thành công');
            props.getSubCategories(props.parentCategories);
            props.onClose();
            setInProgress(false);
          })
          .catch((error) => {
            setInProgress(false);
            if (error.result.errorCode === 'not_found') {
              props.showWarningMessage('Không tìm thấy');
              return;
            }
            props.showWarningMessage(error.message.replace('Error: ', ''))
          });
      } else {
        ShopOrderApiService.createCategory(shop.hashId, saveCategoryData)
          .then(() => {
            props.showSuccessMessage('Tạo mới thành công');
            props.getSubCategories(props.parentCategories);
            resetCategoryData();
            props.onClose();
            setInProgress(false);
          })
          .catch((error) => {
            setInProgress(false);
            if (error.result.errorCode === 'not_found') {
              props.showWarningMessage('Không tìm thấy');
              return;
            }
            props.showWarningMessage(error.message.replace('Error: ', ''))
          });
      }
    }
  };

  const deleteCategory = () => {
    if (props.categoryDetail.code) {
      setShowDialog(true);
    } else {
      props.showWarningMessage('Xóa thành công');
    }
  };

  const execDeleteCategory = () => {
    setInProgress(true);
    if (props.categoryDetail.is_belong_to_menu && props.categoryDetail.is_belong_to_menu === 1) {
      props.showWarningMessage('Không thể xóa vì đã có thực đơn');
      setInProgress(false);
    } else {
      ShopOrderApiService.deleteCategory(shop.hashId, categoryDetail.code)
        .then(() => {
          props.showSuccessMessage('Xóa thành công');
          props.getSubCategories(props.parentCategories);
          props.onClose();
          setInProgress(false);
        })
        .catch((error) => {
          setInProgress(false);
          if (error.result.errorCode === 'not_found') {
            props.showWarningMessage('Không tìm thấy');
            return;
          }
          props.showWarningMessage(error.message);
        });
    }
  };

  const actionModal = () => {
    return (
      <Box textAlign='center'>
        <ButtonCustom
          title='Quay lại'
          borderRadius='28px'
          bgcolor='#828282'
          borderColor='#828282'
          width='176px'
          onClick={() => { setCategoryDetail(categoryDetailOriginal); props.onClose();}}
        />
        <ButtonCustom
          title='Lưu'
          borderRadius='28px'
          bgcolor='#FFA04B'
          borderColor='#FFA04B'
          width='176px'
          onClick={() => {
            saveCategory(true);
          }}
          disabled={inProgress}
        />
      </Box>
    );
  };

  return (
    <Modal
      actions={actionModal()}
      open={props.open}
      title={categoryDetail.id ? 'Cập nhật danh mục' : 'Thêm mới danh mục'}
      onClose={props.onClose}
    >
      <Box mt={2}>
        {categoryDetail.id && (
          <Box display='flex' justifyContent={'flex-end'}>
            <Button
              borderColor={
                inProgress || Object.keys(props.categoryDetail).length === 0 ? '' : 'red'
              }
              borderRadius='28px'
              fgcolor='red'
              disabled={Object.keys(props.categoryDetail).length === 0}
              onClick={deleteCategory}
              style={{
                borderWidth: 1,
                background: '#FFF',
                whiteSpace: 'nowrap',
              }}
            >
              Xóa
            </Button>
          </Box>
        )}

        <Box mt={3} display={'flex'} alignItems={'center'}>
          <Box className={classes.left} width={'40%'} textAlign={'center'}>
            Tên danh mục chính
          </Box>
          <Box width={'40%'} textAlign={'left'}>
            <CustomSelectorBase
              className={classes.select}
              value={categoryDetail.parentCategory.value}
              optionArray={parentCategories}
              id='parent_id'
              name='parentCategory'
              onChange={(event) => parentCategoryChanged(event)}
            />
          </Box>
          <Box width={'20%'}> </Box>
        </Box>

        <Box mt={3} display={'flex'} alignItems={'center'}>
          <Box className={classes.left} width={'40%'} textAlign={'center'}>
            Tên danh mục phụ
          </Box>
          <Box width={'40%'} textAlign={'left'}>
            <OutlinedInput
              value={categoryDetail.name}
              className={classes.input}
              labelWidth={0}
              id='name'
              name='name'
              onChange={(event) => nameChanged(event)}
            />
          </Box>

          <Box width={'20%'}> </Box>
        </Box>
      </Box>

      <Dialog
        isOpen={showDialog}
        onClose={(isOpen) => setShowDialog(isOpen)}
        title='Xóa danh mục'
        message='Bạn có chắc bạn muốn xóa mục này?'
        onConfirm={() => execDeleteCategory()}
      />
    </Modal>
  );
};

// PropTypes
ModalDetailSubCategorySetting.propTypes = {
  open: PropTypes.bool,
  categoryDetail: PropTypes.object,
  parentCategories: PropTypes.array,
  onClose: PropTypes.func,
  getSubCategories: PropTypes.func,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalDetailSubCategorySetting.defaultProps = {
  open: false,
  categoryDetail: {},
  parentCategories: [],
  onClose: () => {},
  getSubCategories: () => {},
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalDetailSubCategorySetting;
