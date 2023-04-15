import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    color: (props) => props.color,
    backgroundColor: (props) => props.bgColor,
    display: 'inline-block',
    fontSize: '18px',
    lineHeight: '18px',
    fontWeight: 600,
    borderRadius: '28px',
    padding: '10px 30px',
  },
}));

const Label = (props) => {
  const classes = useStyles(props);
  
  return <div className={classes.root}>{props.title}</div>;
};

//PropTypes
Label.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  bgColor: PropTypes.string,
};

//Default props
Label.defaultProps = {
  title: '',
  color: '#FFFFFF',
  bgColor: '#F2C94C',
};

export default Label;
