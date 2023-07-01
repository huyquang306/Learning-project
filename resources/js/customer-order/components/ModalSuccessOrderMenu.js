import React from 'react';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';

// Components(Material-UI)
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from "../../shared/components/Button";

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

const styles = {
  footerButton: {
    width: '50%',
  },
};

const ModalSuccessOrderMenu = (props) => {
  const classes = useStyles();

  const renderModalActions = () => {
    return (
      <Button
        bgcolor="#f2994b"
        fgcolor="#ffffff"
        borderRadius="30px"
        padding="12px 20px"
        style={ styles.footerButton }
        onClick={() => props.onClose() }
      >
        OK
      </Button>
    );
  };

  return (
    <Modal
      open={ props.open }
      title='Thành công'
      onClose={ props.onClose }
      actions={ renderModalActions() }
      maxWidth='450px'
    >
      <div className={ classes.modalContent }>
        <Box textAlign='right'>
          <Box className={ classes.lineDetail }>
            <Box width='100%' textAlign='center'>Gọi thêm món thành công</Box>
          </Box>
        </Box>
      </div>
    </Modal>
  );
};

// PropTypes
ModalSuccessOrderMenu.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

// defaultProps
ModalSuccessOrderMenu.defaultProps = {
  open: false,
  onClose: () => {},
};

export default ModalSuccessOrderMenu;
