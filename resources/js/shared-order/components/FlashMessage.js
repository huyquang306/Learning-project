import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    '& .MuiAlert-filledWarning': {
      color: '#FFF',
      backgroundColor: '#db6700',
    }
  },
}));

const FlashMessage = (props) => {
  const classes = useStyles(props);
  const { isOpen, autoHideDuration, anchorOrigin, status, message, onClose, ...rest } = props;
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose(false);
  };
  
  return (
    <div className={classes.root}>
      <Snackbar
        open={isOpen}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        {...rest}
      >
        <Alert elevation={6} variant="filled" onClose={handleClose} severity={status}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

FlashMessage.propTypes = {
  isOpen: PropTypes.bool,
  autoHideDuration: PropTypes.number,
  anchorOrigin: PropTypes.object,
  status: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
};

FlashMessage.defaultProps = {
  isOpen: false,
  autoHideDuration: 5000 /* 1000ms */,
  anchorOrigin: {
    vertical: 'top' /* 'bottom' | 'top' */,
    horizontal: 'center' /* 'center' | 'left' | 'right' */,
  },
  status: 'success' /* success | info | warning | error */,
  message: 'This is a system message!',
  onClose: () => {},
};

export default FlashMessage;
