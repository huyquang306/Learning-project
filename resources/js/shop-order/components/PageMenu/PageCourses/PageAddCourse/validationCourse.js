import Utils from 'js/shared/utils';
import { BLOCK_STATUS_ACTIVE } from 'js/utils/helpers/courseHelper';

const DEFAULT_END_TIME = 5;

const checkCourseValidation = (course, isUpdateMenu = false, shop = {}) => {
  let errors = [];
  const blockCoursePriceExisted = course?.list_course_prices.filter(
    (item) => item.status === BLOCK_STATUS_ACTIVE
  )[0]?.tax_value;
  const childCoursePriceExisted = course?.list_child_courses[0]?.list_course_prices[0]?.tax_value;
  if (
    !childCoursePriceExisted &&
    !course?.list_child_courses[0]?.time_block_unit &&
    !course.alert_notification_time &&
    !blockCoursePriceExisted &&
    isUpdateMenu
  ) {
    errors.push('基本情報を入力してください。');
  } else {
    errors = validateName(course, errors);
    errors = validateTimeBlockUnit(course, errors);
    errors = validateCoursePrice(course, errors);
    errors = validateCoursePriceFirstItem(course, errors);
    errors = validateExtendTimeBlock(course, errors);
    errors = validateExtendUnitPrice(course, errors);
    errors = validateAlertNotificationTime(course, errors);
    errors = validateStartTimeEndTimeInBlock(course, errors, shop);
    errors = validateTimeInBlockOverlap(course, errors);
  }
  return errors;
};

const validateName = (courseData, errors) => {
  const validate = {
    requiredErrorMessage: 'コース名は必須です',
    maxLength: 50,
    maxLengthErrorMessage: 'コース名は最大50文字です',
  };

  if (!Utils.isNil(courseData.name) && courseData.name.trim() !== '') {
    if (courseData.name.length > validate.maxLength) {
      errors.push(validate.maxLengthErrorMessage);
    }
  } else {
    errors.push(validate.requiredErrorMessage);
  }

  return errors;
};

const validateTimeBlockUnit = (courseData, errors) => {
  const minTimeBlockUnit = courseData.alert_notification_time
    ? courseData.alert_notification_time
    : DEFAULT_END_TIME;
  const validate = {
    requiredErrorMessage: 'タイムブロック単位 は必須です',
    max: 1000,
    maxErrorMessage: '1000より小さいのは必要です',
    min: minTimeBlockUnit,
    minErrorMessage: `コース設定時間は${minTimeBlockUnit}より大きで`,
  };

  if (!Utils.isNil(courseData.time_block_unit)) {
    if (parseInt(courseData.time_block_unit) >= validate.max) {
      errors.push(validate.maxErrorMessage);
    } else if (parseInt(courseData.time_block_unit) <= validate.min) {
      errors.push(validate.minErrorMessage);
    }
  } else {
    errors.push(validate.requiredErrorMessage);
  }

  return errors;
};

