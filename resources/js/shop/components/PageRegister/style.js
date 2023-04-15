import { makeStyles } from '@material-ui/core/styles';

const useStylesModalRegisterAccount = makeStyles(() => ({
  shopName: {
    marginTop: '15px',
    fontSize: '30px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  searchNotify: {
    color: 'red',
    fontWeight: 'bold',
  },
  robotIcon: {
    float: 'right',
  },
}));

export { useStylesModalRegisterAccount };
