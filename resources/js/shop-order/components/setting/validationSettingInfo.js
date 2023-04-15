import Utils from 'js/shared/utils';
import moment from 'moment';
import 'moment-timezone';
moment.locale('ja');

const FIRST_DATE = '1/1/1999';
const NEXT_FIRST_DATE = '1/2/1999';

const checkValidation = (shopData) => {
  let errors = [];
  errors = validateName(shopData, errors);
  errors = validateGenres(shopData, errors);
  errors = validatePostalCode(shopData, errors);
  errors = validateAddress(shopData, errors);
  errors = validatePhoneNumber(shopData, errors);
  errors = validateShopTime(shopData, errors);
  errors = validateWifiName(shopData, errors);
  errors = validateWifiPass(shopData, errors);
  errors = validateBusinesses(shopData, errors);
  errors = validateSNSLink(shopData, errors);
  errors = validateInstagramLink(shopData, errors);

  return errors;
};

const validateName = (shopData, errors) => {
  const nameValidate = {
    requiredErrorMessage: '店舗名を入力してください',
    maxLength: 30,
    maxLengthErrorMessage: 'ストア名は30文字を超えてはなりません',
  };

  if (!Utils.isNil(shopData.name) && shopData.name.trim() !== '') {
    if (shopData.name.length > nameValidate.maxLength) {
      errors.push(nameValidate.maxLengthErrorMessage);
    }
  } else {
    errors.push(nameValidate.requiredErrorMessage);
  }
  return errors;
};

const validateGenres = (shopData, errors) => {
  const genreValidate = {
    requiredErrorMessage: 'ジャンル選んでください',
  };

  if (Utils.isNil(shopData.genreValue) || shopData.genreValue === '') {
    errors.push(genreValidate.requiredErrorMessage);
  }
  return errors;
};

const validatePostalCode = (shopData, errors) => {
  const postalCodeValidate = {
    requiredErrorMessage: '郵便番号を選択してください',
    maxLength: 10,
    maxLengthErrorMessage: '郵便番号は10文字を超えてはなりません',
  };

  if (!Utils.isNil(shopData.postalCode) && shopData.postalCode.trim() !== '') {
    if (shopData.postalCode.length > postalCodeValidate.maxLength) {
      errors.push(postalCodeValidate.maxLengthErrorMessage);
    }
  } else {
    errors.push(postalCodeValidate.requiredErrorMessage);
  }
  return errors;
};

const validateAddress = (shopData, errors) => {
  const addressValidate = {
    requiredErrorMessage: '住所を入力してください',
    maxLength: 200,
    maxLengthErrorMessage: '住所は200文字を超えることはできません',
  };

  if (!Utils.isNil(shopData.address) && shopData.address.trim() !== '') {
    if (shopData.address.length > addressValidate.maxLength) {
      errors.push(addressValidate.maxLengthErrorMessage);
    }
  } else {
    errors.push(addressValidate.requiredErrorMessage);
  }
  return errors;
};

const validatePhoneNumber = (shopData, errors) => {
  const phoneNumberValidate = {
    requiredErrorMessage: '電話番号を入力してください',
    patternErrorMessage: '電話番号の形式が正しくありません',
    maxLength: 15,
    maxLengthErrorMessage: '電話番号は15文字を超えてはなりません',
  };
  const phoneNumberRegex = /\d+/;

  if (!Utils.isNil(shopData.phoneNumber) && shopData.phoneNumber.trim() !== '') {
    if (shopData.phoneNumber.length > phoneNumberValidate.maxLength) {
      errors.push(phoneNumberValidate.maxLengthErrorMessage);
    }
    if (!phoneNumberRegex.test(shopData.phoneNumber)) {
      errors.push(phoneNumberValidate.patternErrorMessage);
    }
  } else {
    errors.push(phoneNumberValidate.requiredErrorMessage);
  }
  return errors;
};

