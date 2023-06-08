import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Utils from 'js/shared/utils';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

import QRCode from 'qrcode';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Box, OutlinedInput, Grid, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';


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
    width: '100%',
    color: '#828282',
    fontSize: '20px',
    height: '40px',
    marginRight: '24px',
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
  buttonController: {
    color: '#fff',
    borderRadius: '5px',
    fontSize: '15px',
    width: '100px',
    textAlign: 'center',
  },
  buttonPrintQR : {
    background: '#FFFFFF',
    '&:hover': {
      background: '#FFFFFF',
    },
    color: '#FFA04B',
    border: '1px solid #FFA04B'
  }
}));

const ModalDetailTableSetting = (props) => {
  const classes = useStyles();
  const [tableData, setTableData] = useState({
    code: '',
  });
  const [inProgress, setInProgress] = useState(false);
  const [shop] = useContext(ShopInfoContext);
  // テーブルQR
  const [qrData, setQRData] = useState(null);
  // ローディング
  const [isLoading, setIsLoading] = useState(false);
  // 保存ボタン押下時
  const [isSave, setIsSave] = useState(false);

  // テーブルQR描画
  useEffect(() => {
    if (props.tableDetailData) {
      generateQRCode(props.tableDetailData);
    }
    setIsSave(false);
  }, [props.tableDetailData]);

  // Generate QR code
  const generateQRCode = async (table) => {
    setIsLoading(true);
    try {
      const smartOrderURL = localStorage.getItem('smartOrderURL') || window.location.host;
      let linkTableQR = `${shop.hashId}&table=${table.hash_id}`;
      let imageData = `${process.env.MIX_ASSETS_PATH}/img/shop/defaultQR.png`;

      if(table.hash_id) {
        imageData = await QRCode.toDataURL(`${smartOrderURL}/shop-or/table-register?redirect_url=${linkTableQR}`);
      }

      setQRData(imageData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      props.showWarningMessage(error.message);
    }
  }

  const regenerateTableQR = async (table) => {
    setInProgress(true);
    try {
      const response = await ShopOrderApiService.regenerateTableHashId(shop.hashId, table.hash_id);
        if(response) {
          await setInProgress(false);
          await props.showSuccessMessage('Tạo QR thành công');
          await props.getTables();
          await setTableData(response);

          props.tableDetailData.hash_id = await response.hash_id

          await setInProgress(false);
          await generateQRCode(response)
          await setIsSave(true)
        }

    } catch (error) {
      await setInProgress(false);
      await props.showWarningMessage(error.message);
    }
  }

  useEffect(() => {
    if (Object.keys(props.tableDetailData).length === 0) {
      resetTableData();
    } else {
      setTableData(props.tableDetailData);
    }
  }, [props.tableDetailData]);

  const resetTableData = () => {
    setTableData({
      code: '',
    });
  };

  const saveTable = () => {
    let errors = [];
    validateCode(tableData, errors);

    if (errors.length > 0) {
      props.showWarningMessage(errors);
    } else {
      setInProgress(true);
      if (Object.keys(props.tableDetailData).length === 0) {
        ShopOrderApiService.createTable(shop.hashId, tableData)
          .then((result) => {
            setInProgress(false);
            props.showSuccessMessage('Tạo bàn thành công');
            props.getTables();
            props.onClose();

            generateQRCode(result)
            setIsSave(true);
          })
          .catch((error) => {
            setInProgress(false);
            props.showWarningMessage(error.message.replace('Error:', ''));
          });
      } else {
        const updateTableData = {
          code: tableData.code,
        };

        if (updateTableData.code === props.tableDetailData.code) {
          setInProgress(false);
          props.showSuccessMessage('Cập nhật thành công');
          props.getTables();
          setIsSave(true);
          props.onClose();

          return;
        }

        ShopOrderApiService.updateTable(shop.hashId, props.tableDetailData.hash_id, updateTableData)
          .then(() => {
            setInProgress(false);
            props.showSuccessMessage('Cập nhật thành công');
            props.getTables();
            props.onClose();
            setIsSave(true);
          })
          .catch((error) => {
            setInProgress(false);
            if (error.result.errorCode === 'not_found') {
              props.showWarningMessage('Bàn không tồn tại');
            } else {
              props.showWarningMessage('Đã có lỗi xảy ra');
            }
          });
      }
    }
  };

  const validateCode = (tableData, errors) => {
    const codeValidate = {
      requiredErrorMessage: 'Tên bàn không được để trống',
      maxLength: 20,
      maxLengthErrorMessage: 'Tên bàn quá dài',
    };

    if (!Utils.isNil(tableData.code) && tableData.code.trim() !== '') {
      if (tableData.code.length > codeValidate.maxLength) {
        errors.push(codeValidate.maxLengthErrorMessage);
      }
    } else {
      errors.push(codeValidate.requiredErrorMessage);
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
          onClick={() => {
            props.onClose();
            setTableData(props.tableDetailData);
          }}
        />
        <ButtonCustom
          title={Object.keys(props.tableDetailData).length === 0 ? 'Lưu' : 'Lưu'}
          borderRadius="28px"
          bgcolor="#FFA04B"
          borderColor="#FFA04B"
          width="176px"
          onClick={saveTable}
          disabled={inProgress}
        />
      </Box>
    );
  };

  const closeModal = () => {
    return (
      <Box textAlign="center">
        <ButtonCustom
          title="Đóng"
          borderRadius="28px"
          bgcolor="#828282"
          borderColor="#828282"
          width="176px"
          onClick={props.onClose}
        />
      </Box>
    );
  };

  const codeChanged = (event) => {
    const newTableData = Utils.cloneDeep(tableData);
    newTableData[event.target.name] = event.target.value;
    setTableData(newTableData);
  };

  return (
    <Modal actions={isSave ? closeModal() : actionModal()} open={props.open} title="Chi tiết bàn" onClose={props.onClose}>
      <Box mt={8} mb={5}>
        <Box display={'flex'} alignItems={'center'}>
          <Box width={'60%'} textAlign={'center'}>
            Số bàn
          </Box>
          <Box width={'40%'} textAlign={'left'}>
            <OutlinedInput
              id="code"
              name="code"
              value={tableData.code}
              className={classes.input}
              labelWidth={0}
              onChange={(event) => codeChanged(event)}
            />
          </Box>
        </Box>
        <Box display='flex' alignItems='center' justifyContent='center'>
        {isLoading
          ? <CircularProgress  style={{ marginLeft: 10, width: 20, height: 20 }}/>
          : <img
              src={qrData}
              style={{
                width: '250px',
              }}
            />
        }
        </Box>
        {Object.keys(props.tableDetailData).length !== 0 ?
        <Box display='flex' alignItems='center' justifyContent='center'>
          <Grid item>
            <Button
              onClick={()=> regenerateTableQR(tableData)}
              className={`${classes.buttonController} + ' ' + ${classes.buttonPrintQR}`}
            >
              Tạo mã QR
            </Button>
          </Grid>
        </Box>
        : ''
        }
      </Box>
    </Modal>
  );
};

// PropTypes
ModalDetailTableSetting.propTypes = {
  open: PropTypes.bool,
  tableDetailData: PropTypes.object,
  onClose: PropTypes.func,
  getTables: PropTypes.func,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalDetailTableSetting.defaultProps = {
  open: false,
  tableDetailData: {},
  onClose: () => {},
  getTables: () => {},
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalDetailTableSetting;
