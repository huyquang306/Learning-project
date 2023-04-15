import { makeStyles } from '@material-ui/core/styles';

const userStylesPageStaff = makeStyles(() => ({
  '@global': {
    'body': {
      backgroundColor: 'white',
      minHeight: 'unset',
    },
  },
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
  },
  tableHead: {
    backgroundColor: '#DADADA',
  },

  tableCell: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
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
    margin: '5px',
    '@media (max-width: 400px)' : {
      padding: '5px 10px',
    },
  },
  buttonUpdate: {
    background: '#FFA04B',
    color: '#FFFFFF',
    '&:hover': {
      background: '#FFA04B',
    },
  },
  buttonDelete: {
    background: '#828282',
    color: '#FFFFFF',
    '&:hover': {
      background: '#828282',
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
  },
  centerModal: {
    minHeight: '360px',
    maxHeight: '420px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export { userStylesPageStaff  };
