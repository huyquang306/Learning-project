import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ButtonCore from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  root: {
    display: 'inline-block',
    margin: (props) => props.margin,
    textDecoration: 'none',
    cursor: 'pointer',
    boxSizing: 'borderBox',
    width: (props) => props.width,
    borderRadius: (props) => props.borderRadius,
    padding: (props) => props.padding,
    backgroundColor: (props) => props.bgcolor,
    color: (props) => props.fgcolor,
    fontSize: (props) => props.fontSize,
    borderStyle: 'solid',
    borderColor: (props) => {
      if (props.borderColor) {
        return props.borderColor;
      } else {
        return props.variant === 'outlined' ? props.fgcolor : 'rgba(0,0,0, 0.2)';
      }
    },
    
    // disabled
    '&[disabled]': {
      backgroundColor: 'grey',
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
    
    '@media (max-width: 400px)' : {
      fontSize: '14px!important',
      padding: '8px 10px!important',
    },
    
    '& .MuiButton-label': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
}));

const Button = (props) => {
  const classes = useStyles(props);
  const {isLoading, disabled} = props;
  
  // 引き継ぐべきでないないプロパティは取り除く
  const nextProps = { ...props };
  delete nextProps.borderRadius;
  delete nextProps.borderColor;
  delete nextProps.disabled;
  delete nextProps.isLoading;
  delete nextProps.customClass;
  
  return (
    <ButtonCore
      className={`${classes.root} ${props.customClass}`}
      disabled={isLoading || disabled}
      {...nextProps}
    >
      {props.title || props.children} {
      isLoading && <CircularProgress style={{marginLeft: 10, width: 20, height: 20}}/>
    }
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
  width: PropTypes.string,
  margin: PropTypes.string,
  fontSize: PropTypes.string,
  customClass: PropTypes.string,
  isLoading: PropTypes.bool,
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
  width: 'auto',
  margin: '16px 5px',
  fontSize: '18px',
  customClass: '',
  isLoading: false,
};

export default Button;
