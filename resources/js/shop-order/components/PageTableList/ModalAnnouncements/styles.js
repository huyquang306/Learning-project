import { makeStyles } from '@material-ui/core/styles';

const useStylesAnnouncementSetting = makeStyles(() => ({
  modalContent: {
    overflow: 'hidden',
    display: 'flex',
  },

  loadingContent: {
    position: 'absolute',
    top: '45%',
    left: '48%',
  },

  mainContent: {
    width: '100%',
    padding: '20px',
  },
  itemBox: {
    marginBottom: '20px',
  },
  itemBottomBoxTitle: {
    textAlign: 'center',
  },
  itemInput: {
    width: '100%',
    height: '70px',
    paddingLeft: '20px',
    border: '1px solid #808080',
    borderBottom: 0,
    '@media (max-width: 600px)': {
      textAlign: 'center'
    }
  },
  itemBottomBox: {
    border: '1px solid #808080',
    '& :first-child': {
      '@media (max-width: 600px)': {
        flexDirection: 'column'
      }
    }
  },
  addButtonBoxInput: {
    width: '100%',
    height: '40px',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA04B',
    borderRadius: '28px',
    color: '#FFFFFF',
    border: '1px solid #FFA04B',
    '&:hover': {
      backgroundColor: '#FFA04B',
      opacity: '0.9',
    },
    '&.Mui-disabled': {
      opacity: '0.8',
    }
  },
  itemBottomBoxButtonDelete: {
    border: '1px solid rgb(130, 130, 130)',
    borderRadius: '28px',
    backgroundColor: 'rgb(130, 130, 130)',
    color: 'rgb(247, 250, 238)',
    padding: '1px 25px',
    '&:hover': {
      backgroundColor: 'rgb(130, 130, 130)',
      opacity: '0.8',
    }
  },
  itemBottomBoxOptions: {
    maxHeight: '470px',
    display: 'flex',
    overflowX: 'auto',
  },
  buttonSelectRoot: {
    minWidth: '100px',
    padding: '2px 8px',
    border: '1px solid #808080',
    backgroundColor: '#ffffff',
    borderRadius: '28px',
    color: '#000000',
    marginRight: '10px',
    whiteSpace: 'nowrap',
    textTransform: 'none',
    '&.selected': {
      color: '#ffffff',
      borderRadius: '28px',
      backgroundColor: '#FFA04B',
      border: '1px solid #FFA04B',
    },
    '&.disabled': {
      cursor: 'not-allowed',
    },
  },
  buttonSelectLabel: {
    justifyContent: 'start',
  },
  buttonSubmit: {
    borderRadius: '28px',
    backgroundColor: '#FFA04B',
    border: '1px solid #FFA04B',
    padding: '8px 40px',
    fontSize: '18px',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#FFA04B',
      opacity: 0.9,
    },
    '@media (max-width: 600px)': {
      width: '150px',
      padding: '8px 10px',
      fontSize: '14px'
    }
  },
  buttonBack: {
    '@media (max-width: 600px)': {
      width: '150px',
    }
  },

  noBusinessContent: {
    position: 'absolute',
    top: '30%',
    left: '35%',
    textAlign: 'center'
  },
}));

export {
  useStylesAnnouncementSetting
};
