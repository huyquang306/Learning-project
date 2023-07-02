import React from 'react';
import PropTypes from 'prop-types';

// Component
import {
  Box, Button,
} from '@material-ui/core';
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import { useStylesChangeShopStatus as useStyles } from './styles';

const ModalConfirmChangeShopStatus = (props) => {
  const classes = useStyles();
  const {open, onClose, handleSubmit} = props;

  const renderActions = () => (
    <>
      <ButtonCustom
        title='Quay lại'
        borderRadius='28px'
        bgcolor='#828282'
        borderColor='#828282'
        width='176px'
        onClick={onClose}
      />
      <Button
        className={classes.buttonSubmit}
        onClick={handleSubmit}
      >
        OK
      </Button>
    </>
  );

  return (
    <Modal
      title='Xác nhận'
      open={open}
      actions={renderActions()}
      maxWidth='480px'
      minHeight='150px'
    >
      <Box textAlign='center' className={classes.boxContent}>
        <Box className={classes.textModal}>
          Bạn có chắc chắn muốn thay đổi trạng thái cửa hàng không?
        </Box>
      </Box>
    </Modal>
  );
};

// PropTypes
ModalConfirmChangeShopStatus.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleSubmit: PropTypes.func,
};

// defaultProps
ModalConfirmChangeShopStatus.defaultProps = {
  open: false,
  onClose: () => {},
  handleSubmit: () => {},
};

export default ModalConfirmChangeShopStatus;
