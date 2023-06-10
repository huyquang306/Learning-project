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
    requiredErrorMessage: 'Vui lòng nhập tên cửa hàng',
    maxLength: 100,
    maxLengthErrorMessage: 'Tên cửa hàng không được vượt quá 100 ký tự',
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
    requiredErrorMessage: 'Vui lòng chọn một thể loại',
  };

  if (Utils.isNil(shopData.genreValue) || shopData.genreValue === '') {
    errors.push(genreValidate.requiredErrorMessage);
  }
  return errors;
};

const validatePostalCode = (shopData, errors) => {
  const postalCodeValidate = {
    requiredErrorMessage: 'Vui lòng chọn một mã bưu chính',
    maxLength: 10,
    maxLengthErrorMessage: 'Mã zip không được vượt quá 10 ký tự',
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
    requiredErrorMessage: 'Vui lòng nhập địa chỉ của bạn',
    maxLength: 200,
    maxLengthErrorMessage: 'Địa chỉ không được vượt quá 200 ký tự',
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
    requiredErrorMessage: 'Vui lòng nhập số điện thoại của bạn',
    patternErrorMessage: 'Số điện thoại không đúng định dạng',
    maxLength: 12,
    maxLengthErrorMessage: 'Số điện thoại không được vượt quá 12 ký tự',
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
    requiredErrorMessage: 'Vui lòng nhập giờ làm việc',
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
    maxLengthErrorMessage: 'Tên wifi không thể vượt quá 32 ký tự',
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
    wifiNameRequiredErrorMessage: 'vui lòng nhập mật khẩu wifi',
    maxLength: 32,
    maxLengthErrorMessage: 'Mật khẩu wifi không thể vượt quá 32 ký tự',
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
    timerErrorMessage: 'Vui lòng đặt khung giờ làm việc trong thời gian mở cửa',
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
    requiredNameErrorMessage: 'Vui lòng nhập khung giờ làm việc',
    requiredStartTimeErrorMessage: 'Vui lòng nhập thời gian bắt đầu',
    requiredFinishTimeErrorMessage: 'Vui lòng nhập thời gian kết thúc',
    nameMaxLength: 50,
    nameMaxLengthErrorMessage: 'Tên khung giờ không thể vượt quá 50 ký tự',
    startTimeEqualEndTime: 'Thời gian bắt đầu và thời gian kết thúc không được trùng nhau',
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
    nameRequiredMessage: 'Vui lòng nhập tên liên kết',
    nameMax: 50,
    nameMaxMessage: 'Tên liên kết không thể vượt quá 50 kí tự',
    descriptionMax: 50,
    descriptionMaxMessage: 'Mô tả liên kết không thể vượt quá 50 kí tự',
    linkRequiredMessage: 'Vui lòng nhập link liên kết',
    linkFormatMessage: 'Định dạng liên kết không hợp lệ.',
    linkMax: 500,
    linkMaxMessage: 'Link không thể vượt quá 500 kí tự',
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
    linkRequiredMessage: 'Vui lòng nhập link liên kết',
    linkFormatMessage: 'Định dạng liên kết không hợp lệ',
    linkMax: 500,
    linkMaxMessage: 'Liên kết không được vượt quá 500 ký tự.',
    linkInstagramFormatMessage:'Vui lòng nhập đúng liên kết Instagram',
    commentMax: 50,
    commentMaxMessage: 'Mô tả không được vượt quá 50 ký tự',
    hashTagMax: 100,
    hashTagMaxMessage: 'Hashtag không được vượt quá 100 kí tự',
  };
  shopData.instagram_link.forEach(instaLink => {
    const {name, link, comment, hash_tag} = instaLink;
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
    overlapErrorMessage: 'Không chọn khung giờ trùng nhau',
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
