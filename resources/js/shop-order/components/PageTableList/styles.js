import { makeStyles } from '@material-ui/core/styles';

const useStylesPageTableList = makeStyles(() => ({
  '@global': {
    'body': {
      backgroundColor: '#E0E0E0'
    },
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    height: 'calc(100vh - 64px)',
    overflow: 'hidden',
  },
  buttonHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    cursor: 'pointer',
    backgroundColor: '#fff',
    boxShadow: 'rgb(0 0 0 / 37%) 0px 2px 1px 0px',
    color: '#000 !important',
    fontSize: '16px !important',
    padding: '5px',
    borderRadius: '5px',
    '&:hover': {
      textDecoration: 'none',
    },
    ['@media (max-width: 960px)']: {
      '& span': {
        display: 'none'
      },
      borderRadius: '50%'
    },
  },
  content: {
    flex: '0 0 calc(100vw - 360px)',
    padding: '10px 15px',
    overflow: 'scroll',
    position: 'relative',
    '&.not-scroll': {
      overflowY: 'hidden',
    },

    ['@media (max-width: 768px)']: {
      flex: '0 0 100vw',
    }
  },
  contentTable: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '-10px',
    marginRight: '-10px',
  },
  sideBar: {
    flex: '0 0 360px',
    padding: '10px 12px',
    backgroundColor: '#fff',
    transition: 'all .1s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '-webkit-fill-available',
    maxHeight: '-webkit-fill-available',
    ['@media (max-width: 768px)']: {
      position: 'fixed',
      left: '100%',
      flex: 0,
      width: 320,
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
      borderLeft: '1px solid black',
      borderRadius: '10px 0 0 10px',
    }
  },
  button: {
    borderRadius: '12px',
    backgroundColor: '#FFA04B',
    padding: '8px 18px',
    fontSize: '24px',
    color: '#F2F2F2',
    width: '100%',
    fontWeight: 700,
    border: '1px solid #908b8b',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px !important',
    '&.active': {
      border: '1px solid #FFA04B',
    },
    ['@media (max-width: 960px)']: {
      '&:hover': {
        backgroundColor: '#FFA04B'
      },
    },
    '&.buttonChangeOrder': {
      backgroundColor: '#9dc755',
      border: '1px solid #9dc755',
      '&:hover': {
        background: '#d5d5d5',
      },
      '&:disabled': {
        background: '#d5d5d5',
        border: '1px solid #908b8b'
      }
    }
  },
  info: {
    backgroundColor: '#F2F2F2',
    padding: '5px',
    marginTop: '15px',
    flex: 1,
  },
  infoContent: {
    margin: '25px 0px 15px 10px',
  },
  infoDetail: {
    height: '36px',
    lineHeight: '16px',
    color: '#415B6E',
    marginTop: '15px',
    fontSize: '16px',
    fontWeight: '600',
    '& span': {
      fontSize: '24px',
    },
  },
  infoPrice: {
    margin: '20px 10px',
  },
  infoPriceDetail: {
    fontSize: '20px',
  },

  tableInfo: {
    backgroundColor: '#F2F2F2',
    padding: '5px',
    marginTop: '5px',
  },
  tableInfoContent: {
    marginTop: '10px',
  },
  tableInfoDetail: {
    height: '36px',
    lineHeight: '16px',
    color: '#000000',
    fontSize: '16px',
    fontWeight: '600',
  },
  headerText: {
    display: 'flex',
    alignItems: 'center',
    flex: '0 1 60%'
  },
  tableInfoRightButton: {
    color: '#FFA04B',
    padding: '8px 20px',
    border: '1px solid #908b8b',
    borderRadius: '5px',
    backgroundColor: '#FFF',
    fontSize: '16px',
    whiteSpace: 'nowrap',
    '&.active': {
      border: '1px solid #FFA04B',
    },
    ['@media (max-width: 960px)']: {
      '&:hover': {
        backgroundColor: '#FFF'
      },
    }
  },
  orderGroupDetail: {
    height: 'calc(100vh - 410px)',
    marginTop: '10px',
    overflowY: 'auto',
    ['@media (max-width: 1024px)']: {
      height: 'calc(100vh - 490px)'
    },
  },
  buttonPayment: {
    margin: '50px 0px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '3px 5px 3px 0px',
  },
  menuItemRight: {
    display: 'grid',
    gridTemplateColumns: '15% 85%',
    alignItems: 'center',
    flex: '0 1 65%',
  },
  orderInfo: {
    display: 'flex',
    flex: '0 1 32%',
    justifyContent: 'space-between',
  },
  quantityItem: {
    textAlign: 'right',
  },
  amountItem: {
    textAlign: 'right',
  },
  labelStatus: {
    width: '22px',
    height: '22px',
    textAlign: 'center',
    backgroundColor: '#FDFDFD',
    borderRadius: '50%',
    border: '1px solid #000',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10px',
    lineHeight: '22px',

    '& span': {
      marginTop: '2px',
    },
    '&.preparing': {
      backgroundColor: '#FFA04B',
      color: '#FFFFFF',
      border: '1px solid #FFA04B',
    },
    '&.finished': {
      backgroundColor: '#05f244',
      color: '#FFFFFF',
      border: '1px solid #FFFFFF',
    },
    '&.cancelled': {
      backgroundColor: '#f22105',
      color: '#FFFFFF',
      border: '1px solid #FFFFFF',
    },
  },
  orderName: {
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
  },
  showMenu: {
    margin: '0 -15px 0 0',
    background: 'white',
    fontSize: 18,
    padding: '5px 15px',
    alignItems: 'center',
    fontWeight: 600,
    borderTop: '1px solid black',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderRadius: '10px 0 0 10px',
    display: 'none',
    cursor: 'pointer',
    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    '&.redText': {
      color: 'red',
      border: '1px solid red'
    },

    ['@media (max-width: 768px)']: {
      display: 'flex',
    }
  },
  boxShowSideBar: {
    width: 'fit-content',
    marginLeft: 'auto',
    display: 'flex',
    justifyContent: 'right',
  },
  hiddenMenu: {
    display: 'none',
    fontSize: 18,
    fontWeight: 600,

    ['@media (max-width: 768px)']: {
      display: 'block',
      cursor: 'pointer',
    }
  },
  menuMobile: {
    left: 'calc(100% - 320px)',
  },
  shopInfo: {
    display: 'flex',
    alignItems: 'center',
    ['@media (max-width: 600px)']: {
      flexDirection: 'column',
      margin: '5px 0px'
    }
  },
  shopName: {
    ['@media (max-width: 500px)']: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'inline-block',
      maxWidth: '100%',
      fontSize: '15px',
    },
  },
  planName: {
    marginLeft: '10px',
    minWidth: '100px',
    backgroundColor: '#fff',
    color: '#6C4AF2',
    padding: '4px 10px',
    borderRadius: '5px',
    border: '1px solid #6C4AF2',
    fontSize: 16,
    fontWeight: 'bold',
    boxShadow: 'rgb(0 0 0 / 37%) 0px 2px 1px 0px',
    whiteSpace: 'nowrap',
    ['@media (max-width: 500px)']: {
      fontSize: '15px',
      padding: '0px 10px',
    },
  },
  buttonDropDown: {
    position: 'relative',
    '& button': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: 'none',
      backgroundColor: '#fff',
      boxShadow: 'rgba(0, 0, 0, 0.3) 1px 2px 1px 0px',
      borderRadius: '5px',
      padding: '5px',
      cursor: 'pointer',
    },
    ['@media (max-width: 960px)']: {
      '& span': {
        display: 'none'
      },
      '& button': {
        borderRadius: '50%'
      },
    },
  },
  dropdown: {
    position: 'absolute',
    top: 35,
    right: 0,
    zIndex: 1,
    border: '1px solid',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '5px',
    width: '200px',
    textAlign: 'left'
  },
  dropdownItem: {
    padding: '5px',
    '&:first-child': {
      borderBottom: '1px solid black'
    }
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'right',
    fontSize: '16px'
  },
  linkContact: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px !important',
    color: '#000 !important',
    '& img': {
      width: '15px',
      height: '24px'
    },
  },
  iconArrow: {
    width: '24px',
    height: '24px',
    display: 'flex',
    justifyContent: 'center'
  },
  paymentInfo: {
    position: 'absolute',
    bottom: '35px !important',
    width: '97%',
    borderTop: '1px solid #908b8b',
    background: '#F2F2F2',
    ['@media (max-width: 2000px)']: {
      bottom: '70px !important',
    },
    ['@media (max-width: 1200px)']: {
      bottom: '55px !important',
    },
    ['@media (max-width: 820px)']: {
      bottom: '70px !important',
    },
  },
  borderTopGroupOrder: {
    borderTop: '1px solid #908b8b',
    paddingBottom: 100,
    ['@media (max-width: 1200px)']: {
      paddingBottom: 50,
    }
  },
  roundBorder: {
    borderRadius: '50% !important'
  }
}));

