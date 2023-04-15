import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ButtonCore from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiButton-root': {
      width: '50px',
      minWidth: '50px',
      display: 'inline-block',
      // disabled
      '&[disabled],&[disabled]:hover': {
        backgroundColor: '#D3D4D8',
        color: '#fff',
        border: '2px solid #A1A4B1',
        boxShadow: '0px 2px 0px #D3D4D8',
      },
    },
  },
  button: {
    display: 'inline-block',
    background: (props) => props.bgcolor,
    border: (props) => props.border,
    boxSizing: 'border-box',
    boxShadow: (props) => `0px 2px 0px ${props.bgcolor}`,
    borderRadius: '6px',
    fontFamily: "'Open Sans', sans-serif",
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '16px',
    textAlign: 'center',
    letterSpacing: '1px',
    color: '#FFFFFF',
    order: 0,
    padding: '5px',
    // label
    '& .MuiButton-label': {
      width: '2rem',
    },
    // hover
    '&.MuiButton-root:hover': {
      backgroundColor: (props) => props.bgcolor,
    },
  },
}));

const ButtonOnSale = (props) => {
  const classes = useStyles(props);
  return (
    <span className={classes.root}>
      <ButtonCore className={classes.button} {...props}>
        {props.title}
      </ButtonCore>
    </span>
  );
};

// PropTypes
ButtonOnSale.propTypes = {
  title: PropTypes.string,
  bgcolor: PropTypes.string,
  fgcolor: PropTypes.string,
  border: PropTypes.string,
};
// defaultProps
ButtonOnSale.defaultProps = {
  title: '(no title)',
  bgcolor: '#86BE27',
  fgcolor: '#F7FAEE',
  border: '2px solid #739A1E',
};

export default ButtonOnSale;
