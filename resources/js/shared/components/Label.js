import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
  root: {
    '& .MuiChip-root': {
      margin: '2px',
      padding: '2px',
      borderRadius: '2px',
      backgroundColor: (props) => props.bgcolor,
      color: (props) => props.fgcolor,
    },
  },
});

const Label = (props) => {
  const classes = useStyles(props);
  
  return (
    <span className={classes.root} {...props}>
      <Chip label={props.label} />
    </span>
  );
};
// PropTypes
Label.propTypes = {
  label: PropTypes.string,
};
// defaultProps
Label.defaultProps = {
  label: 'Not set',
};

export default Label;
