/**
 * Page Pre Order
 */

 import axios from 'axios'

// React
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

// Material UI component
import { Grid, Container, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Component
import HeaderAppBar from './HeaderAppBar';
import PageInnerWrap from './PageInnerWrap';
import { getCookie } from 'js/utils/components/cookie/cookie.js';

// Component shared
import PageContainer from '../../shared/components/PageContainer';
import PageInnerContainer from '../../shared/components/PageInnerContainer';
import OrderFooter from '../../shared/components/OrderFooter';
import InstagramFooter from '../../shared/components/InstagramFooter';
import { onConnectWebSocket } from '../../utils/helpers/socket';
import FlashMessage from 'js/shared-order/components/FlashMessage';

const useStyles = makeStyles({
  preFooter: {
    left: 0,
    width: '100%',
    height:'30px',
    color:(props) => props.color,
    padding: (props) => props.padding,
    backgroundColor: (props) => props.bgColor,
    zIndex: '2',
  }
});


const PageInstagram = () => {
  const classes = useStyles();
  const history = useHistory();
  const { shop_hash_id } = useParams();
  const [feeds, setFeedsData] = useState([])
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const shop_name = params.get('shop_name') || localStorage.getItem('shopName');
  const { business_name } = useParams();
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  const token = getCookie('apptoken');
  const instagram_user_id = getCookie('instagramuserid');

  useEffect(() => {
      // this is to avoid memory leaks
      // (https://developer.mozilla.org/ja/docs/Web/API/AbortController)
      const abortController = new AbortController();

      async function fetchInstagramPost () {
        try{
          axios
          .get(`https://graph.facebook.com/v13.0/` + instagram_user_id + `?fields=business_discovery.username(` + business_name + `){media{comments_count,like_count,media_url,caption}}&access_token=` + token)
          .then((resp) => {
              // setFeedsData(resp.data.data)
              setFeedsData(resp.data.business_discovery.media.data)
          }).catch(() => {
            // 400エラー
            showWarningMessage('通信エラーのため表示できません。メニュー画面に戻ります。');
            sleep(3000).then(() => {
              history.push('/' + shop_hash_id);
            })
          })
        } catch (err) {
          // 通信エラー
          showWarningMessage('通信エラーのため表示できません。メニュー画面に戻ります。');
          sleep(3000).then(() => {
            history.push('/' + shop_hash_id);
          })
      }
      }

      // manually call the fetch function
      fetchInstagramPost();

      return () => {
          // cancel pending fetch request on component unmount
          abortController.abort();
      };
  }, [])

  const url = 'https://instagram.com/' + business_name  + '/'

  // sleep関数
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  // toastバーの表示
  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  // Connect to endpoint API Gateway
  useEffect(() => {
    // onConnectWebSocket(shop_hash_id);
  }, []);

  const backToMenu = () => {
    history.push('/' + shop_hash_id);
  };

  const handleBoostToInstagram = () => {
    history.push('/' + shop_hash_id + '/boost_to_instagram/' + business_name);
  };

  // スペーサー
  const Spacer = ({
    size,
    axis,
    style = {},
    ...delegated
  }) => {
    const width = axis === 'vertical' ? 1 : size;
    const height = axis === 'horizontal' ? 1 : size;
    return (
      <span
        style={{
          display: 'block',
          width,
          minWidth: width,
          height,
          minHeight: height,
          ...style,
        }}
        {...delegated}
      />
    );
  };

  return (
    <PageContainer padding="0" height='auto' minHeight='auto'>
      <HeaderAppBar title={shop_name} />
      <PageInnerWrap height='auto'>
        <PageInnerContainer padding="0px 0px 60px 0px">
          <Grid container>
            { feeds.map((feed) => (
              feed.media_url ? (
              <Grid item xs={4} key={feed.id}>
                <img src={feed.media_url}></img>
              </Grid>
              ) : ''
            ))}
            <Grid style={{
              position: 'absolute',
              bottom: '155px',
              left: '50px',
              opacity:'20%'
            }}
              >
              <a href={url} target="_BLANK" rel="noreferrer" style={{textDecoration: 'none'}}>
                <span
                  style={{
                    display: 'block',
                    minWidth: '100%',
                    minHeight: '60px',
                    textAlign: 'center',
                    fontSize: 'x-large',
                    color:'black',
                    textDecoration:'none'
                  }}
                >
                  <b>Instagramで続きを見る</b>
                </span>
              </a>
            </Grid>
          </Grid>
          <Spacer axis="vertical" size={70} />
          <FlashMessage
          isOpen={toast.isShow}
          onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
          status={toast.status}
          message={toast.message}
        />
        </PageInnerContainer>

        {/* Footer: */}
        <div
        onClick={() => handleBoostToInstagram()}
        >
        <InstagramFooter
          bgColor="#FFFFFF"
          color="#FFA04B"
          padding="6px"
        />
        </div>
        <OrderFooter
          bgColor="#FFA04B"
          padding="6px"
          buttonBack={() => backToMenu()}
        />

      </PageInnerWrap>
    </PageContainer>
  );
};

export default PageInstagram;
