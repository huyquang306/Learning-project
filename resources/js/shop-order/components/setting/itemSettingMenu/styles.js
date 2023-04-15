import { makeStyles } from '@material-ui/core/styles';

const useStylesSettingMenu = makeStyles(() => ({
  buttonHeader: {
    textAlign: 'center',
    color: '#fff',
    fontSize: '18px',
    background: '#F2C94C',
    padding: '8px 20px',
    borderRadius: '28px',
    width: '220px',
    '&:hover': {
      background: '#F2C94C',
    },
    '&[disabled]': {
      border: '1px solid #908b8b',
      background: 'rgba(0, 0, 0, 0.12)',
    },
  },
  contentDetail: {
    color: '#000000',
    fontSize: '18px',
    fontWeight: 400,

    '& .wrap-multiple-tabs .MuiTabs-flexContainer': {
      justifyContent: 'space-around',
      '@media (max-width: 650px)': {
        justifyContent: 'unset',
      },
    },
    '& .wrap-checkbox .MuiFormControlLabel-root': {
      margin: 0,
    },
    '& .MuiTab-root': {
      minHeight: 0,
    },
    '& .wrap-multiple-tabs .MuiTab-root': {
      fontSize: 22,
    },
    '& .wrap-multiple-tabs .Mui-selected .MuiTab-wrapper': {
      borderBottom: '1px #000 solid',
      width: 'fit-content',
      fontWeight: 800,
    },
    '& .public-status .MuiTab-root': {
      '@media (max-width: 650px)': {
        minWidth: 0,
      },
    },
    '& .list-setting-price': {
      fontSize: 16,
      fontWeight: 400,
    },
    '& .menu-common .select-tax-options': {
      width: '50%',
      fontSize: 18,
      '@media (max-width: 1110px)': {
        width: '100%',
      }
    },
    '& .menu-common': {
      maxWidth: '100%'
    },
    '& .select-options-tax-value': {
      '@media (max-width: 1110px)': {
        flexDirection: 'column',
      }
    },
    '& .time-frame .MuiInputBase-root': {
      '@media (max-width: 600px)': {
        width: '75%',
      }
    },
    '& .wrap-multiple-tabs .MuiTabs-scroller': {
      '@media (max-width: 650px)': {
        overflow: 'scroll !important'
      }
    },
    '& .instagram .MuiInputBase-root': {
      width: '80%',
      '& input': {
        padding: '8px 14px'
      }
    },
    '& .wrap-content-images': {
      '& button': {
        minWidth: 100
      }
    }
  },
  scrollContent: {
    overflowX: 'auto',
    overflowY: 'hidden'
  },
  select: {
    width: '100%',
    color: '#828282',
    fontSize: '20px',
    height: '40px',
    textAlign: 'center',
  },
  input: {
    paddingRight: '25px',
    width: '100%',
    color: '#4F4F4F',
    fontSize: '24px',
    height: '40px',
  },
  inputPrice: {
    textAlign: 'right',
    paddingRight: '8px',
    color: '#333333',
  },
  image: {
    maxWidth: "max-content"
  },
  mainImage: {
    borderRadius: '5px',
    cursor: 'auto',
    margin: '0 auto'
  },
  selectBoxtext: {
    width: '50%',
    padding: '0px 0px 0px 20px',
    '@media (max-width: 600px)': {
      margin: '0px 0px 20px 0px',
      padding: '0px',
    },
  },
  inputBox: {
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    '@media (max-width: 600px)': {
      margin: '0px 0px 20px 0px',
      width: '100%',
    },
    '& .first': {
      width: '50%',
    },
    '& .second': {
      width: '50%',
      '@media (max-width: 600px)': {
        padding: '0px',
      },
    },
  },
  horizontalLines: {
    background: '#000',
  },
  textShowTax: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 14,
    '@media (max-width: 1110px)': {
      marginLeft: 0,
      width: '100%',
      textAlign: 'center'
    }
  },
  customTab: {
    marginTop: '10px',
    marginBottom: '10px',
    color: '#FFA04B',
    border: '1px solid #FFA04B',
    fontWeight: 600,
    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
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
  textDanger: {
    color: 'red',
    fontSize: '14px',
    padding: '5px 0',
  },
}));

export { useStylesSettingMenu };
