/*
 * React 確認用 サンプル集
 */
import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Utils from 'js/shared/utils';
import ShopApiService, { ENDPOINTS } from 'js/shop/shop-api-service';
import ShopAuthService from 'js/shop/shop-auth-service';

// Components
import LinkButton from 'js/shared/components/LinkButton';
import Button from 'js/shared/components/Button';
import ButtonSquare from 'js/shared/components/ButtonSquare';
import ButtonOnSale from 'js/shared/components/ButtonOnSale';
import Footer from 'js/shared/components/Footer';
import Card from 'js/shared/components/Card';
import Label from 'js/shared/components/Label';
import Modal from 'js/shared/components/Modal';
import Checkbox from 'js/shared/components/Checkbox';
import InputPinField from 'js/shared/components/InputPinField';
import ItemCard from 'js/shared/components/ItemCard';
import OnsaleItemCard from 'js/shared/components/OnsaleItemCard';
import DialogCard from 'js/shared/components/DialogCard';
import Chips from 'js/shared/components/Chips';
import LinkChips from 'js/shared/components/LinkChips';
import Drawer from 'js/shared/components/Drawer';
import PageContainer from 'js/shared/components/PageContainer';
import { RecaptchaContainer } from 'js/shared/auth-base';
import PropTypes from 'prop-types';
import { Grid, Box } from '@material-ui/core';
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import AddAPhotoOutlinedIcon from '@material-ui/icons/AddAPhotoOutlined';
import DirectionsWalkOutlinedIcon from '@material-ui/icons/DirectionsWalkOutlined';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import RestaurantOutlinedIcon from '@material-ui/icons/RestaurantOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import ModalConfirmationCode from 'js/shared/components/ModalConfirmationCode';

const SampleRouter = (props) => {
  return (
    <Router basename={process.env.MIX_BASENAME_SHOP}>
      <Switch>
        <Route path="/sample/" exact>
          <PageSampleContainer> menu </PageSampleContainer>
        </Route>
        <Route path="/sample/00">
          <PageSample00 {...props} />
        </Route>
        <Route path="/sample/01">
          <PageSample01 />
        </Route>
        <Route path="/sample/02">
          <PageSample02 />
        </Route>
        <Route path="/sample/03">
          <PageSample03 />
        </Route>
        <Route path="/sample/04">
          <PageSample04 />
        </Route>
        <Route path="/sample/05">
          <PageSample05 />
        </Route>
        <Route path="/sample/06">
          <PageSample06 />
        </Route>
        <Route path="/sample/07">
          <PageSample07 />
        </Route>
        <Route path="/sample/08">
          <PageSample08 />
        </Route>
      </Switch>
    </Router>
  );
};
export default SampleRouter;

const PageSampleContainer = (props) => {
  return (
    <PageContainer>
      <LinkButton title="TESTER" to="/sample/00" bgcolor="#88a" fgcolor="#ddf" />
      <LinkButton title="sample1" to="/sample/01" />
      <LinkButton title="sample2" to="/sample/02" />
      <LinkButton title="sample3" to="/sample/03" />
      <LinkButton title="sample4" to="/sample/04" />
      <LinkButton title="sample5" to="/sample/05" />
      <LinkButton title="sample6" to="/sample/06" />
      <LinkButton title="sample7" to="/sample/07" />
      <LinkButton title="sample8" to="/sample/08" />
      <hr />
      {props.children}
    </PageContainer>
  );
};
// PropTypes
PageSampleContainer.propTypes = {
  children: PropTypes.node,
};