const useStylesOrderManager = makeStyles(() => ({
  container: {
    ['@media (max-width: 600px)']: {
      position: 'relative',
    },
  },
  modalOrderContent: {
    overflow: 'hidden',
  },
  modalContent: {
    height: 'inherit',
    overflow: 'hidden',
  },
  contentLeft: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '1px',
    ['@media (max-width: 600px)']: {
      maxHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
    },
  },
  contentRight: {
    paddingLeft: '1px',
  },
  sideBarCategory: {
    padding: '7px 0px',
    
    background: '#f7dcc3'
  },
  breakLine:{
    height:1,
    border: '1px solid #BDBDBD',
    width: '98%',
    '&.breakLine': {
      border: '1.5px solid #ffa04b',
      background: '#ffa04b'
    }
  },
  subCategory: {
    display: 'flex',
    height: '100%',
    ['@media (max-width: 600px)']: {
      height: 'calc(100% - 46px)',
      overflow: 'hidden'
    }
  },
  headerRight: {
    width: '100%',
    backgroundColor: '#BDBDBD',
    color: '#000000',
    fontWeight: 600,
    fontSize: '24px',
    margin: '0px auto',
    textAlign: 'center',
    ['@media (max-width: 600px)']: {
      width: '100%',
    },
  },
  itemSubCategory: {
    display: 'flex',
    width: '100%',
  },
  subCategoryLeft: {
    flex: '0 0 102px',
    borderRight: '1px solid #BDBDBD',
    height: '100%',
    overflow: 'auto',
    '& ul': {
      minHeight: '100px',
      overflowY: 'scroll',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      '& li': {
        color: '#000000',
        fontSize: '12px',
        lineHeight: '16px',
        alignItems: 'center',
        padding: '12px 4px',
        '&:nth-child(odd)': {
          backgroundColor: '#C4C4C4',
        },
        '&:nth-child(even)': {
          backgroundColor: '#E0E0E0',
        },
        '&.active': {
          backgroundColor: '#FFA04B',
        },
      },
    },
  },
  subCategoryRight: {
    flex: 1,
    margin: '5px 0px 10px 10px',
    ['@media (max-width: 600px)']: {
      overflowY: 'scroll',
      overflowX: 'hidden',
    }
  },
  buttonChildrenCategory: {
    fontSize: '12px',
    lineHeight: '12px',
    color: '#000000',
    fontWeight: 600,
    backgroundColor: '#FFF',
    padding: '12px',
    height: 90,
    position: 'relative',
    minWidth: '50px',
    width: '90%',
    wordBreak: 'break-word',
    border: '2px solid rgb(134, 190, 39)',
    marginTop: 16,
    textTransform: 'none',
    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    ['@media (max-width: 600px)']: {
      overflow: 'hidden',
      display: 'block',
      padding: '5px',
    },
  },
  menu: {
    overflow: 'scroll',
    height: '325px',
  },
  itemMenu: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #BDBDBD',
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  itemMenuLeft: {
    flex: 1,
    display: 'flex',
  },
  menuStatus: {
    width: '30px',
    '& span': {
      width: '15px',
      height: '15px',
      display: 'block',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 0, 0, 0.67)',
    },
  },
  menuInfo: {
    flex: 5,
    display: 'flex',
  },
  menuOrder: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '5px',
  },
  menuNumber: {
    fontSize: '19px',
    '& span': {
      fontSize: '7px',
    },
    marginRight: '10px',
  },
  menuButtonOrder: {
    borderRadius: '15px',
    color: '#F2F2F2',
    backgroundColor: '#F5AD6E',
    border: 'none',
    padding: '5px',
    textAlign: 'right',
  },
  menuInfoLeft: {
    flex: 1,
  },
  menuTime: {
    color: '#828282',
    fontSize: '12px',
    lineHeight: '16px',
    opacity: 0.8,
  },
  menuName: {
    color: '#000000',
    fontSize: '19px',
    fontWeight: 600,
    paddingRight: '15px',
  },
  gridList: {
    flexWrap: 'unset!important',
    transform: 'translateZ(0)',
    '& button': {
      width: '80% !important'
    }
  },
  gridListChildrenCategory: {
    width: 'auto',
    maxHeight: '310px',
    paddingBottom: '10px !important',
  },
  orderItem: {
    padding: '12px 6px 6px',
    marginBottom: '3px',
    backgroundColor: '#F2F2F2',
    fontWeight: 600,
  },
  customButton: {
    minWidth: '53px',
    height: '53px',
    border: 0,
    lineHeight: '57px',
    fontSize: '27px',
    boxShadow: 'rgba(0, 0, 0, 0.3) 1px 1px 1px 0px',
    fontWeight: 600,
  },
  wrapFoodBox: {
    background: '#E0E0E0',
    overflowY: 'scroll',
    minHeight: '75vh',
    ['@media (max-width: 959px)']: {
      minHeight: '62vh',
      maxHeight: 'calc(62vh - 1px)',
    },
    ['@media (max-width: 400px)']: {
      minHeight: '55vh',
    },
    '&.hasSubCate': {
      minHeight: 'calc(100vh - 270px)',
      maxHeight: 'calc(100vh - 270px)',
      ['@media (max-width: 959px)']: {
        minHeight: 'calc(65vh - 90px)',
        maxHeight: 'calc(65vh - 90px)',
      },
      ['@media (max-width: 400px)']: {
        minHeight: 'calc(62vh - 116px)',
        maxHeight: 'calc(65vh - 116px)',
      },
    },
  },
  foodBox: {
    textAlign: 'center',
  },
  showCourseBox: {
    position: 'absolute',
    right: '3px',
    bottom: '3px',
    border: '2px solid #FFE8A5',
    borderRadius: '15px',
    padding: '0 5px',
    fontSize: '7px',
    fontWeight: 600,
    backgroundColor: '#FFE8A5',
  },
  cancelOrder: {
    display: 'unset',
    color: 'red',
    marginLeft: '-5px',
  },
  button: {
    textAlign: 'center',
    ['@media (max-width: 600px)']: {
      padding: '4px 10px',
    },
    ['@media (max-width: 320px)']: {
      padding: '4px 4px',
    },
  },
  smallModalCard: {
    ['@media (max-width: 375px)']: {
      width: 'auto!important'
    },
  },
  buttonCategory: {
    borderWidth: 1,
    fontWeight: 600,
    '&.borderWidthBold': {
      borderWidth: 2
    },
    '&.backToTableList': {
      ['@media (max-width: 768px)']: {
        position: 'fixed',
        padding: '8px 10px!important',
        top: '53px',
        left: 0,
      },
      ['@media (max-width: 600px)']: {
        position: 'absolute',
        padding: '6px 10px!important',
        top: '-45px',
        left: '-15px',
      },
    },
  },
  wrapButtonGroup: {
    display:'flex',
    overflowX: 'scroll',
    width: '100%',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    '&.buttonSmallGroup button': {
      flex: '0 0 160px',
      padding: '1.5px 0',
      whiteSpace: 'nowrap',
      textTransform: 'none',
    },
    '& .noneBoxShadow': {
      boxShadow: 'none',
    },
  },
  largeCateButton: {
    borderWidth: 0,
    boxShadow: 'none',
    flex: '0 0 160px',
    textAlign: 'center',
    '& button': {
      textTransform: 'none',
      boxShadow: 'none',
      border: 'none',
      '&:hover': {
        boxShadow: 'none'
      }
    },
    '&.borderRight': {
      borderRight: '2px solid #BDBDBD !important'
    },
  },
  backgroundGrey: {
    background: '#E0E0E0'
  },
  backgroundWhite: {
    background: '#FFF'
  },
  boxContent: {
    maxWidth: 'calc(386px + 20px)',
    padding: '0 10px',
    margin: '30px auto 0',

    ['@media (max-width: 600px)']: {
      margin: '10px auto 0!important',
      overflowX: 'hidden',
    },
  },
  inputPrice: {
    textAlign: 'right'
  },
  pointer: {
    cursor: 'pointer'
  }
}));

