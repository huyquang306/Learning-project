import { numberRegex } from 'js/utils/helpers/constHelper';
import Utils from 'js/shared/utils';

const ESTIMATED_TIME = {
  MIN_VALUE: 0,
  MAX_VALUE: 60,
};
const validateParentCategory = (menuData, errors) => {
  const parentCategoryValidate = {
    requiredErrorMessage: 'Vui lòng chọn danh mục chính',
  };

  if (Utils.isNil(menuData.parentCategory.value) || menuData.parentCategory.value === '') {
    errors.push(parentCategoryValidate.requiredErrorMessage);
  }
  return errors;
};

const validateChildCategory = (menuData, errors) => {
  const childCategoryValidate = {
    requiredErrorMessage: 'Vui lòng chọn danh mục phụ',
  };

  if (Utils.isNil(menuData.childCategory.value) || menuData.childCategory.value === '') {
    errors.push(childCategoryValidate.requiredErrorMessage);
  }
  return errors;
};

const validateName = (menuData, errors) => {
  const nameValidate = {
    requiredErrorMessage: 'Vui lòng nhập tên món ăn',
    maxLength: 100,
    maxLengthErrorMessage: 'Vui lòng nhập tên sản phẩm không quá 100 ký tự.',
  };

  if (!Utils.isNil(menuData.name) && menuData.name.trim() !== '') {
    if (menuData.name.length > nameValidate.maxLength) {
      errors.push(nameValidate.maxLengthErrorMessage);
    }
  } else {
    errors.push(nameValidate.requiredErrorMessage);
  }
  return errors;
};

const validatePrice = (menuData, errors) => {
  const priceValidate = {
    requiredErrorMessage: 'Vui lòng chọn một mức giá',
    patternErrorMessage: 'Định dạng không chính xác',
  };
  const priceRegex =/^\d+(\\d{0,2})?$/;

  if (!Utils.isNil(menuData.price)) {
    if (!priceRegex.test(menuData.price)) {
      errors.push(priceValidate.patternErrorMessage);
    }
  } else {
    errors.push(priceValidate.requiredErrorMessage);
  }
  return errors;
};

const validateCookTime = (menuData, errors) => {
  const cookTimeValidate = {
    patternErrorMessage: 'Vui lòng nhập một giá trị số cho thời gian thực hiện',
    minOrMaxErrorMessage: 'Thời gian thực hiện phải lớn hơn 0 và nhỏ hơn 60 phút',
  };

  if (menuData?.estimated_preparation_time) {
    let estimatedTime = menuData.estimated_preparation_time;
    if (!numberRegex.test(estimatedTime)) {
      errors.push(cookTimeValidate.patternErrorMessage);
    }

    if (
      numberRegex.test(estimatedTime) &&
      (estimatedTime <= ESTIMATED_TIME.MIN_VALUE || estimatedTime > ESTIMATED_TIME.MAX_VALUE)
    ) {
      errors.push(cookTimeValidate.minOrMaxErrorMessage);
    }
  }

  return errors;
};

export {
  validateParentCategory,
  validateChildCategory,
  validateName,
  validatePrice,
  validateCookTime,
};
