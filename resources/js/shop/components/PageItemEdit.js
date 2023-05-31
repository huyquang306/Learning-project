/*
 * Obento-R お弁当アイテム編集
 */

import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

// Base Components
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import Footer from 'js/shop/components/Footer';
import Waiting from 'js/shared/components/Waiting';

import Button from 'js/shared/components/Button.js';
import ButtonMUI from '@material-ui/core/Button';
import ButtonSquare from 'js/shared/components/ButtonSquare';
import StepCard from 'js/shared/components/Card';
import { Box, Card, Container, Grid, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { styled, makeStyles } from '@material-ui/core/styles';
import ShopApiService, { ENDPOINTS } from 'js/shop/shop-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import Utils from 'js/shared/utils';
// icons
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

const FormsContainer = styled(Container)({
  width: '95%',
});
const useStyles = makeStyles({
  textCenter: {
    textAlign: 'center',
  },
  link: {
    color: '#000',
    display: 'block',
    marginBottom: '10px',
    '& .MuiSvgIcon-root': {
      verticalAlign: 'middle',
    },
  },
  loading: {
    marginTop: '30%',
    width: '100%',
    height: '20px',
    lineHeight: '20px',
    fontSize: '20px',
    textAlign: 'center',
    color: '#aaa',
  },
  thumbnail: {
    color: '#eee',
    textAlign: 'center',
    margin: '10px auto 10px auto',
    padding: '10px',
    boxSizing: 'border-box',
    width: '30%',
    height: 'auto',
    border: '1px solid #666',
    backgroundColor: '#aaa',
    '& img': {
      margin: 'auto',
    },
  },
  hidden: {
    opacity: 0,
    width: 0,
    height: 0,
    visibility: 'hidden',
    lineHeight: 0,
  },
  skipper: {
    width: '90%',
    margin: '20px auto',
    padding: '10px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#444',
  },
  skipperButton: {
    border: '2px solid #000',
    marginTop: '5px',
    boxShadow: '0px 2px 0px 0px #000',
  },
});
const PageItemEdit = (props) => {
  const classes = useStyles(props);
  const history = useHistory();

  const [shop] = useContext(ShopInfoContext);
  const itemHash = props.match.params.itemHash;

  const [isLoaded, setIsLoaded] = useState(false);

  const [step, setStep] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemPict, setItemPict] = useState(null);

  const [wait, setWait] = useState(true);

  //
  // on page mount
  //
  useEffect(() => {
    console.debug('[PageItemEdit] hash: ' + `shop = ${shop.hashId} , item= ${itemHash}`);
    setWait(true);
    ShopApiService.getItem(shop.hashId, itemHash)
      .then((item) => {
        setWait(false);
        if (item) {
          setItemName(item.name);
          setItemPrice(item.price);
          setItemPict(Utils.getBucketPath(item.s_image_folder_path, ShopApiService.host));
          setIsLoaded(true);
        } else {
          console.error('item not found');
          throw new Error('item not found');
        }
      })
      .catch((error) => {
        console.debug('[PageItemEdit] ERROR ' + `shop = ${shop.hashId} , item= ${itemHash}`, error);
        setWait(false);
        alert(error);
      });
  }, []);

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
  // Update values
  //
  const handleClickUpdateButton = (key, value) => {
    setWait(true);
    ShopApiService.request(ENDPOINTS.UPDATE_ITEM, [shop.hashId, itemHash], {
      [key]: value,
    })
      .then((result) => {
        console.debug(
          '[PageItemEdit] handleClickUpdateButton  UPDATE_ITEM SUCCESS',
          key,
          value,
          result
        );
        setWait(false);
        setStep((prev) => prev + 1);
      })
      .catch((error) => {
        console.debug(
          '[PageItemEdit] file upload ERROR ' + `shop = ${shop.hashId} , item= ${itemHash}`,
          key,
          value,
          error
        );
        setWait(false);
        alert(error);
      });
  };

  //
  // did file selected
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
    };
    reader.readAsDataURL(file);

    // アップロード
    setWait(true);
    ShopApiService.request(ENDPOINTS.REGIST_ITEM_IMG, [shop.hashId, itemHash], file)
      .then((item) => {
        setWait(false);
        console.debug('[PageItemEdit] UPLOAD SUCCESS', item);
        setStep((prev) => prev + 1);
      })
      .catch((error) => {
        console.debug(
          '[PageItemEdit] file upload ERROR ' + `shop = ${shop.hashId} , item= ${itemHash}`,
          error
        );
        setWait(false);
        alert(error);
      });
  };

  //
  // 共通部品
  //
  const SkipButtonCard = (props) => {
    return (
      <Card className={classes.skipper}>
        <Box>{props.target} Tiếp tục nếu bạn không muốn thay đổi</Box>
        <ButtonMUI
          variant="outlined"
          color="default"
          onClick={() => {
            setStep((prev) => prev + 1);
          }}
          className={classes.skipperButton}
        >
          Tiếp theo
          <ArrowForwardIcon fontSize="small" />
        </ButtonMUI>
      </Card>
    );
  };
  SkipButtonCard.propTypes = {
    target: PropTypes.string.isRequired,
  };

  //
  // シナリオ
  //
  const cardList = [
    // === step 0 =========
    <Container className={classes.textCenter}>
      <StepCard
        title="Ảnh"
        key="photo"
        customButtons={(() => {
          return (
            <Link to="/item/list" className={classes.link}>
              <ArrowBackIcon fontSize="small" />
              Quay lại
            </Link>
          );
        })()}
      >
        {(() => {
          // preview
          // console.debug('Preview itemPict', itemPict);
          if (itemPict) {
            return (
              <Container className={classes.thumbnail}>
                <img src={itemPict} alt="thumb" />
              </Container>
            );
          }
          return null;
        })()}

        <Grid container>
          <Grid item xs={6} className={classes.buttonGrid}>
            <ButtonSquare
              title="Chụp ảnh"
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
              title="Chọn ảnh"
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
      </StepCard>
      <SkipButtonCard target="" />
      <Button
        bgcolor="#E35649"
        onClick={() => {
          ShopApiService.deleteItem(shop.hashId, itemHash).then((result) => {
            console.debug('[PageItemEdit] deleteItem result', result);
            history.push('/item/list');
          });
        }}
      >
        <DeleteOutlinedIcon />
        Xóa
      </Button>
    </Container>,

    // === step 1 =========
    <Container className={classes.textCenter}>
      <StepCard
        title="Tên cửa hàng"
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
                Quay lại
              </Button>
              <Button
                disabled={buttonDisabled}
                onClick={() => {
                  handleClickUpdateButton('name', itemName);
                }}
                bgcolor="#F8B62D"
              >
                Tiếp tục
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
            placeholder="Nhập tên cửa hàng"
            fullWidth
          />
        </FormsContainer>
      </StepCard>
      <SkipButtonCard target=""/>
    </Container>,

    // === step 2 =========
    <Container className={classes.textCenter}>
      <StepCard
        title="Số lượng"
        key="price"
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
                Quay lại
              </Button>
              <Button
                disabled={buttonDisabled}
                onClick={() => {
                  handleClickUpdateButton('price', Number(itemPrice));
                }}
                bgcolor="#F8B62D"
              >
                <AddIcon fontSize="small" />
                Lưu
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
            placeholder="Vui lòng nhập số tiền bao gồm thuế"
            fullWidth
          />
        </FormsContainer>
      </StepCard>
      <SkipButtonCard target="" />
    </Container>,
  ];

  //
  // View
  //

  if (!isLoaded) {
    return (
      <PageContainer padding="0px">
        <HeaderAppBar title="Chỉnh sửa" backButton={true} />
        <Box className={classes.loading}> 読込中... </Box>
        <Footer initialTabIndex={Number(0)}></Footer>
      </PageContainer>
    );
  }

  return (
    <PageContainer padding="0px">
      <HeaderAppBar title="Chỉnh sửa" backButton={true} />

      <PageInnerContainer backgroundColor="rgba(200,200,200,0.4)">
        {cardList[step]}
      </PageInnerContainer>

      <Footer initialTabIndex={Number(0)}></Footer>
      <Waiting isOpen={wait} />
    </PageContainer>
  );
};
// PropTypes
PageItemEdit.propTypes = {
  // path parameter
  match: PropTypes.shape({
    params: PropTypes.shape({
      itemHash: PropTypes.string,
    }),
  }).isRequired,
};
export default PageItemEdit;
