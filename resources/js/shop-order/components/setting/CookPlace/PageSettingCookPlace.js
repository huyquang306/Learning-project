import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import Utils from 'js/shared/utils';

// Service
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Base Components
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import Footer from 'js/shared-order/components/Footer';
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import ModalSettingCookPlace from './ModalSettingCookPlace';

// Components(Material-UI)
import {
  Button,
  Box,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody, TableContainer
} from '@material-ui/core';

// Utils
import { useStylesPageSettingCookPlace } from './styles';
import {Add} from '@material-ui/icons';

const MAX_COOK_PLACES_NUMBER = 10;

const PageSettingCookPlace = (props) => {
  const classes = useStylesPageSettingCookPlace(props);
  const history = useHistory();
  const [shop] = useContext(ShopInfoContext);

  // local state
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });
  const [cookPlaces, setCookPlaces] = useState([]);
  const [isShowSetting, setIsShowSetting] = useState(false);
  const [isShowDelete, setIsShowDelete] = useState(false);
  const [selectedCookPlace, setSelectedCookPlace] = useState(null);

  useEffect(() => {
    getShopCookPlaces();
  }, []);

  const getShopCookPlaces = async () => {
    try {
      const cookPlacesDB = await ShopOrderApiService.getCookPlaces(shop.hashId);
      setCookPlaces(cookPlacesDB);
    } catch (error) {
      showWarningMessage(error.message);
    }
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

  const handleDeleteCookPlace = async () => {
    try {
      await ShopOrderApiService.deleteCookPlace(shop.hashId, selectedCookPlace.hash_id);

      let newCookPlaces = Utils.cloneDeep(cookPlaces);
      const cookPlaceIndex = cookPlaces.findIndex(cookTmp => selectedCookPlace && cookTmp.id === selectedCookPlace.id);
      if (cookPlaceIndex > -1) {
        newCookPlaces.splice(cookPlaceIndex, 1);
      }
      setCookPlaces(newCookPlaces);
      setSelectedCookPlace(null);
      setIsShowDelete(false);
      showSuccessMessage('削除しました。');
    } catch (error) {
      showWarningMessage(error.message);
    }
  }

  const actionDeleteCookPlace = () => (
    <Box textAlign="center">
      <ButtonCustom
        title="いいえ"
        borderRadius="28px"
        bgcolor="#828282"
        borderColor="#828282"
        width="176px"
        onClick={() => {
          setIsShowDelete(false);
          setSelectedCookPlace(null);
        }}
      />
      <ButtonCustom
        title="はい"
        borderRadius="28px"
        bgcolor="#FFA04B"
        borderColor="#FFA04B"
        width="176px"
        onClick={handleDeleteCookPlace}
      />
    </Box>
  );

  return (
    <>
      <PageContainer padding="0px" minHeight='auto' height='auto'>
        <HeaderAppBar title="調理場設定" />
        <PageInnerContainer padding='8px 16px 25px 16px' height='auto'>
          <Box className={classes.container}>
            <Box mt={1}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell classes={{root: classes.tableCell}} align='center' width='60%'>調理場名</TableCell>
                      <TableCell classes={{root: classes.tableCell}} align='center' width='40%'>操作</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {cookPlaces && cookPlaces.map((cookPlace, index) => (
                      <TableRow key={index}>
                        <TableCell
                          classes={{root: classes.tableCell}}
                          align='center'
                          component='th'
                          scope='row'
                        >
                          {cookPlace.name}
                        </TableCell>
                        <TableCell classes={{root: classes.tableCell}} align="center">
                          <Button
                            className={classes.button}
                            onClick={() => {
                              setSelectedCookPlace(cookPlace);
                              setIsShowSetting(true);
                            }}
                          >詳細</Button>
                          <Button
                            className={`${classes.button} ${classes.buttonDelete}`}
                            onClick={() => {
                              setSelectedCookPlace(cookPlace);
                              setIsShowDelete(true);
                            }}
                          >削除</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Footer padding="20px 10px">
              <Grid container justify="center" spacing={5}>
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
                    className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                    onClick={() => setIsShowSetting(true)}
                    disabled={cookPlaces.length >= MAX_COOK_PLACES_NUMBER}
                  >
                    <Add /> 追加する
                  </Button>
                </Grid>
              </Grid>
            </Footer>
          </Box>

          <ModalSettingCookPlace
            open={isShowSetting}
            onClose={() => {
              setIsShowSetting(false);
              setSelectedCookPlace(null);
            }}
            cookPlace={selectedCookPlace}
            cookPlaces={cookPlaces}
            setCookPlaces={setCookPlaces}
            showSuccessMessage={showSuccessMessage}
            showWarningMessage={showWarningMessage}
          />

          {/* modal delete CookPlace */}
          <Modal
            actions={actionDeleteCookPlace()}
            open={isShowDelete}
            title='調理場削除'
            onClose={() => {
              setIsShowDelete(false);
              setSelectedCookPlace(null);
            }}
          >
            <div className={classes.centerModal}>
              <h2>この調理場を削除しますか？</h2>
            </div>
          </Modal>
          {/* END modal delete CookPlace */}

          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />
        </PageInnerContainer>
      </PageContainer>
    </>
  );
};

PageSettingCookPlace.propTypes = {};
export default PageSettingCookPlace;
