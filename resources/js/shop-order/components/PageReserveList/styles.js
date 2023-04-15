import { makeStyles } from '@material-ui/core/styles';

const useStylesReserve = makeStyles(() => ({
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
    minWidth: 250
  },
  cancelOrder: {
    display: 'unset',
    color: 'red',
    marginLeft: '-10px',
    whiteSpace: 'nowrap'
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '8px',
    alignItems: 'start',
    '@media (max-width: 600px)': {
      flexWrap: 'wrap',
    },
    flexWrap: 'nowrap',
    '& .cookPlaceRadioGroup': {
      '@media (max-width: 960px)': {
        flexWrap: 'unset',
        overflowX: 'auto',
        overflowY: 'hidden'
      },
    }
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
  headerSelectBox: {
    display: 'flex',
    width: '35%',
    '@media (max-width: 600px)': {
      width: '100%'
    },
  },
  headerFilterBox: {
    display: 'flex',
    alignItems: 'center',
    width: 'auto',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    '@media (max-width: 600px)': {
      width: '100%',
      flexWrap: 'wrap',
    },
  },
  filterBox: {
    width: 'auto',
    '@media (max-width: 600px)': {
      width: '50%',
    },
  },
  select: {
    width: 210,
    color: '#828282',
    fontSize: 17,
    height: '44px',
    marginRight: '24px',
    alignSelf: 'center',
    '& .MuiSelect-selectMenu': {
      textOverflow: 'unset'
    }
  },
  tableHead: {
    background: 'rgb(224, 224, 224)'
  },
  tableCustomer: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 600,
    width: 230,
    margin: '0 auto'
  }
}));

const stylesReserve = {
  cellHeader: {
    backgroundColor: '#E0E0E0',
    paddingTop: '6px',
    paddingBottom: '3px',
    whiteSpace: 'nowrap',
    fontSize: 20,
    fontWeight: 600,
    textAlign: 'center'
  },
  cellTitle: { fontWeight: 700, fontSize: 16, paddingRight: '3px' },
  cellSubTitle: { fontWeight: 400, fontSize: 12 },
};

export { useStylesReserve, stylesReserve };
