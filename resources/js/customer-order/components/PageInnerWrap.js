/**
 * Page Inner Wrap
 */

// React
import React from 'react';

// Library
import PropTypes from 'prop-types';

// Material UI component
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  innerWrap: {},
});

const PageInnerWrap = (props) => {
  const classes = useStyles();

  return <Box
    className={ classes.innerWrap }
    style={{
      height: props.height
    }}
  >{ props.children }</Box>;
};

// PropTypes
PageInnerWrap.propTypes = {
  children: PropTypes.node,
  height: PropTypes.string,
};
// defaultProps
PageInnerWrap.defaultProps = {
  height: 'calc((var(--vh, 1vh) * 100) - 43px)',
};

export default PageInnerWrap;
