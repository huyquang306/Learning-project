import { makeStyles } from '@material-ui/core/styles';

const useStylesSidebarHidden = makeStyles(() => ({
  hiddenSidebarHeader: {
    padding: '10px',
    borderBottom: '1px solid gray',
  },
  headerCookPlaceRadioGroup: {
    flexWrap: 'unset',
    overflowX: 'auto',
    overflowY: 'hidden',
    '@media (max-width: 960px)' : {
      flexWrap: 'wrap',
      overflowX: 'unset',
      overflowY: 'unset',
      marginTop: '10px',
    },
  },
  hiddenButton: {
    fontWeight: 600,
  },
  headerCookPlaceRadio: {
    border: '1px solid gray',
    borderRadius: '5px',
    padding: '0 20px 0 0',
    marginRight: '25px',
    marginLeft: 0,
    whiteSpace: 'nowrap',
    '@media (max-width: 960px)' : {
      padding: '0 5px 0 0',
      width: '45%',
      margin: '5px',
    },
  },
  headerCookPlaceRadioLabel: {
    '@media (max-width: 960px)' : {
      fontSize: '12px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  },

  hiddenSidebarBoxFilter: {
    padding: '10px 30px 10px 30px',
    textAlign: 'center',
  },
  sideBarDesignSelect: {
    width: '100%',
    textAlign: 'left',
    fontSize: '14px',
  },
  sideBarFilter: {
    margin: '15px 0',
  },
  sideBarFilterBox: {
    color: 'rgba(0, 0, 0, 0.87)',
    border: '1px solid gray',
    borderRadius: '5px',
    width: '100px',
    minHeight: '100px',
    display: 'block',
    margin: 'auto',
    marginBottom: '10px',
    backgroundColor: '#FFF',
    fontSize: '14px',
    padding: '0 5px',
    textAlign: 'center',
    textTransform: 'capitalize',
    '&:hover': {
      boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
      backgroundColor: '#d5d5d5',
    },
    '@media (max-width: 350px)' : {
      width: '90%',
      height: '90%',
    },
  },
  sideBarFilterBoxLabel: {
    display: 'block',
  },
  sideBarFilterBoxIcon: {
    fontSize: '70px',
    color: 'gray',
  },
  sideBarNotiBox: {
    position: 'relative',
  },
}));

export { useStylesSidebarHidden };
