import Utils from 'js/shared/utils';

const validateParentCategory = (menuData, errors, indexRow, nameColumn) => {
  const parentCategoryValidate = {
    requiredErrorMessage: '大カテゴリーを選んでください',
  };

  if (
    Utils.isNil(menuData.parentCategory.value) ||
    menuData.parentCategory.value === '' ||
    menuData.parentCategory.value === -1
  ) {
    errors.push({
      indexRow: indexRow,
      nameColumn: nameColumn,
      errorContent: parentCategoryValidate.requiredErrorMessage,
    });
  }
  return errors;
};

const validateChildCategory = (menuData, errors, indexRow, nameColumn) => {
  const childCategoryValidate = {
    requiredErrorMessage: '小カテゴリーを選んでください。',
  };

  if (
    Utils.isNil(menuData.childCategory.value) ||
    menuData.childCategory.value === '' ||
    menuData.childCategory.value === -1
  ) {
    errors.push({
      indexRow: indexRow,
      nameColumn: nameColumn,
      errorContent: childCategoryValidate.requiredErrorMessage,
    });
  }
  return errors;
};

const validateName = (menuData, errors, indexRow, nameColumn) => {
  const nameValidate = {
    requiredErrorMessage: '商品名を入力してください。',
    maxLength: 30,
    maxLengthErrorMessage: '商品名を30文字以内で入力してください。',
  };

  if (!Utils.isNil(menuData.name) && menuData.name.trim() !== '') {
    if (menuData.name.length > nameValidate.maxLength) {
      errors.push({
        indexRow: indexRow,
        nameColumn: nameColumn,
        errorContent: nameValidate.maxLengthErrorMessage,
      });
    }
  } else {
    errors.push({
      indexRow: indexRow,
      nameColumn: nameColumn,
      errorContent: nameValidate.requiredErrorMessage,
    });
  }
  return errors;
};

const validatePrice = (menuData, errors, indexRow, nameColumn) => {
  const priceValidate = {
    requiredErrorMessage: '価格を選んでください',
    patternErrorMessage: '価格形式が正しくありません',
  };
  const priceRegex = /^\d+(\\d{0,2})?$/;

  if (!Utils.isNil(menuData.price)) {
    if (!priceRegex.test(menuData.price)) {
      errors.push({
        indexRow: indexRow,
        nameColumn: nameColumn,
        errorContent: priceValidate.patternErrorMessage,
      });
    }
  } else {
    errors.push({
      indexRow: indexRow,
      nameColumn: nameColumn,
      errorContent: priceValidate.patternErrorMessage,
    });
  }
  return errors;
};

export { validateParentCategory, validateChildCategory, validateName, validatePrice };
