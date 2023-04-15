/**
 * Footer
 */

// React
import React from 'react';

// Library
import PropTypes from 'prop-types';

// Material UI component
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: (props) => props.padding,
    backgroundColor: (props) => props.bgColor,
    zIndex: 999
  },
});

const Footer = (props) => {
  const classes = useStyles(props);
  
  return <Box className={classes.footer}>{props.children}</Box>;
};

// PropTypes
Footer.propTypes = {
  children: PropTypes.node,
  bgColor: PropTypes.string,
  padding: PropTypes.string,
};

Footer.defaultProps = {
  bgColor: '#ffffff',
  padding: '0 10px',
};

export default Footer;
