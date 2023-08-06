import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../../shared-order/components/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const CardStyle = styled.div`
  width: 90%;
  margin: auto;
  height: auto;
  background: #fff;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const CardTitleStyle = styled.div`
  width: 100%;
  height: auto;
  padding: 8px 40px;
  background: #31333e;
  text-align: center;
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  line-height: 125%;
  box-sizing: border-box;
`;

const CardChildren = styled.div`
  //  width: 80%;
  height: auto;
  margin: 15px auto;
  text-align: center;
`;

const NextButton = (props) => {
  if (!props.customButtons) {
    if (props.buttonTitle.length > 0) {
      return (
        <Button
          title={props.buttonTitle}
          bgcolor="#86BE27"
          fgcolor="#F7FAEE"
          onClick={props.onButtonClick}
          disabled={props.buttonDisabled}
          style={{ width: props.buttonWidth }}
        ></Button>
      );
    } else {
      return (
        <>
          {props.showButtonBack && (
            <Button
              bgcolor="#828282"
              fgcolor="#F7FAEE"
              onClick={props.handleBackClick}
              disabled={false}
            >
              <ArrowBackIcon />
              Quay lại
            </Button>
          )}
          <Button
            bgcolor="#86BE27"
            fgcolor="#F7FAEE"
            onClick={props.onButtonClick}
            disabled={props.buttonDisabled}
          >
            <ArrowForwardIcon />
            Tiếp tục
          </Button>
        </>
      );
    }
  } else {
    return props.customButtons;
  }
};

const SkipButton = (props) => {
  if (props.showButtonSkip) {
    return (
      <Button
        bgcolor="#808080"
        fgcolor="#F7FAEE"
        onClick={props.onButtonSkipClick}
        style={{ width: props.buttonWidth }}
      >
        Bỏ qua
      </Button>
    );
  } else {
    return null;
  }
};

const Card = (props) => {
  const buttonProps = { ...props };
  delete buttonProps.title;
  delete buttonProps.children;
  
  return (
    <CardStyle>
      <CardTitleStyle>{props.title}</CardTitleStyle>
      <CardChildren>{props.children}</CardChildren>
      <NextButton {...buttonProps} />
      <SkipButton {...buttonProps} />
    </CardStyle>
  );
};

// PropTypes
Card.propTypes = {
  title: PropTypes.string,
  buttonTitle: PropTypes.string,
  children: PropTypes.node,
  onButtonClick: PropTypes.func,
  buttonDisabled: PropTypes.bool,
  customButtons: PropTypes.node,
  showButtonSkip: PropTypes.bool,
  onButtonSkipClick: PropTypes.func,
  handleBackClick: PropTypes.func,
  showButtonBack: PropTypes.bool
};
// defaultProps
Card.defaultProps = {
  title: '(no title)',
  buttonTitle: '',
  onButtonClick: () => {
    /*nop*/
  },
  onButtonSkipClick: () => {
    /*nop*/
  },
  handleBackClick: () => {
    /*nop*/
  },
  buttonDisabled: false,
  customButtons: null,
  buttonWidth: null,
  showButtonBack: false
};

export default Card;
