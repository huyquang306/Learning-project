export const phoneNumberFormat = (phoneNumber = '') => {
  let match = phoneNumber.match(/^(\d{3})(\d{4})(\d{4})(\d)?$/);

  return match && match.length >= 3
    ? `${match[1]}-${match[2]}-${match[3]}${match[4] || ''}` : phoneNumber;
};

export const hideMiddlePhoneNumber = (phoneNumber = '') => {
  let match = phoneNumber.match(/^(\d{3})(\d{4})(\d{4})(\d)?$/);
  if (match) {
    return match && match.length >= 3
      ? `${match[1]}-${match[2]}-${match[3]}${match[4] || ''}` : phoneNumber;
  }

  let plusMatch = phoneNumber.match(/^\+81(\d{2})(\d{4})(\d{4})(\d)?$/);

  return plusMatch && plusMatch.length >= 3
    ? `0${plusMatch[1]}-****-${plusMatch[3]}${plusMatch[4] || ''}` : phoneNumber;
}
