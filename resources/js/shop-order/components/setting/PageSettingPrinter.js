import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import Utils from 'js/shared/utils';
import { find } from 'lodash';

// Base Components
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import IOSSwitch from 'js/utils/components/Switch/IOSSwitch';
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  Button,
  Box,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import ModalDetailPrinterSetting from './ModalDetailPrinterSetting';

import PageInnerWrap from 'js/shared-order/components/PageInnerWrap';
import Footer from 'js/shared-order/components/Footer';

const useStyles = makeStyles(() => ({
  container: {
    maxHeight: '460px',
  },
  tableCellHead: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#4F4F4F',
    background: '#fff',
    minWidth: '180px',
    '&:first-of-type': {
      minWidth: '80px'
    },
    '&:last-of-type': {
      minWidth: '250px'
    }
  },
  tableCell: {
    fontSize: '18px',
    fontWeight: 400,
    color: '#4F4F4F',
    background: '#fff',
  },
  button: {
    background: '#FFA04B',
    color: '#FFFFFF',
    borderRadius: '28px',
    textAlign: 'center',
    padding: '5px 32px',
    '&:hover': {
      background: '#FFA04B',
    },
  },
  buttonController: {
    color: '#fff',
    borderRadius: '28px',
    padding: '12px 0',
    fontSize: '18px',
    width: '252px',
    textAlign: 'center',
  },
  buttonAdd: {
    background: '#FFA04B',
    '&:hover': {
      background: '#FFA04B',
    },
  },
  buttonBack: {
    background: '#828282',
    '&:hover': {
      background: '#828282',
    },
  },
  centerModal: {
    minHeight: '360px',
    maxHeight: '420px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDelete: {
    background: '#828282',
    color: '#FFFFFF',
    '&:hover': {
      background: '#828282',
    },
    marginLeft: '10px',
  },
  actionButtons: {
    display: 'flex',
  }
}));

const PRINTER_STATUS_DISABLE = 0;
const PRINTER_STATUS_ENABLE = 1;