const PageSample00 = (_props) => {
  const [genreList, setGenreList] = useState([]);
  const authCtx = useContext(ShopAuthService.context);

  // confirmation login
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isShowConfirmCode, setIsShowConfirmCode] = useState(false);

  useEffect(() => {
    ShopApiService.request(ENDPOINTS.GET_GENRE, null, null).then((result) => {
      console.debug('[app] api response', result);
      setGenreList(result);
    });
  }, [authCtx.isSignedIn]);

  //  console.debug('_________', props.isSignedIn);
  const onClickSignIn = async (ev) => {
    let number = prompt('DEBUG: 電話番号');
    if (!Utils.validatePattern('MOBILE_JP', number)) {
      alert('携帯番号を入力してください');
      return;
    }
    number = Utils.addPhonePrefix(number);

    try {
      const confirmation = await ShopAuthService.signInWithPhoneNumber(number);
      setConfirmationResult(confirmation);
      setIsShowConfirmCode(true);
      console.debug('Signed In ');
    } catch (error) {
      console.error('PageSample00:', error);
    }
  };

  const onClickSignOut = (ev) => {
    console.debug('signout button clicked!', ev);
    ShopAuthService.signOut();
  };

  // API test
  const onClickApiTestNoAuth = () => {
    const postal = prompt('郵便番号');
    if (!Utils.validatePattern('POSTAL', postal)) {
      alert('7桁の数字、ハイフン無しで入力');
      return;
    }
    ShopApiService.request(ENDPOINTS.SEARCH_ZIP, [postal], null)
      .then((result) => {
        console.debug('[app] api response', result);
        alert(JSON.stringify(result));
      })
      .catch((error) => {
        console.error('[app] api error', error);
      });
  };

  const onClickApiTestNeedAuth = () => {
    ShopApiService.request(ENDPOINTS.GET_SHOP, [''], null)
      .then((result) => {
        console.debug('[app] api response', result);
        alert('GET_SHOP result \n' + JSON.stringify(result));
      })
      .catch((error) => {
        console.error('[app] api error', error);
      });
  };

  const onCloseConfirmCode = () => {
    setIsShowConfirmCode(false);
  }

  const onSubmitConfirmCode = async (code) => {
    setIsShowConfirmCode(false);
    try {
      const result = await confirmationResult.confirm(code);
      ShopAuthService.setCurrentUser(result.user);
    } catch (error) {
      console.error('PageSample00:', error);
    }
  }

  const GenreSelectForm = () => {
    if (!authCtx.isSignedIn) {
      return null;
    }
    return (
      <select>
        {genreList.map((item) => {
          return (
            <option value={item.code} key={item.code}>
              {item.name}
            </option>
          );
        })}
      </select>
    );
  };

  return (
    <PageSampleContainer>
      <h1>店舗管理画面 動作テスト用</h1>
      {authCtx.phoneNumber ? <div>{authCtx.phoneNumber}</div> : ''}
      {authCtx.uid ? <div>{authCtx.uid}</div> : ''}
      <Button title="SignIn" onClick={onClickSignIn} bgcolor="#448" fgcolor="#ff0"></Button>
      <Button title="SignOut" onClick={onClickSignOut} bgcolor="#844" fgcolor="#fcf"></Button>
      <Button
        title="API test (認証なし)"
        onClick={onClickApiTestNoAuth}
        bgcolor="#484"
        fgcolor="#fff"
      ></Button>
      <Button
        title="API Test (認証あり)"
        onClick={onClickApiTestNeedAuth}
        bgcolor="#484"
        fgcolor="#fff"
      ></Button>
      <br />
      <GenreSelectForm />

      {/* Modal get confirm code */}
      <ModalConfirmationCode
        title='コードを入力'
        open={ isShowConfirmCode }
        onClose={ onCloseConfirmCode }
        onSubmit={ onSubmitConfirmCode }
      />
      {/* END Modal get confirm code */}

      <RecaptchaContainer authService={ShopAuthService} />
      <Card title="お店の名前" buttonTitle="進む → ">
        フォーム要素
      </Card>
    </PageSampleContainer>
  );
};

const PageSample01 = (_props) => {
  return (
    <PageSampleContainer>
      <h1>Sample1</h1>
      <p>hello world!</p>
      <p>hello world!</p>
      <p>hello world!</p>
    </PageSampleContainer>
  );
};

