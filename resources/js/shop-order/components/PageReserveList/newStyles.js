import { makeStyles } from '@material-ui/core/styles';

const useStylesNewReserve = makeStyles(() => ({
  '@global': {
    'body': {
      backgroundColor: 'white',
      minHeight: 'unset',
      '& #appRoot': {
        minHeight: 'unset',
      },
      '& #appRoot > div': {
        minHeight: 'unset',
      },
    },
  },
  row: {
    display: 'flex',
    height: 'calc(100vh - 48px)',
    overflow: 'hidden',
    '@media (max-width: 960px)' : {
      height: 'auto',
    },
  },
  content: {
    flex: '0 0 calc(100vw - 160px)',
    '@media (max-width: 960px)' : {
      flex: 'auto',
    },
    '@media (max-width: 600px)' : {
      fontSize: '8px',
    },
    padding: '0',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
  },
  button: {
    borderRadius: '12px',
    backgroundColor: '#FFA04B',
    padding: '8px 18px',
    fontSize: '24px',
    color: '#F2F2F2',
    width: '100%',
    fontWeight: 700,
  },
  headerCookPlace: {
    position: 'sticky',
    top: '0px',
    width: '100%',
    backgroundColor: '#FFF',
    padding: '15px 15px 0px 15px',
    scroll: 'auto',
    zIndex: 9,
    '@media (max-width: 600px)' : {
      padding: '12px 5px 0px 5px',
    }
  },
  headerCookPlaceLine: {
    borderBottom: '1px solid gray',
    paddingBottom: '15px',
    display: 'flex',
    '@media (max-width: 600px)' : {
      paddingBottom: '8px',
    },
  },
  headerTimeRefresh: {
    paddingRight: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 600px)' : {
      '& p': {
        fontSize: '10px !important'
      },
    },
  },

  mainContent: {
    marginTop: '10px',
    padding: '0 15px 20px 15px',
    '@media (max-width: 600px)' : {
      padding: '0 5px 25px 5px',
    }
  },
  mainOrders: {
    border: '1px solid #707070',
  },
  mainStaffOrders: {
    height: '100%',
    '@media (max-width: 960px)' : {
      paddingLeft: '7px',
    },
  },
  mainStaffOrdersBorder: {
    border: '1px solid #707070',
    marginBottom: '20px',
    '@media (max-width: 600px)' : {
      marginBottom: '10px',
    },
    '&:nth-of-type(1)': {
      borderTop: 'none'
    }
  },
  mainArrow: {
    textAlign: 'center',
    '& img': {
      display: 'inline',
      marginTop: '20vh',
    }
  },
  mainOrdersTitle: {
    borderBottom: '1px solid #707070',
    backgroundColor: '#F1F1F1',
    textAlign: 'center',
    height: '40px',
    lineHeight: '40px',
    fontSize: '20px',
    fontWeight: 600,
    padding: '0 5px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '@media (max-width: 600px)' : {
      fontSize: '12px',
    },
  },
  staffOrdersTitle: {
    border: '1px solid #707070',
    backgroundColor: '#F1F1F1',
    textAlign: 'center',
    height: '40px',
    lineHeight: '40px',
    fontSize: '20px',
    fontWeight: 600,
    padding: '0 5px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '@media (max-width: 600px)' : {
      fontSize: '12px',
    },
  },
  mainsOrdersLeftContent: {
    padding: '0 15px',
    marginTop: '15px',
    fontWeight: 'normal',
    position: 'relative',
    overflowX: 'hidden',
    minHeight: 'calc(100vh - 210px)',
    '@media (max-width: 600px)' : {
      padding: '0 5px',
      marginTop: '5px',
    },
  },
  orderItemDragBox: {
    position: 'relative',
  },
  orderItemDragging: {
    backgroundColor: 'rgb(242 153 75 / 20%)',
    zIndex: 2,
  },
  mainsOrdersRightContent: {
    padding: '20px 10px 20px 15px',
    fontWeight: 'normal',
    position: 'relative',
    overflowX: 'hidden',
    '@media (max-width: 960px)' : {
      padding: '10px 5px 10px 5px',
    },
    '&.react-draggable-dragged': {
      zIndex: 1,
    }
  },
  staffOrdersToggle: {
    marginBottom: '10px',
    '@media (max-width: 960px)' : {
      textAlign: 'center',
    }
  },

  orderItemGrid: {
    float: 'left',
    cursor: 'move',
    '-webkit-touch-callout': 'none', /* iOS Safari */
    '-webkit-user-select': 'none', /* Safari */
    '-khtml-user-select': 'none', /* Konqueror HTML */
    '-moz-user-select': 'none', /* Old versions of Firefox */
    '-ms-user-select': 'none', /* Internet Explorer/Edge */
    width: 'calc(100% / 2)',
    '&.isShowShipping': {
      width: 'calc(100% / 1)',
    },
    '&.sortable-chosen' : {
      opacity: '1 !important',
    },
    '@media (min-width: 700px)' : {
      width: 'calc(100% / 2)',
      '&.isShowShipping': {
        width: 'calc(100% / 1)',
      },
    },
    '@media (min-width: 950px)' : {
      width: 'calc(100% / 3)',
      '&.isShowShipping': {
        width: 'calc(100% / 2)',
      },
    },
    '@media (min-width: 1200px)' : {
      width: 'calc(100% / 4)',
      '&.isShowShipping': {
        width: 'calc(100% / 2)',
      },
    },
  },
  orderItemRightGrid: {
    float: 'left',
    cursor: 'move',
    width: '100%',
    '&.sortable-chosen' : {
      opacity: '1 !important',
    },
  },
  buttonDrawerSidebar: {
    color: 'rgba(0, 0, 0, 0.87)',
    border: '1px solid gray',
    borderRadius: '5px',
    width: '100%',
    display: 'block',
    margin: 0,
    backgroundColor: '#FFF',
    fontSize: '16px',
    padding: '5px 5px',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: 600,
    '&:hover': {
      boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
      backgroundColor: '#d5d5d5',
    },
    '@media (max-width: 600px)' : {
      fontSize: '10px',
    },
  },
  sideBar: {
    flex: '0 0 160px',
    padding: '0 12px 0 12px',
    backgroundColor: '#fff',
    overflow: 'auto',
    borderLeft: '1px solid gray',
    '@media (max-width: 960px)' : {
      display: 'none',
    },
  },
  sideBarHeader: {
    position: 'sticky',
    top: '0px',
    zIndex: 99,
    backgroundColor: '#FFF',
    paddingTop: '15px',
    textAlign: 'center',
    '& .MuiSelect-select': {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
  },
  sideBarFilter: {
    marginTop: '10px',
    padding: '0 15px',
  },
  sideBarFilterBox: {
    color: 'rgba(0, 0, 0, 0.87)',
    border: '1px solid gray',
    borderRadius: '5px',
    width: '100px',
    minHeight: '100px',
    display: 'block',
    margin: 'auto',
    marginBottom: '10px',
    backgroundColor: '#FFF',
    fontSize: '16px',
    padding: '0 5px',
    textAlign: 'center',
    textTransform: 'capitalize',
    '&:hover': {
      boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
      backgroundColor: '#d5d5d5',
    },
  },
  sideBarDesignSelect: {
    width: '100px',
    marginBottom: '20px',
    '@media (max-width: 960px)' : {
      width: '100%',
      textAlign: 'left',
      fontSize: '14px',
    },
  },
  sideBarFilterBoxLabel: {
    display: 'block',
  },
  sideBarFilterBoxIcon: {
    fontSize: '70px',
    color: 'gray',
  },
  sideBarNotiBox: {
    position: 'relative',
  },

  card: {
    position: 'relative',
    '&:before,&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: '2px solid gray',
      borderRadius: '5px',
      backgroundColor: 'white',
    },
    '&:before': {
      zIndex: 1,
      transform: 'translate(-7px,-7px)',
      '@media (max-width: 600px)' : {
        transform: 'translate(-3px,-3px)',
      },
    },
    '&:after': {
      transform: 'translate(-14px,-14px)',
      '@media (max-width: 600px)' : {
        transform: 'translate(-6px,-6px)',
      },
    },
    '@media (max-width: 960px)' : {
      marginLeft: '20px',
    },
    '@media (max-width: 600px)' : {
      marginLeft: '7px',
    },
    '& > div': {
      position: 'relative',
      zIndex: 1,
      margin: 0,
    }
  },
  staffOrderFooter: {
    textAlign: 'center',
    marginTop: '10px',
    cursor: 'pointer',
  },

  drawer: {
    '&.MuiDrawer-root, & .MuiBackdrop-root, & .MuiDrawer-paper': {
      top: '48px !important',
    },
    '& .MuiDrawer-paper': {
      width: '80vw',
      border: '2px solid gray',
      borderRight: 'none',
      borderTopLeftRadius: '10px',
      borderBottomLeftRadius: '10px',
      height: 'calc(100vh - 48px)',
    },
  },
}));