const validateCoursePrice = (courseData, errors) => {
  const validate = {
    requiredErrorMessage: '単価は必須です',
    requiredPriceUnitMessage: '受付可能時間の単価の記入が必要です',
    requiredUnitPriceMessage: '単価の記入が必要です',
    priceUnitMax: 100000,
    priceUnitMaxErrorMessage: '単価は0より大きで、100000より小さいのは必要です',
    priceUnitMin: 0,
    priceUnitMinErrorMessage: '単価は0より大きで、100000より小さいのは必要です',
    timeRegex: '/^((([0-1][0-9]|2[0-3]):([0-5][0-9])))$/',
    timeRegexErrorMessage: '時間はHH：MM でなければなりません',
    timeFinishIsEqualTimeStart: '開始時刻と終了時刻は同じ時刻にはできません',
    timeFormatErrorMessage: '時間はHH：MM でなければなりません',
    startAndFinishTimeRequiredMessage: '利用中の基本料金が少なくとも１つ必要です。',
  };
  courseData.list_course_prices.forEach((time_block) => {
    if (time_block.status === BLOCK_STATUS_ACTIVE) {
      // validate block_time_start or block_time_finish required
      if (
        Utils.isNil(time_block.block_time_start) ||
        time_block.block_time_start.trim() === '' ||
        Utils.isNil(time_block.block_time_finish) ||
        time_block.block_time_finish.trim() === ''
      ) {
        errors.push(validate.startAndFinishTimeRequiredMessage);
        return errors;
      }

      // validate block_time_start, block_time_finish format
      if (
        !checkTimeFormatHourSecond(time_block.block_time_start) ||
        !checkTimeFormatHourSecond(time_block.block_time_finish)
      ) {
        errors.push(validate.timeFormatErrorMessage);

        return errors;
      }

      // validate block_time_start = block_time_finish
      if (time_block.block_time_start === time_block.block_time_finish) {
        errors.push(validate.timeFinishIsEqualTimeStart);

        return errors;
      }

      // validate unit_price required
      if (time_block.unit_price === '') {
        errors.push(validate.requiredUnitPriceMessage);

        return errors;
      }

      if (time_block.unit_price === '') {
        errors.push(validate.requiredPriceUnitMessage);

        return errors;
      }

      // validate unit_price
      if (parseInt(time_block.unit_price) >= validate.priceUnitMax) {
        errors.push(validate.priceUnitMaxErrorMessage);
      } else if (parseInt(time_block.unit_price) <= validate.priceUnitMin) {
        errors.push(validate.priceUnitMinErrorMessage);
      }
    }
  });

  return errors;
};

const validateCoursePriceFirstItem = (courseData, errors) => {
  const validate = {
    requiredErrorMessage: '利用中の基本料金が少なくとも１つ必要です。',
  };

  let activeStatusTimeBlock = courseData.list_course_prices.find(
    (time_block) => time_block.status === BLOCK_STATUS_ACTIVE
  );

  if (activeStatusTimeBlock) {
    return errors;
  }
  errors.push(validate.requiredErrorMessage);

  return errors;
};

const validateExtendTimeBlock = (courseData, errors) => {
  const validate = {
    max: 1000,
    maxErrorMessage: '延長時間は0より大きで、1000より小さいのは必要です',
    min: 0,
    minErrorMessage: '延長時間は0より大きで、1000より小さいのは必要です',
    extendUnitPriceNullError: '延長時間の単価の記入が必要です',
  };

  courseData.list_child_courses.forEach((childCourse) => {
    if (childCourse.time_block_unit) {
      if (parseInt(childCourse.time_block_unit) >= validate.max) {
        errors.push(validate.maxErrorMessage);
      } else if (parseInt(childCourse.time_block_unit) <= validate.min) {
        errors.push(validate.minErrorMessage);
      }

      if (!childCourse.list_course_prices[0].unit_price) {
        errors.push(validate.extendUnitPriceNullError);
      }
    }
  });

  return errors;
};

const validateExtendUnitPrice = (courseData, errors) => {
  const validate = {
    max: 100000,
    maxErrorMessage: '延長時間単価は0より大きで、100000より小さいのは必要です',
    min: 0,
    minErrorMessage: '延長時間単価は0より大きで、100000より小さいのは必要です',
    extendTimeBlockNullError: '延長時間の記入が必要です',
  };

  courseData.list_child_courses.forEach((childCourse) => {
    if (childCourse.list_course_prices[0].unit_price) {
      if (parseInt(childCourse.list_course_prices[0].unit_price) >= validate.max) {
        errors.push(validate.maxErrorMessage);
      } else if (parseInt(childCourse.list_course_prices[0].unit_price) <= validate.min) {
        errors.push(validate.minErrorMessage);
      }

      if (!childCourse.time_block_unit) {
        errors.push(validate.extendTimeBlockNullError);
      }
    }
  });

  return errors;
};