const stylesOrderManager = {
  buttonFooter: {
    borderRadius: '28px',
    width: '176px',
  },
  thumbnail: {
    width: '100%',
    display: 'block',
    objectFit: 'cover',
    maxHeight: '170px',
  },
};

const useStylesRegisterCustomer = makeStyles(() => ({
  modalContent: {
    height: '340px',
    overflowY: 'scroll',
  },
  input: {
    padding: '15px',
  },
  inputNumber: {
    padding: '15px',
    width: '185px',
  },
  inputNumberWarning: {
    borderColor: 'red',
  },
  boxRegister: {
    textAlign: 'right',
    ['@media (max-width: 600px)']: {
      textAlign: 'center',
    }
  },
  button: {
    textAlign: 'center',
    ['@media (max-width: 600px)']: {
      padding: '4px 10px',
    },
    ['@media (max-width: 320px)']: {
      padding: '4px 4px',
    },
  },
  buttonAddTable: {
    display: 'flex',
    justifyContent: 'center',
    ['@media (max-width: 600px)']: {
      padding: '5px 10px 10px!important',
    },
  },
  inputLabel: {
    ['@media (max-width: 600px)']: {
      padding: '10px 10px 0 30px!important',
    }
  },
  inputSelect: {
    '& .MuiOutlinedInput-adornedEnd ': {
      width: '100%',
      justifyContent: 'space-between',
    },
    ['@media (max-width: 600px)']: {
      padding: '5px 10px 10px 30px!important',
    },
  },
  boxContent: {
    maxWidth: 'calc(386px + 20px)',
    padding: '0 10px',
    margin: '30px auto 0',

    ['@media (max-width: 600px)']: {
      margin: '10px auto 0!important',
      overflowX: 'hidden',
    },
  },
  smallModalCard: {
    ['@media (max-width: 375px)']: {
      width: 'auto!important'
    },
  },
  gridInfo: {
    justifyContent: 'center',
    marginTop: '30px',
  },
  gridInfoLink: {
    color: 'blue',
    textDecoration: 'underline',
    fontWeight: 600,
  },
}));

