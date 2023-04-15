import { makeStyles } from '@material-ui/core/styles';

const useStylesPageCoursesList = makeStyles(() => ({
  contentWrap: {
    position: 'absolute',
    width: '100%',
    top: '64px',
    height: 'calc(100% - 64px)',
    display: 'flex',
    padding: '8px 16px 0px',
  },
  head: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '75px',
  },
  select: {
    width: '232px',
    color: '#828282',
    fontSize: '20px',
    height: '40px',
    marginRight: '24px',
  },
  input: {
    padding: '5px',
    width: '200px',
    height: '40px',
    marginRight: '14px',
    color: '#828282',
    size: '20px',
  },
  container: {
    '@media (max-width: 600px)': {
      marginBottom: '160px'
    },
    // maxHeight: '460px',
  },
  tableHead: {
    backgroundColor: '#DADADA',
  },

  tableCell: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
  },
  tableCellDetail: {
    fontSize: '20px',
    fontWeight: 400,
    color: '#4F4F4F',
  },
  tableCellImage: {
    fontSize: '16px',
    color: '#828282',
    textDecorationLine: 'underline',
  },
  menuImage: {
    margin: '0 auto',
  },

  button: {
    borderRadius: '28px',
    textAlign: 'center',
    padding: '5px 32px',
    '@media (max-width: 600px)': {
      padding: '5px'
    },
  },
  buttonDetail: {
    background: '#FFA04B',
    color: '#FFFFFF',
    '&:hover': {
      background: '#FFA04B',
    },
    '@media (max-width: 960px)': {
      marginTop: '10px',
      width: '100%'
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
  buttonCopy: {
    color: '#000000',
    border: '1px solid #FFA04B',
    marginRight: '10px',
    '@media (max-width: 960px)': {
      marginRight: '0px',
      width: '100%'
    },
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
  search: {
    cursor: 'pointer',
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '15px',
  },
  headerTitle: {
    paddingRight: '10px',
  },
  table: {
    minWidth: 650,
  },
  rootDate: {
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '5px',
    padding: '6px',
    height: '40px',
    color: '#828282',
    marginRight: '10px',
  },
  imageCourse: {
    width: '30%',
    margin: 'auto',
    borderRadius: '5px',
  },
  centerModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  linkWithoutUnder: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)',
  },
}));

export { useStylesPageCoursesList };
