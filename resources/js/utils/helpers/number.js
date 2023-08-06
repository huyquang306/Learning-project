export const currencyFormat = (number) => number
  .toString()
  .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');

export const formatPrice =  (number) => {
  if (number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  return 0;
};