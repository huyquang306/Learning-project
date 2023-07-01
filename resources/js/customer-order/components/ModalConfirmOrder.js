import React from 'react';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';

// Components(Material-UI)
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from 'js/shared/components/Button';

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
  footerActions: {
    padding: '0px 15px 0px 15px',
    display: 'flex',
    width: '100%',
  },
  footerButton: {
    width: '100%',
  },
}));
const styles = {
  footerButton: {
    width: '100%',
  },
};

const ModalConfirmOrder = (props) => {
  const classes = useStyles();

  const ModalActions = () => {
    return (
      <Box className={classes.footerActions}>
        <Button
          bgcolor='#828282'
          fgcolor='#ffffff'
          borderRadius='30px'
          padding='12px 20px'
          style={styles.footerButton}
          onClick={props.onClose}
        >
          Quay lại
        </Button>
        <Button
          bgcolor='#f2994b'
          fgcolor='#ffffff'
          borderRadius='30px'
          padding='12px 20px'
          style={styles.footerButton}
          onClick={props.onSubmit}
          disabled={props.isSubmitLoading}
          isSubmitLoading={props.isSubmitLoading}
        >
          OK
        </Button>
      </Box>
    );
  };

  const menusQuantity = () => props.orders.reduce((sum, order) => sum + (order.quantity || 0), 0);

  return (
    <Modal
      open={props.open}
      title='Gọi món'
      onClose={props.onClose}
      actions={ModalActions()}
      maxWidth='450px'
    >
      <div className={classes.modalContent}>
        <Box textAlign='right'>
          <Box className={classes.lineDetail}>
            <Box width={'100%'} textAlign={'center'}>
              Bạn có muốn gọi thêm những món đã chọn？
            </Box>
          </Box>
        </Box>
      </div>
    </Modal>
  );
};

// PropTypes
ModalConfirmOrder.propTypes = {
  open: PropTypes.bool,
  orders: PropTypes.array,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  isSubmitLoading: PropTypes.bool
};

// defaultProps
ModalConfirmOrder.defaultProps = {
  open: false,
  orders: [],
  onClose: () => {},
  onSubmit: () => {},
  isSubmitLoading: false
};

export default ModalConfirmOrder;
