import React from 'react';
import PropTypes from 'prop-types';
import BackdropCore from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Backdrop = (props) => {
  const classes = useStyles();
  return (
    <div>
      <BackdropCore className={classes.backdrop} open={props.open} onClose={props.onClose}>
        {props.children}
      </BackdropCore>
    </div>
  );
};

// PropTypes
Backdrop.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
};
// defaultProps
Backdrop.defaultProps = {
  open: false,
  onClose: () => {
    /*nop*/
  },
};

export default Backdrop;
