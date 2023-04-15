import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(0.5),
    },
    '& .MuiChip-root': {
      margin: '2px 2px 4px 4px',
      padding: '0px 4px',
      background: '#F1F2F4',
    },
  },
}));

const Chips = (props) => {
  const classes = useStyles();
  
  return (
    <span className={classes.root}>
      <Chip icon={props.icon} size="small" color="default" label={props.label} />
    </span>
  );
};

// PropTypes
Chips.propTypes = {
  label: PropTypes.string,
  img: PropTypes.string,
  icon: PropTypes.node,
};
// defaultProps
Chips.defaultProps = {
  label: '(no title)',
  img: '',
  icon: '',
};

export default Chips;
