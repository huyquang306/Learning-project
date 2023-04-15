import { makeStyles } from '@material-ui/core/styles';

const userManagementStyles = makeStyles(() => ({
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
    paddingBottom: '120px',
  },
  select: {
    width: '232px',
    color: '#828282',
    fontSize: '20px',
    height: '40px',
    marginRight: '24px',
  },
  input: {
    padding: '5px',
    width: '200px',
    height: '40px',
    marginRight: '14px',
    color: '#828282',
    size: '20px',
    '@media (max-width: 960px)': {
      width: '30%',
    },
    '@media (max-width: 600px)': {
      width: '40%',
    },
  },
  container: {
    maxHeight: '460px',
  },
  tableHead: {
    backgroundColor: '#DADADA',
  },

  tableCell: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
    minWidth: '160px'
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
  menuImage: {
    margin: '0 auto',
  },

  button: {
    borderRadius: '28px',
    textAlign: 'center',
    padding: '5px 32px',
  },
  buttonDetail: {
    background: '#FFA04B',
    color: '#FFFFFF',
    '&:hover': {
      background: '#FFA04B',
    },
  },
  buttonDetailOrder: {
    background: '#FFA04B',
    color: '#FFFFFF',
    '&:hover': {
      background: '#FFA04B',
    },
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '15px',
    height: '34px',
    borderRadius: '28px',
    textAlign: 'center',
    padding: '9px 32px',
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
  },
  buttonBack: {
    background: '#828282',
    '&:hover': {
      background: '#828282',
    },
  },
  search: {
    cursor: 'pointer',
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '15px',
  },
  headerTitle: {
    paddingRight: '10px',
  },
  table: {
    minWidth: 650,
  },
  rootDate: {
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '5px',
    padding: '6px',
    height: '40px',
    color: '#828282',
    marginRight: '10px',
    '&.pageDetail': {
      minWidth: '200px'
    }
  },
  filterBlock: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    '@media (max-width: 960px)': {
      flexWrap: 'wrap'
    },
  },
  filterBlockChildren: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 960px)': {
      width: '100%',
    },
    '&:nth-of-type(2)': {
      '@media (max-width: 960px)': {
        marginTop: '20px'
      },
    },
    '&:nth-of-type(1)': {
      '@media (max-width: 960px)': {
        width: '100%'
      },
    }
  },
  inputTime: {
    '@media (max-width: 960px)': {
      width: '45%'
    },
    '@media (max-width: 600px)': {
      width: '40%',
    },
  },
  dateInputBlock: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 960px)': {
      width: '100%',
      marginLeft: '40px'
    },
    '&:nth-of-type(2)': {
      '@media (max-width: 960px)': {
        marginTop: '20px',
      },
    },
  },
  filterBlockDetail: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: '100%',
    '@media (max-width: 600px)': {
      flexWrap: 'wrap',
    },
  },
  dateInputDetail: {
    display: 'flex',
    alignItems: 'center',
    '&:nth-of-type(2)': {
      '@media (max-width: 960px)': {
        marginTop: '0px',
      },
      '@media (max-width: 600px)': {
        marginTop: '20px',
      },
    },
    '@media (max-width: 960px)': {
      width: 'auto',
      marginLeft: '40px',
      marginTop: '0px',
    },
  }
}));

const stylesOrderHistory = {
  cellHeader: {
    backgroundColor: '#E0E0E0',
    paddingTop: '6px',
    paddingBottom: '3px',
  },
  cellTitle: {
    marginRight: '30px',
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '19px',
    alignItems: 'center',
    color: '#000000',
  },
  cellContent: {
    fontStyle: 'normal',
    fontSize: '19px',
    alignItems: 'center',
    color: '#000000',
  },
  cancelOrder: {
    display: 'unset',
    color: 'red',
    marginLeft: '-10px',
  },
  menuCancel: {
    fontStyle: 'normal',
    fontSize: '19px',
    alignItems: 'center',
    color: 'red',
  },
};

export { userManagementStyles, stylesOrderHistory  };
