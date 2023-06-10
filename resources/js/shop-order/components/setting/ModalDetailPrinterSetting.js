import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Utils from 'js/shared/utils';

// Component
import Modal from '../../../shared-order/components/Modal';
import ButtonCustom from '../../../shared-order/components/Button';
import CustomSelectorBase from 'js/shared/components/CustomSelectorBase';

import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Box, OutlinedInput } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  modalContent: {},
  buttonHeader: {
    textAlign: 'center',
    color: '#fff',
    fontSize: '18px',
    background: '#F2C94C',
    padding: '8px 20px',
    borderRadius: '28px',
    width: '220px',
    '&:hover': {
      background: '#F2C94C',
    },
  },
  contentDetail: {
    color: '#000000',
    fontSize: '18px',
    fontWeight: 400,
  },
  select: {
    width: '80%',
    color: '#828282',
    fontSize: '20px',
    height: '40px',
    marginRight: '24px',
    '@media (max-width: 600px)' : {
      margin: '0px'
    },
  },
  input: {
    width: '80%',
    color: '#4F4F4F',
    fontSize: '24px',
    height: '48px',
    borderRadius: '4px',
    // paddingLeft: '16px'
  },

  left: {
    fontSize: '18px',
    color: '#000',
    fontWeight: 400,
  },
  right: {
    fontSize: '24px',
    color: '#4F4F4F',
    fontWeight: 700,
  },
  printerData: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 600px)' : {
      flexDirection: 'column'
    },
  },
  label: {
    width: '60%',
    textAlign: 'center',
    '@media (max-width: 600px)' : {
      width: '80%',
      textAlign: 'left',
      marginBottom: '10px'
    },
  },
  inputData: {
    width: '40%',
    textAlign: 'left',
    '@media (max-width: 600px)' : {
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    },
  }
}));

