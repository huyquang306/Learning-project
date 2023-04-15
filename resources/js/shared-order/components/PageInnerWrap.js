/**
 * Page Inner Wrap
 */

// React
import React from 'react';

// Library
import PropTypes from 'prop-types';

// Material UI component
import { Box } from '@material-ui/core';

const PageInnerWrap = (props) => {
  
  return <Box
    className={props.className}
    style={{
      height: props.height
    }}
  >{props.children}</Box>;
};

// PropTypes
PageInnerWrap.propTypes = {
  children: PropTypes.node,
  height: PropTypes.string,
  className: PropTypes.string,
};
PageInnerWrap.defaultProps = {
  height: 'calc((var(--vh, 1vh) * 100) - 48px)',
  className: '',
}

export default PageInnerWrap;
