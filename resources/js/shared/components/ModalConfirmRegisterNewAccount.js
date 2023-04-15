import React from 'react';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';
import Button from 'js/shared/components/Button.js';

// Components(Material-UI)
import { Box } from '@material-ui/core';

const ModalConfirmRegisterNewAccount = (props) => {
  const cancelModal = () => {
    localStorage.removeItem('phoneNumber');
    props.signOut();
    window.location.href = process.env.MIX_BASENAME_SHOP_ORDER;
  }
  
  const confirmModal = () => {
    window.location.href = `${process.env.MIX_BASENAME_SHOP_ORDER}/regist`;
  }
  
  const actionModal = () => {
    return (
      <Box textAlign="center">
        <Button
          title="いいえ"
          borderRadius="28px"
          bgcolor="#828282"
          borderColor="#828282"
          width="120px"
          padding="5px 45px"
          onClick={cancelModal}
        />
        <Button
          title="はい"
          borderRadius="28px"
          bgcolor="#FFA04B"
          borderColor="#FFA04B"
          width="120px"
          padding="5px 45px"
          onClick={confirmModal}
        />
      </Box>
    );
  };
  
  return (
    <Modal
      actions={ actionModal() }
      open={props.open}
      title={ props.title }
      maxWidth='400px'
      minHeight='none'
    >
      <Box textAlign={'center'} padding={'40px 5px'}>
        このIDは登録されておりません。
        新しく店舗を登録しますか？
      </Box>
    </Modal>
  );
};

// PropTypes
ModalConfirmRegisterNewAccount.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  signOut: PropTypes.func,
};

// defaultProps
ModalConfirmRegisterNewAccount.defaultProps = {
  open: false,
  onClose: () => {},
  onSubmit: () => {},
  signOut: () => {},
  setIsSignedIn: () => {},
};

export default ModalConfirmRegisterNewAccount;
