import { makeStyles } from '@material-ui/core/styles';

const useStylesPageMenu = makeStyles(() => ({
  contentWrap: {
    position: 'absolute',
    width: '100%',
    top: '64px',
    height: 'calc(100% - 64px)',
    padding: '0 30px',
  },
  menuGridWrap: {
    marginTop: 80,
  },
  link: {
    backgroundColor: '#FFF',
    color: '#FFA04B',
    borderRadius: 5,
    border: '1px #FFA04B solid',
    fontSize: '35px',
    fontWeight: 600,
    display: 'flex',
    textDecoration: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    height: '160px',
    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    '&:hover': {
      backgroundColor: '#FFA04B',
      color: '#F2F2F2',
      boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
      transition: 'all 0.5s'    
    },
    '@media (max-width: 600px)': {
      fontSize: '25px',
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
}));

export { useStylesPageMenu };
