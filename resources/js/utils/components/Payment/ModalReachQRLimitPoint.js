import React from 'react';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import {
  Box,
  Button,
} from '@material-ui/core';
import { useStylesReachQRLimitPoint as useStyles } from './styles';

const ModalReachQRLimitPoint = (props) => {
  const classes = useStyles();
  const {onShowChangeServicePlan} = props;
  
  const renderActions = () => (
    <>
      <ButtonCustom
        title='戻る'
        borderRadius='28px'
        bgcolor='#828282'
        borderColor='#828282'
        width='176px'
        onClick={props.onClose}
      />
      <Button
        className={classes.buttonSubmit}
        onClick={onShowChangeServicePlan}
      >
        契約はこちら
      </Button>
    </>
  );
  
  return (
    <Modal
      open={props.open}
      title='有料プラン移行のお知らせ'
      actions={renderActions()}
      maxHeight='auto'
      minHeight='200px'
    >
      <Box>
        <Box className={classes.modalContent}>
          <Box className={classes.textBlueColor}>QR数が上限に近づいています。</Box>
          <Box>有料プランへ変更をおすすめします。</Box>
        </Box>
      </Box>
    </Modal>
  );
};

// PropTypes
ModalReachQRLimitPoint.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onShowChangeServicePlan: PropTypes.func,
};

// defaultProps
ModalReachQRLimitPoint.defaultProps = {
  open: false,
  onClose: () => {},
  onShowChangeServicePlan: () => {},
};

export default ModalReachQRLimitPoint;
