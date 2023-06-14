import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import Utils from 'js/shared/utils';

import ShopApiService from 'js/shop/shop-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Base Components
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import CustomSelectorBase from 'js/shared/components/CustomSelectorBase';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import Footer from 'js/shared-order/components/Footer';
import TimeSelector from 'js/shared/components/TimeSelector';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import {OutlinedInput, Button, Box, Grid} from '@material-ui/core';
import {Add, Remove} from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ModalPreviewSNSLink from './ModalPreviewSNSLink';

// Utils
import {checkValidation} from './validationSettingInfo';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  container: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#000',
    '@media (max-width: 960px)': {
      padding: '20px 20px 160px 20px',
    },
    padding: '20px 160px 90px'
  },
  input: {
    width: '100%',
    color: '#000',
    fontSize: '16px',
    height: '40px',
    borderRadius: '4px',
    textAlign: 'right',
    paddingRight: '15px',
    fontWeight: 600,
    '& .MuiInputBase-formControl': {
      paddingTop: '1px',
      paddingBottom: '1px',
    },
  },
  timeName: {
    '@media (max-width: 600px)': {
      padding: '0px !important'
    },
  },
  select: {
    width: '100%',
    height: '40px',
    color: '#000',
    textAlign: 'right',
    fontWeight: 600,
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
  iconAdd: {
    color: '#BDBDBD',
    fontSize: 30,
  },
  inputTimer: {
    height: '40px',
    minWidth: '120px',
    '@media (max-width: 600px)': {
      minWidth: '30%',
      maxWidth: '30%'
    },
  },
  middleTimer: {
    width: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  snsLinkPreview: {
    marginLeft: '10px',
    background: '#828282',
    color: '#fff',
    padding: '7px 10px',
    fontSize: '15px',
    textAlign: 'center',
    borderRadius: '28px',
    '&.Mui-disabled': {
      color: '#fff',
      opacity: 0.8,
      cursor: 'not-allowed',
    },
    '&:hover': {
      background: '#828282',
      color: '#fff',
      opacity: 0.9,
    },
  },
  btnAddTime: {
    marginLeft: '10px',
    '@media (max-width: 600px)': {
      padding: '0px 10px',
      marginLeft: '0px'
    },
  },
  timeSetting: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '@media (max-width: 600px)': {
      flexDirection: 'column'
    },
  },
  timeSettingText: {
    width: '30%',
    margin: '0px',
    '@media (max-width: 600px)': {
      width: '100%',
      margin: '0px 0px 10px 0px'
    },
  },
  timeSelect: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    width: '70%',
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
  snsSetting: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    '@media (max-width: 600px)': {
      flexDirection: 'column'
    },
  },
  snsSettingText: {
    width: '30%',
    '@media (max-width: 600px)': {
      width: '100%',
      margin: '0px 0px 10px 0px'
    },
  },
  snsSettingBody: {
    width: '70%',
    '@media (max-width: 600px)': {
      width: '100%',
    },
    '& :first-child': {
      display: 'block',
      flexDirection: 'row',
      '@media (max-width: 600px)': {
        display: 'flex',
      flexDirection: 'column',
      },
    },
    '& input': {
      padding: '0px'
    }
  },
  snsButtonPreview: {
    width: '30%',
    margin: '0px 0px 16px 0px',
    '@media (max-width: 960px)': {
      width: '100%',
      margin: '0px',
    },
    '@media (max-width: 600px)': {
      margin: '10px 0px 0px 0px',
    },
  },
  businessHourSetting: {
    display: 'flex',
    flexDirection: 'row',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
    },
  },
  businessHourSettingText: {
    width: '30%',
    '@media (max-width: 600px)': {
      width: '100%',
      margin: '0px 0px 10px 0px'
    },
  },
  businessHourSettingBody: {
    width: '70%',
    '@media (max-width: 600px)': {
      width: '100%',
      flexDirection: 'column'
    },
  },
  snsSettingSecondInput: {
    width: '100%',
    margin: '0px 0px 16px 0px',
    '@media (max-width: 960px)': {
      margin: '0px 0px 16px 0px',
      width: '50%',
    },
    '@media (max-width: 600px)': {
      margin: '0px 0px 10px 0px',
      width: '100%',
    },
  },
  snsSettingFirstInput: {
    width: '100%',
    '@media (max-width: 960px)': {
      width: '50%',
    },
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
  snsSettingThirdInput: {
    margin: '0px',
    display: 'flex',
    '@media (max-width: 960px)': {
      margin: '0px 0px 16px 0px',
    },
    '@media (max-width: 600px)': {
      flexDirection: 'column'
    },
  },
  timeSelectBlock: {
    '@media (max-width: 600px)': {
      width: '100%'
    },
  },
  inputBlock: {
    width: '100%',
    '@media (max-width: 600px)': {
      marginTop: '10px',
      width: '100%'
    },
  },
  addTime: {
    width: '100%',
    '@media (max-width: 600px)': {
      flexDirection: 'column'
    },
  },
  inputTimeName: {
    width: 'calc(60% + 25px)',
    marginLeft: '10px',
    '@media (max-width: 600px)': {
      marginLeft: '0px',
    },
  },
  inputData: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    width: '30%',
    '@media (max-width: 600px)': {
      width: '40%'
    },
  },
  printerData: {
    width: '70%',
    '@media (max-width: 600px)': {
      width: '60%'
    },
  }
}));
const styles = {
  iconAdd: {
    color: '#BDBDBD',
    fontSize: 30,
  },
};
const DEFAULT_BUSINESS_HOUR = {
  id: null,
  hash_id: null,
  name: '',
  start_time: '',
  finish_time: '',
};
const MAX_BUSINESS_HOUR = 4;
const DEFAULT_NAME_OPTIONS = [
  'Buổi sáng',
  'Buổi trưa',
  'Buổi tối',
  'Đêm',
];
const DEFAULT_SNS_LINK = {
  name: '',
  description: '',
  link: '',
}
const DEFAULT_INSTAGRAM_LINK = {
  name: 'instagram',
  link: '',
  comment: '',
  hash_tag: '',
}

