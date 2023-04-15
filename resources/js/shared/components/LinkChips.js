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
      padding: '13px 16px',
      position: 'relative',
      background: '#E35649',
      border: '2px solid #FFFFFF',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.16)',
      borderRadius: '18px',
      fontFamily: "'Open Sans', sans-serif",
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '24px',
      alignItems: 'center',
      color: '#FFFFFF',
      alignSelf: 'center',
      '& .MuiChip-icon': {
        color: '#FFF',
      },
    },
  },
}));

const LinkChips = (props) => {
  const classes = useStyles();
  
  return (
    <span className={classes.root}>
      <Chip
        icon={props.icon}
        size="small"
        color="default"
        label={props.label}
        onClick={props.onClick}
      />
    </span>
  );
};

// PropTypes
LinkChips.propTypes = {
  label: PropTypes.string,
  img: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
};
// defaultProps
LinkChips.defaultProps = {
  label: '(no title)',
  img: '',
  icon: '',
  onClick: () => {
    /*nop*/
  },
};

export default LinkChips;