const stylesRegisterCustomer = {
  iconAdd: {
    color: '#BDBDBD',
    fontSize: 30,
  },
  inputRoot: {
    width: '100%',
    ['@media (max-width: 600px)']: {
      padding: '7px 32px 7px 7px',
    },
  },
};

const useStylesWaittingPaymentRequest = makeStyles(() => ({
  modalContent: {
    height: '340px',
    overflowY: 'auto',
  },
  messageWarning: {
    marginTop: '8%',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: '20px',
    ['@media (max-width: 600px)']: {
      padding: '10px',
    },
  },
  menuBody: {
    marginTop: '2%',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '64%',
    padding: '8px 5px 3px 0px',
    margin: '0 auto',
    overflowY: 'auto',
    fontSize: '18px',
    fontWeight: 600,
    ['@media (max-width: 600px)']: {
      width: '90%',
    },
  },
  menuItem: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    padding: '10px 0px',
  },
  menuName: {
    display: 'grid',
    gridTemplateColumns: '15% 85%',
    flex: '0 1 60%',
  },
  quantityItem: {
    width: '10%',
    textAlign: 'right',
  },
  amountItem: {
    width: '18%',
    textAlign: 'right',
  },
  normalText: {
    fontSize: '16px',
    fontWeight: 500,
  },
  labelStatus: {
    width: '22px',
    height: '22px',
    textAlign: 'center',
    backgroundColor: '#FDFDFD',
    borderRadius: '50%',
    border: '1px solid #000',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10px',
    lineHeight: '22px',

    '& span': {
      marginTop: '2px',
    },
    '&.preparing': {
      backgroundColor: '#FFA04B',
      color: '#FFFFFF',
      border: '1px solid #FFA04B',
    },
  },
  boxButton: {
    ['@media (max-width: 600px)']: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  orderName: {
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
  },
}));