const validateShopTime = (shopData, errors) => {
  const validationRules = {
    requiredErrorMessage: '営業時間を入力してください',
  };
  const {start_time, end_time} = shopData;
  // start_time is required
  if (!start_time) {
    errors.push(validationRules.requiredErrorMessage);
    return errors;
  }
  // finish_time is required
  if (!end_time) {
    errors.push(validationRules.requiredErrorMessage);
    return errors;
  }

  return errors;
};

const validateWifiName = (shopData, errors) => {
  const validateRules = {
    maxLength: 32,
    maxLengthErrorMessage: 'ネットワック名は最大32文字です',
  };

  if (!Utils.isNil(shopData.wifi_name) && shopData.wifi_name.trim() !== '') {
    if (shopData.wifi_name.length > validateRules.maxLength) {
      errors.push(validateRules.maxLengthErrorMessage);
    }
  }

  return errors;
};

const validateWifiPass = (shopData, errors) => {
  const validateRules = {
    wifiNameRequiredErrorMessage: 'ネットワック名の記入は必要です',
    maxLength: 32,
    maxLengthErrorMessage: 'パスワードは最大32文字です',
  };

  if (!Utils.isNil(shopData.wifi_pass) && shopData.wifi_pass.trim() !== '') {
    if (shopData.wifi_pass.length > validateRules.maxLength) {
      errors.push(validateRules.maxLengthErrorMessage);
    }

    if (Utils.isNil(shopData.wifi_name) || shopData.wifi_name.trim() === '') {
      errors.push(validateRules.wifiNameRequiredErrorMessage);
    }
  }

  return errors;
};

const validateBusinesses = (shopData, errors) => {
  // TODO: translate
  const validationRules = {
    timerErrorMessage: '営業時間帯は営業時間内に設定してください。',
  };
  const {businessHours = [], start_time, end_time} = shopData;
  if (businessHours.length === 0) return errors;
  if (businessHours.length === 1) {
    const {id, name, start_time, finish_time} = businessHours[0];
    // check if not required and not has id and not has data
    if (!id && name.trim() === '' && !start_time && !finish_time) {
      return errors;
    }
  }

  businessHours.forEach((businessData, index) => {
    // validate fields in one of business
    if (index === 0) {
      errors = validateBusinessItem(businessData, errors);
    } else {
      errors = validateBusinessItem(businessData, errors, true);
    }
  });

  // Validate business in shop working time
  if (!validateSuitableTime(businessHours, shopData)) {
    errors.push(validationRules.timerErrorMessage);
  }

  // Validate business overlap
  errors = validateOverlap(businessHours, errors);

  return errors;
};

const validateBusinessItem = (businessData, errors, isRequired = false) => {
  const validationRules = {
    requiredNameErrorMessage: '営業時間帯を入力してください。',
    requiredStartTimeErrorMessage: '開始時間を入力してください。',
    requiredFinishTimeErrorMessage: '終了時間を入力してください。',
    nameMaxLength: 32,
    nameMaxLengthErrorMessage: '営業時間帯名が32文字以内に入力してください。',
    startTimeEqualEndTime: '開始時刻と終了時刻は同じ時刻にはできません。',
  };

  const {id, name, start_time, finish_time} = businessData;
  // check if not required and not has id and not has data
  if (!isRequired && !id && name.trim() === '' && !start_time && !finish_time) {
    return errors;
  }

  // name is required
  if (name.trim() === '') {
    errors.push(validationRules.requiredNameErrorMessage);
    return errors;
  }
  // name is max
  if (name.length > validationRules.nameMaxLength) {
    errors.push(validationRules.nameMaxLengthErrorMessage);
    return errors;
  }

  // start_time is required
  if (!start_time) {
    errors.push(validationRules.requiredStartTimeErrorMessage);
    return errors;
  }
  // finish_time is required
  if (!finish_time) {
    errors.push(validationRules.requiredFinishTimeErrorMessage);
    return errors;
  }

  // finish time = end time
  if (start_time === finish_time) {
    errors.push(validationRules.startTimeEqualEndTime);

    return errors;
  }

  return errors;
};

