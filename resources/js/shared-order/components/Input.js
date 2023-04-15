import React from 'react';
import PropTypes from 'prop-types';

import { InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: '46px',
    padding: '5px 16px',
    border: '1px solid #000000',
    boxSizing: 'border-box',
    textAlign: (props) => props.textAlign,
  },
}));

const Input = (props) => {
  const classes = useStyles(props);
  
  return (
    <InputBase
      classes={{
        root: classes.root,
        input: classes.input,
      }}
      type={props.type}
    />
  );
};

//PropTypes
Input.propTypes = {
  type: PropTypes.string,
  textAlign: PropTypes.string,
};

//Default props
Input.defaultProps = {
  type: 'text',
  textAlign: 'left',
};

export default Input;
