import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import StoreOutlinedIcon from '@material-ui/icons/StoreOutlined';
import ViewQuiltOutlinedIcon from '@material-ui/icons/ViewQuiltOutlined';

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
  const [value, setValue] = React.useState(props.initialTabIndex);
  
  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        console.debug('[Footer] onChange', newValue);
        setValue(newValue);
        props.onChange(newValue);
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
  active: PropTypes.string,
  onChange: PropTypes.func,
  initialTabIndex: PropTypes.number,
};
// defaultProps
Footer.defaultProps = {
  active: 'left',
  onChange: () => {},
  initialTabIndex: 0,
};

export default Footer;
