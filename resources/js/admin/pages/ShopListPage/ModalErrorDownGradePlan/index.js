import React from 'react';
import PropTypes from 'prop-types';

// Component
import {
  Box,
} from '@material-ui/core';
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import { useStylesDownGradePlan as useStyles } from './styles';

const ModalErrorDownGradePlan = (props) => {
  const classes = useStyles();
  const {open, onClose} = props;

  const renderActions = () => (
    <>
      <ButtonCustom
        title='OK'
        borderRadius='28px'
        bgcolor='#F2994A'
        borderColor='#F2994A'
        width='176px'
        onClick={() => onClose(false)}
      />
    </>
  );

  return (
    <Modal
      title='確認'
      open={open}
      actions={renderActions()}
      maxWidth='480px'
      minHeight='150px'
    >
      <Box textAlign='center' className={classes.boxContent}>
        <Box className={classes.textModal} color='red'>
          プランを変更できません。
        </Box>
        <Box className={classes.textModal}>
          QR数上限を超えているため、プラン変更できません。
        </Box>
        <Box className={classes.textModal}>サポート窓口までお問い合わせください。</Box>
      </Box>
    </Modal>
  );
};

// PropTypes
ModalErrorDownGradePlan.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

// defaultProps
ModalErrorDownGradePlan.defaultProps = {
  open: false,
  onClose: () => {},
};

export default ModalErrorDownGradePlan;
