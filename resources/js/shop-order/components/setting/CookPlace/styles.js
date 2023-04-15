import { makeStyles } from '@material-ui/core/styles';

const useStylesPageSettingCookPlace = makeStyles(() => ({
  '@global': {
    'body': {
      backgroundColor: 'white',
      minHeight: 'unset',
    },
  },
  container: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#000',
  },
  input: {
    width: '100%',
    color: '#000',
    fontSize: '16px',
    height: '40px',
    borderRadius: '4px',
    textAlign: 'right',
    paddingRight: '15px',
    fontWeight: 600,
    '& .MuiInputBase-formControl': {
      paddingTop: '1px',
      paddingBottom: '1px',
    }
  },

  select: {
    width: '100%',
    height: '40px',
    color: '#000',
    textAlign: 'right',
    fontWeight: 600,
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
  tableCell: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
    background: '#fff',
  },
  button: {
    background: '#FFA04B',
    color: '#FFFFFF',
    borderRadius: '28px',
    textAlign: 'center',
    padding: '5px 32px',
    margin: '5px',
    '&:hover': {
      background: '#FFA04B',
    },
  },
  buttonDelete: {
    background: '#828282',
    '&:hover': {
      background: '#828282',
      opacity: 0.8,
    },
  },
  centerModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

export { useStylesPageSettingCookPlace };
