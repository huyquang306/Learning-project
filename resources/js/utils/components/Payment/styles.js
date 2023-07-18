import { makeStyles } from '@material-ui/core/styles';

const usRegisterMethodStyles = makeStyles(() => ({
  radioGroupMethod: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '10px 0',
  },
}));

const useSetupFormStyles = makeStyles(() => ({
  cancelButton: {
    background: '#828282',
    color: '#fff',
    width: '252px',
    padding: '12px 0',
    fontSize: '18px',
    textAlign: 'center',
    borderRadius: '28px',
    marginRight: '10px',
    border: 0,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'block',
    transition: 'all 0.2s ease',
  },
  submitButton: {
    color: '#fff',
    width: '252px',
    padding: '12px 0',
    fontSize: '18px',
    textAlign: 'center',
    borderRadius: '28px',
    background: '#F2994A',
    border: 0,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'block',
    transition: 'all 0.2s ease',
  },
  boxItems: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    color: '#000',
    fontSize: '16px',
    height: '40px',
    borderRadius: '4px',
    paddingRight: '15px',
    paddingTop: '0px',
    paddingBottom: '0px',
    '& .MuiInputBase-formControl': {
      paddingTop: '1px',
      paddingBottom: '1px',
    },
    '-webkit-box-shadow': '0 0 0 30px white inset !important'
  },
  termOfService: {
    borderBottom: '1px solid #000',
    color: '#000',
    '&:hover': {
      borderBottom: '1px solid #000',
      textDecoration: 'none'
    }
  },
}));

const useRegisterPaymentMethod = makeStyles(() => ({
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
  boxItems: {
    display: 'flex',
    alignItems: 'center',
  },
  radioChecked: {
    color: '#F2994B !important',
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
    border: '1px solid #F2994A',
    color: '#F2994A',
    padding: '2px 20px',
    fontSize: '18px',
    textAlign: 'center',
    background: '#FEFEFE',
    marginRight: '10px',
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
  servicePlanDescription: {
    backgroundColor: 'lightgray',
    padding: '15px',
  },
  boxContent: {
    maxWidth: 'calc(395px + 20px)',
    padding: '0 10px',
    margin: '30px auto 0',
    fontWeight: 600,
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
  ItemName: {
    padding: '4px',
    // border: 'solid 1px #4b4848',
    // background: '#dcdada',
    fontSize: '18px',
    textAlign: 'left',
  },
  ItemValue: {
    fontWeight: 600,
    marginLeft: '10px',
    fontSize: '18px',
  },
  noteItem: {
    fontSize: '14px',
    fontWeight: 400,
    float: 'right',
    marginTop: '3px',
  },
  cardItems: {
    fontWeight: 600,
    width: '50%',
  },
  cardInputs: {
    width: '50%',
    marginRight: '10px',
  },
  textModal: {
    padding: '6px 0px',
  },
  termOfService: {
    borderBottom: '1px solid #000',
    color: '#000',
    '&:hover': {
      borderBottom: '1px solid #000',
      textDecoration: 'none'
    }
  },
}));

const useStylesReachQRLimitPoint = makeStyles(() => ({
  modalContent: {
    marginTop: '50px',
    fontSize: '20px',
    fontWeight: 600,
    textAlign: 'center',
  },
  textBlueColor: {
    color: '#4E7AC7',
    marginBottom: '10px',
  },
  buttonSubmit: {
    borderRadius: '28px',
    backgroundColor: '#F2994A',
    border: '1px solid #F2994A',
    margin: '16px 5px',
    padding: '8px 40px',
    fontSize: '18px',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#F2994A',
      opacity: 0.9,
    },
  },
}));

export {
  useSetupFormStyles,
  usRegisterMethodStyles,
  useRegisterPaymentMethod,
  useStylesReachQRLimitPoint,
};
