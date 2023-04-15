import React from 'react';
import PropTypes from 'prop-types';

import { Backdrop, CircularProgress, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({
  backdrop: {
    zIndex: 9999,
    textAlign: 'center',
    color: 'white',
  },
});
const Waiting = (props) => {
  const classes = useStyles(props);
  return (
    <Backdrop className={classes.backdrop} open={props.isOpen}>
      <Container>
        <CircularProgress color="inherit" />
        {props.message}
      </Container>
    </Backdrop>
  );
};

// PropTypes
Waiting.propTypes = {
  isOpen: PropTypes.bool,
  message: PropTypes.string,
};
Waiting.defaultProps = {
  isOpen: false,
  message: '',
};
export default Waiting;
