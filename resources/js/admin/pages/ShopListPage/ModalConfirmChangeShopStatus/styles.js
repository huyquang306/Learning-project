import { makeStyles } from '@material-ui/core/styles';

const useStylesChangeShopStatus = makeStyles(() => ({
  textModal: {
    padding: '6px 0px',
  },
  boxContent: {
    maxWidth: 'calc(392px + 20px)',
    padding: '0 10px',
    margin: '30px auto 0',
    fontWeight: 600,
    ['@media (max-width: 600px)']: {
      margin: '10px auto 0!important',
      overflowX: 'hidden',
    },
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
}));

export {
  useStylesChangeShopStatus
};
