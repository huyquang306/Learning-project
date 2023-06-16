/**
 * Dialog
 */

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    width: '300px',
    '& .MuiCardActions-root': {
      background: '#EDEEEF',
      padding: '8px 20px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    '& .MuiTypography-gutterBottom': {
      marginBottom: '0.5em',
    },
    '& .MuiButton-contained': {
      backgroundColor: (props) => props.color,
      color: '#FFF',
      // disabled
      '&[disabled]': {
        backgroundColor: 'grey !important',
        color: '#ccc',
      },
    },
    '& .MuiButton-outlined': {
      border: (props) => `1px solid ${props.color}`,
      color: (props) => props.color,
    },
  },
  rootButton: {
    minWidth: '120px',
  },
});

const AlertDialog = (props) => {
  const classes = useStyles(props);
  const { isOpen, onClose, onConfirm, title, message, confirmText, cancelText } = props;
  
  const handleClose = () => {
    onClose(false);
  };
  
  const handleConfirm = () => {
    onClose(false);
    onConfirm();
  };
  
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Card className={classes.root}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom component="h4">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {message}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button classes={{ root: classes.rootButton }} variant="outlined" onClick={handleClose}>
            {cancelText}
          </Button>
          <Button
            classes={{ root: classes.rootButton }}
            variant="contained"
            onClick={handleConfirm}
            disabled={props.isSubmitLoading}
          >
            {confirmText}
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  );
};

AlertDialog.propTypes = {
  isOpen: PropTypes.bool,
  color: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  isSubmitLoading: PropTypes.bool
};

AlertDialog.defaultProps = {
  isOpen: false,
  title: 'Xác nhận',
  message: '',
  color: '#FFA04B',
  confirmText: 'Đồng ý',
  cancelText: 'Hủy',
  onClose: () => {},
  onConfirm: () => {},
  isSubmitLoading: false
};

export default AlertDialog;
