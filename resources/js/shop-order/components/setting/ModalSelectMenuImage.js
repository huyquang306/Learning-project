import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

//library
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

// Component
import Modal from '../../../shared-order/components/Modal';
import ButtonCustom from '../../../shared-order/components/Button';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import defaultMenuImage from '../../../assets/images/no-image.png';

const useStyles = makeStyles(() => ({
  contentDetail: {
    color: '#000000',
    fontSize: '18px',
    fontWeight: 400,
  },
  image: {
    borderRadius: '5px',
    marginTop: 32
  },
  inputUploadImage: {
    visibility: 'hidden',
    width: '0',
  },
  wrapButton: {
    '& button': {
      boxShadow:
        '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    },
  },
  contentCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const ModalSelectMenuImage = (props) => {
  const classes = useStyles();
  const inputRef = React.createRef();
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  const chooseFile = () => {
    inputRef.current.click();
  };

  const [image, setImage] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [hiddenButtonUpload, setHiddenButtonUpload] = useState(false);
  const [cropData, setCropData] = useState('#');
  const [fileName, setFileName] = useState('name-image');
  const [shop] = useContext(ShopInfoContext);

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    const reader = new FileReader();
    if (files[0].type.includes('image')) {
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
      setFileName(files[0].name);
      setHiddenButtonUpload(true);
    } else {
      setToast({
        isShow: true,
        message: 'Choose file with type is image',
        status: 'warning',
      });
    }
  };

  const getCropData = () => {
    setCropData(cropper.getCroppedCanvas().toDataURL());
  };

  const handleRotate = () => {
    cropper.rotate(90);
  };

  const hanldeUploadImage = async () => {
    try {
      const res = await ShopOrderApiService.uploadImageToS3(shop?.hashId, {
        file: cropper.getCroppedCanvas().toDataURL(),
      });
      getCropData();
      props.setMenuFiles(res.image_path);
      props.onClose();
      setHiddenButtonUpload(false);
      setImage(null);
    } catch (error) {
      props
    }
  };

  const actionModal = () => {
    return (
      <Box textAlign='center' className={classes.wrapButton}>
        <ButtonCustom
          title='戻る'
          borderRadius='28px'
          bgcolor='#828282'
          borderColor='#828282'
          width='176px'
          padding='8px 10px'
          onClick={() => {
            props.onClose();
            setImage(defaultMenuImage);
            setHiddenButtonUpload(false);
          }}
        />
        {!hiddenButtonUpload && (
          <ButtonCustom
            title='アップロード'
            borderRadius='28px'
            bgcolor='#FFA04B'
            borderColor='#FFA04B'
            width='176px'
            padding='8px 10px'
            onClick={chooseFile}
          />
        )}
        {hiddenButtonUpload && (
          <>
            <ButtonCustom
              title='回転'
              borderRadius='28px'
              bgcolor='#FFF'
              fgcolor='#FFA04B'
              borderColor='#FFA04B'
              width='176px'
              padding='8px 10px'
              variant='outlined'
              onClick={handleRotate}
            />
            <ButtonCustom
              title='保存'
              borderRadius='28px'
              bgcolor='#FFA04B'
              borderColor='#FFA04B'
              width='176px'
              padding='8px 10px'
              onClick={hanldeUploadImage}
            />
          </>
        )}
      </Box>
    );
  };

  return (
    <Modal
      actions={actionModal()}
      open={props.open}
      title={!hiddenButtonUpload ? '画像詳細' : '切り抜きと回転'}
      onClose={() => {
        getCropData();
        props.onClose();
      }}
      maxWidth='850px'
      maxHeight='65vh'
      minHeight='460px'
      overflowY='unset'
      customClass={classes.contentCenter}
    >
      <Box className={classes.contentDetail} mt={1} minWidth='100%'>
        <Box width={'100%'} display={'flex'} justifyContent={'center'}>
          <Box width={'100%'} display={!hiddenButtonUpload && 'none'}>
            <Cropper
              style={{ height: 400, width: '100%' }}
              initialAspectRatio={1}
              preview='.img-preview'
              src={image}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
              guides={true}
            />
          </Box>
          <Box display={hiddenButtonUpload && 'none'}>
            <img
              id='file'
              name='file'
              className={classes.image}
              width={'406px'}
              height={'291px'}
              src={defaultMenuImage}
            />
          </Box>
          <input
            type='file'
            id='choose-image'
            className={classes.inputUploadImage}
            ref={inputRef}
            onChange={onChange}
            accept='image/*'
          />
        </Box>
      </Box>
      <FlashMessage
        isOpen={toast.isShow}
        onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
        status={toast.status}
        message={toast.message}
      />
    </Modal>
  );
};

// PropTypes
ModalSelectMenuImage.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  setMenuFiles: PropTypes.func,
};

// defaultProps
ModalSelectMenuImage.defaultProps = {
  open: false,
  onClose: () => {
    /*nop*/
  },
  setMenuFiles: () => {},
};

export default ModalSelectMenuImage;