const PageSample02 = () => (
  <PageSampleContainer>
    <h1>Sample2</h1>
    <p>
      首はヴァイオリンの返事ねずみらに楽長が云いうちでた。するとすこし同じないでしという狸たまし。それどころんたのましもですいや棚の愉快団のうちをもこつこつ変たませて、ぼくまでかっこうにこめられことただ。考え過ぎ君は首でひどくなて前の譜の療汁をとりだし第一ざとじぶんのげの心配をかかえているないん。
    </p>
    <p>
      自分はたくさん弾きていろた。口は六あわて片手のようがせでやっな。町はずれはろ狸たりみんなへ出てくれた。療はねずみをなるべくに合せし血がふくのように帰っし猫をとりとまげて顔を考えているる。ちらちらぱっとけちをゴーシュへなさいたた。
    </p>
  </PageSampleContainer>
);

const PageSample03 = () => (
  <PageSampleContainer>
    <h1>Sample3</h1>
    <p>
      ぼくしばらくに包みへこって狸に引きさいましましょ。かっこうをぶっつかったまし。「ゆうべがいうた。本気、どこを夜中。
    </p>
    <p>
      とまっ。」それも今度の限りのそう明方のままを通りないです。手はゴーシュがごまわりに弾きて楽譜を楽長に飛びつきてなんだかはじめかついれまし所にやめまします。いったいぼんやり行くて、落ちついて教えてやりですておばあさんをすると本気からまるでそうのぞき込んたた。「ゴーシュくれ。
    </p>
  </PageSampleContainer>
);
// export { PageSampleContainer, PageSample00, PageSample01, PageSample02, PageSample03 };

const PageSample04 = (_props) => {
  // 最初からモーダル表示したい場合にはtrue
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <PageSampleContainer>
      <Button title="モーダルを開く" bgcolor="#E35649" onClick={handleOpen} />
      <Modal open={open} onClose={handleClose}>
        Để sử dụng dịch vụ này, cần phải đồng ý với các điều khoản sử dụng và chính sách bảo mật.
        <div>
          <Checkbox />
          Điều khoản dịch vụ
        </div>
        <div>
          <Checkbox />
          Chính sách bảo mật
        </div>
        <Button title="同意しない" bgcolor="#E35649" onClick={handleClose} width="170px" />
        <Button title="同意する" onClick={handleClose} width="170px" />
      </Modal>
    </PageSampleContainer>
  );
};

const PageSample05 = (_props) => {
  // buttonのdisabled
  const [buttonDisabledStatus, setButtonDisabledStatus] = useState(true);
  const handleChange = (status) => {
    setButtonDisabledStatus(status);
  };

  return (
    <PageSampleContainer>
      <Card title="Mã PIN" buttonTitle="+ Đăng ký" buttonDisabled={buttonDisabledStatus}>
        Vui lòng nhập mã PIN gồm bốn chữ số của bạn
        <InputPinField buttonDisabledChange={handleChange} />
      </Card>
    </PageSampleContainer>
  );
};

const PageSample06 = (props) => {
  return (
    <PageSampleContainer>
      <Button
        title="+ 登録してみる"
        bgcolor="#86BE27"
        fgcolor="#F7FAEE"
        onClick={props.onButtonClick}
        disabled={props.buttonDisabled}
        borderRadius="20px"
        boxshadow=""
      ></Button>
      <Grid container>
        <Grid item xs={4} />
        <Grid item xs={2}>
          <ButtonSquare
            title="撮影する"
            bgcolor="#FFFFFF"
            fgcolor="#F8B62D"
            border="3px solid #F8B62D"
            borderRadius="6px"
            boxshadow="0px 4px 0px #D69C24"
            img={
              <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/camera.png`} alt="撮影する" />
            }
          ></ButtonSquare>
        </Grid>
        <Grid item xs={2}>
          <ButtonSquare
            title="写真を選ぶ"
            bgcolor="#FFFFFF"
            fgcolor="#F8B62D"
            border="3px solid #F8B62D"
            borderRadius="6px"
            boxshadow="0px 4px 0px #D69C24"
            img={
              <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/photo.png`} alt="写真を選ぶ" />
            }
          ></ButtonSquare>
        </Grid>
        <Grid item xs={4} />
      </Grid>
      <Box display="flex" justifyContent="space-between">
        <ButtonSquare
          title="撮影する"
          bgcolor="#FFFFFF"
          fgcolor="#F8B62D"
          border="3px solid #F8B62D"
          borderRadius="6px"
          boxshadow="0px 4px 0px #D69C24"
          img={<AddAPhotoOutlinedIcon fontSize="large" />}
        ></ButtonSquare>
        <ButtonSquare
          title="写真を選ぶ"
          bgcolor="#FFFFFF"
          fgcolor="#F8B62D"
          border="3px solid #F8B62D"
          borderRadius="6px"
          boxshadow="0px 4px 0px #D69C24"
          img={<AddPhotoAlternateOutlinedIcon fontSize="large" />}
        ></ButtonSquare>
      </Box>
      <Footer img="photo.png"></Footer>

      <ButtonOnSale
        title="販売停止"
        bgcolor="#97C633"
        fgcolor="#F8B62D"
        border="2px solid #739A1E"
      ></ButtonOnSale>

      <ButtonOnSale
        title="販売開始"
        bgcolor="#E35649"
        fgcolor="#F8B62D"
        border="2px solid #B53F35"
      ></ButtonOnSale>

      <ButtonOnSale
        title="販売停止"
        bgcolor="#97C633"
        fgcolor="#F8B62D"
        disabled="true"
      ></ButtonOnSale>
    </PageSampleContainer>
  );
};

