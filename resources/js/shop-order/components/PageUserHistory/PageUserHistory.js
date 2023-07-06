import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Utils from 'js/shared/utils';

// Components(Material-UI)
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  OutlinedInput,
  TableHead,
  Button,
  Input,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import PageInnerWrap from 'js/shared-order/components/PageInnerWrap';
import BasicPagination from 'js/utils/components/pagination/BasicPagination';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import FlashMessage from 'js/shared-order/components/FlashMessage';

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Styles
import { userManagementStyles } from 'js/shop-order/components/PageUserHistory/styles';

//Modal
import ModalDetailUser from './ModalDetailUser';

const PageUserHistory = (props) => {
  const classes = userManagementStyles(props);
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const urlCurrentPage = params.get('current_page');
  const urlEmail = params.get('email') || '';
  const urlNickName = params.get('nick_name') || '';
  const urlPhoneNumber = params.get('phone_number') || '';
  const urlTimeStart = params.get('time_start') || '';
  const urlTimeEnd = params.get('time_end') || '';
  const history = useHistory();
  const [filterUser, setFilterUser] = useState({
    email: '',
    nick_name: '',
    phone_number: '',
    timeStart: '',
    timeEnd: '',
  });
  const [shop] = useContext(ShopInfoContext);
  const [tableData, setTableData] = useState([]);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [pagination, setPagination] = useState({
    last_pages: 0,
    current_page: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [userDetailData, setUserDetailData] = useState({});

  useEffect(() => {
    let urlData = {};
    urlData.email = urlEmail;
    urlData.nick_name = urlNickName;
    urlData.phone_number = urlPhoneNumber;
    urlData.timeStart = urlTimeStart;
    urlData.timeEnd = urlTimeEnd;
    setFilterUser(urlData);
  }, [urlEmail, urlNickName, urlPhoneNumber, urlTimeStart, urlTimeEnd]);

  useEffect(() => {
    getUsers();
  }, [filterUser]);

  const getUsers = async (queryParams = {}) => {
    try {
      let data = {};
      if (urlEmail) {
        data.email = urlEmail;
      } else {
        data.email = queryParams?.email || '';
      }
      if (urlNickName) {
        data.nick_name = urlNickName;
      } else {
        data.nick_name = queryParams?.nick_name || '';
      }
      if (urlPhoneNumber) {
        data.phone_number = urlPhoneNumber;
      } else {
        data.phone_number = queryParams?.phone_number || '';
      }
      if (urlTimeStart) {
        data.timeStart = urlTimeStart;
      } else {
        data.timeStart = queryParams?.timeStart || '';
      }
      if (urlTimeEnd) {
        data.timeEnd = urlTimeEnd;
      } else {
        data.timeEnd = queryParams?.timeEnd || '';
      }
      if (queryParams.page) {
        data.page = queryParams.page || urlCurrentPage;
      } else if (urlCurrentPage) {
        data.page = urlCurrentPage;
      }
      const response = await ShopOrderApiService.getUserHistory(shop.hashId, data);
      setTableData(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const inputChanged = (event) => {
    let newData = Utils.cloneDeep(filterUser);
    let attribute = event.target.getAttribute('name');
    newData[attribute] = event.target.value;
    setFilterUser(newData);
  };

  const execFilterUser = () => {
    let page = 1;
    pushParameterToUrl(page);
    const filterData = getRequestParams();
    getUsers(filterData);
  };

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  const onChangePage = (event, value) => {
    pushParameterToUrl(value);
    const filterData = getRequestParams(value);
    getUsers(filterData);
  };

  const getRequestParams = (page) => {
    let filterData = {};

    if (!Utils.isNil(filterUser.email) && filterUser.email !== '') {
      filterData.email = filterUser.email;
    }
    if (!Utils.isNil(filterUser.nick_name) && filterUser.nick_name !== '') {
      filterData.nick_name = filterUser.nick_name;
    }
    if (!Utils.isNil(filterUser.phone_number) && filterUser.phone_number !== '') {
      filterData.phone_number = filterUser.phone_number;
    }
    if (!Utils.isNil(filterUser.timeStart) && filterUser.timeStart !== '') {
      filterData.timeStart = filterUser.timeStart;
    }
    if (!Utils.isNil(filterUser.timeEnd) && filterUser.timeEnd !== '') {
      filterData.timeEnd = filterUser.timeEnd;
    }
    if (page) {
      filterData.page = page;
    }
    return filterData;
  };

  const pushParameterToUrl = (page) => {
    const parameters = [];
    if (page) {
      parameters.push(`current_page=${page}`);
    } else if (pagination.current_page) {
      parameters.push(`current_page=${pagination.current_page}`);
    }
    if (filterUser.email) {
      parameters.push(`email=${filterUser.email}`);
    }
    if (filterUser.nick_name) {
      parameters.push(`nick_name=${filterUser.nick_name}`);
    }
    if (filterUser.phone_number) {
      parameters.push(`phone_number=${filterUser.phone_number}`);
    }
    if (filterUser.timeStart) {
      parameters.push(`time_start=${filterUser.timeStart}`);
    }
    if (filterUser.timeEnd) {
      parameters.push(`time_end=${filterUser.timeEnd}`);
    }
    history.push({
      search: '?' + parameters.join('&'),
    });
  };

  return (
    <PageContainer padding="0px">
      <HeaderAppBar title="Danh sách khách hàng" />
      <PageInnerWrap>
        <PageInnerContainer padding={'8px 16px'}>
          <Box flex={1} className={classes.head}>
            <Box className={classes.filterBlock}>
              <Box className={classes.filterBlockChildren}>
                <OutlinedInput
                  id="nick_name"
                  name="nick_name"
                  value={filterUser?.nick_name || ''}
                  className={classes.input}
                  labelWidth={0}
                  placeholder="Tên"
                  onChange={(event) => inputChanged(event)}
                />
                <OutlinedInput
                  id="phone_number"
                  name="phone_number"
                  value={filterUser?.phone_number || ''}
                  className={classes.input}
                  labelWidth={0}
                  placeholder="Số điện thoại"
                  onChange={(event) => inputChanged(event)}
                />
                <OutlinedInput
                  id="email"
                  name="email"
                  value={filterUser?.email || ''}
                  className={classes.input}
                  labelWidth={0}
                  placeholder="Email"
                  onChange={(event) => inputChanged(event)}
                />
              </Box>
              <Box className={classes.filterBlockChildren}>
                <Input
                  id="timeStart"
                  type="date"
                  name="timeStart"
                  defaultValue={filterUser?.timeStart || ''}
                  disableUnderline={true}
                  classes={{ root: `${classes.rootDate} ${classes.inputTime}` }}
                  onChange={(event) => inputChanged(event)}
                  />
                <Box className={classes.headerTitle}>~</Box>
                <Input
                  id="timeEnd"
                  type="date"
                  name="timeEnd"
                  defaultValue={filterUser?.timeEnd || ''}
                  disableUnderline={true}
                  classes={{ root: `${classes.rootDate} ${classes.inputTime}` }}
                  onChange={(event) => inputChanged(event)}
                />
                <Search className={classes.search} onClick={execFilterUser}></Search>
              </Box>
             
            </Box>

            <BasicPagination
              currentPage={pagination.current_page}
              totalPage={pagination.last_pages}
              onChange={onChangePage}
            />

            <Box mt={1}>
              <TableContainer component={Paper} className={classes.container}>
                <Table stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow classes={{ root: classes.tableHead }}>
                      <TableCell classes={{ root: classes.tableCell }} align="center">
                        Tên
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }} align="center">
                        Số điện thoại
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }} align="center">
                        Ngày đến cửa hàng gần nhất
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }} align="center">
                        Số lần ghé thăm
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }} align="center">
                        Thông tin khách hàng
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }} align="center">
                        Chi tiết
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData?.length > 0 &&
                      tableData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell
                            classes={{
                              root: classes.tableCell,
                            }}
                            align="center"
                            component="th"
                            scope="row"
                          >
                            {data.nick_name}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCellImage,
                            }}
                            align="center"
                          >
                            {data.phone_number}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCellDetail,
                            }}
                            align="center"
                          >
                            {data.last_check_out}
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tableCellDetail,
                            }}
                            align="center"
                          >
                            {data.times_order}
                          </TableCell>
                          <TableCell classes={{ root: classes.tableCell }} align="center">
                            <Button
                              className={`${classes.button} ${classes.buttonDetail}`}
                              onClick={() => {
                                setShowModal(true);
                                setUserDetailData(data);
                              }}
                            >
                              Xem thông tin
                            </Button>
                          </TableCell>
                          <TableCell classes={{ root: classes.tableCell }} align="center">
                            <Button
                              className={`${classes.button} ${classes.buttonDetail}`}
                              onClick={() => {
                                history.push('/users/history/order-detail/' + data.hash_id);
                              }}
                            >
                              Xem chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
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

          <ModalDetailUser
            open={showModal}
            userDetailData={userDetailData}
            onClose={() => setShowModal(false)}
            getUsers={getUsers}
          />

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

PageUserHistory.propTypes = {};
export default PageUserHistory;
