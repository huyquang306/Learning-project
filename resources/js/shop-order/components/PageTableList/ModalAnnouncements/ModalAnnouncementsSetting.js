import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Utils from 'js/shared/utils';

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopApiService from 'js/shop/shop-api-service';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import {Box, Button, Grid} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useStylesAnnouncementSetting as useStyles} from './styles';

// Utils
import {checkValidation} from './validatetionAnnouncements';

const DEFAULT_ANNOUNCEMENT = {
  id: null,
  hash_id: null,
  content: '',
  businessHourIds: [],
}
const DEFAULT_TIME = '00:00:00';

const ModalAnnouncementsSetting = (props) => {
  const classes = useStyles();
  const {shop, setToast} = props;

  // state
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [businessHours, setBusinessHours] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [startTime, setStartTime] = useState(DEFAULT_TIME);
  const [endTime, setEndTime] = useState(DEFAULT_TIME);

  useEffect(() => {
    if (props.open) {
      getBusinessesShop();
      getAnnouncements();
    }
  }, [props.open]);

  const getBusinessesShop = async () => {
    try {
      setIsLoadingContent(true);
      const shopRes = await ShopApiService.getShop(shop.hashId);
      setBusinessHours(shopRes?.businessHours || []);
      setStartTime(shopRes.start_time || DEFAULT_TIME);
      setEndTime(shopRes.end_time || DEFAULT_TIME);
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
      setIsLoadingContent(false);
    }
  };

  const getAnnouncements = async () => {
    try {
      setIsLoadingContent(true);
      const announcementsRes = await ShopOrderApiService.getAnnouncements(shop.hashId);
      if (!announcementsRes || !announcementsRes.length) {
        announcementsRes.push({...DEFAULT_ANNOUNCEMENT});
      }
      setAnnouncements(announcementsRes);
      setIsLoadingContent(false);
    } catch (error) {
      setToast({ isShow: true, status: 'error', message: error.message });
      setIsLoadingContent(false);
    }
  }

  const handleSubmit = async () => {
    const errors = checkValidation(announcements);

    if (errors.length > 0) {
      setToast({ isShow: true, status: 'warning', message: errors[0] });
    } else {
      setIsLoadingSubmit(true);
      try {
        await ShopOrderApiService.updateAnnouncement(shop.hashId, {announcements});
        setIsLoadingSubmit(false);
        setToast({ isShow: true, status: 'success', message: 'お知らせの設定が更新されました。' });
      } catch (error) {
        setToast({ isShow: true, status: 'error', message: error.message });
        setIsLoadingSubmit(false);
      }
    }
  }

  const handleChange = (event, announcementIndex) => {
    let announcementsClone = Utils.cloneDeep(announcements);
    const {name, value} = event.target;
    announcementsClone[announcementIndex][name] = value;
    setAnnouncements(announcementsClone);
  }

  const handleClickBusiness = (announcementIndex, business) => {
    let announcementsClone = Utils.cloneDeep(announcements);
    // unselected business of this announcements
    if (announcementsClone[announcementIndex].businessHourIds.includes(business.id)) {
      announcementsClone[announcementIndex].businessHourIds = announcementsClone[announcementIndex].businessHourIds
        .filter(businessId => businessId !== business.id);

      setAnnouncements(announcementsClone);
      return;
    }

    // unselected business of all announcements
    announcementsClone = announcementsClone.map(announce => {
      if (announce.businessHourIds.includes(business.id)) {
        announce.businessHourIds = announce.businessHourIds
          .filter(businessId => businessId !== business.id);
      }

      return announce;
    });
    announcementsClone[announcementIndex].businessHourIds.push(business.id);
    setAnnouncements(announcementsClone);
  }

  const handleNewAnnouncement = () => {
    let announcementsClone = Utils.cloneDeep(announcements);
    announcementsClone.push({...DEFAULT_ANNOUNCEMENT});
    setAnnouncements(announcementsClone);
  }

  const isBusinessSelected = (announcement, business) => !!announcement.businessHourIds.includes(business.id);

  const getBusinessesUnSelected = () => businessHours.filter(business => {
    const isSelected = announcements.find(announce => announce.businessHourIds.includes(business.id));

    return !isSelected;
  });

  const handleDeleteAnnouncement = (announcementIndex) => {
    let announcementsClone = Utils.cloneDeep(announcements);
    announcementsClone.splice(announcementIndex, 1);
    setAnnouncements(announcementsClone);
  }

  const renderActions = () => (
    <>
      {
        !isLoadingContent && (
          <>
            <ButtonCustom
              title="戻る"
              borderRadius="28px"
              bgcolor="#828282"
              borderColor="#828282"
              width="176px"
              onClick={props.onClose}
              classes={{
                root: classes.buttonBack,
              }}
            />
            <Button
              className={classes.buttonSubmit}
              onClick={handleSubmit}
              disabled={isLoadingSubmit}
            >
              保存する
              {
                isLoadingSubmit ? <CircularProgress  style={{ marginLeft: 10, width: 20, height: 20 }}/> : null
              }
            </Button>
          </>
        )
      }
    </>
  );

  return (
    <Modal open={props.open} title="お知らせ設定" actions={renderActions()}>
      <div className={classes.modalContent}>
        {
          isLoadingContent ? (
            <Box className={classes.loadingContent}>
              <CircularProgress style={{ marginLeft: 10, width: 20, height: 20 }}/>
            </Box>
          ) : (
            <Box className={classes.mainContent}>
              <Box>
                {
                  announcements.map((announcement, announcementIndex) => (
                    <Box key={announcementIndex} className={classes.itemBox}>
                      <Box>
                        <input
                          className={classes.itemInput}
                          name='content'
                          onChange={(e) => handleChange(e, announcementIndex)}
                          placeholder='お知らせ内容を入力してください'
                          value={announcement.content}
                        />
                      </Box>

                      <Box className={classes.itemBottomBox}>
                        <Grid container spacing={2} alignContent='center' alignItems='center' style={{ margin: 0 }}>
                          <Grid item xs={12} sm={2} className={classes.itemBottomBoxTitle}>掲載時間帯</Grid>

                          <Grid item xs={10} sm={8} className={classes.itemBottomBoxOptions}>
                            {
                              businessHours && businessHours.length === 0 ? (
                                <Box key='all-time-shop'>
                                  <Button
                                    classes={{
                                      root: classes.buttonSelectRoot,
                                      label: classes.buttonSelectLabel,
                                    }}
                                    className='selected disabled'
                                    disabled
                                  >{`${startTime} ~ ${endTime}`}</Button>
                                </Box>
                              ) : businessHours.map((business, businessIndex) => (
                                <Box key={businessIndex}>
                                  <Button
                                    classes={{
                                      root: classes.buttonSelectRoot,
                                      label: classes.buttonSelectLabel,
                                    }}
                                    className={isBusinessSelected(announcement, business) ? 'selected' : null}
                                    onClick={() => handleClickBusiness(announcementIndex, business)}
                                  >{business.name}</Button>
                                </Box>
                              ))
                            }
                          </Grid>

                          <Grid item xs={4} sm={2}>
                            <Button
                              className={classes.itemBottomBoxButtonDelete}
                              onClick={() => handleDeleteAnnouncement(announcementIndex)}
                            >削除</Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  ))
                }

                <Box>
                  <Button
                    className={classes.addButtonBoxInput}
                    onClick={handleNewAnnouncement}
                    disabled={getBusinessesUnSelected().length === 0 || businessHours.length <= announcements.length}
                  ><Add /> 追加する</Button>
                </Box>
              </Box>
            </Box>
          )
        }
      </div>
    </Modal>
  );
};

// PropTypes
ModalAnnouncementsSetting.propTypes = {
  open: PropTypes.bool,
  shop: PropTypes.object,
  onClose: PropTypes.func,
  setToast: PropTypes.func,
};

// defaultProps
ModalAnnouncementsSetting.defaultProps = {
  open: false,
  shop: {},
  onClose: () => {},
  setToast: () => {},
};

export default ModalAnnouncementsSetting;