const PageSample07 = (props) => {
  return (
    <PageSampleContainer>
      <ItemCard img="item.png" />
      <OnsaleItemCard img="item.png" itemname="唐揚げ弁当" itemprice="¥1,100" />
      <DialogCard />
    </PageSampleContainer>
  );
};

const PageSample08 = (props) => {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const [itemData, setItemData] = useState([
    { key: 0, label: '中華弁当', price: '¥1,100', onsale: true },
    { key: 1, label: '焼肉弁当', price: '¥800', onsale: false },
    { key: 2, label: '唐揚げ弁当', price: '¥1,500', onsale: false },
    { key: 3, label: 'テスト弁当A', price: '¥2,000', onsale: true },
    { key: 4, label: 'テスト弁当B', price: '¥500', onsale: true },
    { key: 5, label: 'テスト弁当C', price: '¥3,500', onsale: false },
    { key: 6, label: 'テスト弁当D', price: '¥350', onsale: false },
  ]);

  const [chipData, setChipData] = useState([
    { key: 0, label: '徒歩9分', icon: Object.assign({}, <DirectionsWalkOutlinedIcon />) },
    { key: 1, label: '11:30〜14:00', icon: Object.assign({}, <WatchLaterOutlinedIcon />) },
    { key: 2, label: '中華料理', icon: Object.assign({}, <RestaurantOutlinedIcon />) },
    {
      key: 3,
      label: '東京都新宿区代々木１−１−１ 第一代々木ビル１F',
      icon: Object.assign({}, <RoomOutlinedIcon />),
    },
  ]);

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <PageSampleContainer>
      <Chips label="徒歩9分" icon={<DirectionsWalkOutlinedIcon />} />
      <Chips label="11:30〜14:00" icon={<WatchLaterOutlinedIcon />} />
      <Chips label="中華料理" icon={<RestaurantOutlinedIcon />} />
      <Chips label="東京都新宿区代々木１−１−１ 第一代々木ビル１F" icon={<RoomOutlinedIcon />} />
      <div>
        <React.Fragment key="bottom">
          <Button onClick={toggleDrawer('bottom', true)} title="bottom"></Button>

          <Drawer
            items={itemData}
            chips={chipData}
            anchor="bottom"
            onClick={toggleDrawer('bottom', true)}
            open={state['bottom']}
            onClose={toggleDrawer('bottom', false)}
          />
          <Label label="販売中" bgcolor="#F8B62D" fgcolor="#FFFFFF" />
          <Label label="売切れ" bgcolor="#E35649" fgcolor="#FFFFFF" />
        </React.Fragment>
      </div>

      <div>
        <LinkChips
          label="販売中のお弁当を再検索"
          icon={<RefreshOutlinedIcon />}
          onClick={handleClick}
        />
      </div>
    </PageSampleContainer>
  );
};