const validateAlertNotificationTime = (courseData, errors) => {
  const validate = {
    max: 1000,
    maxErrorMessage: `アーラム通知時間は${DEFAULT_END_TIME + 1}分以上で設定してください`,
    min: DEFAULT_END_TIME,
    minErrorMessage: `アーラム通知時間は${DEFAULT_END_TIME + 1}分以上で設定してください`,
    alertTimeMoreThanTimeBlockUnit:
      'アラート通知時間は、コース時間単位よりも短くする必要があります',
  };

  if (courseData.alert_notification_time) {
    if (parseInt(courseData.alert_notification_time) >= validate.max) {
      errors.push(validate.maxErrorMessage);
    } else if (parseInt(courseData.alert_notification_time) <= validate.min) {
      errors.push(validate.minErrorMessage);
    }

    if (parseInt(courseData.alert_notification_time) > parseInt(courseData.time_block_unit)) {
      errors.push(validate.alertTimeMoreThanTimeBlockUnit);
    }
  }

  return errors;
};

const validateTimeInBlockOverlap = (courseData, errors) => {
  const validate = {
    overlapErrorMessage: '受付可能時間は重複してはなりません',
  };

  let activeBlocks = courseData.list_course_prices.filter(
    (time_block) => time_block.status === BLOCK_STATUS_ACTIVE
  );
  // pass if only has one active block
  if (activeBlocks.length <= 1) {
    return errors;
  }

  // if has more than one active block
  let activeBlocksLength = activeBlocks.length;
  // loop item index from 0 -> 1 because has max is 3 item blocks
  for (let index1 = 0; index1 < activeBlocksLength - 1; index1++) {
    // loop item from 1 -> 2
    for (let index2 = index1 + 1; index2 < activeBlocksLength; index2++) {
      if (checkTwoTimeBlockIsOverlap(activeBlocks[index1], activeBlocks[index2])) {
        errors.push(validate.overlapErrorMessage);

        return errors;
      }
    }
  }

  return errors;
};

const checkTwoTimeBlockIsOverlap = (firstBlock, secondBlock) => {
  const firstBlockTimeStart = new Date('1/1/1999 ' + firstBlock.block_time_start);
  const firstBlockTimeFinish = new Date('1/1/1999 ' + firstBlock.block_time_finish);
  const secondBlockTimeStart = new Date('1/1/1999 ' + secondBlock.block_time_start);
  const secondBlockTimeFinish = new Date('1/1/1999 ' + secondBlock.block_time_finish);

  if (firstBlockTimeStart < firstBlockTimeFinish && secondBlockTimeStart < secondBlockTimeFinish) {
    // Two courses end in a day
    return (
      (firstBlockTimeStart <= secondBlockTimeStart &&
        secondBlockTimeStart < firstBlockTimeFinish) || // b starts in a
      (firstBlockTimeStart < secondBlockTimeFinish &&
        secondBlockTimeFinish <= firstBlockTimeFinish) || // b ends in a
      (secondBlockTimeStart <= firstBlockTimeStart &&
        firstBlockTimeFinish <= secondBlockTimeFinish) || // a in b
      (firstBlockTimeStart <= secondBlockTimeStart && secondBlockTimeFinish <= firstBlockTimeFinish)
    ); // b in a
  } else if (
    firstBlockTimeStart > firstBlockTimeFinish &&
    secondBlockTimeStart < secondBlockTimeFinish
  ) {
    // First course overnight, second course end in a day
    return (
      secondBlockTimeStart >= firstBlockTimeStart || // b starts in a
      secondBlockTimeFinish > firstBlockTimeStart || // b ends in a
      secondBlockTimeStart < firstBlockTimeFinish || // b starts in a
      secondBlockTimeFinish <= firstBlockTimeFinish
    ); // b ends in a
  } else if (
    secondBlockTimeStart > secondBlockTimeFinish &&
    firstBlockTimeStart < firstBlockTimeFinish
  ) {
    // Second course overnight, first course end in a day
    return (
      firstBlockTimeStart >= secondBlockTimeStart || // a starts in b
      firstBlockTimeFinish > secondBlockTimeStart || // a ends in b
      firstBlockTimeStart < secondBlockTimeFinish || // a start in b
      firstBlockTimeFinish <= secondBlockTimeFinish
    ); // a ends in b
  } else {
    // Two course overnight
    return true;
  }
};

