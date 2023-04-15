import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ButtonCore from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  root: {
    display: 'inline-block',
    margin: '20px 5px',
    textDecoration: 'none',
    cursor: 'pointer',
    boxSizing: 'borderBox',
    // boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2), 0 -4px 5px -2px rgba(0, 0, 0, 0.3) inset',
    boxShadow: (props) => {
      if (props.variant === 'outlined') {
        return `0 2px 0px 0px ${props.fgcolor}`;
      } else {
        return `0 2px 0px 0px rgba(0,0,0, 0.3)`;
      }
    },
    borderRadius: (props) => props.borderRadius,
    padding: (props) => props.padding,
    backgroundColor: (props) => props.bgcolor,
    color: (props) => props.fgcolor,
    borderStyle: 'solid',
    borderColor: (props) => {
      if (props.borderColor) {
        return props.borderColor;
      } else {
        return props.variant === 'outlined' ? props.fgcolor : 'rgba(0,0,0, 0.2)';
      }
    },
    borderWidth: '2px',
    
    // disabled
    '&[disabled]': {
      backgroundColor: 'grey !important',
      color: '#ccc',
    },
    
    // hover
    '&:hover': {
      backgroundColor: (props) => props.bgcolor,
      opacity: 0.9,
    },
    
    // icons
    '& .MuiSvgIcon-root': {
      verticalAlign: 'middle',
    },
  },
}));

const Button = (props) => {
  const classes = useStyles(props);
  
  // 引き継ぐべきでないないプロパティは取り除く
  const nextProps = { ...props };
  delete nextProps.borderRadius;
  delete nextProps.borderColor;
  
  return (
    <ButtonCore className={classes.root} {...nextProps}>
      {props.title || props.children}{' '}
      {props.isSubmitLoading ? (
        <CircularProgress style={{ marginLeft: 10, width: 20, height: 20 }} />
      ) : null}
    </ButtonCore>
  );
};

// PropTypes
Button.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  bgcolor: PropTypes.string,
  fgcolor: PropTypes.string,
  borderRadius: PropTypes.string,
  padding: PropTypes.string,
  variant: PropTypes.string,
  borderColor: PropTypes.string,
  isSubmitLoading: PropTypes.bool,
};
// defaultProps
Button.defaultProps = {
  children: null,
  title: '',
  disabled: false,
  bgcolor: '#86BE27',
  fgcolor: '#F7FAEE',
  borderRadius: '5px',
  padding: '8px 40px',
  variant: 'contained',
  borderColor: null,
  isSubmitLoading: false,
};

export default Button;
