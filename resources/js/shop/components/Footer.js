import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import StoreOutlinedIcon from '@material-ui/icons/StoreOutlined';
import ViewQuiltOutlinedIcon from '@material-ui/icons/ViewQuiltOutlined';
import { useHistory } from 'react-router';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiBottomNavigationAction-root': {
      maxWidth: '100%',
    },
    '& .Mui-selected': {
      background: '#F8B62D',
      color: '#FFFFFF',
    },
    width: '100%',
    textAlign: 'center',
    overflow: 'hidden',
    background: '#FFFFFF',
    color: '#F8B62D',
    position: 'fixed',
    bottom: 0,
  },
}));

const Footer = (props) => {
  const classes = useStyles(props);
  const history = useHistory();

  const [value, setValue] = React.useState(props.initialTabIndex);
  // click footer tabs
  const handleTabChange = (newTabIndex) => {
    // console.debug('[Footer] handleTabChange() tab index', newTabIndex);
    setValue(newTabIndex);
    switch (newTabIndex) {
      case 0:
        history.push('/item/list');
        break;
      case 1:
        history.push('/onsale');
        break;
      default:
        console.error('[Footer] handleTabChange() tab index not match', newTabIndex);
    }
  };

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        handleTabChange(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="お弁当の登録" icon={<ViewQuiltOutlinedIcon />} />
      <BottomNavigationAction label="販売画面" icon={<StoreOutlinedIcon />} />
    </BottomNavigation>
  );
};

// PropTypes
Footer.propTypes = {
  initialTabIndex: PropTypes.number,
};
// defaultProps
Footer.defaultProps = {
  initialTabIndex: 0,
};

export default Footer;