const validateStartTimeEndTimeInBlock = (courseData, errors, shop) => {
  const validate = {
    timeStartAfterTimeFinish: '終了時刻は開始時刻より後でなければなりません',
  };
  const shopStartTime = shop?.start_time ? new Date('1/1/1999 ' + shop.start_time) : null;
  const shopEndTime = shop?.end_time ? new Date('1/1/1999 ' + shop.end_time) : null;

  if (shopStartTime < shopEndTime) {
    // Shop open in a workday
    courseData.list_course_prices.forEach((timeBlock) => {
      if (timeBlock.status === BLOCK_STATUS_ACTIVE) {
        const blockStartTime = new Date('1/1/1999 ' + timeBlock.block_time_start);
        const blockFinishTime = new Date('1/1/1999 ' + timeBlock.block_time_finish);

        // Validate finish time after start time
        if (blockStartTime > blockFinishTime) {
          errors.push(validate.timeStartAfterTimeFinish);
        }
      }
    });
  } else {
    // Shop open overnight
    courseData.list_course_prices.forEach((timeBlock) => {
      if (timeBlock.status === BLOCK_STATUS_ACTIVE) {
        const blockStartTime = new Date('1/1/1999 ' + timeBlock.block_time_start);
        const blockFinishTime = new Date('1/1/1999 ' + timeBlock.block_time_finish);

        // Validate finish time after start time
        if (
          (blockStartTime > shopStartTime && blockFinishTime > shopStartTime) || // Block starts and ends before 0h
          (blockStartTime < shopEndTime && blockFinishTime < shopEndTime) // Block starts and ends after 0h
        ) {
          if (blockStartTime > blockFinishTime) {
            errors.push(validate.timeStartAfterTimeFinish);
          }
        }
      }
    });
  }

  return errors;
};

const validateTimeInBlockOverWorkTime = (courseData, errors, shop) => {
  const validate = {
    overWorkTimeErrorMessage: '受付可能時間は営業時間内に設定して下さい',
  };

  let activeBlocks = courseData.list_course_prices.filter(
    (coursePrice) => coursePrice.status === BLOCK_STATUS_ACTIVE
  );
  let reduceTime = {
    block_time_start: null,
    block_time_finish: null,
  };
  if (!Utils.isEmpty(activeBlocks)) {
    activeBlocks.forEach((item, index) => {
      if (index === 0) {
        reduceTime.block_time_start = item.block_time_start;
        reduceTime.block_time_finish = item.block_time_finish;
        return;
      }
      if (reduceTime.block_time_start >= item.block_time_start) {
        reduceTime.block_time_start = item.block_time_start;
      }
      if (reduceTime.block_time_finish <= item.block_time_finish) {
        reduceTime.block_time_finish = item.block_time_finish;
      }
    });

    let startTime = shop?.start_time ? new Date('1/1/1999 ' + shop.start_time) : null;
    let endTime = shop?.end_time ? new Date('1/1/1999 ' + shop.end_time) : null;
    let blockTimeStart = new Date('1/1/1999 ' + reduceTime.block_time_start);
    let blockTimeFinish = new Date('1/1/1999 ' + reduceTime.block_time_finish);
    if ((startTime && blockTimeStart < startTime) || (endTime && blockTimeFinish > endTime)) {
      errors.push(validate.overWorkTimeErrorMessage);
    }
  }

  return errors;
};

const TIME_REGEX = /^((([0-1][0-9]|2[0-3]):([0-5][0-9])))$/;
const checkTimeFormatHourSecond = (time) => {
  return TIME_REGEX.test(time);
};

export { checkCourseValidation };
