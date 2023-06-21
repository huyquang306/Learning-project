/**
 * ModalQRCode
 */

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
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
    },
    '& .MuiButton-outlined': {
      border: (props) => `1px solid ${props.color}`,
      color: (props) => props.color,
    },
  },
  rootButton: {
    minWidth: '120px',
    ['@media (max-width: 360px)']: {
      minWidth: '100px',
    },
  },
});

const ModalQRCode = (props) => {
  const classes = useStyles(props);
  const {
    isOpen,
    onClose,
    onConfirm,
    title,
    confirmText,
    cancelText,
    children,
    onCancel,
    isModalConfirmUpdateCourse,
    isModalChangePaymentPackage,
    isModalConfirmInitOrder,
    isModalShowAddNewMenu
  } = props;

  const handleClose = () => {
    onClose(false);
  };

  const handleConfirm = () => {
    if (!isModalShowAddNewMenu) {
      onClose(false);
    }
    onConfirm();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Card className={`${classes.root} ${props.customClass}`}>
        <CardContent>
          <Typography
            gutterBottom
            component="h3"
            style={{ textAlign: 'center', fontSize: '20px', fontWeight: 600 }}
          >
            {title}
          </Typography>
          {children}
        </CardContent>
        <CardActions>
          {isModalConfirmUpdateCourse || isModalChangePaymentPackage || isModalConfirmInitOrder ? (
            <Button classes={{ root: classes.rootButton }} variant="outlined" onClick={onCancel}>
              {cancelText}
            </Button>
          ) : (
            <Button classes={{ root: classes.rootButton }} variant="outlined" onClick={handleClose}>
              {cancelText}
            </Button>
          )}
          <Button
            classes={{ root: classes.rootButton }}
            variant="contained"
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  );
};

ModalQRCode.propTypes = {
  isOpen: PropTypes.bool,
  color: PropTypes.string,
  title: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
  onCancel: PropTypes.func,
  isModalConfirmUpdateCourse: PropTypes.bool,
  isModalChangePaymentPackage: PropTypes.bool,
  isModalConfirmInitOrder: PropTypes.bool,
  isModalShowAddNewMenu: PropTypes.bool,
  customClass: PropTypes.string,
};

ModalQRCode.defaultProps = {
  isOpen: false,
  title: 'Thông báo',
  color: '#FFA04B',
  confirmText: 'OK',
  cancelText: 'Hủy',
  isModalConfirmUpdateCourse: false,
  isModalChangePaymentPackage: false,
  isModalConfirmInitOrder: false,
  isModalShowAddNewMenu: false,
  onClose: () => {},
  onConfirm: () => {},
  onCancel: () => {},
  customClass: '',
};

export default ModalQRCode;
