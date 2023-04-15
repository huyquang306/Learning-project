import { makeStyles } from '@material-ui/core/styles';

const useStylesOrderHistory = makeStyles(() => ({
  root: {
    paddingTop: '65px',
  },
  table: {
    minWidth: 650,
  },
  dot: {
    width: '15px',
    height: '15px',
    margin: 'auto',
    display: 'block',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 0, 0, 0.67)',
  },
  statusBox: {
    borderWidth: '1px',
    borderColor: '#4E7376',
    borderRadius: '4px',
    borderStyle: 'solid',
    display: 'inline-block',
    paddingLeft: '15px',
    paddingRight: '15px',
    marginLeft: '10px',
  },
  status: {
    fontWeight: 600,
    fontSize: 12,
    color: '#4E7376',
  },
  menuName: {
    fontSize: 22,
    fontWeight: 600,
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '8px',
    '@media (max-width: 600px)': {
      flexWrap: 'wrap',
    },
    flexWrap: 'nowrap'
  },
  boxSearch: {
    display: 'flex',
    width: '63%',
    alignItems: 'center',
  },
  select: {
    width: '100%',
    color: '#828282',
    height: '40px',
  },
  boxSelect: {
    width: '48%',
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
    display: 'flex',
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
  search: {
    cursor: 'pointer',
  },
  headerSelectBox: {
    display: 'flex',
    width: '63%',
    alignItems: 'center',
    '@media (max-width: 600px)': {
      width: '100%',
      flexWrap: 'wrap'
    },
    flexWrap: 'nowrap'
  },
  selectBox: {
    width: '48%',
    margin: '0px 10px 0px 0px',
    '@media (max-width: 600px)': {
      width: '40%',
    },
  },
  inputTimeBox: {
    width: '47%',
    '@media (max-width: 960px)': {
      width: '40%',
    },
    '@media (max-width: 600px)': {
      width: '40%',
      marginRight: '10px'
    },
  },
  headerInputTime: {
    alignItems: 'center',
    display: 'flex',
    '@media (max-width: 600px)': {
      width: '100%',
      margin: '10px 0px 10px 0px',
    },
  },
  paginate: {
    display: 'flex',
    justifyContent: 'right',
    marginTop: '10px',
    marginBottom: '10px'
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

export { useStylesOrderHistory, stylesOrderHistory };
