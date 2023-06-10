import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import Dialog from 'js/shared-order/components/Dialog';
import defaultMenuImage from 'js/assets/images/no-image.png';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Box, FormControlLabel, Checkbox } from '@material-ui/core';

// Utils
import { renderUrlImageS3 } from 'js/utils/helpers/image';

const useStyles = makeStyles(() => ({
  contentDetail: {
    color: '#000000',
    fontSize: '18px',
    fontWeight: 400,
  },
  image: {
    borderRadius: '5px',
  },
  buttonDownload: {
    textDecoration: 'none',
    color: '#FFA04B',
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

const ModalShowDetailImage = (props) => {
  const classes = useStyles();
  const { indexImageClicked, files, mainImage } = props;
  const [showDialog, setShowDialog] = useState(false);

  const execDeleteMenu = () => {
    setShowDialog(false);
    props.onClose();
    props.showSuccessMessage();
    props.execDeleteImage();
  };

  const hanldeDownloadImage = (value, name) => {
    fetch(value, {
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
    })
      .then((resp) => resp.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => props.showWarningMessage());
  };

  const actionModal = () => {
    return (
      <Box textAlign='center' className={classes.wrapButton}>
        <ButtonCustom
          title='Quay lại'
          borderRadius='28px'
          bgcolor='#828282'
          borderColor='#828282'
          width='176px'
          padding='8px 10px'
          onClick={props.onClose}
        />
        <ButtonCustom
          title='Xóa ảnh'
          borderRadius='28px'
          bgcolor='#FFF'
          borderColor='#ba000d'
          fgcolor='#ba000d'
          variant='outlined'
          width='176px'
          padding='8px 10px'
          onClick={() => setShowDialog(true)}
        />
        <ButtonCustom
          borderRadius='28px'
          bgcolor='#FFF'
          fgcolor='#FFA04B'
          variant='outlined'
          borderColor='#FFA04B'
          width='176px'
          padding='8px 10px'
          onClick={() =>
            hanldeDownloadImage(
              `${renderUrlImageS3(files[indexImageClicked])}`,
              `${moment().format('x')}.png`
            )
          }
        >
          Tải ảnh
        </ButtonCustom>
      </Box>
    );
  };

  return (
    <Modal
      actions={actionModal()}
      open={props.open}
      title='Xem chi tiết'
      onClose={() => {
        props.onClose;
      }}
      maxWidth='850px'
      maxHeight='65vh'
      minHeight='460px'
      overflowY='auto'
      customClass={classes.contentCenter}
    >
      <Box className={classes.contentDetail} mt={2}>
        <Box
          width={'100%'}
          display={'flex'}
          justifyContent={'center'}
          alignItems='center'
          flexDirection='column'
        >
          <img
            id='file'
            name='file'
            className={classes.image}
            width={'350px'}
            height={'auto'}
            src={files ? `${renderUrlImageS3(files[indexImageClicked])}` : defaultMenuImage}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={files && mainImage === files[indexImageClicked] ? true : false}
                name='checkbox-set-main-image'
                value={mainImage}
                color='default'
              />
            }
            label={<Box style={{ fontSize: 14 }}>Chọn làm hình ảnh chính</Box>}
            onChange={props.setMainImage}
          />
        </Box>
      </Box>
      <Dialog
        isOpen={showDialog}
        onClose={(isOpen) => setShowDialog(isOpen)}
        title='Xóa ảnh'
        message='Bạn có chắc muốn xóa ảnh này không?'
        onConfirm={() => execDeleteMenu()}
      />
    </Modal>
  );
};

// PropTypes
ModalShowDetailImage.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  setMenuFiles: PropTypes.func,
  showSuccessMessage: PropTypes.func,
  showWarningMessage: PropTypes.func,
  execDeleteImage: PropTypes.func,
  setMainImage: PropTypes.func,
};

// defaultProps
ModalShowDetailImage.defaultProps = {
  open: false,
  onClose: () => {
    /*nop*/
  },
  setMenuFiles: () => {},
  showSuccessMessage: () => {},
  showWarningMessage: () => {},
  execDeleteImage: () => {},
  setMainImage: () => {},
};

export default ModalShowDetailImage;