const ModalDetailPrinterSetting = (props) => {
  const classes = useStyles();
  const [printerData, setPrinterData] = useState({
    model: '',
    name: '',
    ip: '',
    address: '',
  });
  const [inProgress, setInProgress] = useState(false);
  const [positions, setPositions] = useState([]);
  const [shop] = useContext(ShopInfoContext);

  useEffect(() => {
    if (Object.keys(props.printerDetailData).length === 0) {
      setPrinterData({
        position: '',
        model: '',
        name: '',
        ip: '',
        address: '',
      });
    } else {
      const printer = Utils.cloneDeep(props.printerDetailData);
      if (Utils.isNil(printer.position)) {
        printer.position = '';
      }
      if (Utils.isNil(printer.name)) {
        printer.name = '';
      }
      if (Utils.isNil(printer.model)) {
        printer.model = '';
      }
      if (Utils.isNil(printer.ip)) {
        printer.ip = '';
      }
      if (Utils.isNil(printer.address)) {
        printer.address = '';
      }
      setPrinterData(printer);
    }

    ShopOrderApiService.getPrinterPositions(shop.hashId)
      .then((response) => {
        const positions = [];
        for (const key in response) {
          const value = response[key];
          positions.push(value);
        }
        setPositions(positions);
      })
      .catch((error) => {
        if (error?.result?.errorCode === 'deactive_shop') {
          return;
        }
        props.showWarningMessage(JSON.stringify(error));
      });
  }, [props.printerDetailData]);

  const savePrinter = () => {
    let errors = [];
    validatePrinterPosition(printerData, errors);
    validateModel(printerData, errors);
    validateName(printerData, errors);
    validateIp(printerData, errors);
    validateMacAdress(printerData, errors);

    if (errors.length > 0) {
      props.showWarningMessage(JSON.stringify(errors));
    } else {
      setInProgress(true);
      if (Object.keys(props.printerDetailData).length === 0) {
        ShopOrderApiService.createPrinter(shop.hashId, printerData)
          .then(() => {
            setInProgress(false);
            props.showSuccessMessage('Tạo mới thành công');
            props.getPrinters();
            props.onClose();
          })
          .catch((error) => {
            setInProgress(false);
            props.showWarningMessage(error.message);
          });
      } else {
        const updatePrinterData = {
          model: printerData.model,
          name: printerData.name,
          ip: printerData.ip,
          address: printerData.address,
          position: printerData.position,
        };
        ShopOrderApiService.updatePrinter(
          shop.hashId,
          props.printerDetailData.hash_id,
          updatePrinterData
        )
          .then(() => {
            setInProgress(false);
            props.showSuccessMessage('Cập nhật thành công');
            props.getPrinters();
            props.onClose();
          })
          .catch((error) => {
            setInProgress(false);
            props.showWarningMessage(error.message);
          });
      }
    }
  };

  const validatePrinterPosition = (printerData, errors) => {
    const printerPositionValidate = {
      requiredErrorMessage: 'Vị trí máy in không được để trống',
    };

    if (Utils.isNil(printerData.position) || printerData.position === '') {
      errors.push(printerPositionValidate.requiredErrorMessage);
    }
    return errors;
  };

  const validateModel = (printerData, errors) => {
    const modelValidate = {
      requiredErrorMessage: 'Vui lòng nhập số hiệu máy in',
      maxLength: 20,
      maxLengthErrorMessage: 'Số hiệu máy in quá dài',
    };

    if (!Utils.isNil(printerData.model) && printerData.model.trim() !== '') {
      if (printerData.model.length > modelValidate.maxLength) {
        errors.push(modelValidate.maxLengthErrorMessage);
      }
    } else {
      errors.push(modelValidate.requiredErrorMessage);
    }
    return errors;
  };

  const validateName = (printerData, errors) => {
    const nameValidate = {
      requiredErrorMessage: 'Vui lòng nhập tên máy in',
      maxLength: 40,
      maxLengthErrorMessage: 'Tên máy in quá dài',
    };

    if (!Utils.isNil(printerData.name) && printerData.name.trim() !== '') {
      if (printerData.name.length > nameValidate.maxLength) {
        errors.push(nameValidate.maxLengthErrorMessage);
      }
    } else {
      errors.push(nameValidate.requiredErrorMessage);
    }
    return errors;
  };

  const validateIp = (printerData, errors) => {
    const ipValidate = {
      requiredErrorMessage: 'Vui lòng nhập địa chỉ IP của bạn',
      patternErrorMessage: 'Địa chỉ IP không đúng định dạng',
      maxLength: 20,
      maxLengthErrorMessage: 'Địa chỉ IP không được vượt quá 20 ký tự',
    };
    const ipAddressRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!Utils.isNil(printerData.ip) && printerData.ip.trim() !== '') {
      if (printerData.ip.length > ipValidate.maxLength) {
        errors.push(ipValidate.maxLengthErrorMessage);
      }
      if (!ipAddressRegex.test(printerData.ip)) {
        errors.push(ipValidate.patternErrorMessage);
      }
    } else {
      errors.push(ipValidate.requiredErrorMessage);
    }
    return errors;
  };

  const validateMacAdress = (printerData, errors) => {
    const addressValidate = {
      requiredErrorMessage: 'Vui lòng nhập tên máy in',
      maxLength: 20,
      maxLengthErrorMessage: 'Tên máy in quá dài',
    };

    if (!Utils.isNil(printerData.address) && printerData.address.trim() !== '') {
      if (printerData.address.length > addressValidate.maxLength) {
        errors.push(addressValidate.maxLengthErrorMessage);
      }
    } else {
      errors.push(addressValidate.requiredErrorMessage);
    }
    return errors;
  };

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
        <ButtonCustom
          title="Lưu"
          borderRadius="28px"
          bgcolor="#FFA04B"
          borderColor="#FFA04B"
          width="176px"
          onClick={savePrinter}
          disabled={inProgress}
        />
      </Box>
    );
  };

  const inputChanged = (event) => {
    const newPrinterData = Utils.cloneDeep(printerData);
    newPrinterData[event.target.name] = event.target.value;
    setPrinterData(newPrinterData);
  };

  const printerPositionChanged = (event) => {
    const newPrinterData = Utils.cloneDeep(printerData);
    newPrinterData.position = event.target.value;
    setPrinterData(newPrinterData);
  };

  return (
    <Modal actions={actionModal()} open={props.open} title="Cài đặt máy in" onClose={props.onClose}>
      <Box mt={8} mb={5}>
        <Box className={classes.printerData}>
          <Box className={classes.label}>
            ポジション
          </Box>
          <Box className={classes.inputData}>
            <CustomSelectorBase
              id="position"
              className={classes.select}
              value={printerData.position}
              optionArray={positions}
              onChange={(event) => printerPositionChanged(event)}
            />
          </Box>
        </Box>

        <Box mt={3} className={classes.printerData}>
          <Box className={classes.label}>
            番号
          </Box>
          <Box className={classes.inputData}>
            <OutlinedInput
              id="model"
              name="model"
              value={printerData.model}
              className={classes.input}
              labelWidth={0}
              onChange={(event) => inputChanged(event)}
            />
          </Box>
        </Box>

        <Box mt={3} className={classes.printerData}>
          <Box className={classes.label}>
            プリンター名
          </Box>
          <Box className={classes.inputData}>
            <OutlinedInput
              id="name"
              name="name"
              value={printerData.name}
              className={classes.input}
              labelWidth={0}
              onChange={(event) => inputChanged(event)}
            />
          </Box>
        </Box>

        <Box mt={3} className={classes.printerData}>
          <Box className={classes.label}>
            IPアドレス
          </Box>
          <Box className={classes.inputData}>
            <OutlinedInput
              id="ip"
              name="ip"
              value={printerData.ip}
              className={classes.input}
              labelWidth={0}
              onChange={(event) => inputChanged(event)}
            />
          </Box>
        </Box>

        <Box mt={3} className={classes.printerData}>
          <Box className={classes.label}>
            Macアドレス
          </Box>
          <Box className={classes.inputData}>
            <OutlinedInput
              id="address"
              name="address"
              value={printerData.address}
              className={classes.input}
              labelWidth={0}
              onChange={(event) => inputChanged(event)}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

// PropTypes
ModalDetailPrinterSetting.propTypes = {
  open: PropTypes.bool,
  printerDetailData: PropTypes.object,
  onClose: PropTypes.func,
  getPrinters: PropTypes.func,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalDetailPrinterSetting.defaultProps = {
  open: false,
  printerDetailData: {},
  onClose: () => {},
  getPrinters: () => {},
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalDetailPrinterSetting;
