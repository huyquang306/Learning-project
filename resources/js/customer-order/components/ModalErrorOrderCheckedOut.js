import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';

// Components(Material-UI)
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  modalContent: {
    maxWidth: '470px',
  },
  right: {
    fontSize: '24px',
    color: '#4F4F4F',
    fontWeight: 700,
  },
  lineDetail: {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    marginTop: '40%',
    marginLeft: '10%',
    marginRight: '10%',
  },
}));

const ModalErrorOrderCheckedOut = (props) => {
  const classes = useStyles();

  return (
    <Modal
      open={props.open}
      title="警告"
      onClose={props.onClose}
      maxWidth="450px"
    >
      <div className={classes.modalContent}>
        <Box textAlign="right">
          <Box className={ classes.lineDetail }>
            <Box width={'100%'} textAlign={'center'}>
                注文はチェックアウトされました
            </Box>
          </Box>
        </Box>
      </div>
    </Modal>
  );
};

// PropTypes
ModalErrorOrderCheckedOut.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

// defaultProps
ModalErrorOrderCheckedOut.defaultProps = {
  open: false,
  onClose: () => {},
};

export default ModalErrorOrderCheckedOut;