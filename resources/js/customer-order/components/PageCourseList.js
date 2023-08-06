/**
 * Page Category Menu
 */

// React
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';

// Material UI component
import {Box, Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Component
import HeaderAppBar from './HeaderAppBar';
import PageInnerWrap from './PageInnerWrap';

// Component shared
import PageContainer from '../../shared/components/PageContainer';
import PageInnerContainer from '../../shared/components/PageInnerContainer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import OrderFooter from '../../shared/components/OrderFooter';

// Utils
import { renderUrlImageS3 } from 'js/utils/helpers/image';
import {formatPrice} from "../../utils/helpers/number";

// Style
const useStyles = makeStyles({
  btnFooter: {
    fontWeight: 600,
    margin: '3px',
  },
  pageBorder: {
    overflowY: 'scroll',
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
      backgroundImage: 'linear-gradient(#ffffff, rgba(255,255,255,0.6))',
      zIndex: '1',
    },

    '& .menuInfo': {
      position: 'absolute',
      bottom: '0',
      zIndex: '1',
      width: '100%',
      height: '26px',
      backgroundImage: 'linear-gradient(#ffffff, rgba(255,255,255,0.6))',
    },

    '& .prodPrice': {
      position: 'absolute',
      bottom: '0',
      right: '5px',
      padding: '0 8px',
      color: '#000000',
      fontWeight: 600,
    },
  },
  footerActions: {
    padding: '0px 15px 0px 15px',
    display: 'flex',
    width: '100%',
  },
});

const PageCourseList = () => {
  const classes = useStyles();
  const history = useHistory();
  const [courseList, setCoursesList] = useState([]);
  const { shopHashId } = useParams();
  const [priceDisplayMode, setPriceDisplayMode] = useState();
  const [currencyName, setCurrencyName] = useState('');
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  useEffect(() => {
    getCourses();
    getShopTaxInfo();
  }, [getCourses]);

  const getCourses = async () => {
    try {
      const response = await CustomerOrderApiService.getListOfCourse(shopHashId);
      setCoursesList(response);
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const getShopTaxInfo = async () => {
    try {
      const response = await CustomerOrderApiService.getShopTaxInfo(shopHashId);
      setPriceDisplayMode(response?.price_display_mode);
      setCurrencyName(response?.mCurrency?.name);
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const backToMasterScreen = () => {
    history.push(`/${shopHashId}`);
  };

  const handleSelectCourse = (course_hash_id, block_hash_id) => {
    history.push(`/${shopHashId}/course/${course_hash_id}/block/${block_hash_id}`);
  };

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  return (
    <PageContainer padding='0' height='auto' minHeight='auto'>
      <HeaderAppBar title='Danh sách set ăn' />
      <PageInnerWrap height='auto'>
        <PageInnerContainer padding='0px 0px 0px 0px'>
          <Box display='flex' height='100%' padding='0px 0px 60px 0px'>
            <Box flex={1} className={classes.pageBorder}>
              <Grid container>
                {courseList &&
                  courseList.map((course, index) => (
                    // <Box
                    //   key={index}
                    //   className={classes.prodItem}
                    //   onClick={() => handleSelectCourse(course.hash_id, course.block_hash_id)}
                    // >
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={index}
                      className={classes.prodItem}
                      onClick={() => handleSelectCourse(course.hash_id, course.block_hash_id)}
                    >
                      <Box className='prodName' fontSize={16} fontWeight={600}>
                        {course.name}
                      </Box>

                      {course.m_image_folder_path ? (
                        <img src={renderUrlImageS3(course.m_image_folder_path)} />
                      ) : (
                        <img
                          src={`${process.env.MIX_ASSETS_PATH}/img/shared/noimage.png`}
                          alt='banner'
                        />
                      )}

                      <Box className='menuInfo'>
                        <Box
                          className='prodPrice'
                          display='flex'
                          alignItems='baseline'
                          justifyContent='flex-end'
                          fontSize={16}
                        >
                          {/*{priceDisplayMode === 1*/}
                          {/*  ? course.current_price.price_unit_without_tax*/}
                          {/*  : course.current_price.price_unit_with_tax}*/}
                          {formatPrice(course.current_price.price_unit_with_tax)}
                          {currencyName}
                          {/*{priceDisplayMode === 1 && course.price_unit > 0 && '(Miễn thuế)'}*/}
                        </Box>
                      </Box>
                    {/*</Box>*/}
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Box>

          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />
        </PageInnerContainer>

        <OrderFooter bgColor='#FFA04B' padding='6px' buttonBack={backToMasterScreen} />
      </PageInnerWrap>
    </PageContainer>
  );
};

export default PageCourseList;
