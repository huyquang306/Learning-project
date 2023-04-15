import { makeStyles } from '@material-ui/core/styles';

const useStylesPageCurrentPlan = makeStyles(() => ({
  '@global': {
    body: {
      backgroundColor: 'white',
      minHeight: 'unset',
    },
  },
  container: {
    fontSize: '18px',
    fontWeight: 500,
    color: '#000',
  },
  input: {
    width: '100%',
    color: '#000',
    fontSize: '16px',
    height: '40px',
    borderRadius: '4px',
    paddingRight: '15px',
    '& .MuiInputBase-formControl': {
      paddingTop: '1px',
      paddingBottom: '1px',
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
    background: '#F2994A',
    fontWeight: 600,
    '&:hover': {
      background: '#F2994A',
    },
  },
  buttonBack: {
    background: '#828282',
    fontWeight: 600,
    '&:hover': {
      background: '#828282',
    },
  },
  buttonCancel: {
    background: '#ffffff',
    fontWeight: 600,
    '&:hover': {
      background: '#ffffff',
    },
    color: 'red',
    border: '1px solid red',
  },
  iconAdd: {
    color: '#BDBDBD',
    fontSize: 30,
  },
  servicePlanDescription: {
    backgroundColor: 'lightgray',
    padding: '15px',
  },
  buttonSelect: {
    '&:first-child': {
      borderBottomLeftRadius: '7px',
      borderTopLeftRadius: '7px',
    },
    '&:last-child': {
      borderBottomRightRadius: '7px',
      borderTopRightRadius: '7px',
    },
    textTransform: 'none',
    borderRadius: 0,
    border: '1px solid #F2994A',
    color: '#F2994A',
    padding: '2px 20px',
    fontSize: '18px',
    textAlign: 'center',
    background: '#FEFEFE',
    '&:hover': {
      background: '#FEFEFE',
    },
  },
  buttonSelectActive: {
    color: '#fff',
    background: '#F2994A',
    '&:hover': {
      background: '#F2994A',
    },
  },
  textBold: {
    fontWeight: 600,
  },
  ItemName: {
    padding: '4px',
    border: 'solid 1px #4b4848',
    background: '#dcdada',
    fontSize: '16px',
    textAlign: 'right',
  },
  ItemValue: {
    fontWeight: 600,
    marginLeft: '10px',
  },
  itemLink: {
    cursor: 'pointer',
    color: '#000',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
  },
  tableHeader: {
    textAlign: 'center',
    border: '1px solid #dddddd',
    padding: '4px',
    fontWeight: 500,
  },
  tableDetail: {
    border: '1px solid #dddddd',
    padding: '2px 8px',
    fontSize: '16px',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  textHeader: {
    padding: '6px 0px',
    margin: '25px auto',
  },
  textDetail: {
    padding: '6px 0px',
    marginLeft: '15%',
    textAlign: 'left',
  },
  boxItems: {
    display: 'flex',
    alignItems: 'center',
  },
  boxContent: {
    width: '80%',
    fontWeight: 600,
  },
  boxDetail: {
    lineHeight: '30px',
    padding: '2px',
  },
  cardContentCustom: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

export { useStylesPageCurrentPlan };
