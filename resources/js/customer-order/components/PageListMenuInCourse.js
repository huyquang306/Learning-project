/**
 * Page Category Menu
 */

// React
import React, { useEffect, useState, Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';
import { getCookie } from 'js/utils/components/cookie/cookie.js';

// Material UI component
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Component
import HeaderAppBar from './HeaderAppBar';
import PageInnerWrap from './PageInnerWrap';
import Footer from './Footer';
import Modal from './Modal';

// Component shared
import Button from '../../shared/components/Button';
import PageContainer from '../../shared/components/PageContainer';
import PageInnerContainer from '../../shared/components/PageInnerContainer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
// Common AWS WebSocket components
import { onConnectWebSocket, onSendNotifyHasNewOrder } from '../../utils/helpers/socket';

// Utils
import { renderUrlImageS3 } from 'js/utils/helpers/image';

// Style
const useStyles = makeStyles({
  btnFooter: {
    fontWeight: 600,
    margin: '3px',
  },
  customButton: {
    minWidth: '53px',
    height: '53px',
    border: 0,
    lineHeight: '57px',
    fontSize: '27px',
    boxShadow: 'rgba(0, 0, 0, 0.3) 1px 1px 1px 0px',
    fontWeight: 600,
  },
  prodItem: {
    position: 'relative',
    border: '1px solid #BDBDBD',

    '&:before': {
      content: '""',
      display: 'block',
      paddingTop: 'calc(100% * 173 / 243 )',
    },

    '& img': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      objectFit: 'cover',
    },

    '& .prodName': {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      padding: '1px 5px',
      zIndex: '1',
      textAlign: 'center',
      backgroundImage: 'linear-gradient(#ffffff, rgba(255,255,255,0.6))',
    },
  },
  footerActions: {
    padding: '0px 15px 0px 15px',
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  tableHead: {
    fontWeight: 600,
    textAlign: 'center',
  },
});

const styles = {
  footerButton: {
    width: '50%',
  },
};

const PageListMenuInCourse = () => {
  const classes = useStyles();
  const userHashId = getCookie('userHashId') || '';
  const history = useHistory();
  const [menuList, setMenuList] = useState([]);
  const { shopHashId, courseHashId, blockHashId } = useParams();
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const ordergroupHash = localStorage.getItem('ordergroupHash');
  const [isShowModal, setIsShowModal] = useState(false);
  const [numberOfCustomer, setNumberOfCustomer] = useState();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  useEffect(() => {
    getMenuInCourse();
  }, [getMenuInCourse]);

  // Connect to endpoint API Gateway
  useEffect(() => {
    // onConnectWebSocket(shopHashId);
  }, []);

  const getMenuInCourse = async () => {
    try {
      const response = await CustomerOrderApiService.getDetailCourse(shopHashId, courseHashId);
      setMenuList(response);
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const handleDecrement = () => {
    let numberOfCustomerUpdate = parseInt(numberOfCustomer) - 1;
    setNumberOfCustomer(numberOfCustomerUpdate);
  };

  const handleIncrement = () => {
    let numberOfCustomerUpdate = parseInt(numberOfCustomer) + 1;
    setNumberOfCustomer(numberOfCustomerUpdate);
  };

  const showConfirmOrderCourse = () => {
    getStatusOrdergroup();
    setIsShowModal(true);
  };

  const getStatusOrdergroup = async () => {
    try {
      const response = await CustomerOrderApiService.getStatusOrdergroup(
        shopHashId,
        ordergroupHash
      );
      if (response) {
        setNumberOfCustomer(response.number_of_customers);
      }
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const confirmOrderCourse = async () => {
    setIsSubmitLoading(true);

    try {
      const data = {
        number_of_customers: numberOfCustomer,
        course_hash_id: courseHashId,
        block_hash_id: blockHashId,
        user_hash_id: userHashId,
      };
      const response = await CustomerOrderApiService.confirmOrderCourse(
        shopHashId,
        ordergroupHash,
        data
      );
      if (response) {
        // Push notification for shop update realtime data
        onSendNotifyHasNewOrder(shopHashId);
        // Back to master screen
        history.push(`/${shopHashId}`);
      }
    } catch (error) {
      showWarningMessage(error.message);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const ModalActions = () => {
    return (
      <Box className={classes.footerActions}>
        <Button
          bgcolor="#f2994b"
          fgcolor="#ffffff"
          borderRadius="30px"
          padding="12px 20px"
          style={styles.footerButton}
          disabled={isSubmitLoading}
          isSubmitLoading={isSubmitLoading}
          onClick={confirmOrderCourse}
        >
          OK
        </Button>
      </Box>
    );
  };

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  return (
    <PageContainer padding="0" height='auto' minHeight='auto'>
      <HeaderAppBar title="コース詳細" />
      <PageInnerWrap height='auto'>
        <PageInnerContainer padding="0px 0px 0px 0px">
          <Box p={1} height="100%" padding="0px 0px 79px 0px">
            <Box display="flex" height="120px">
              <Box flex={1}>
                <Box className={classes.prodItem} height="100%">
                  <Box className="prodName" fontSize={20} fontWeight={600}>
                    {menuList.name}
                  </Box>

                  {menuList.m_image_folder_path ? (
                    <img src={renderUrlImageS3(menuList.m_image_folder_path)} />
                  ) : (
                    <img
                      src={`${process.env.MIX_ASSETS_PATH}/img/shared/noimage.png`}
                      alt="banner"
                    />
                  )}
                </Box>
              </Box>
            </Box>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      classes={{
                        root: classes.tableHead,
                      }}
                    >
                      カテゴリ
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tableHead,
                      }}
                    >
                      商品名
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tableHead,
                      }}
                    >
                      写真
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menuList &&
                    menuList.menus &&
                    menuList.menus
                      .filter((item) => item.status === 'active')
                      .map((menu, index) => (
                        <Fragment key={index}>
                          <TableRow>
                            <TableCell
                              classes={{
                                root: classes.tableCell,
                              }}
                            >
                              {menu.m_menu_category &&
                                menu.m_menu_category.map((category, category_index) => (
                                  <Box mt={1} key={category_index}>
                                    {category.name}
                                  </Box>
                                ))}
                            </TableCell>
                            <TableCell
                              classes={{
                                root: classes.tableCell,
                              }}
                              align="left"
                            >
                              {menu.name}
                            </TableCell>
                            <TableCell
                              classes={{
                                root: classes.tableCellImage,
                              }}
                              align="center"
                              width={'90px'}
                            >
                              {menu.m_image_folder_path ? (
                                <img
                                  className={classes.menuImage}
                                  width={'56px'}
                                  height={'40px'}
                                  src={renderUrlImageS3(menu.m_image_folder_path)}
                                />
                              ) : (
                                '設定無し'
                              )}
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />
        </PageInnerContainer>

        <Footer bgColor="#FFA04B" padding="6px">
          <Box display="flex" justifyContent="center">
            <Box>
              <Button
                bgcolor="#ffffff"
                fgcolor="#333333"
                borderColor="red"
                classes={{
                  root: classes.btnFooter,
                }}
                style={{
                  boxShadow: 'none',
                  color: 'red',
                }}
                onClick={() => showConfirmOrderCourse()}
              >
                注文する
              </Button>
            </Box>
          </Box>
        </Footer>

        {/* Modal product  */}
        {isShowModal && (
          <Modal
            title="詳細"
            open={isShowModal}
            actions={ModalActions()}
            maxHeight="520px"
            maxWidth="330px"
            onClose={() => setIsShowModal(false)}
          >
            <Box fontWeight={600} fontSize={20} mb={2}>
              {menuList.name}
            </Box>
            <Box className={classes.prodItem}>
              {menuList.m_image_folder_path ? (
                <img src={renderUrlImageS3(menuList.m_image_folder_path)} />
              ) : (
                <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/noimage.png`} alt="banner" />
              )}
            </Box>
            <Box mt={1} />

            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Button
                padding="0"
                borderRadius="50%"
                bgcolor="#E4E1B0"
                fgcolor="#000000"
                classes={{
                  root: classes.customButton,
                }}
                onClick={() => handleDecrement()}
              >
                ー
              </Button>
              <Box display="flex" alignItems="baseline" fontSize={55} fontWeight="fontWeightBold">
                {numberOfCustomer}
                <Box fontSize={23} fontWeight="fontWeightRegular">
                  名
                </Box>
              </Box>
              <Button
                padding="0"
                borderRadius="50%"
                bgcolor="#F2994B"
                fgcolor="#ffffff"
                classes={{
                  root: classes.customButton,
                }}
                onClick={() => handleIncrement()}
              >
                ＋
              </Button>
            </Box>
          </Modal>
        )}
        {/* END Modal product  */}
      </PageInnerWrap>
    </PageContainer>
  );
};

export default PageListMenuInCourse;
