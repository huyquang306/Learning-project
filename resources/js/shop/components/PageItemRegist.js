/*
 * Obento-R お弁当登録
 */

import React, { useState, useEffect, useContext } from 'react';
// import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

// Base Components
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import Footer from 'js/shop/components/Footer';
import Waiting from 'js/shared/components/Waiting';
import { styled, makeStyles } from '@material-ui/core/styles';

import Button from 'js/shared/components/Button.js';
import ButtonSquare from 'js/shared/components/ButtonSquare';
import Card from 'js/shared/components/Card';
import { Box, Container, Grid, TextField } from '@material-ui/core';

import { Link } from 'react-router-dom';

import ShopApiService, { ENDPOINTS } from 'js/shop/shop-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// icons
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles({
  buttonGrid: {
    textAlign: 'center',
  },
  linkBox: {
    margin: '20px auto',
  },
  thumbnail: {
    color: '#eee',
    textAlign: 'center',
    margin: '30px auto 40px auto',
    padding: '10px',
    boxSizing: 'border-box',
    width: '70%',
    height: 'auto',
    border: '1px solid #666',
    backgroundColor: '#aaa',
  },
});
const FormsContainer = styled(Container)({
  width: '95%',
});

const PageItemRegist = (props) => {
  const classes = useStyles(props);
  const history = useHistory();

  const [shop] = useContext(ShopInfoContext);
  const [step, setStep] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemPict, setItemPict] = useState(null);
  const [itemPictFile, setItemPictFile] = useState(null);

  const [wait, setWait] = useState(false);

  //
  // button disable
  //
  useEffect(() => {
    if (step >= cardList.length) {
      history.push('/item/list');
      return;
    }

    if (step === 1 && itemName.length === 0) {
      setButtonDisabled(true);
    } else if (step === 2 && Number(itemPrice) === 0) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [step]);

  //
  // form change
  //
  const handleInputChange = (event) => {
    const key = event.target.id;
    const value = event.target.value;
    const inputType = event.target.type;
    // console.debug('handleInputChange', key, value, typeof value);

    if (inputType === 'tel' && !/^\d*$/.test(value)) {
      return;
    }
    switch (key) {
      case 'itemName':
        setItemName(value);
        if (value.length > 0) {
          setButtonDisabled(false);
        } else {
          setButtonDisabled(true);
        }
        break;
      case 'itemPrice':
        {
          const price = Number(value);
          if (price === 0) {
            setItemPrice('');
          } else {
            setItemPrice(price);
          }

          if (price > 0) {
            setButtonDisabled(false);
          } else {
            setButtonDisabled(true);
          }
        }

        break;
      default:
    }
  };

  //
  // file selected
  //
  const handleFileCapture = (files) => {
    const file = files[0];
    // console.debug('handleFileCapture', files, file);
    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.onload = () => {
      setItemPict(reader.result);
      setStep((prev) => prev + 1);
    };
    reader.readAsDataURL(file);
    setItemPictFile(file);
  };

  //
  // button click
  //
  const handleClickRegistButton = () => {
    // console.debug('[PageItemRegist] go regist', itemName, itemPrice, itemPict);
    setWait(true);
    ShopApiService.request(ENDPOINTS.REGIST_ITEM, [shop.hashId], {
      name: itemName,
      price: itemPrice,
    })
      .then((result) => {
        // console.debug('[PageItemRegist] regist result', result);
        return ShopApiService.request(
          ENDPOINTS.REGIST_ITEM_IMG,
          [shop.hashId, result.hash_id],
          itemPictFile
        );
      })
      .then((imageResult) => {
        setWait(false);
        console.debug('[PageItemRegist] regist image result', imageResult);
        history.push('/item/list');
      })
      .catch((error) => {
        setWait(false);
        console.error('[PageItemRegist] regist error', error);
        alert(error);
      });
  };

  //
  // シナリオ
  //
  const cardList = [
    // === step 0 =========
    <Card
      title="お弁当の写真"
      key="photo"
      customButtons={(() => {
        return (
          <Box className={classes.linkBox}>
            <Link to="/item/list">←登録画面に戻る</Link>
          </Box>
        );
      })()}
    >
      <Grid container>
        <Grid item xs={6} className={classes.buttonGrid}>
          <ButtonSquare
            title="撮影する"
            bgcolor="#FFFFFF"
            fgcolor="#F8B62D"
            border="3px solid #F8B62D"
            borderRadius="6px"
            boxshadow="0px 4px 0px #D69C24"
            img={<CameraAltOutlinedIcon />}
            onClick={() => {
              const input = document.getElementById('takePicture');
              input.dispatchEvent(new MouseEvent('click'));
            }}
          >
            <input
              type="file"
              id="takePicture"
              accept="image/*"
              capture="environment"
              onChange={(event) => {
                console.debug('[PageItemRegist] takePicture onChange', event.target.files);
                handleFileCapture(event.target.files);
              }}
            />
          </ButtonSquare>
        </Grid>
        <Grid item xs={6} className={classes.buttonGrid}>
          <ButtonSquare
            title="写真を選ぶ"
            bgcolor="#FFFFFF"
            fgcolor="#F8B62D"
            border="3px solid #F8B62D"
            borderRadius="6px"
            boxshadow="0px 4px 0px #D69C24"
            img={<ImageOutlinedIcon />}
            onClick={() => {
              const input = document.getElementById('cameraRoll');
              input.dispatchEvent(new MouseEvent('click'));
            }}
          >
            <input
              type="file"
              id="cameraRoll"
              accept="image/*"
              onChange={(event) => {
                console.debug('[PageItemRegist] cameraRoll onChange', event.target.files);
                handleFileCapture(event.target.files);
              }}
            />
          </ButtonSquare>
        </Grid>
      </Grid>
    </Card>,

    // === step 1 =========
    <Card
      title="お弁当の名前"
      key="name"
      customButtons={(() => {
        return (
          <Box>
            <Button
              onClick={() => {
                setStep((prev) => prev - 1);
              }}
              bgcolor="#fff"
              fgcolor="#F8B62D"
              variant="outlined"
            >
              <ArrowBackIcon fontSize="small" />
              戻る
            </Button>
            <Button
              disabled={buttonDisabled}
              onClick={() => {
                setStep((prev) => prev + 1);
              }}
              bgcolor="#F8B62D"
            >
              進む
              <ArrowForwardIcon fontSize="small" />
            </Button>
          </Box>
        );
      })()}
    >
      <FormsContainer>
        <TextField
          id="itemName"
          inputProps={{
            maxLength: 30,
            type: 'text',
          }}
          variant="outlined"
          value={itemName}
          onChange={handleInputChange}
          placeholder="お弁当の名前を入力"
          fullWidth
        />
      </FormsContainer>
    </Card>,

    // === step 2 =========
    <Card
      title="お弁当の金額"
      key="price"
      customButtons={(() => {
        return (
          <Box className={classes.linkBox}>
            <Button
              onClick={() => {
                setStep((prev) => prev - 1);
              }}
              bgcolor="#fff"
              fgcolor="#F8B62D"
              variant="outlined"
            >
              <ArrowBackIcon fontSize="small" />
              戻る
            </Button>

            <Button disabled={buttonDisabled} onClick={handleClickRegistButton} bgcolor="#F8B62D">
              <AddIcon fontSize="small" />
              登録
            </Button>
          </Box>
        );
      })()}
    >
      <FormsContainer>
        <TextField
          id="itemPrice"
          inputProps={{
            maxLength: 10,
            type: 'tel',
          }}
          variant="outlined"
          value={itemPrice}
          onChange={handleInputChange}
          placeholder="税込の金額を入力してください"
          fullWidth
        />
      </FormsContainer>
    </Card>,
  ];

  return (
    <PageContainer padding="0px">
      <HeaderAppBar title="お弁当登録" />
      {/* debug >>>>>> */}
      {/* <form */}
      {/*   method="POST" */}
      {/*   action="/api/v1/shop/KQZCeZA/item/JYQ5ZxU/images" */}
      {/*   encType="multipart/form-data" */}
      {/* > */}
      {/*   <input type="file" name="file" /> */}
      {/*   <input type="submit" /> */}
      {/* </form> */}
      {/* <<<<<< debug */}

      <PageInnerContainer backgroundColor="rgba(200,200,200,0.4)">
        {cardList[step]}

        {(() => {
          if (itemPict) {
            return (
              <Container className={classes.thumbnail}>
                <img src={itemPict} alt="thumb" />
              </Container>
            );
          } else {
            return null;
          }
        })()}
      </PageInnerContainer>
      <Footer initialTabIndex={Number(0)}></Footer>
      <Waiting isOpen={wait} />
    </PageContainer>
  );
};
// PropTypes
PageItemRegist.propTypes = {};
export default PageItemRegist;
