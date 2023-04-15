import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ButtonCore from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiButton-root': {
      width: '100px',
      height: '100px',
      '&:hover': {
        backgroundColor: '',
      },
    },
  },
  button: {
    display: 'inline-block',
    backgroundColor: (props) => props.bgcolor,
    color: (props) => props.fgcolor,
    margin: (props) => props.margin,
    borderRadius: (props) => props.borderRadius,
    border: (props) => props.border,
    textDecoration: (props) => props.textDecoration,
    cursor: 'pointer',
    boxShadow: (props) => props.boxshadow,
  },
  img: {
    display: 'block',
    width: '40px',
    height: '40px',
    margin: '0px auto 5px auto',
    '& .MuiSvgIcon-root': {
      fontSize: '40px',
    },
  },
  hidden: {
    opacity: 0,
    width: 0,
    height: 0,
    visibility: 'hidden',
  },
}));

const ButtonSquare = (props) => {
  const classes = useStyles(props);
  
  // 引き継ぐべきでないないプロパティは取り除く
  const nextProps = { ...props };
  delete nextProps.borderRadius;
  
  return (
    <div className={classes.root} {...nextProps}>
      <ButtonCore className={`${classes.button}`}>
        <div className={classes.img}>{props.img}</div>
        {props.title}
        <div className={classes.hidden}>{props.children}</div>
      </ButtonCore>
    </div>
  );
};

// PropTypes
ButtonSquare.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
  title: PropTypes.string,
  bgcolor: PropTypes.string,
  fgcolor: PropTypes.string,
  borderRadius: PropTypes.string,
  boxshadow: PropTypes.string,
  border: PropTypes.string,
  margin: PropTypes.string,
  img: PropTypes.element,
};
// defaultProps
ButtonSquare.defaultProps = {
  children: null,
  to: '#',
  title: '(no title)',
  bgcolor: '#86BE27',
  fgcolor: '#F7FAEE',
  borderRadius: '5px',
  boxshadow: '0 2px 2px rgba(0, 0, 0, 0.2), 0 -4px 5px -2px rgba(0, 0, 0, 0.3) inset',
  border: '',
  margin: '20px 5px',
  img: '',
};

export default ButtonSquare;
