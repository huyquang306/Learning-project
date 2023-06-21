/**
 * Footer Order
 */

// React
import React from 'react';

// Library
import PropTypes from 'prop-types';

// Material UI component
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined';

const useStyles = makeStyles({
  footer: {
    position: 'fixed',
    bottom: '58px',
    left: 0,
    width: '100%',
    color:(props) => props.color,
    padding: (props) => props.padding,
    backgroundColor: (props) => props.bgColor,
    zIndex: '2',
    border: 'solid',
    borderColor: '#FFA04B'
  },
  imageInstagram: {
    display: 'inline',
    padding: '0 0',
    width: '15vw',
  }
});

const InstagramFooter = (props) => {
  const classes = useStyles(props);

  return (
    <Box className={classes.footer}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <VolumeUpOutlinedIcon
            fontSize="large"
          />
        </Box>
        <Box
          fontSize={18}
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          lineHeight={1.3}
        >
          <u>投稿で飲食店を応援しよう！</u>
        </Box>
        <Box>
          <img
            src={`${process.env.MIX_ASSETS_PATH}/img/shared/instagram.png`}
            alt="instagram"
            className={classes.imageInstagram}
          />
        </Box>
      </Box>
    </Box>
  );
};

// PropTypes
InstagramFooter.propTypes = {
  bgColor: PropTypes.string,
  padding: PropTypes.string,
  color:PropTypes.string,
};

InstagramFooter.defaultProps = {
  bgColor: '#ffffff',
  padding: '0 10px',
  color: '#FFA04B',
};

export default InstagramFooter;
