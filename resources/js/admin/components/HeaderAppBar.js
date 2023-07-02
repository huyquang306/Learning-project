import React from 'react';
import PropTypes from 'prop-types';

// Material Component
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  appBar: {
    backgroundColor: '#F2994A',
    alignItems: 'center',
    color: '#FFFFFF',
  },

  appBarToolbar: {
    width: '100%',
    textAlign: 'center',
  },

  appBarTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '20px',
    width: '100%'
  },
});

const HeaderAppBar = (props) => {
  const classes = useStyles(props);

  return (
    <>
      <AppBar position='sticky' className={classes.appBar}>
        <Toolbar variant='dense' className={classes.appBarToolbar}>
          <Typography valiant='div' className={classes.appBarTitle}>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

// PropTypes
HeaderAppBar.propTypes = {
  title: PropTypes.string,
};
HeaderAppBar.defaultProps = {
  title: 'undefined',
};

export default HeaderAppBar;
