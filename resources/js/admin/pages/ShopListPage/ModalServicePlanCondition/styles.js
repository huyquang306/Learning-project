import { makeStyles } from '@material-ui/core/styles';

const useStylesServicePlanItem = makeStyles(() => ({
  contentDetail: {
    color: '#000000',
    fontSize: '18px',
    fontWeight: 400,
    margin: '40px 60px 0 60px',
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
    ['@media (max-width: 468px)']: {
      padding: '8px 10px',
    },
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'center',
  },
  buttonSelect: {
    margin: '10px',
    textTransform: 'none',
    borderRadius: '7px',
    border: '1px solid #F2994A',
    color: '#F2994A',
    padding: '2px 40px',
    fontSize: '18px',
    textAlign: 'center',
    background: '#FEFEFE',
    '&:hover': {
      background: '#FEFEFE',
    },
    ['@media (max-width: 1045px)']: {
      width: '100%',
    },
  },
  buttonSelectActive: {
    color: '#fff',
    background: '#F2994A',
    '&:hover': {
      background: '#F2994A',
    },
  },
  inputLabel: {
    backgroundColor: '#F2994B',
    color: '#FFF',
    paddingLeft: '30px',
    height: '60px',
    lineHeight: '60px',
  },
  inputLabelDisable: {
    opacity: 0.7,
  },
  inputBox: {
    width: '100%',
    height: '60px',
    marginLeft: '20px',
  },
  input: {
    textAlign: 'right',
  },
}));

export {
  useStylesServicePlanItem
};
