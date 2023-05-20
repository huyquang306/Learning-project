import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';
import {
  Box,
  Button,
} from '@material-ui/core';
import { useStylesReachQRLimitPoint as useStyles } from './styles';

const ModalActionIsNotAuthority = (props) => {
  const history = useHistory();
  const classes = useStyles();
  
  const renderActions = () => (
    <>
      <Button
        className={classes.buttonSubmit}
        onClick={() => {
          history.push('/setting');
        }}
      >
        Back
      </Button>
    </>
  );
  
  return (
    <Modal
      open={props.open}
      title='Notice'
      actions={renderActions()}
      maxHeight='auto'
      minHeight='200px'
    >
      <Box>
        <Box className={classes.modalContent}>
          <Box>Please change your contract plan to use this function</Box>
        </Box>
      </Box>
    </Modal>
  );
};

// PropTypes
ModalActionIsNotAuthority.propTypes = {
  open: PropTypes.bool,
};

// defaultProps
ModalActionIsNotAuthority.defaultProps = {
  open: false,
};

export default ModalActionIsNotAuthority;
