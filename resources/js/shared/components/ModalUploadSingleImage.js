import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import FlashMessage from 'js/shared-order/components/FlashMessage';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

import defaultMenuImage from 'js/assets/images/no-image.png';

const useStyles = makeStyles(() => ({
  contentDetail: {
    color: '#000000',
    fontSize: '18px',
    fontWeight: 400,
  },
  image: {
    borderRadius: '5px',
  },
  inputUploadImage: {
    visibility: 'hidden',
    width: '0',
  },
}));

const initImage = {
  file: null,
  base64Image: null,
};

const ModalUploadSingleImage = (props) => {
  const classes = useStyles();
  const inputRef = React.createRef();
  const [image, setImage] = useState(initImage);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  
  useEffect(() => {
    setImage(initImage);
  }, [ props.open ]);
  
  const chooseFile = () => {
    inputRef.current.click();
  };
  
  const handleFileChange = (event) => {
    let { files } = event.target;
    if (files.length) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        setImage({
          file: files[0],
          base64Image: reader.result,
        });
      };
      reader.onerror = (error) => {
        throw new error();
      };
    }
  };
  
  const takeWithCamera = () => {
    setToast({
      isShow: true,
      message: 'This feature is in development',
      status: 'warning',
    });
  };
  
  const onCloseModal = () => {
    props.onClose();
    props.onChangeFile(image);
  }
  
  const actionModal = () => {
    return (
      <Box textAlign="center">
        <ButtonCustom
          title="Back"
          borderRadius="28px"
          bgcolor="#828282"
          borderColor="#828282"
          width="176px"
          padding="8px 10px"
          onClick={ onCloseModal }
        />
        <ButtonCustom
          title="Take with camera"
          borderRadius="28px"
          bgcolor="#FFA04B"
          borderColor="#FFA04B"
          width="176px"
          padding="8px 10px"
          onClick={ takeWithCamera }
        />
        <ButtonCustom
          title="Choose a photo"
          borderRadius="28px"
          bgcolor="#FFA04B"
          borderColor="#FFA04B"
          width="176px"
          padding="8px 10px"
          onClick={ chooseFile }
        />
      </Box>
    );
  };
  
  return (
    <Modal
      actions={ actionModal() }
      open={ props.open }
      title={ props.title }
      onClick={ onCloseModal }
    >
      <Box className={ classes.contentDetail } mt={ 1 } mr={ 2 }>
        <Box width='100%' display='flex' justifyContent='center'>
          <img
            name="file"
            className={ classes.image }
            width='406px'
            height='291px'
            src={ image.base64Image ?? defaultMenuImage }
          />
          <input
            type="file"
            className={ classes.inputUploadImage }
            ref={ inputRef }
            onChange={ (event) => handleFileChange(event) }
            accept={ props.accept }
          />
        </Box>
      </Box>
      
      <FlashMessage
        isOpen={ toast.isShow }
        onClose={ isOpen => setToast({ ...toast, isShow: isOpen }) }
        status={ toast.status }
        message={ toast.message }
      />
    </Modal>
  );
};

// PropTypes
ModalUploadSingleImage.propTypes = {
  title: PropTypes.string,
  accept: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onChangeFile: PropTypes.func,
};

// defaultProps
ModalUploadSingleImage.defaultProps = {
  title: 'Upload File',
  accept: "image/*",
  open: false,
  onClose: () => {},
  onChangeFile: () => {},
};

export default ModalUploadSingleImage;
