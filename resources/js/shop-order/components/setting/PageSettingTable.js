import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';

// Base Components
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import PageInnerWrap from 'js/shared-order/components/PageInnerWrap';
import Footer from 'js/shared-order/components/Footer';
import FlashMessage from 'js/shared-order/components/FlashMessage';

import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

import ModalDetailTableSetting from 'js/shop-order/components/setting/ModalDetailTableSetting';
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

import { S3_URL } from 'js/utils/helpers/const';

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

const useStyles = makeStyles(() => ({
  container: {
    maxHeight: '750px',
  },
  tableCell: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4F4F4F',
    background: '#fff',
  },
  button: {
    background: '#FFA04B',
    color: '#FFFFFF',
    borderRadius: '28px',
    textAlign: 'center',
    margin: '5px',
    padding: '5px 32px',
    '&:hover': {
      background: '#FFA04B',
    },
    '@media (max-width: 600px)' : {
      padding: '5px',
    },
  },
  buttonDelete: {
    background: '#828282',
    color: '#FFFFFF',
    borderRadius: '28px',
    textAlign: 'center',
    margin: '5px',
    padding: '5px 32px',
    '&:hover': {
      background: '#828282',
    },
    '@media (max-width: 600px)' : {
      padding: '5px',
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
  buttonPrintQR : {
    background: '#FFFFFF',
    '&:hover': {
      background: '#FFFFFF',
    },
    color: '#FFA04B',
    border: '1px solid #FFA04B'
  }
}));

const PageTableSetting = (props) => {
  const classes = useStyles(props);

  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [tableDetailData, setTableDetailData] = useState({});
  const [inProgress, setInProgress] = useState(false);

  const history = useHistory();
  const [shop] = useContext(ShopInfoContext);
  const [tableData, setTableData] = useState([]);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  useEffect(() => {
    getTables();
  }, [getTables]);

  const getTables = async () => {
    ShopOrderApiService.getTables(shop.hashId)
      .then((tables) => {
        setTableData(tables);
      })
      .catch((error) => {
        showWarningMessage(error.message);
      });
  };

  const deleteTable = async () => {
    setInProgress(true);
    try {
      await ShopOrderApiService.deleteTable(shop.hashId, tableDetailData.hash_id);
      setInProgress(false);
      showSuccessMessage('xóa thành công');
      getTables();
      onClose();
    } catch (error) {
      setInProgress(false);
      if (error?.result?.errorCode == 'not_found') {
        showWarningMessage('Không tìm thấy');
      } else {
        showWarningMessage('Bàn này đang được sử dụng và không thể xóa được');
      }
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

  // テーブルQR一覧表示
  const getTableQRPreview = async () => {
    try {
      const response = await ShopOrderApiService.getTableQRPreview(shop.hashId)

      if (response) {
        await window.open(S3_URL + response.file_path, "_blank", "noreferrer")
      }
    } catch (error) {
      showWarningMessage(error.message);
    }
  }

  const onClose = () => setShowModalDelete(false);

  const actionModal = () => {
    return (
      <Box textAlign="center">
        <ButtonCustom
          title="Quay lại"
          borderRadius="28px"
          bgcolor="#828282"
          borderColor="#828282"
          width="176px"
          onClick={onClose}
        />
        <ButtonCustom
          title="Đồng ý"
          borderRadius="28px"
          bgcolor="#FFA04B"
          borderColor="#FFA04B"
          width="176px"
          onClick={deleteTable}
          disabled={inProgress}
        />
      </Box>
    );
  };

  return (
    <PageContainer padding="0px">
      <HeaderAppBar title="Danh sách bàn" />

      <PageInnerWrap>
        <PageInnerContainer padding={'20px'}>
          <Box>
            <Box mt={1}>
              <TableContainer component={Paper} className={classes.container}>
                <Table stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        classes={{
                          root: classes.tableCell,
                        }}
                        align="center"
                      >
                        Số bàn
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tableCell,
                        }}
                        align="center"
                      >
                        Bàn
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tableCell,
                        }}
                        align="center"
                      >
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData &&
                      tableData.map((table, index) => (
                        <TableRow key={index}>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align="center"
                            component="th"
                            scope="row"
                          >
                            {table.code}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align="center"
                          >
                            {table.code}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align="center"
                          >
                            <Button
                              className={classes.button}
                              onClick={() => {
                                setShowModalDetail(true);
                                setTableDetailData(table);
                              }}
                            >
                              Chi tiết
                            </Button>

                            <Button
                              className={classes.buttonDelete}
                              onClick={() => {
                                setShowModalDelete(true);
                                setTableDetailData(table);
                              }}
                            >
                              Xóa
                            </Button>
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
                      Quay lại
                    </Button>
                  </Grid>
                  {/*{tableData ?*/}
                  {/*  <Grid item>*/}
                  {/*    <Button*/}
                  {/*      onClick={()=> getTableQRPreview()}*/}
                  {/*      className={`${classes.buttonController} + ' ' + ${classes.buttonPrintQR}`}*/}
                  {/*    >*/}
                  {/*      Xem mã QR*/}
                  {/*    </Button>*/}
                  {/*  </Grid>*/}
                  {/*  : ''*/}
                  {/*}*/}
                  <Grid item>
                    <Button
                      onClick={() => {
                        setShowModalDetail(true);
                        setTableDetailData({});
                      }}
                      className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                    >
                      <Add /> Thêm bàn
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Footer>
          </Box>

          <ModalDetailTableSetting
            open={showModalDetail}
            tableDetailData={tableDetailData}
            onClose={() => setShowModalDetail(false)}
            getTables={getTables}
            showWarningMessage={showWarningMessage}
            showSuccessMessage={showSuccessMessage}
          />

          <Modal actions={actionModal()}
            open={showModalDelete}
            title="Xóa bàn"
          >
            <Box mt={8} mb={5}>
              <Box textAlign={'center'} marginTop={'25%'}>
                <h2>
                  Bạn có chắc chắn muốn xóa bàn không?
                </h2>
              </Box>
            </Box>
          </Modal>

          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />
        </PageInnerContainer>
      </PageInnerWrap>
    </PageContainer>
  );
};

PageTableSetting.propTypes = {};
export default PageTableSetting;
