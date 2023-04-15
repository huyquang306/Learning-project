import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StylingDiv = styled.div`
  flex: 0 0 calc(100vh - 64px);
  background-color: ${(props) => props.backgroundColor};
`;

const PageInnerContainer = (props) => {
  return <StylingDiv backgroundColor={props.backgroundColor}>{props.children}</StylingDiv>;
};

// PropTypes
PageInnerContainer.propTypes = {
  children: PropTypes.node,
  backgroundColor: PropTypes.string,
};
// defaultProps
PageInnerContainer.defaultProps = {
  backgroundColor: 'white',
};

export default PageInnerContainer;
