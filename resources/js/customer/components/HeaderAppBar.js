/*
 * Obento-R お弁当販売
 Header
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import LocalPhoneOutlinedIcon from '@material-ui/icons/LocalPhoneOutlined';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';

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

  const handleBackClick = (_event) => {
    history.push('/searchmap/');
  };

  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar className={classes.appBarToolbar}>
        <Box className={classes.appBarIconLeft}>
          {((props) => {
            return props.backButton ? (
              <IconButton onClick={handleBackClick}>
                <ArrowBackIosOutlinedIcon />
              </IconButton>
            ) : null;
          })(props)}
        </Box>
        <Typography valiant="div" className={classes.appBarTitle}>
          {props.title}
        </Typography>
        <Box className={classes.appBarIconRight}>
          {((props) => {
            return props.phoneButton ? (
              <a href={`tel:${props.phone_number}`}>
                <IconButton>
                  <LocalPhoneOutlinedIcon style={{ color: '#E35649' }} />
                </IconButton>
              </a>
            ) : null;
          })(props)}
          {((props) => {
            return props.mapButton ? (
              <a href={`comgooglemaps://?daddr=${props.lat},${props.lng}`}>
                <IconButton>
                  <RoomOutlinedIcon style={{ color: '#E35649' }} />
                </IconButton>
              </a>
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
  phoneButton: PropTypes.bool,
  mapButton: PropTypes.bool,
  phone_number: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
};
HeaderAppBar.defaultProps = {
  title: 'undefined',
  backButton: true,
  phoneButton: true,
  mapButton: true,
  phone_number: null,
  lat: 35.6809591,
  lng: 139.7673068,
};
export default HeaderAppBar;
