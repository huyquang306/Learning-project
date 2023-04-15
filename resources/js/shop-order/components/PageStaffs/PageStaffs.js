import React, { useState, useEffect, useContext } from 'react';

// Components(Material-UI)
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  TableHead,
  Button, Grid,
} from '@material-ui/core';
import { useHistory } from 'react-router';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import PageInnerWrap from 'js/shared-order/components/PageInnerWrap';
import BasicPagination from 'js/utils/components/pagination/BasicPagination';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import Footer from 'js/shared-order/components/Footer';
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import ModalAddStaff from './ModalAddStaff';

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Styles
import { userStylesPageStaff as useStyles } from './styles';
import {Add} from '@material-ui/icons';

const PageStaffs = (props) => {
  const classes = useStyles(props);
  const history = useHistory();

  // Context
  const [shop] = useContext(ShopInfoContext);

  // Local state
  const [staffs, setStaffs] = useState([]);
  const [isShowStaff, setIsShowStaff] = useState(false);
  const [isShowDelete, setIsShowDelete] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [pagination, setPagination] = useState({
    last_pages: 0,
    current_page: 0,
  });
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  useEffect(() => {
    getStaffs();
  }, []);

  const getStaffs = async (queryParams = {}) => {
    try {
      const response = await ShopOrderApiService.getStaffs(shop.hashId, queryParams);
      const {data, pagination} = response;
      const {current_page, last_pages} = pagination;
      setStaffs(data);
      setPagination(pagination);
      if (current_page > last_pages) {
        getStaffs({page: last_pages});
      }
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const onChangePage = (event, value) => {
    getStaffs({page: value});
  };

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

  const actionDeleteStaff = () => (
    <Box textAlign='center'>
      <ButtonCustom
        title='いいえ'
        borderRadius='28px'
        bgcolor='#828282'
        borderColor='#828282'
        width='176px'
        onClick={() => {
          setIsShowDelete(false);
          setSelectedStaff(null);
        }}
      />
      <ButtonCustom
        title='はい'
        borderRadius='28px'
        bgcolor='#FFA04B'
        borderColor='#FFA04B'
        width='176px'
        onClick={handleDeleteStaff}
      />
    </Box>
  );

  const handleDeleteStaff = async () => {
    try {
      await ShopOrderApiService.deleteStaff(shop.hashId, selectedStaff.hash_id);

      getStaffs({page: pagination.current_page});
      setIsShowDelete(false);
      showSuccessMessage('削除しました。');
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  return (
    <PageContainer padding='0px' minHeight='auto' height='auto'>
      <HeaderAppBar title='スタッフ設定'/>
      <PageInnerWrap>
        <PageInnerContainer padding='8px 16px 25px 16px' height='auto'>
          <Box flex={1} className={classes.head}>
            <Box mt={1}>
              <TableContainer component={Paper}>
                <Table stickyHeader aria-label='staffs table'>
                  <TableHead>
                    <TableRow classes={{ root: classes.tableHead }}>
                      <TableCell width='60%' classes={{ root: classes.tableCell }} align='center'>スタッフ名</TableCell>
                      <TableCell width='40%' classes={{ root: classes.tableCell }} align='center'>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      staffs && staffs.map((staff, index) => (
                        <TableRow key={index}>
                          <TableCell
                            classes={{ root: classes.tableCell }}
                            align='center'
                            component='th'
                            scope='row'
                          >
                            {staff.given_name}
                          </TableCell>

                          <TableCell classes={{ root: classes.tableCell }} align='center'>
                            <Button
                              className={`${classes.button} ${classes.buttonUpdate}`}
                              onClick={() => {
                                setSelectedStaff(staff);
                                setIsShowStaff(true);
                              }}
                            >
                              詳細
                            </Button>
                            <Button
                              className={`${classes.button} ${classes.buttonDelete}`}
                              onClick={() => {
                                setSelectedStaff(staff);
                                setIsShowDelete(true);
                              }}
                            >
                              削除
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>

              <BasicPagination
                currentPage={pagination.current_page}
                totalPage={pagination.last_pages}
                onChange={onChangePage}
              />
            </Box>
          </Box>

          <Footer padding='10px'>
            <Box textAlign='center'>
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
                    setSelectedStaff(null);
                    setIsShowStaff(true);
                  }}
                  className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                >
                  <Add /> 追加する
                </Button>
                </Grid>
              </Grid>
            </Box>
          </Footer>

          <ModalAddStaff
            open={isShowStaff}
            onClose={() => {
              setSelectedStaff(null);
              setIsShowStaff(false);
            }}
            staff={selectedStaff}
            getStaffs={getStaffs}
            currentPage={pagination.current_page}
            showSuccessMessage={showSuccessMessage}
            showWarningMessage={showWarningMessage}
          />

          {/* modal delete staff */}
          <Modal
            actions={actionDeleteStaff()}
            open={isShowDelete}
            title='スタッフ削除'
          >
            <div className={classes.centerModal}>
              <h2>本当に削除しますか。</h2>
            </div>
          </Modal>
          {/* END modal delete staff */}

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

PageStaffs.propTypes = {};
export default PageStaffs;
