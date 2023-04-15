import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ModalCore from '@material-ui/core/Modal';

const modalStyle = {
  top: '40%',
  left: '50%',
  right: '0%',
  bottom: '0%',
  width: '85%',
  maxWidth: '600px',
  transform: 'translate(-50%, -40%)',
  position: 'absolute',
  background: '#FFFFFF',
  overflow: 'auto',
};

const useStyles = makeStyles({
  title: {
    //
  },
  content: {
    position: 'absolute',
    height: 'auto',
    left: '24px',
    right: '24px',
    top: '24px',
    fontFamily: "'Open Sans', sans-serif",
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '170%',
    letterSpacing: '0.04em',
    color: '#40434F',
  },
});

const Modal = (props) => {
  const classes = useStyles();
  return (
    <ModalCore
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div style={{...modalStyle, height: props.height ? props.height : 'auto'}}>
        <h2 id="modal-title" className={classes.title}>
          {props.title}
        </h2>
        <div id="modal-description" className={classes.content}>
          {props.children}
        </div>
      </div>
    </ModalCore>
  );
};

// PropTypes
Modal.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  children: PropTypes.node,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  height: PropTypes.string
};

// defaultProps
Modal.defaultProps = {
  title: '',
  body: '',
  open: false,
  height: 'auto',
  onClose: () => {
    /*nop*/
  },
};

export default Modal;