const PagePrinterSetting = (props) => {
  const classes = useStyles(props);

  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [printerDetailData, setPrinterDetailData] = useState({});

  const history = useHistory();
  const [shop] = useContext(ShopInfoContext);
  const [printerData, setPrinterData] = useState([]);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  useEffect(() => {
    getPrinters();
  }, [getPrinters]);

  const getPrinters = async () => {
    ShopOrderApiService.getPrinters(shop.hashId)
      .then((printers) => {
        ShopOrderApiService.getPrinterPositions(shop.hashId)
          .then((positions) => {
            if (printers.length) {
              printers.forEach((printer) => {
                if (!Utils.isNil(printer.position)) {
                  printer.positionItem = find(positions, { value: printer.position });
                }
              });
            }
            setPrinterData(printers);
          })
          .catch((error) => {
            if (error?.result?.errorCode === 'deactive_shop') {
              return;
            }
            showWarningMessage(error.message);
          });
      })
      .catch((error) => {
        if (error?.result?.errorCode === 'deactive_shop') {
          return;
        }
        showWarningMessage(error.message);
      });
  };

  const handleDeletePrinter = async () => {
    try {
      await ShopOrderApiService.deletePrinter(shop.hashId, printerDetailData.hash_id);
      setPrinterDetailData({});
      setShowModalDelete(false);
      showSuccessMessage('削除しました。');
      getPrinters();
    } catch (error) {
      showWarningMessage(error.message);
    }
  }

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  const showSuccessMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'success',
    });
  };

  const actionDeletePrinter = () => (
    <Box textAlign='center'>
      <ButtonCustom
        title='いいえ'
        borderRadius='28px'
        bgcolor='#828282'
        borderColor='#828282'
        width='176px'
        onClick={() => {
          setShowModalDelete(false);
          setPrinterDetailData({});
        }}
      />
      <ButtonCustom
        title='はい'
        borderRadius='28px'
        bgcolor='#FFA04B'
        borderColor='#FFA04B'
        width='176px'
        onClick={handleDeletePrinter}
      />
    </Box>
  );

  const onChangeStatus = async (event, printer) => {
    const { target } = event;
    const newStatus = target.checked ? PRINTER_STATUS_ENABLE : PRINTER_STATUS_DISABLE;

    try {
      await ShopOrderApiService.updatePrinter(
          shop.hashId,
          printer.hash_id,
          {
            position: printer.position,
            status: newStatus
          }
      );

      let printersClone = Utils.cloneDeep(printerData);
      let updatedPrinterIndex = printersClone.findIndex(printerTmp => printerTmp.hash_id === printer.hash_id);
      if (updatedPrinterIndex > -1) {
        printersClone[updatedPrinterIndex].status = newStatus;
      }
      setPrinterData(printersClone);
      showSuccessMessage('更新しました。');
    } catch (error) {
      showWarningMessage(error.message);
    }
  }

  const showConfirmModal = (printer) => {
    setShowModalDelete(true);
    setPrinterDetailData(printer);
  }

  const showDetailPrinter = (printer) => {
    setShowModal(true);
    setPrinterDetailData(printer);
  }

  return (
    <PageContainer padding="0px">
      <HeaderAppBar title="プリンター設定" />

      <PageInnerWrap>
        <PageInnerContainer padding="20px">
          <Box>
            <Box mt={1}>
              <TableContainer component={Paper} className={classes.container}>
                <Table stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        classes={{
                          root: classes.tableCellHead,
                        }}
                        align="center"
                      >
                        利用中
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tableCellHead,
                        }}
                        align="center"
                      >
                        番号
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tableCellHead,
                        }}
                        align="center"
                      >
                        プリンター名
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tableCellHead,
                        }}
                        align="center"
                      >
                        IPアドレス
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tableCellHead,
                        }}
                        align="center"
                      >
                        Macアドレス
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tableCellHead,
                        }}
                        align="center"
                      >
                        ポジション
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tableCellHead,
                        }}
                        align="center"
                      >
                        ステータスコード
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tableCellHead,
                        }}
                        align="center"
                      >
                        操作
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {printerData &&
                      printerData.map((printer, index) => (
                        <TableRow key={index}>
                          <TableCell
                              classes={{
                                root: classes.tableCell,
                              }}
                              align="center"
                              component="th"
                              scope="row"
                          >
                            <IOSSwitch
                                checked={ printer.status === PRINTER_STATUS_ENABLE }
                                onChange={ e => onChangeStatus(e, printer) }
                            />
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align="center"
                            component="th"
                            scope="row"
                          >
                            {printer.model}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align="center"
                          >
                            {printer.name}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align="center"
                          >
                            {printer.ip}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align="center"
                          >
                            {printer.address}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align="center"
                          >
                            {printer.positionItem ? printer.positionItem.label : ''}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align="center"
                          >
                            {printer.status_code}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align="center"
                          >
                            <Box className={classes.actionButtons}>
                              <Button
                                className={classes.button}
                                onClick={() => showDetailPrinter(printer)}
                              >
                                詳細
                              </Button>
                              <Button
                                className={`${classes.button} ${classes.buttonDelete}`}
                                onClick={() => showConfirmModal(printer)}
                              >
                                削除
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Footer padding={'10px'}>
              <Box textAlign="center">
                <Grid spacing={5} container justify={'center'}>
                  <Grid item>
                    <Button
                      onClick={() => history.push('/setting')}
                      className={`${classes.buttonController} + ' ' + ${classes.buttonBack}`}
                    >
                      戻る
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => {
                        setShowModal(true);
                        setPrinterDetailData({});
                      }}
                      className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                    >
                      <Add /> 追加する
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Footer>
          </Box>

          <ModalDetailPrinterSetting
            open={showModal}
            printerDetailData={printerDetailData}
            onClose={() => setShowModal(false)}
            getPrinters={getPrinters}
            showWarningMessage={showWarningMessage}
            showSuccessMessage={showSuccessMessage}
          />

          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />

          {/* modal delete printer */}
          <Modal
            actions={actionDeletePrinter()}
            open={showModalDelete}
            title='プリンター削除'
          >
            <div className={classes.centerModal}>
              <h2>本当に削除しますか。</h2>
            </div>
          </Modal>
          {/* END modal delete printer */}

        </PageInnerContainer>
      </PageInnerWrap>
    </PageContainer>
  );
};

PagePrinterSetting.propTypes = {};
export default PagePrinterSetting;
