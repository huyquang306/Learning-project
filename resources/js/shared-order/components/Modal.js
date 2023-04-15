/**
 * Modal component
 */

// React
import React from 'react';

// Library
import PropTypes from 'prop-types';

// Material UI Component
import ModalCore from '@material-ui/core/Modal';
import CardCore from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';

// modal内style
const useStyles = makeStyles({
  cardCore: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: (props) => props.maxWidth,
    position: 'fixed',
    boxShadow: 'none',
    overflow: 'unset',
    
    '&:focus': {
      outline: 'none',
    },
  },
  cardHeader: {
    padding: '7px 12px',
    textAlign: 'center',
    backgroundColor: (props) => props.titleBgColor,
    
    '& .MuiCardHeader-title': {
      fontSize: '20px',
      color: '#ffffff',
    },
  },
  cardContent: {
    minHeight: (props) => props.minHeight,
    maxHeight: (props) => props.maxHeight,
    overflowY: (props) => props.overflowY,
    backgroundColor: '#ffffff',
    padding: 0,
  },
  cardActions: {
    padding: 0,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
});

const Modal = (props) => {
  const classes = useStyles(props);
  
  return (
    <ModalCore
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      disableBackdropClick={props.disableBackdropClick}
    >
      <CardCore className={classes.cardCore}>
        {props.title && (
          <CardHeader title={props.title} className={classes.cardHeader} />
        )}
        <CardContent className={`${classes.cardContent} ${props.customClass}`}>{props.children}</CardContent>
        <CardActions className={classes.cardActions}>{props.actions}</CardActions>
      </CardCore>
    </ModalCore>
  );
};

// PropTypes
Modal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  titleBgColor: PropTypes.string,
  maxWidth: PropTypes.string,
  minHeight: PropTypes.string,
  maxHeight: PropTypes.string,
  children: PropTypes.node,
  actions: PropTypes.node,
  onClose: PropTypes.func,
  disableBackdropClick: PropTypes.bool,
  customClass: PropTypes.string,
  overflowY: PropTypes.string
};

// defaultProps
Modal.defaultProps = {
  title: '',
  titleBgColor: '#F2994A',
  open: false,
  maxWidth: '770px',
  minHeight: '360px',
  maxHeight: '420px',
  overflowY: 'scroll',
  onClose: () => {},
  disableBackdropClick: false,
  customClass: '',
};

export default Modal;
