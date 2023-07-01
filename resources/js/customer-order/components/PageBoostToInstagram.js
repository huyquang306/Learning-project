/**
 * Page Pre Order
 */

// React
import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';

// Material UI component
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Component
import HeaderAppBar from './HeaderAppBar';
import PageInnerWrap from './PageInnerWrap';

// Component shared
import Button from 'js/shared/components/Button';
import PageContainer from '../../shared/components/PageContainer';
import PageInnerContainer from '../../shared/components/PageInnerContainer';
import { onConnectWebSocket } from '../../utils/helpers/socket';
import ModalBoostToInstagram from './ModalBoostToInstagram';

// Style
const useStyles = makeStyles({
  textMessage: {
    width: '100%',
    textAlign: 'center',
    marginLeft: '20px',
    marginRight: '20px',
    marginBottom: '30px'
  },
  supportMessage: {
    width: '100%',
    textAlign: 'center',
    marginLeft: '20px',
    marginRight: '20px',
  },
  textHashTag :{
    width: '100%',
    textAlign: 'center',
    marginLeft: '100px',
    marginRight: '100px',
    marginBottom: '30px'
  },
  imageInstagram: {
    display: 'inline',
    padding: '20px 0',
    width: '20vw',
  },
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
  buttonBack: {
    background: '#828282',
    '&:hover': {
      background: '#828282',
    },
  },
});

const PageBoostToInstagram = () => {
  const classes = useStyles();
  const history = useHistory();
  const { shop_hash_id, business_name } = useParams();
  const default_tag = '#飲食店を応援したい #オーダーアール';
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const shop_name = params.get('shop_name') || localStorage.getItem('shopName');

  const [isShowGoToInstagram, setIsShowGoToInstagram] = useState(false);

  const backToMenu = () => {
    history.push('/' + shop_hash_id + '/instagram/' + business_name);
  };

  // Instagram情報
  const comment = localStorage.getItem('instagram_comment');
  const hash_tag = localStorage.getItem('instagram_hash_tag');
  const link = localStorage.getItem('instagram_link');

  const tag_list = (hash_tag + ' ' + default_tag).split("#")
    .map((line, key, row) => {
      if(key === 0) {
        return;
      } else if(key + 1 === row.length) {
        return <span key={key}>#{line}</span>;
      }
      return <span key={key}>#{line}<br /></span>;
    })

  // インスタグラムを開いてからメニュー画面に戻る
  const goToMenuOpenInstagram = () => {
    // menu画面に戻る
    history.push('/' + shop_hash_id);

    // インスタグラムのアプリを開く
    window.open(link, '_blank');
  };

  // Connect to endpoint API Gateway
  useEffect(() => {
    // onConnectWebSocket(shop_hash_id);
  }, []);

  return (
    <PageContainer padding="0" height='auto' minHeight='auto'>
      <HeaderAppBar title={shop_name} />
      <PageInnerWrap height='auto'>
        <PageInnerContainer padding="0px 0px 30px 0px">
          <Grid item md={12}>
            <Grid container>
              <Grid item md={1} className={ classes.textMessage }></Grid>
              <Grid item md={3} sm={12} className={ classes.textMessage }>
                <b>SNSに写真を投稿してお店を応援しよう！</b>
              </Grid>
              <Grid item md={3} sm={12} className={ classes.textMessage }>
                <img
                  src={`${process.env.MIX_ASSETS_PATH}/img/shared/instagram.png`}
                  alt="instagram"
                  className={classes.imageInstagram}
                />
              </Grid>
              <Grid item md={3} sm={12} className={ classes.textMessage }>
                お店とメニューのハッシュタグをつけて<br />インスタに料理を投稿しよう！
              </Grid>
              <Grid item md={3} sm={12} className={ classes.textHashTag } style={{ border: "1px solid grey" }} >
                <u>{tag_list}</u>
              </Grid>
              <Grid item md={3} sm={12} className={ classes.supportMessage }>
                お店から一言！
              </Grid>
              <Grid item md={3} sm={12} className={ classes.supportMessage }>
                {comment}
              </Grid>
            </Grid>
          </Grid>
        </PageInnerContainer>

        {/* Footer: */}
        <div>
          <Button
            onClick={() => {
                setIsShowGoToInstagram(true);
                navigator.clipboard.writeText(hash_tag + ' ' + default_tag);
              }
            }
            className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
          >
          タグをコピーしてインスタ投稿
          </Button>
        </div>
        <br />
        <div>
          <Button
            onClick={() => backToMenu()}
            className={`${classes.buttonController} + ' ' + ${classes.buttonBack}`}
          >
          戻る
          </Button>
        </div>

        {/* Modal boost instagram */}
        <ModalBoostToInstagram
          open={ isShowGoToInstagram }
          onClose={ () => setIsShowGoToInstagram(false) }
          onSubmit={ () => goToMenuOpenInstagram() }
        />

      </PageInnerWrap>
    </PageContainer>
  );
};

export default PageBoostToInstagram;
