import { makeStyles } from '@material-ui/core/styles';

const useStylesShopItem = makeStyles(() => ({
  contentDetail: {
    color: '#000000',
    fontWeight: 400,
    margin: '40px 60px 0 60px',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    color: '#4F4F4F',
    fontSize: '24px',
    height: '40px',
  },
  textArea: {
    width: '100%',
    color: '#4F4F4F',
    '& .MuiInputBase-root': {
      fontSize: '24px',
    }
  },
  buttonSubmit: {
    borderRadius: '28px',
    backgroundColor: '#F2994A',
    border: '1px solid #F2994A',
    padding: '8px 40px',
    fontSize: '18px',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#F2994A',
      opacity: 0.9,
    },
  },

  boxRow: {
    marginTop: '10px',
    marginBottom: '10px',
    alignItems: 'start',
    gap: '25px',
    '& div' : {
      wordBreak: 'break-all',
    },
  },
  colonMargin: {
    marginLeft: '5px',
    marginRight: '5px',
  },
  boxPaymentRow: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  boxTableRow: {
    marginTop: '30px',
  },
  tableHead: {
    backgroundColor: '#DADADA',
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

  button: {
    borderRadius: '28px',
    textAlign: 'center',
    padding: '5px 15px',
  },
  buttonDelete: {
    background: '#828282',
    color: '#FFFFFF',
    '&:hover': {
      background: '#828282',
    },
  },
  buttonAddCondition: {
    width: '100%',
    height: '40px',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2994A',
    borderRadius: '28px',
    color: '#FFFFFF',
    border: '1px solid #F2994A',
    '&:hover': {
      backgroundColor: '#F2994A',
      opacity: '0.9',
    },
    '&.Mui-disabled': {
      opacity: '0.8',
    }
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
    padding: '2px 7%',
    fontSize: '16px',
    textAlign: 'center',
    background: '#FEFEFE',
    '&:hover': {
      background: '#FEFEFE',
    },
    '&[disabled]': {
      background: '#F2994A',
      color: '#FFF',
    },
  },
  buttonSelectActive: {
    color: '#fff',
    background: '#F2994A',
    '&:hover': {
      background: '#F2994A',
    },
  },
  select: {
    width: '100%',
    color: '#828282',
    height: '40px',
    marginTop: '10px',
  },
  fwBold: {
    fontWeight: 'bold',
  },
  radioChecked: {
    color: '#F2994B !important',
  },
  radioStyle: {
    height: '27px',
  },
}));

export {
  useStylesShopItem
};
