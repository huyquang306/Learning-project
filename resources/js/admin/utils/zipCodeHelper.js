export const getFormatZipCode = (zipCode) => {
  if (!zipCode || zipCode.length < 3) {
    return zipCode;
  }

  return `〒${zipCode.substr(0,3)}-${zipCode.substr(3)}`;
};
