/*
 * Obento-R お弁当販売
 Header
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  appBar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    color: '#444',
  },
  appBarToolbar: {
    width: '100%',
    textAlign: 'center',
  },
  appBarIconLeft: {
    width: '15%',
    textAlign: 'left',
    '& .MuiIconButton-root': {
      padding: '12px 0px',
    },

    '& .MuiIconButton-label': {
      color: '#E35649',
      fontSize: '12px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
    },
  },

  appBarTitle: {
    width: '70%',
    textAlign: 'center',
  },

  appBarIconRight: {
    width: '15%',
    textAlign: 'right',
    '& .MuiIconButton-root': {
      padding: '12px 0px',
    },

    '& .MuiIconButton-label': {
      color: '#F8B62D',
      fontSize: '12px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
    },
  },
});

const HeaderAppBar = (props) => {
  const classes = useStyles(props);
  const history = useHistory();
  // click setting icon
  const handleSettingClick = (_event) => {
    history.push('/setting');
  };

  const handleBackClick = (_event) => {
    history.goBack();
  };

  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar className={classes.appBarToolbar}>
        <Box className={classes.appBarIconLeft}>
          {((props) => {
            return props.backButton ? (
              <IconButton onClick={handleBackClick}>
                <ArrowBackIcon />
                戻る
              </IconButton>
            ) : null;
          })(props)}
        </Box>
        <Typography valiant="div" className={classes.appBarTitle}>
          {props.title}
        </Typography>
        <Box className={classes.appBarIconRight}>
          {((props) => {
            return props.settingButton ? (
              <IconButton onClick={handleSettingClick}>
                <SettingsIcon />
                設定
              </IconButton>
            ) : null;
          })(props)}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
// PropTypes
HeaderAppBar.propTypes = {
  title: PropTypes.string,
  backButton: PropTypes.bool,
  settingButton: PropTypes.bool,
};
HeaderAppBar.defaultProps = {
  title: 'undefined',
  backButton: false,
  settingButton: true,
};
export default HeaderAppBar;