const useStylesPaymentRequest = makeStyles(() => ({
  modalContent: {
    fontWeight: 600,
    marginTop: 24,
    '& .heading': {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 10,
      '& div': {
        borderBottom: '1px solid #000',
        display: 'inline',
        whiteSpace: 'nowrap'
      },
    },
    '& .firstHeading': {
      display: 'flex',
      justifyContent: 'start',
      marginBottom: 10,
      '& div': {
        borderBottom: '1px solid #000',
        display: 'inline',
        whiteSpace: 'nowrap'
      },
    },
  },
  inputNumberServe: {
    width: '100%'
  },
  buttonBoxShadow: {
    '& button': {
      boxShadow: 'rgb(0 0 0 / 24%) 0px 3px 8px',
      whiteSpace: 'nowrap',
      '@media (max-width: 420px)': {
        padding: '8px 10px !important'
      },
    }
  },
  contentLeft: {
    flex: 3,
    ['@media (max-width: 600px)']: {
      flex: '0 1 100%'
    },
  },
  menuItem: {
    display: 'flex',
    fontSize: '17px',
    color: '#000000',
    fontWeight: 600,
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #BDBDBD',
  },
  header: {
    display: 'flex',
    fontSize: '12px',
    color: '#000000',
    fontWeight: 500,
    alignItems: 'center',
    background: '#E0E0E0',
    padding: '10px 0px',
    '& .headerMenuName': {
      textAlign: 'center',
      flex: 4,
    },
    '& .headerMenuCount': {
      flex: 1,
      textAlign: 'center',
    },
    '& .headerMenuPrice': {
      flex: 2,
      textAlign: 'center',
    },
    '& .headerMenuButton': {
      flex: 3,
    },
  },

  courseDiv: {
    borderBottom: '1px solid #BDBDBD',
  },
  courseMainContent: {
    display: 'flex',
    fontSize: '17px',
    color: '#000000',
    fontWeight: 600,
    alignItems: 'center',
    paddingTop: '10px',
  },
  courseExtendContent: {
    display: 'flex',
    fontSize: '17px',
    color: '#000000',
    fontWeight: 600,
    alignItems: 'center',
    paddingBottom: '10px',
  },

  menuBody: {
    height: '300px',
    overflow: 'scroll',
    ['@media (max-width: 600px)']: {
      height: 'fit-content',
    },
  },
  menuName: {
    flex: 4,
    textAlign: 'left',
    marginLeft: '8px',
  },
  menuCount: {
    flex: 1,
    textAlign: 'center',
    '& span': {
      fontSize: '10px',
    },
  },
  menuPrice: {
    flex: 2,
    textAlign: 'center',
    '& span': {
      fontSize: '10px',
    },
  },
  menuButton: {
    flex: 3,
    textAlign: 'center',
    '& button': {
      border: 'none',
      color: '#F2F2F2',
      borderRadius: '12px',
      background: '#FFA04B',
      fontSize: '16px',
      fontWeight: 600,
      textAlign: 'center',
      padding: '8px 32px',
      whiteSpace: 'nowrap',
      ['@media (max-width: 600px)']: {
        padding: '6px 25px',
      },
    },
  },
  contentRight: {
    flex: 2,
    height: '360px',
    padding: '9px 9px 0 9px',
    ['@media (max-width: 600px)']: {
      flex: '0 1 100%'
    },
  },
  button: {
    textAlign: 'center',
    ['@media (max-width: 600px)']: {
      padding: '4px 10px',
    },
    ['@media (max-width: 320px)']: {
      padding: '4px 4px',
    },
  },
  payment: {
    backgroundColor: '#E0E0E0',
    paddingLeft: '8px',
    paddingTop: '3px',
    fontSize: '18px',
    color: '#000000',
    fontWeight: 600,
  },
  paymentHeaderLeft: {
    width: '255px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  paymentHeader: {
    alignItems: 'center',
    display: 'flex',
    marginBottom: '10px',
    '& div.paymentHeaderLeft': {
      flex: 1,
      textAlign: 'left',
    },
    '& div.paymentHeaderRight': {
      flex: 1,
      textAlign: 'right',
      marginRight: '5px',
    },
    '& button': {
      background: '#F2C94C',
      borderRadius: '28px',
      color: '#FFFFFF',
      padding: '5px 50px',
      border: 'none',
      ['@media (max-width: 360px)']: {
        padding: '2px 32px',
      },
    },
  },
  paymentInfo: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '13px',
  },
  paymentColLeft: {
    flex: '0 0 58px',
  },
  paymentColRight: {
    flex: 1,
    marginRight: '15px',
    marginLeft: '40px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '& input': {
      border: 'none',
      background: '#E0E0E0',
      fontSize: '24px',
      width: '100%',
      textAlign: 'right',
      '&:focus': {
        outline: 'none',
      },
    },
    '& span': {
      fontSize: '11px',
      marginRight: '15px',
      marginBottom: '5px',
    },
  },
  paymentBoxInput: {
    border: '1px solid #000000',
    width: '100%',
    textAlign: 'right',
    display: 'flex',
    alignItems: 'flex-end',
  },
  paymentButton: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '30px',
    paddingBottom: '12px',
    '& button': {
      border: 'none',
      borderRadius: '28px',
      color: '#FFFFFF',
      fontSize: '18px',
      padding: '10px 13px',
    },
    '& .paymentButtonLeft': {
      flex: 1,
      textAlign: 'center',
      '& button': {
        background: '#FFA04B',
        padding: '10px 27px !important',
      },
    },
    '& .paymentButtonRight': {
      flex: 1,
      textAlign: 'center',
      '& button': {
        background: '#828282',
      },
    },
  },

  paymentExtendInfo: {
    marginTop: '10px',
  },
  paymentExtendTitle: {},
  paymentExtendInput: {
    maxWidth: '260px',
    marginRight: '15px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '& input': {
      border: 'none',
      background: '#E0E0E0',
      fontSize: '18px',
      width: '100%',
      textAlign: 'right',
      '&:focus': {
        outline: 'none',
      },
    },
    '& span': {
      fontSize: '11px',
      marginRight: '15px',
      marginBottom: '5px',
    },
  },
  paymentButtonExtend: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '15px',
    paddingBottom: '12px',
    '& button': {
      border: 'none',
      borderRadius: '28px',
      color: '#FFFFFF',
      fontSize: '18px',
      padding: '10px 13px',
    },
    '& .paymentButtonLeft': {
      flex: 1,
      textAlign: 'center',
      '& button': {
        background: '#FFA04B',
        padding: '10px 27px !important',
      },
    },
    '& .paymentButtonRight': {
      flex: 1,
      textAlign: 'center',
      '& button': {
        background: '#828282',
      },
    },
  },

  totalAmount: {
    fontSize: '24px',
    color: '#415B6E',
  },
  cancelOrder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
    marginLeft: '-5px',
  },

  inputTimer: {
    border: '1px solid gray',
    borderRadius: '4px',
    width: '100%',
  },
  middleTimer: {
    margin: 'auto 20px',
  },
  textCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  firstColumn: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    height: '100%'
  },
  customButton: {
    minWidth: '53px',
    height: '53px',
    border: 0,
    lineHeight: '57px',
    fontSize: '27px',
    boxShadow: 'rgba(0, 0, 0, 0.3) 1px 1px 1px 0px',
    fontWeight: 600,
    borderRadius: '50%',
    padding: 0
  },
}));

export {
  useStylesPageTableList,
  useStylesOrderManager,
  stylesOrderManager,
  useStylesRegisterCustomer,
  stylesRegisterCustomer,
  useStylesPaymentRequest,
  useStylesWaittingPaymentRequest,
};
