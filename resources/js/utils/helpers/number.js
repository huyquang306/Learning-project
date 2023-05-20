export const currencyFormat = (number) => number
  .toString()
  .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');