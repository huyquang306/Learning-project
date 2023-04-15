import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LinkButtonStyle = styled.div`
  display: inline-block;
  margin: 20px 5px;
  border-radius: 3px;
  background-color: ${(p) => p.bgcolor};
  a {
    display: block;
    color: ${(p) => p.fgcolor};
    text-decoration: none;
    padding: 10px 20px;
  }
`;

const LinkButton = (props) => {
  return (
    <LinkButtonStyle {...props}>
      <Link to={props.to}>{props.title}</Link>
    </LinkButtonStyle>
  );
};

// PropTypes
LinkButton.propTypes = {
  to: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  bgcolor: PropTypes.string,
  fgcolor: PropTypes.string,
};
// defaultProps
LinkButton.defaultProps = {
  to: '',
  title: '(no title)',
  bgcolor: '#333',
  fgcolor: '#fff',
};

export default LinkButton;