const validateSNSLink = (shopData, errors) => {
  const validationRules = {
    nameRequiredMessage: 'リンク名が必須です。',
    nameMax: 32,
    nameMaxMessage: 'リンク名が32文字以内に入力してください。',
    descriptionMax: 50,
    descriptionMaxMessage: 'リンク説明は50文字以内に入力してください。',
    linkRequiredMessage: 'リンクが必須です。',
    linkFormatMessage: 'リンクのフォーマットが不正です。',
    linkMax: 500,
    linkMaxMessage: 'リンクは500文字以内に入力してください。',
  };
  shopData.sns_links.forEach(snsLink => {
    const {name, description, link } = snsLink;
    // sns link empty
    if ((!name || name.trim() === '') && (!description || description.trim() === '') && (!link || link.trim() === '')) {
      return;
    }

    // has sns link data
    if (!name || name.trim() === '') {
      errors.push(validationRules.nameRequiredMessage);
      return;
    } else {
      if (name.length > validationRules.nameMax) {
        errors.push(validationRules.nameMaxMessage);
        return;
      }
    }

    if (description && description.length > validationRules.descriptionMax) {
      errors.push(validationRules.descriptionMaxMessage);
      return;
    }

    if (!link || link.trim() === '') {
      errors.push(validationRules.linkRequiredMessage);
      return;
    } else {
      if (link.length > validationRules.linkMax) {
        errors.push(validationRules.linkMaxMessage);
        return;
      }

      // link format
      if (!isValidURL(link)) {
        errors.push(validationRules.linkFormatMessage);
        return;
      }
    }
  });
  return errors;
};

// Instagram validation
const validateInstagramLink = (shopData, errors) => {
  const validationRules = {
    linkRequiredMessage: 'リンクが必須です。',
    linkFormatMessage: 'リンクのフォーマットが不正です。',
    linkMax: 500,
    linkMaxMessage: 'リンクは500文字以内に入力してください。',
    linkInstagramFormatMessage:'正しいインスタグラムのリンクを入力してください',
    commentMax: 50,
    commentMaxMessage: '応援コメントは50文字以内に入力してください。',
    hashTagMax: 100,
    hashTagMaxMessage: 'ハッシュタグは100文字以内に入力してください。',
  };
  shopData.instagram_link.forEach(instaLink => {
    const {name, link, comment, hash_tag} = instaLink;
    // name はinstagram固定なのでチェックしない
    // sns link empty
    if ((!link || link.trim() === '') && (!comment || comment.trim() === '') && (!hash_tag || hash_tag.trim() === '')) {
      return;
    }

    if (comment && comment.length > validationRules.commentMax) {
      errors.push(validationRules.commentMaxMessage);
      return;
    }

    if (hash_tag && hash_tag.length > validationRules.hashTagMax) {
      errors.push(validationRules.hashTagMaxMessage);
      return;
    }

    if (!link || link.trim() === '') {
      errors.push(validationRules.linkRequiredMessage);
      return;
    } else {
      if (link.length > validationRules.linkMax) {
        errors.push(validationRules.linkMaxMessage);
        return;
      }

      // instagram URLの場合のバリデーション
      if(!isValidInstagramURL(link)) {
        errors.push(validationRules.linkInstagramFormatMessage);
        return;
      }
    }
  });
  return errors;
};

