import { makeStyles } from '@material-ui/core/styles';

const shopListStyles = makeStyles(() => ({
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
  textAlignEnd: {
    textAlign: 'end',
    '@media (max-width: 600px)': {
      textAlign: 'left',
      marginTop: '10px',
      marginLeft: '20px'
    }
  },

  tableHead: {
    backgroundColor: '#F2994A',
  },
  tableCellHead: {
    fontSize: '20px',
    backgroundColor: '#F2994A',
    color: '#FFFFFF',
  },
  tableCell: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
  },
  noBreakLine: {
    whiteSpace: 'nowrap',
  },

  button: {
    borderRadius: '28px',
    textAlign: 'center',
    padding: '15px 32px',
  },
  buttonController: {
    color: '#fff',
    borderRadius: '28px',
    padding: '12px 0',
    fontSize: '18px',
    width: '252px',
    textAlign: 'center',
  },
  buttonSearch: {
    background: '#F2994A',
    color: '#FFFFFF',
    marginLeft: '15px',
    fontSize: '20px',
    padding: '6px 40px',
    '&:hover': {
      background: '#F2994A',
    },
  },
  input: {
    color: '#4F4F4F',
    fontSize: '20px',
    height: '48px',
    borderRadius: '4px',
    width: '100%',
  },
  inputDate: {
    border: '1px solid gray',
    borderRadius: '4px',
    padding: '5px',
    fontSize: '20px',
    width: '40%',
    '@media (max-width: 960px)': {
      width: '100%',
      marginBottom: '15px',
    }
  },
  filterBox: {
    display: 'flex',
  },
  shopItemHover: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#CCC'
    }
  },
}));

export {shopListStyles};
