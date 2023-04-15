import { makeStyles } from '@material-ui/core/styles';

const useStylesSettingManyMenus = makeStyles(() => ({
  head: {
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiTabs-flexContainer': {
      display: 'block'
    }
  },
  select: {
    width: '232px',
    fontSize: '20px',
    height: '40px',
    marginRight: '24px',
    alignSelf: 'center',
    marginBottom: 8,
    color: '#4F4F4F',
    display: 'block',
    '& .MuiSelect-outlined.MuiSelect-outlined': {
      padding: 10,
      width: '80%'
    },
    '@media (max-width: 1366px)': {
      width: '160px'
    },
    '@media (max-width: 960px)': {
      marginBottom: '10px',
    },
  },
  fontWeightSelect: {
    fontWeight: 600,
  },
  input: {
    padding: '5px',
    color: '#4F4F4F',
    height: '40px',
    width: 233,
    marginRight: '14px',
    fontSize: '20px',
    alignSelf: 'center',
    fontWeight: 600,
    '@media (max-width: 960px)': {
      marginBottom: '10px',
      width: '232px',
      alignSelf: 'start',
    },
  },
  tableHead: {
    backgroundColor: '#DADADA',
  },

  tableCell: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
    minWidth: '160px',
    position: 'relative',
    '&.MuiTableCell-root': {
      '@media (max-width: 1366px)': {
        padding: '20px 6px'
      },
    },
    '@media (max-width: 1366px)': {
      minWidth: '100px'
    },
  },
  tableCellImage: {
    fontSize: '16px',
    color: '#828282',
    textDecorationLine: 'underline',
  },
  button: {
    background: '#FFA04B',
    color: '#FFFFFF',
    borderRadius: '28px',
    textAlign: 'center',
    padding: '5px 32px',
    '&:hover': {
      background: '#FFA04B',
    },
    '@media (max-width: 600px)': {
      padding: '5px 5px',
    },
  },

  buttonController: {
    color: '#FFA04B',
    borderRadius: '28px',
    padding: '8px 0',
    fontSize: '18px',
    width: '215px',
    textAlign: 'center',
  },
  buttonAdd: {
    background: '#  ',
    border: '3px solid #FFA04B',
  },
  buttonBack: {
    background: '#828282',
    '&:hover': {
      background: '#828282',
    },
  },
  buttonDelete: {
    color: '#d32f2f',
    border: '2px solid rgba(211, 47, 47, 1)',
    height: 40,
    alignSelf: 'center',
    width: 90,
    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    '@media (max-width: 1366px)': {
      width: 70,
      height: 35,
    },
  },
  menuName: {
    minWidth: '250px',
    '& .MuiInputBase-root': {
      width: '240px'
    }
  },
  inputPrice: {
    width: 185,
    textAlign: 'right',
    '@media (max-width: 1366px)': {
      width: 130,
    },
  },
  customTab: {
    marginTop: '10px',
    marginBottom: '10px',
    color: '#FFA04B',
    border: '1px solid #FFA04B',
    fontWeight: 600,
    minWidth: 100,
    minHeight: 'auto',
    boxShadow:
      '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    '@media (max-width: 1366px)': {
      minWidth: 80,
    },    
  },
  customTabLeft: {
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    '&.Mui-selected': {
      background: '#FFA04B',
      color: '#FFFFFF',
      border: '1px solid #FFA04B',
    },
  },
  customTabRight: {
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    '&.Mui-selected': {
      background: '#FFA04B',
      color: '#FFFFFF',
      border: '1px solid #FFA04B',
    },
  },
  messageError: {
    color: 'red',
    fontSize: 13,
    fontWeight: 400,
    position: 'absolute',
    bottom: 4
  },
  wrapColumndisplay: {
    '@media (max-width: 1350px)': {
      flexDirection: 'column',
    },
  },
  textCenter: {
    textAlign: 'center'
  },
  textArea: {
    maxHeight: 65,
    border: '1px solid #0000003b',
    borderRadius: 4,
    marginTop: 8,
    resize: 'none'
  }
}));

export { useStylesSettingManyMenus };