const useStyleOrderCard = makeStyles(() => ({
  orderItem: {
    border: '2px solid gray',
    borderRadius: '5px',
    padding: '20px',
    backgroundColor: '#FFF',
    boxShadow: '5px 5px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    '&.shipped': {
      backgroundColor: '#DDD',
    },
    '&.shipping': {},
    '&.cancel': {},
    '&.cookOvertime': {
      border: '2px solid red',
    },
    '&.isNew': {
      border: '2px solid #F2994B',
    },
    '@media (max-width: 600px)' : {
      padding: '8px',
    },
  },
  orderCard: {
    margin: '10px 5px',
    zIndex: 2,
    'text-align': 'inherit',
    background: 'transparent',
    border: 'none',
    width: 'calc(100% - 10px)',
    outline: 'none',
    textTransform: 'inherit',
    display: 'inherit',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    lineHeight: 'inherit',
    padding: '0px',
    '&.isGroup': {
      margin: '10px 0px 0px 0px',
      width: '100%',
    },
    '&:hover': {
      background: 'transparent',
    },
    '&:visted': {
      background: 'transparent',
    },
    '&:active': {
      boxShadow: 'none !important',
      background: 'none !important',
      borderColor: 'none',
    },
    '&:focus': {
      boxShadow: 'none',
      backgroundColor: 'none',
      borderColor: 'none',
    },
  },
  orderItemRow: {
    marginBottom: '5px',
  },
  orderItemDotLine: {
    borderBottom: '1px dashed gray',
    marginBottom: '5px',
  },
  orderItemContent: {
    fontWeight: 600,
    marginBottom: '5px',
  },
  orderItemChangeStatusBox: {
    height: '30px',
    '@media (max-width: 950px)' : {
      height: '15px',
    },
  },
  orderItemTextRight: {
    textAlign: 'right',
  },
  orderItemChangeStatus: {
    color: 'rgba(0, 0, 0, 0.87)',
    border: '1px solid gray',
    borderRadius: '5px',
    width: '100%',
    display: 'block',
    margin: 0,
    backgroundColor: '#FFF',
    fontSize: '16px',
    padding: '0px 5px',
    textAlign: 'center',
    textTransform: 'capitalize',
    '&:hover': {
      boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
      backgroundColor: '#d5d5d5',
    },
    '@media (max-width: 600px)' : {
      fontSize: '8px',
    },
  },
  textDangerCancel: {
    color: 'red',
    marginLeft: '-10px',
    fontWeight: 600,
    '@media (max-width: 600px)' : {
      marginLeft: '-5px',
    },
  },
}));

export {
  useStylesNewReserve,
  useStyleOrderCard,
};
