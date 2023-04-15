/**
 * Page UnAuthorize
 */

// React
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';

// Material UI component
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Component
import HeaderAppBar from './HeaderAppBar';
import PageInnerWrap from './PageInnerWrap';

// Component shared
import Button from '../../shared/components/Button';
import PageContainer from '../../shared/components/PageContainer';
import PageInnerContainer from '../../shared/components/PageInnerContainer';
import FlashMessage from 'js/shared-order/components/FlashMessage';

import { S3_URL } from 'js/utils/helpers/const';


// Style
const useStyles = makeStyles({
  buttonController: {
    color: '#fff',
    borderRadius: '28px',
    padding: '12px 0',
    fontSize: '18px',
    width :"-webkit-fill-available",
    textAlign: 'center',
  },
  buttonAdd: {
    background: '#FFA04B',
    '&:hover': {
      background: '#FFA04B',
    },
  },
});


const PageThanksForCustomer = () => {
  // ordergroup_hash_id
  const ordergroup_hash_id = localStorage.getItem('ordergroupHash');
  const [filePathOfOrderGroup, setFilePathOfOrderGroup] = useState();
  const { shop_hash_id } = useParams();
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  const classes = useStyles();

  const getInfoOfOrdergroup = async () => {
    try {
      const response = await CustomerOrderApiService.getStatusOrdergroup(shop_hash_id, ordergroup_hash_id);

      if (response) {
        setFilePathOfOrderGroup(response.file_path);
      }
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  useEffect(() => {
    getInfoOfOrdergroup();
  }, []);

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  // ordergroup.file_path
  const file_path = filePathOfOrderGroup

  return (
    <PageContainer padding="0">
      <HeaderAppBar title="お会計" />
      <PageInnerWrap>
        <PageInnerContainer>
          <Box height="10%" textAlign="center" display="flex" alignItems="center"/>
          <Box height="30%" textAlign="center" alignItems="center" fontWeight={600} fontSize={'20px'}>
            ご来店ありがとうございました。
            <br></br>
            またのお越しをお待ちしております。
          </Box>
          <Box height="30%" textAlign="center" alignItems="center">
          { file_path ?
              <Button
                className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                onClick={()=> window.open(S3_URL + file_path, "_blank")}
              >
                レシートを表示
              </Button>
            : ''
            }
          </Box>
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

export default PageThanksForCustomer;
