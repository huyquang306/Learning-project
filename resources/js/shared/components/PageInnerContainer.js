/*
Page Inner Container Components
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StylingDiv = styled.div`
  width: 100%;
  height: ${(props) => props.height};
  padding: ${(props) => props.padding};
  box-sizing: border-box;
  background-color: ${(props) => props.backgroundColor};
`;

const PageInnerContainer = (props) => {
  return (
    <StylingDiv
      backgroundColor={ props.backgroundColor }
      padding={ props.padding }
      height={ props.height }
      className={props.className}
    >
      {props.children}
    </StylingDiv>
  );
};

// PropTypes
PageInnerContainer.propTypes = {
  children: PropTypes.node,
  backgroundColor: PropTypes.string,
  padding: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
};
// defaultProps
PageInnerContainer.defaultProps = {
  backgroundColor: 'white',
  padding: '10px 5px 80px 5px',
  height: '100%',
  className: '',
};

export default PageInnerContainer;