const validateSuitableTime = (businesses, shopData) => {
  const shopStartTime = new Date(`${FIRST_DATE} ${shopData.start_time}`);
  const shopFinishTime = getFinishDate(shopData.start_time, shopData.end_time);

  let result = businesses.filter(businessTmp => {
    let businessStartTime = new Date(`${FIRST_DATE} ${businessTmp.start_time}`);
    let businessFinishTime = getFinishDate(businessTmp.start_time, businessTmp.finish_time);

    // Start and finish time are all in NEXT_FIRST_DATE
    if ((businessStartTime < shopStartTime) && (businessFinishTime < shopStartTime)) {
      businessStartTime = new Date(`${NEXT_FIRST_DATE} ${businessTmp.start_time}`);
      businessFinishTime = new Date(`${NEXT_FIRST_DATE} ${businessTmp.finish_time}`);
    }

    return (businessStartTime < shopStartTime || businessStartTime > shopFinishTime
      || businessFinishTime < shopStartTime || businessFinishTime > shopFinishTime);
  })

  if (result?.length) return false;

  return true;
}

const validateOverlap = (businesses, errors) => {
  const validationRules = {
    overlapErrorMessage: '重複の営業時間帯を選択しないでください。',
  };
  const businessesLength = businesses.length;

  if (businessesLength <= 1) return errors;

  for (let index1 = 0; index1 < businessesLength - 1; index1++) {
    for (let index2 = index1 + 1; index2 < businessesLength; index2++) {
      if (checkTwoBusinessesIsOverlap(businesses[index1], businesses[index2])) {
        errors.push(validationRules.overlapErrorMessage);

        return errors;
      }
    }
  }

  return errors;
}

const checkTwoBusinessesIsOverlap = (firstBusiness, secondBusiness) => {
  const firstStartTime = new Date(`${FIRST_DATE} ${firstBusiness.start_time}`);
  const firstFinishTime = new Date(`${FIRST_DATE} ${firstBusiness.finish_time}`);
  const secondStartTime = new Date(`${FIRST_DATE} ${secondBusiness.start_time}`);
  const secondFinishTime = new Date(`${FIRST_DATE} ${secondBusiness.finish_time}`);

  if (firstStartTime < firstFinishTime && secondStartTime < secondFinishTime) {
    // Two businesses end in a day
    return (firstStartTime <= secondStartTime && secondStartTime < firstFinishTime) // b starts in a
      || (firstStartTime < secondFinishTime && secondFinishTime <= firstFinishTime) // b ends in a
      || (secondStartTime <= firstStartTime && firstFinishTime <= secondFinishTime) // a in b
      || (firstStartTime <= secondStartTime && secondFinishTime <= firstFinishTime); // b in a
  } else if (firstStartTime > firstFinishTime && secondStartTime < secondFinishTime) {
    // First business overnight, second business end in a day
    return secondStartTime >= firstStartTime // b starts in a
      || secondFinishTime > firstStartTime // b ends in a
      || secondStartTime < firstFinishTime // b starts in a
      || secondFinishTime <= firstFinishTime; // b ends in a
  } else if (secondStartTime > secondFinishTime && firstStartTime < firstFinishTime) {
    // Second business overnight, first business end in a day
    return firstStartTime >= secondStartTime // a starts in b
      || firstFinishTime > secondStartTime // a ends in b
      || firstStartTime < secondFinishTime // a start in b
      || firstFinishTime <= secondFinishTime; // a ends in b
  } else {
    // Two businesses overnight
    return true;
  }
}

const getFinishDate = (startTime, finishTime) => {
  const startDate = new Date(`${FIRST_DATE} ${startTime}`);
  let finishDate = new Date(`${FIRST_DATE} ${finishTime}`);
  if (finishDate < startDate) {
    finishDate = new Date(`${NEXT_FIRST_DATE} ${finishTime}`);
  }

  return finishDate;
}

const isValidURL = (string) => {
  let res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

  return (res !== null);
};

const isValidInstagramURL = (string) => {
  let res = string.match(/(http(s)?:\/\/.)?(www\.)?instagram\.com\/(?!\.)[\w.]+\/$/g);
  return (res !== null);
};


export {
  checkValidation
};
