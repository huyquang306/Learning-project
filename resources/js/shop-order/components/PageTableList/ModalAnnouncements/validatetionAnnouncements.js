import Utils from 'js/shared/utils';

const checkValidation = (announcementsData) => {
  let errors = [];
  errors = validateAnnouncements(announcementsData, errors);

  return errors;
}

const validateAnnouncements = (announcementsData, errors) => {
  announcementsData.forEach(announcement => {
    errors = validateAnnouncement(announcement, errors);
  });

  return errors;
};

const validateAnnouncement = (announcement, errors) => {
  const validateRules = {
    requiredErrorMessage: 'お知らせ内容を入力してください。',
    maxLength: 100,
    maxLengthErrorMessage: 'お知らせ内容は100文字以内に入力してください。',
  };

  if (!Utils.isNil(announcement.content) && announcement.content.trim() !== '') {
    if (announcement.content.length > validateRules.maxLength) {
      errors.push(validateRules.maxLengthErrorMessage);
    }
  } else {
    errors.push(validateRules.requiredErrorMessage);
  }

  return errors;
}

export {
  checkValidation
};
