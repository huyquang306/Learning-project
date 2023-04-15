/*
Page Container Components
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PageContainerStyled = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  box-sizing: border-box;
  padding: ${(props) => props.padding};
  background: rgba(0, 0, 0, 0.05);
  position: relative;
  background-color: ${(props) => props.backgroundColor};
  background-image: ${(props) => {
    if (props.backgroundImage) {
      return `url(${props.backgroundImage})`;
    }
    return 'none';
    }
  };
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  min-height: ${(props) => props.minHeight};
`;

const PageContainer = (props) => {
  return (
    <PageContainerStyled
      backgroundColor={props.backgroundColor}
      backgroundImage={props.backgroundImage}
      alt={props.alt}
      width={props.width}
      height={props.height}
      minHeight={props.minHeight}
      top={props.top}
      left={props.left}
      padding={props.padding}
    >
      {props.children}
    </PageContainerStyled>
  );
};

// PropTypes
PageContainer.propTypes = {
  children: PropTypes.node,
  backgroundImage: PropTypes.string,
  backgroundColor: PropTypes.string,
  padding: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  minHeight: PropTypes.string,
  top: PropTypes.string,
  left: PropTypes.string,
};
// defaultProps
PageContainer.defaultProps = {
  backgroundColor: 'white',
  backgroundImage: null,
  padding: '10px 10px',
  alt: 'no image',
  width: '100%',
  height: '100%',
  minHeight: '100vh',
  top: '',
  left: '',
};

export default PageContainer;
