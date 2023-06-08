import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

// Components(Material-UI)
import { Box } from '@material-ui/core';
import QRCode from 'qrcode';
import CircularProgress from '@material-ui/core/CircularProgress';

const ModalPreviewSNSLink = (props) => {
  // local state
  const [isLoading, setIsLoading] = useState(false);
  const [qrData, setQRData] = useState(null);

  useEffect(() => {
    if (props.open && props.link) {
      generateQRCode();
    }
  }, [props.open, props.link]);

  const generateQRCode = async () => {
    setIsLoading(true);
    try {
      const imageData = await QRCode.toDataURL(props.link);
      setQRData(imageData);
      setIsLoading(false);
    } catch (error) {
      props.showWarningMessage(error.message);
    }
  }

  const actionModal = () => {
    return (
      <Box textAlign="center">
        <ButtonCustom
          title="Quay lại"
          borderRadius="28px"
          bgcolor="#828282"
          borderColor="#828282"
          width="176px"
          onClick={props.onClose}
        />
      </Box>
    );
  };

  return (
    <Modal actions={actionModal()} open={props.open} title='QR code' minHeight='auto' maxHeight='auto' maxWidth='70%'>
      <Box display='flex' alignItems='center' justifyContent='center'>
        {isLoading
          ? <CircularProgress  style={{ marginLeft: 10, width: 20, height: 20 }}/>
          : <img
              src={qrData}
              style={{
                width: '350px',
              }}
            />
        }
      </Box>
    </Modal>
  );
};

// PropTypes
ModalPreviewSNSLink.propTypes = {
  open: PropTypes.bool,
  link: PropTypes.string,
  onClose: PropTypes.func,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalPreviewSNSLink.defaultProps = {
  open: false,
  link: null,
  onClose: () => {},
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalPreviewSNSLink;