const PageInfoSetting = (props) => {
  const classes = useStyles(props);
  const history = useHistory();

  // local state
  const [genreDataSelect, setGenreDataSelect] = useState([]);
  const [shopData, setShopData] = useState({
    name: '',
    genreValue: '',
    postalCode: '',
    address: '',
    phoneNumber: '',
    sns_links: [
      DEFAULT_SNS_LINK,
      DEFAULT_SNS_LINK,
    ],
    instagram_link : [
      DEFAULT_INSTAGRAM_LINK,
    ],
    businessHours: [],
    start_time: '',
    end_time: '',
    wifi_name: '',
    wifi_pass: '',
  });
  const [isSubmit , setIsSubmit] = useState(false);
  const [previewSNSLink , setPreviewSNSLink] = useState({
    open: false,
    link: null,
  });

  // shop context
  const [shop, setShopInfo] = useContext(ShopInfoContext);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  useEffect(() => {
    getGenre();
    getShop();

    return () => {
      console.debug('[PageInfoSetting] unmount(shop)');
    };
  }, [getGenre, getShop]);

  const getGenre = async () => {
    ShopApiService.getGenre()
      .then((result) => {
        const convertGenreDataSelect = result.map((genre) => {
          return { value: genre.code, label: genre.name };
        });
        setGenreDataSelect(convertGenreDataSelect);

        // if (result.length === 0) {
        //   history.push('/searchmap/');
        // }
      })
      .catch((error) => {
        showWarningMessage(error.message);
      });
  };

  const getShop = async () => {
    ShopApiService.getShop(shop.hashId)
      .then(shop => {
        // 店舗情報がなければ地図画面へ
        if (!shop) {
          history.push('/searchmap/');
        } else {
          let {sns_links} = shop;
          let {instagram_link} = shop;
          if (Object.keys(shop).length > 0) {
            if (Utils.isNil(shop.name)) {
              shop.name = '';
            }
            if (Utils.isNil(shop.postalCode)) {
              shop.postalCode = '';
            }
            if (Utils.isNil(shop.address)) {
              shop.address = '';
            }
            if (Utils.isNil(shop.phoneNumber)) {
              shop.phoneNumber = '';
            }
            if (!Utils.isNil(shop.genres) && shop.genres.length > 0) {
              shop.genreValue = shop.genres[0].code;
            } else {
              shop.genreValue = '';
            }
            if (Utils.isNil(shop.wifi_name)) {
              shop.wifi_name = '';
            }
            if (Utils.isNil(shop.wifi_pass)) {
              shop.wifi_pass = '';
            }
            if (Utils.isNil(shop.start_time)) {
              shop.start_time = '';
            }
            if (Utils.isNil(shop.end_time)) {
              shop.end_time = '';
            }

            // instagram_link
            if (instagram_link) {
              if (!instagram_link[0]) shop.instagram_link[0] = DEFAULT_INSTAGRAM_LINK;
            } else {
              shop.instagram_link = [
                DEFAULT_INSTAGRAM_LINK,
              ]
            }

            // snsLinks
            if (sns_links) {
              if (!sns_links[0]) shop.sns_links[0] = DEFAULT_SNS_LINK;
              if (!sns_links[1]) shop.sns_links[1] = DEFAULT_SNS_LINK;
            } else {
              shop.sns_links = [
                DEFAULT_SNS_LINK,
                DEFAULT_SNS_LINK,
              ]
            }
            setShopData({ ...shop });
          }
        }
      }).catch(error => {
        showWarningMessage(error.message);
      });
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

  const handleChangeInput = (event) => {
    const newShopData = Utils.cloneDeep(shopData);
    const {name, value} = event.target;
    newShopData[name] = value;
    setShopData(newShopData);
  };

  const genresChanged = (event) => {
    const newShopData = Utils.cloneDeep(shopData);
    if (!Utils.isNil(newShopData.genreValue)) {
      newShopData.genreValue = event.target.value;
    }
    setShopData(newShopData);
  };

  const handleChangeInputBusiness = (event, businessHourIndex) => {
    const newShopData = Utils.cloneDeep(shopData);
    const {name, value} = event.target;
    newShopData.businessHours[businessHourIndex][name] = value;
    setShopData(newShopData);
  };

  const handleChangeSNS = (event, snsIndex) => {
    const newShopData = Utils.cloneDeep(shopData);
    const {name, value} = event.target;
    newShopData.sns_links[snsIndex][name] = value;
    setShopData(newShopData);
  };

  const handleChangeInstagram = (event, snsIndex) => {
    const newShopData = Utils.cloneDeep(shopData);
    const {name, value} = event.target;
    newShopData.instagram_link[snsIndex][name] = value;
    setShopData(newShopData);
  };

  const makeBusinessUpdate = () => shopData.businessHours
    .filter(businessTmp => businessTmp?.name
      && businessTmp.name.trim() !== ''
      && businessTmp.start_time && businessTmp.finish_time
    );

  const handleUpdateClick = async () => {
    const errors = checkValidation(shopData);
    setIsSubmit(true);

    if (errors.length > 0) {
      showWarningMessage(errors[0]);
      setIsSubmit(false);
    } else {
      const {
        name,
        postalCode,
        address,
        phoneNumber,
        start_time,
        end_time,
        wifi_name,
        wifi_pass,
        sns_links,
        instagram_link,
      } = shopData;
      const updateShopGenreData = {
        genre: shopData.genreValue,
      };
      const updateShopData = {
        name,
        postal_code: postalCode,
        address,
        phone_number: phoneNumber,
        start_time,
        end_time,
        businessHours: makeBusinessUpdate(),
        wifi_name,
        wifi_pass,
        sns_links,
        instagram_link,
      };
      try {
        const shopResponse = await ShopApiService.updateShop(shop.hashId, updateShopData);
        await ShopApiService.updateShopGenre(shop.hashId, updateShopGenreData);

        showSuccessMessage('Cập nhật thành công');
        setIsSubmit(false);
        updateShopInfoToContext(shopResponse);
      } catch (error) {
        showWarningMessage(error.message);
        setIsSubmit(false);
      }
    }
  };

  const updateShopInfoToContext = (shopResponse) => {
    Object.keys(shop).forEach(key => {
      shop[key] = shopResponse[key];
    });
    setShopInfo(shop);
  };

  const handleAddBusinessHour = () => {
    let cloneShopData = Utils.cloneDeep(shopData);
    cloneShopData.businessHours.push({...DEFAULT_BUSINESS_HOUR});
    setShopData(cloneShopData);
  };

  const handleDeleteBusiness = (businessIndex) => {
    let cloneShopData = Utils.cloneDeep(shopData);
    cloneShopData.businessHours.splice(businessIndex, 1);
    setShopData(cloneShopData);
  };

  const handleShowPreviewSNSLink = (snsLink) => {
    setPreviewSNSLink({
      open: true,
      link: snsLink.link,
    })
  };

  return (
    <>
      {Object.keys(shopData).length > 0 && genreDataSelect.length > 0 ? (
        <PageContainer padding='0px'>
          <HeaderAppBar title='Cài đặt chung' />
          <PageInnerContainer padding='0px 0px 25px 0px'>
            <Box className={classes.container}>
              <React.Fragment>
                <Box className={classes.inputData}>
                  <Box className={classes.label}>Tên cửa hàng</Box>
                  <Box className={classes.printerData}>
                    <OutlinedInput
                      id='name'
                      name='name'
                      value={shopData.name}
                      className={classes.input}
                      labelWidth={0}
                      onChange={e => handleChangeInput(e)}
                      classes={{input: classes.input}}
                    />
                  </Box>
                </Box>

                <Box mt={2} className={classes.inputData}>
                  <Box className={classes.label}>Loại cửa hàng</Box>
                  <Box className={classes.printerData}>
                    <CustomSelectorBase
                      id='genres'
                      name='genres'
                      className={classes.select}
                      value={shopData.genreValue}
                      optionArray={genreDataSelect}
                      onChange={(event) => genresChanged(event)}
                    />
                  </Box>
                </Box>

                <Box mt={2} className={classes.inputData}>
                  <Box className={classes.label}>Mã bưu điện</Box>
                  <Box className={classes.printerData}>
                    <OutlinedInput
                      id='postal-code'
                      name='postalCode'
                      value={shopData.postalCode}
                      className={classes.input}
                      labelWidth={0}
                      onChange={e => handleChangeInput(e)}
                      classes={{
                        input: classes.input,
                      }}
                    />
                  </Box>
                </Box>

                <Box mt={2} className={classes.inputData}>
                  <Box className={classes.label}>Địa chỉ</Box>
                  <Box className={classes.printerData}>
                    <OutlinedInput
                      id='address'
                      name='address'
                      value={shopData.address}
                      className={classes.input}
                      labelWidth={0}
                      onChange={e => handleChangeInput(e)}
                      classes={{
                        input: classes.input,
                      }}
                    />
                  </Box>
                </Box>

                <Box mt={2} className={classes.inputData}>
                  <Box className={classes.label}>Số điện thoại</Box>
                  <Box className={classes.printerData}>
                    <OutlinedInput
                      id='phone-number'
                      name='phoneNumber'
                      value={shopData.phoneNumber}
                      className={classes.input}
                      labelWidth={0}
                      onChange={e => handleChangeInput(e)}
                      classes={{
                        input: classes.input,
                      }}
                    />
                  </Box>
                </Box>

                {/* Wifi */}
                <Box mt={2} className={classes.inputData}>
                  <Box className={classes.label}>Tên Wifi</Box>
                  <Box className={classes.printerData}>
                    <OutlinedInput
                      id='wifi-name'
                      name='wifi_name'
                      value={shopData.wifi_name}
                      className={classes.input}
                      labelWidth={0}
                      onChange={e => handleChangeInput(e)}
                      classes={{ input: classes.input }}
                    />
                  </Box>
                </Box>

                <Box mt={2} className={classes.inputData}>
                  <Box className={classes.label}>Mật khẩu Wifi</Box>
                  <Box className={classes.printerData}>
                    <OutlinedInput
                      id='wifi-pass'
                      name='wifi_pass'
                      value={shopData.wifi_pass}
                      className={classes.input}
                      labelWidth={0}
                      onChange={e => handleChangeInput(e)}
                      classes={{ input: classes.input }}
                    />
                  </Box>
                </Box>
                {/* END Wifi */}

                {/* Business Hours */}
                <Box className={classes.timeSetting} mt={2}>
                  <Box className={classes.timeSettingText}>Giờ mở cửa</Box>
                  <Box className={classes.timeSelect}>
                    <TimeSelector
                      name='start_time'
                      value={shopData.start_time}
                      onChange={e => handleChangeInput(e)}
                      className={classes.inputTimer}
                    />
                    <Box className={classes.middleTimer}>~</Box>
                    <TimeSelector
                      name='end_time'
                      value={shopData.end_time}
                      onChange={e => handleChangeInput(e)}
                      className={classes.inputTimer}
                    />
                    <Button
                      onClick={handleAddBusinessHour}
                      className={classes.btnAddTime}
                      disabled={shopData.businessHours.length >= MAX_BUSINESS_HOUR}
                    >
                      <Add style={styles.iconAdd}/> Thêm khung giờ
                    </Button>
                  </Box>
                </Box>

                {
                  shopData?.businessHours && shopData?.businessHours.length ? (
                    <Box mt={2} className={classes.businessHourSetting}>
                      <Box className={classes.businessHourSettingText}>Khung giờ mở cửa</Box>
                      <Box className={classes.businessHourSettingBody} alignItems='center'>
                        {
                          shopData.businessHours.map((businessHour, businessHourIndex) => (
                            <Box key={businessHourIndex} mb={2} display='flex' alignItems='center'>
                              <Box display='flex' alignItems='center' className={classes.addTime}>
                                <Box display={'flex'} className={classes.timeSelectBlock}>
                                  <TimeSelector
                                    name='start_time'
                                    value={businessHour.start_time}
                                    onChange={event => handleChangeInputBusiness(event, businessHourIndex)}
                                    className={classes.inputTimer}
                                  />
                                  <Box className={classes.middleTimer}>~</Box>
                                  <TimeSelector
                                    name='finish_time'
                                    value={businessHour.finish_time}
                                    onChange={event => handleChangeInputBusiness(event, businessHourIndex)}
                                    className={classes.inputTimer}
                                  />
                                </Box>
                                <Box display={'flex'} className={classes.inputBlock}>
                                  <Autocomplete
                                    className={classes.inputTimeName}
                                    id='name'
                                    freeSolo
                                    options={DEFAULT_NAME_OPTIONS}
                                    value={businessHour.name}
                                    style={{minWidth: '150px'}}
                                    name='name'
                                    renderInput={params => <TextField
                                      {...params}
                                      variant='outlined'
                                      className={`${classes.input} ${classes.timeName}`}
                                      name='name'
                                      onChange={event => handleChangeInputBusiness(event, businessHourIndex)}
                                    />}
                                    onChange={(event, newValue) => {
                                      const newEvent = {
                                        target: {
                                          name: 'name',
                                          value: newValue ? newValue : '',
                                        }
                                      }
                                      handleChangeInputBusiness(newEvent, businessHourIndex)
                                    }}
                                  />

                                  <Box width='10%'>
                                    <Button onClick={() => handleDeleteBusiness(businessHourIndex)}>
                                      <Remove style={styles.iconAdd}/>
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          ))
                        }
                      </Box>
                    </Box>
                  ) : null
                }
                {/* END Business Hours */}

                {/* SNS links */}
                <Box mt={2} className={classes.snsSetting}>
                  <Box className={classes.snsSettingText}>Tích hợp SNS</Box>
                  <Box className={classes.snsSettingBody}>
                    <Box>
                      <Box mb={2} className={classes.snsSettingFirstInput}>
                        <Box width={{md: '70%'}}>
                          <OutlinedInput
                            id='name'
                            name='name'
                            className={classes.input}
                            placeholder='Instagram'
                            value={shopData.instagram_link[0].name}
                            labelWidth={0}
                            classes={{ input: classes.input }}
                            disabled
                            readOnly
                          />
                        </Box>
                      </Box>
                      <Box className={classes.snsSettingSecondInput}>
                        <Box width={{md: '70%'}}>
                          <OutlinedInput
                            id='hash_tag'
                            name='hash_tag'
                            className={classes.input}
                            placeholder='Hashtag'
                            value={shopData.instagram_link[0].hash_tag}
                            labelWidth={0}
                            onChange={e => handleChangeInstagram(e, 0)}
                            classes={{ input: classes.input }}
                          />
                        </Box>
                      </Box>
                      <Box className={classes.snsSettingSecondInput}>
                        <Box width={{md: '70%'}}>
                          <OutlinedInput
                            id='comment'
                            name='comment'
                            className={classes.input}
                            placeholder='Mô tả'
                            value={shopData.instagram_link[0].comment}
                            labelWidth={0}
                            onChange={e => handleChangeInstagram(e, 0)}
                            classes={{ input: classes.input }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Box className={classes.snsSettingThirdInput}>
                      <Box width={{xs: '100%', md: '70%'}}>
                        <OutlinedInput
                          id='link'
                          name='link'
                          className={classes.input}
                          placeholder='URL（https://www.instagram.com/*******/）'
                          value={shopData.instagram_link[0].link}
                          labelWidth={0}
                          onChange={e => handleChangeInstagram(e, 0)}
                          classes={{ input: classes.input }}
                        />
                      </Box>
                      <Box className={classes.snsButtonPreview}>
                        <Button
                          className={classes.snsLinkPreview}
                          disabled={!shopData.instagram_link[0].link || shopData.instagram_link[0].link.trim() === ''}
                          onClick={() => handleShowPreviewSNSLink(shopData.instagram_link[0])}
                        >Xem trước mã QR</Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box mt={2} className={classes.snsSetting}>
                  <Box className={classes.snsSettingText}>Tài khoản mạng xã hội khác</Box>
                  <Box className={classes.snsSettingBody}>
                    <Box>
                      <Box mb={2} className={classes.snsSettingFirstInput}>
                        <Box width={{md: '70%'}}>
                          <OutlinedInput
                            id='name'
                            name='name'
                            className={classes.input}
                            placeholder='Facebook'
                            value={shopData.sns_links[0].name}
                            labelWidth={0}
                            onChange={e => handleChangeSNS(e, 0)}
                            classes={{ input: classes.input }}
                          />
                        </Box>
                      </Box>
                      <Box className={classes.snsSettingSecondInput}>
                        <Box width={{md: '70%'}}>
                          <OutlinedInput
                            id='description'
                            name='description'
                            className={classes.input}
                            placeholder='Mô tả'
                            value={shopData.sns_links[0].description}
                            labelWidth={0}
                            onChange={e => handleChangeSNS(e, 0)}
                            classes={{ input: classes.input }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Box className={classes.snsSettingThirdInput}>
                      <Box width={{xs: '100%', md: '70%'}}>
                        <OutlinedInput
                          id='link'
                          name='link'
                          className={classes.input}
                          placeholder='Link URL'
                          value={shopData.sns_links[0].link}
                          labelWidth={0}
                          onChange={e => handleChangeSNS(e, 0)}
                          classes={{ input: classes.input }}
                        />
                      </Box>
                      <Box className={classes.snsButtonPreview}>
                        <Button
                          className={classes.snsLinkPreview}
                          disabled={!shopData.sns_links[0].link || shopData.sns_links[0].link.trim() === ''}
                          onClick={() => handleShowPreviewSNSLink(shopData.sns_links[0])}
                        >Xem trước mã QR</Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box mt={2} className={classes.snsSetting}>
                  <Box className={classes.snsSettingText}>SNSアカウント2</Box>
                  <Box className={classes.snsSettingBody}>
                    <Box>
                      <Box mb={2} className={classes.snsSettingFirstInput}>
                        <Box width={{md: '70%'}}>
                          <OutlinedInput
                            id='name'
                            name='name'
                            className={classes.input}
                            placeholder='Tiktok'
                            value={shopData.sns_links[1].name}
                            labelWidth={0}
                            onChange={e => handleChangeSNS(e, 1)}
                            classes={{ input: classes.input }}
                          />
                        </Box>
                      </Box>
                      <Box className={classes.snsSettingSecondInput}>
                        <Box width={{md: '70%'}}>
                          <OutlinedInput
                            id='description'
                            name='description'
                            className={classes.input}
                            placeholder='Mô tả'
                            value={shopData.sns_links[1].description}
                            labelWidth={0}
                            onChange={e => handleChangeSNS(e, 1)}
                            classes={{ input: classes.input }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Box className={classes.snsSettingThirdInput}>
                      <Box width={{xs: '100%', md: '70%'}}>
                        <OutlinedInput
                          id='link'
                          name='link'
                          className={classes.input}
                          placeholder='Link URL'
                          value={shopData.sns_links[1].link}
                          labelWidth={0}
                          onChange={e => handleChangeSNS(e, 1)}
                          classes={{ input: classes.input }}
                        />
                      </Box>
                      <Box className={classes.snsButtonPreview}>
                        <Button
                          className={classes.snsLinkPreview}
                          disabled={!shopData.sns_links[1].link || shopData.sns_links[1].link.trim() === ''}
                          onClick={() => handleShowPreviewSNSLink(shopData.sns_links[1])}
                        >Xem trước mã QR</Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {/* END SNS links */}
              </React.Fragment>

              <Footer padding='20px 10px'>
                <Grid container justify='center' spacing={5}>
                  <Grid item>
                    <Button
                      onClick={() => history.push('/setting')}
                      className={`${classes.buttonController} + ' ' + ${classes.buttonBack}`}
                    >
                      Quay lại
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      onClick={handleUpdateClick}
                      className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                      disabled={isSubmit}
                    >
                      Lưu
                      {
                        isSubmit ? <CircularProgress  style={{ marginLeft: 10, width: 20, height: 20 }}/> : null
                      }
                    </Button>
                  </Grid>
                </Grid>
              </Footer>
            </Box>

            <ModalPreviewSNSLink
              open={previewSNSLink.open}
              onClose={() => {
                setPreviewSNSLink({
                  open: false,
                  link: null,
                })
              }}
              link={previewSNSLink.link}
              showSuccessMessage={showSuccessMessage}
              showWarningMessage={showWarningMessage}
            />

            <FlashMessage
              isOpen={toast.isShow}
              onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
              status={toast.status}
              message={toast.message}
            />
          </PageInnerContainer>
        </PageContainer>
      ) : null}
    </>
  );
};

PageInfoSetting.propTypes = {};
export default PageInfoSetting;
