import { makeStyles } from '@material-ui/core/styles';

const useStylesPageAddCourse = makeStyles(() => ({
  contentWrap: {
    position: 'absolute',
    width: '100%',
    top: '64px',
    height: 'calc(100% - 64px)',
    display: 'flex',
    padding: '8px 16px 0px',
  },
  head: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectTaxOptions: {
    width: '100%',
    textAlign: 'center'
  },
  container: {
    zIndex: 1,
    marginBottom: '160px',
    overflowX: 'auto',
    '@media (max-width: 600px)': {
      marginBottom: '250px',
    },
  },
  tableHead: {
    backgroundColor: '#DADADA',
  },

  tableCell: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
    backgroundColor: '#DADADA',
  },
  tableCellDetail: {
    fontSize: '20px',
    fontWeight: 400,
    color: '#4F4F4F',
  },
  tableCellImage: {
    fontSize: '16px',
    color: '#828282',
    textDecorationLine: 'underline',
  },

  button: {
    borderRadius: '28px',
    textAlign: 'center',
    padding: '5px 32px',
    '@media (max-width: 600px)': {
      padding: '5px'
    },
  },
  buttonCopy: {
    background: '#828282',
    marginRight: 5,
    color: '#FFFFFF',
    '&:hover': {
      background: '#828282',
    },
  },
  buttonDetail: {
    background: '#FFA04B',
    color: '#FFFFFF',
    '&:hover': {
      background: '#FFA04B',
    },
  },

  buttonController: {
    color: '#fff',
    borderRadius: '28px',
    padding: '12px 0',
    fontSize: '18px',
    width: '252px',
    textAlign: 'center',
  },
  buttonAdd: {
    background: '#FFA04B',
    border: '1px solid #FFA04B',
    '&:hover': {
      background: '#FFA04B',
      border: '1px solid #FFA04B',
    },
    '&[disabled]': {
      border: '1px solid #908b8b',
      background: 'rgba(0, 0, 0, 0.12)',
    }
  },
  buttonBack: {
    background: '#828282',
    '&:hover': {
      background: '#828282',
    },
  },
  deleteButton: {
    borderRadius: '28px',
    border: '1px solid red',
    boxShadow: '0 0 3px grey',
    color: 'red',
  },
  menu: {
    border: '2px solid #ccc',
    boxShadow: '0 0 3px grey',
    padding: '10px',
  },
  buttonRemoveImage: {
    color: 'red',
  },

  inputHead: {
    width: '80%',
  },
  imageUploadHead: {
    width: '30%',
    borderRadius: '5px',
    maxHeight: '125px',
    maxWidth: '200px',
  },
  imageMenuItem: {
    width: '30%',
    margin: 'auto',
    borderRadius: '5px',
    display: 'inline-block'
  },
  customTab: {
    marginTop: '20px',
    marginBottom: '10px',
    color: 'gray',
    border: '1px solid gray',
  },
  customTabLeft: {
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    '&.Mui-selected': {
      background: '#FFA04B',
      color: '#FFFFFF',
      border: '1px solid #FFA04B',
    },
  },
  customTabRight: {
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    '&.Mui-selected': {
      background: '#FFA04B',
      color: '#FFFFFF',
      border: '1px solid #FFA04B',
    },
  },
  inputBlockCost: {
    width: '80px',
    marginRight: '5px',
  },
  inputBlockCostInput: {
    '-webkit-appearance': 'none',
    '-moz-appearance': 'none',
    '&::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  inputTimer: {
    border: '1px solid gray',
    borderRadius: '4px',
    padding: '10px',
  },
  inputExtendTime: {
    marginRight: '10px',
  },
  inputAlertTime: {
    marginRight: '10px',
  },
  tableRowGray: {
    background: 'rgba(249, 249, 249, 0.94)',
    boxShadow: '0px -0.5px 0px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(20px)',
  },
  middleTimer: {
    margin: 'auto 20px',
  },
  centerModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  switchBox: {
    width: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '@media (max-width: 600px)': {
      width: '50%',
      justifyContent: 'left',
    },
  },
  options: {
    width: 'auto',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 960px)': {
      width: '50%',
      justifyContent: 'center',
    },
  },
  previewBlock: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  previewImg: {
    display: 'flex',
    margin: '0px 0px 0px 10px'
  },
  deleteBlock: {
    display: 'flex',
    alignItems: 'center',
    margin: '0px 0px 0px 10px',
    '@media (max-width: 960px)': {
      marginTop:'16px'
    },
  },
  footer: {
    zIndex: 100
  }
}));

const useStylesModalMenuList = makeStyles(() => ({
  contentWrap: {
    position: 'absolute',
    width: '100%',
    top: '64px',
    height: 'calc(100% - 64px)',
    display: 'flex',
    padding: '8px 16px 0px',
  },
  head: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    maxHeight: 250,
    borderRadius: 0,
  },
  tableHead: {
    backgroundColor: '#DADADA',
  },

  tableCell: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
    backgroundColor: '#DADADA',
  },
  tableCellDetail: {
    fontSize: '20px',
    fontWeight: 400,
    color: '#4F4F4F',
  },
  tableCellImage: {
    fontSize: '16px',
    color: '#828282',
    textDecorationLine: 'underline',
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '8px',
    '& :first-child': {
      '@media (max-width: 600px)': {
        flexWrap: 'wrap',
      },
    }
  },
  select: {
    width: '250px',
    color: '#828282',
    height: '40px',
    '& :first-child': {
      '@media (max-width: 600px)': {
        paddingTop: '0px',
        marginTop: '10px'
      },
    },
  },
  boxSelect: {
    width: '250px',
    marginRight: '10px',
  },
  boxRight: {
    marginLeft: '10px',
  },
  rootDate: {
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '5px',
    padding: '6px',
    height: '40px',
    color: '#828282',
    marginRight: '10px',
    '@media (max-width: 600px)': {
      width: '250px',
      marginTop: '10px'
    },
  },
  search: {
    cursor: 'pointer',
    height: 40,
    lineHeight: 40,
    '@media (max-width: 600px)': {
      marginTop: '10px'
    },
  },
  buttonController: {
    color: '#fff',
    borderRadius: '28px',
    padding: '12px 0',
    fontSize: '18px',
    width: '252px',
    textAlign: 'center',
  },
  buttonAdd: {
    background: '#FFA04B',
    '&:hover': {
      background: '#FFA04B',
    },
    '@media (max-width: 600px)': {
      marginTop: '40px'
    },
  },
  buttonBack: {
    background: '#828282',
    marginRight: 10,
    '&:hover': {
      background: '#828282',
    },
  },
  imageMenu: {
    width: '30%',
    margin: 'auto',
    borderRadius: '5px',
  },
  button: {
    borderRadius: '28px',
    textAlign: 'center',
    padding: '5px 32px',
    '@media (max-width: 600px)': {
      padding: '5px'
    },
  },
  buttonDetail: {
    background: '#FFA04B',
    color: '#FFFFFF',
    '&:hover': {
      background: '#FFA04B',
    },
    '@media (max-width: 600px)': {
      padding: '5px'
    },
  },
}));

export { useStylesPageAddCourse, useStylesModalMenuList };
