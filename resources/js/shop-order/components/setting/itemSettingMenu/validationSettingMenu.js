import { numberRegex } from 'js/utils/helpers/constHelper';
import Utils from 'js/shared/utils';

const ESTIMATED_TIME = {
  MIN_VALUE: 0,
  MAX_VALUE: 60,
};
const validateParentCategory = (menuData, errors) => {
  const parentCategoryValidate = {
    requiredErrorMessage: '大カテゴリーを選んでください',
  };

  if (Utils.isNil(menuData.parentCategory.value) || menuData.parentCategory.value === '') {
    errors.push(parentCategoryValidate.requiredErrorMessage);
  }
  return errors;
};

const validateChildCategory = (menuData, errors) => {
  const childCategoryValidate = {
    requiredErrorMessage: '小カテゴリーを選んでください。',
  };

  if (Utils.isNil(menuData.childCategory.value) || menuData.childCategory.value === '') {
    errors.push(childCategoryValidate.requiredErrorMessage);
  }
  return errors;
};

const validateName = (menuData, errors) => {
  const nameValidate = {
    requiredErrorMessage: '商品名を入力してください。',
    maxLength: 30,
    maxLengthErrorMessage: '商品名を30文字以内で入力してください。',
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
    requiredErrorMessage: '価格を選んでください',
    patternErrorMessage: '価格形式が正しくありません',
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
    patternErrorMessage: '提供時刻は数値で入力してください',
    minOrMaxErrorMessage: '提供時刻は0より大きいで、60より小さいのは必要です',
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
