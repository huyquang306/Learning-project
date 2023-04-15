/*
 * Obento-R サインイン
 */

// React
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Utils from 'js/shared/utils';

// Material UI component
import { Box, OutlinedInput, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Component
import HeaderAppBar from './HeaderAppBar';
import PageInnerWrap from './PageInnerWrap';

// Component shared
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';
import PageContainer from '../../shared/components/PageContainer';
import PageInnerContainer from '../../shared/components/PageInnerContainer';
import FlashMessage from 'js/shared-order/components/FlashMessage';
import UserInfoContext from 'js/customer-order/components/UserInfoContext';

// Style
const useStyles = makeStyles({
  btnFooter: {
    fontWeight: 600,
    margin: '3px',
  },
  input: {
    width: '100%',
    color: '#4F4F4F',
    fontSize: '21px',
    height: '42px',
    borderRadius: '4px',
  },
  textName: {
    width: '100%',
  },
  left: {
    fontSize: '18px',
    color: '#000',
    fontWeight: 400,
  },
  right: {
    fontSize: '24px',
    color: '#4F4F4F',
    fontWeight: 700,
  },
  lineDetail: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 0px',
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
  heading: {
    flexShrink: 0,
    fontWeight: 600,
  },
  nickName: {
    width: '100%',
    paddingLeft: '16px',
  }
});

const PageUserInfo = (_props) => {
  const classes = useStyles();
  const orderLink = localStorage.getItem('orderLinkForOneQRCode');
  const history = useHistory();
  const [expanded, setExpanded] = useState(false);
  //context
  const [userInfo, setUserInfo] = useContext(UserInfoContext);
  //user
  const [userData, setUserData] = useState({
    nick_name: '',
    email: '',
    family_name: '',
    given_name: '',
    family_name_kana: '',
    given_name_kana: '',
    phone_number: '',
    birth_date: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
  });
  //
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  //
  useEffect(() => {
    if (userInfo && userInfo.hash_id) {
      let cloneUserData = { ...userData };
      Object.keys(userInfo).map(param => {
        if (!userInfo[param]) {
          cloneUserData[param] = '';
        } else {
          cloneUserData[param] = userInfo[param];
        }
      });
      setUserData(cloneUserData);
    }
  }, [userInfo]);

  const inputChanged = (event) => {
    let newUserData = Utils.cloneDeep(userData);
    let attribute = event.target.getAttribute('name');
    newUserData[attribute] = event.target.value;
    setUserData(newUserData);
  };

  const updateUserInfo = async () => {
    try {
      let errors = [];
      validateNickName(userData, errors);
      validateEmail(userData, errors);
      validateFamilyName(userData, errors);
      validateGivenName(userData, errors);
      validateFamilyNameKana(userData, errors);
      validateGivenNameKana(userData, errors);
      validatePrefecture(userData, errors);
      validateCity(userData, errors);
      validateAddress(userData, errors);
      validateBuilding(userData, errors);

      if (errors.length > 0) {
        showWarningMessage(JSON.stringify(errors));
      } else {
        const response = await CustomerOrderApiService.updateUser(userInfo.hash_id, userData);
        setUserInfo(response);
        showSuccessMessage('更新しました');
        history.push(orderLink);
      }
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

  const validateNickName = (userData, errors) => {
    const nickNameValidate = {
      requiredErrorMessage: 'ニックネームを入力してください',
      maxLength: 50,
      maxLengthErrorMessage: 'ニックネーム50文字を超えてはなりません',
    };

    if (!Utils.isNil(userData.nick_name) && userData.nick_name.trim() !== '') {
      if (userData.nick_name.length > nickNameValidate.maxLength) {
        errors.push(nickNameValidate.maxLengthErrorMessage);
      }
    } else {
      errors.push(nickNameValidate.requiredErrorMessage);
    }
    return errors;
  };

  const validateEmail = (userData, errors) => {
    const emailValidate = {
      maxLength: 128,
      emailMaxLengthError: 'メールアドレスが128文字を超えてはなりません。',
      validEmailErrorMessage: 'メールアドレス形式を正しく入力してください。',
    };

    if (!Utils.isNil(userData.email) && userData.email.trim() !== '') {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(userData.email)) {
        errors.push(emailValidate.validEmailErrorMessage);
      }
      if (userData.email.length > emailValidate.maxLength) {
        errors.push(emailValidate.emailMaxLengthError);
      }
    }
    return errors;
  };

  const validateFamilyName = (userData, errors) => {
    const familyNameValidate = {
      maxLength: 30,
      maxLengthErrorMessage: '家系の名前は30文字を超えてはなりません',
    };

    if (!Utils.isNil(userData.family_name) && userData.family_name.trim() !== '') {
      if (userData.family_name.length > familyNameValidate.maxLength) {
        errors.push(familyNameValidate.maxLengthErrorMessage);
      }
    }
    return errors;
  };

  const validateGivenName = (userData, errors) => {
    const givenNameValidate = {
      maxLength: 30,
      maxLengthErrorMessage: '名は30文字を超えてはなりません',
    };

    if (!Utils.isNil(userData.given_name) && userData.given_name.trim() !== '') {
      if (userData.given_name.length > givenNameValidate.maxLength) {
        errors.push(givenNameValidate.maxLengthErrorMessage);
      }
    }
    return errors;
  };

  const validateFamilyNameKana = (userData, errors) => {
    const familyNameKanaValidate = {
      maxLength: 50,
      maxLengthErrorMessage: '家系の名前かなは50文字を超えてはなりません',
    };

    if (!Utils.isNil(userData.family_name_kana) && userData.family_name_kana.trim() !== '') {
      if (userData.family_name_kana.length > familyNameKanaValidate.maxLength) {
        errors.push(familyNameKanaValidate.maxLengthErrorMessage);
      }
    }
    return errors;
  };

  const validateGivenNameKana = (userData, errors) => {
    const givenNameKanaValidate = {
      maxLength: 50,
      maxLengthErrorMessage: '名かなは50文字を超えてはなりません',
    };

    if (!Utils.isNil(userData.given_name_kana) && userData.given_name_kana.trim() !== '') {
      if (userData.given_name_kana.length > givenNameKanaValidate.maxLength) {
        errors.push(givenNameKanaValidate.maxLengthErrorMessage);
      }
    }
    return errors;
  };

  const validatePrefecture = (userData, errors) => {
    const prefectureValidate = {
      maxLength: 5,
      maxLengthErrorMessage: '県は5文字を超えてはなりません',
    };

    if (!Utils.isNil(userData.prefecture) && userData.prefecture.trim() !== '') {
      if (userData.prefecture.length > prefectureValidate.maxLength) {
        errors.push(prefectureValidate.maxLengthErrorMessage);
      }
    }
    return errors;
  };

  const validateCity = (userData, errors) => {
    const cityValidate = {
      maxLength: 50,
      maxLengthErrorMessage: '都市は50文字を超えてはなりません',
    };

    if (!Utils.isNil(userData.city) && userData.city.trim() !== '') {
      if (userData.city.length > cityValidate.maxLength) {
        errors.push(cityValidate.maxLengthErrorMessage);
      }
    }
    return errors;
  };

  const validateAddress = (userData, errors) => {
    const addressValidate = {
      maxLength: 200,
      maxLengthErrorMessage: 'アドレスは200文字を超えてはなりません',
    };

    if (!Utils.isNil(userData.address) && userData.address.trim() !== '') {
      if (userData.address.length > addressValidate.maxLength) {
        errors.push(addressValidate.maxLengthErrorMessage);
      }
    }
    return errors;
  };

  const validateBuilding = (userData, errors) => {
    const buildingValidate = {
      maxLength: 100,
      maxLengthErrorMessage: '建物は100文字を超えてはなりません',
    };

    if (!Utils.isNil(userData.building) && userData.building.trim() !== '') {
      if (userData.building.length > buildingValidate.maxLength) {
        errors.push(buildingValidate.maxLengthErrorMessage);
      }
    }
    return errors;
  };

  const handleChangeExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderButtonBack = () => {
    if (userInfo.nick_name)
      return (
        <Grid item>
          <Button
            onClick={() => history.push(orderLink)}
            className={`${classes.buttonController} + ' ' + ${classes.buttonBack}`}
          >
            戻る
          </Button>
        </Grid>
      );

    return null;
  };

  return (
    <PageContainer padding="0">
      <HeaderAppBar title="詳細情報を更新する" />
      <PageInnerWrap>
        <PageInnerContainer padding="0px 20px">
          <Box mt={4} mb={4}>
            {/* input nick_name */}
            <Grid container className={ classes.lineDetail }>
              <Grid item md={1}></Grid>
              <Grid item md={3} sm={12} className={ classes.nickName }>
                ニックネーム
              </Grid>
              <Grid item md={6} sm={12} className={ classes.textName } textalign={'left'}>
                <OutlinedInput
                  id="nick_name"
                  name="nick_name"
                  value={userData.nick_name}
                  className={classes.input}
                  labelWidth={0}
                  onChange={(event) => inputChanged(event)}
                />
              </Grid>
            </Grid>
            {/* Tap to Expand : 詳細情報を入力 */}
            <Grid container className={ classes.lineDetail }>
              <Grid item md={1}></Grid>
              <Grid item md={9} sm={12} className={ classes.textName }>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChangeExpand('panel2')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                  >
                    <Typography className={classes.heading}>詳細情報を入力</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container>
                      <Grid item md={12}>
                        <Grid container className={ classes.lineDetail }>
                          <Grid item md={1}></Grid>
                          <Grid item md={3} sm={12} className={ classes.textName }>
                            メールアドレス
                          </Grid>
                          <Grid item md={6} sm={12} className={ classes.textName } textalign={'left'}>
                            <OutlinedInput
                              id="email"
                              name="email"
                              value={userData.email}
                              className={classes.input}
                              labelWidth={0}
                              onChange={(event) => inputChanged(event)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item md={12}>
                        <Grid container className={ classes.lineDetail }>
                          <Grid item md={1}></Grid>
                          <Grid item md={3} sm={12} className={ classes.textName }>
                            姓前
                          </Grid>
                          <Grid item md={6} sm={12} className={ classes.textName } textalign={'left'}>
                            <OutlinedInput
                              id="family_name"
                              name="family_name"
                              value={userData.family_name}
                              className={classes.input}
                              labelWidth={0}
                              onChange={(event) => inputChanged(event)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item md={12}>
                        <Grid container className={ classes.lineDetail }>
                          <Grid item md={1}></Grid>
                          <Grid item md={3} sm={12} className={ classes.textName }>
                            名前
                          </Grid>
                          <Grid item md={6} sm={12} className={ classes.textName } textalign={'left'}>
                            <OutlinedInput
                              id="given_name"
                              name="given_name"
                              value={userData.given_name}
                              className={classes.input}
                              labelWidth={0}
                              onChange={(event) => inputChanged(event)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item md={12}>
                        <Grid container className={ classes.lineDetail }>
                          <Grid item md={1}></Grid>
                          <Grid item md={3} sm={12} className={ classes.textName }>
                            姓前（カナ）
                          </Grid>
                          <Grid item md={6} sm={12} className={ classes.textName } textalign={'left'}>
                            <OutlinedInput
                              id="family_name_kana"
                              name="family_name_kana"
                              value={userData.family_name_kana}
                              className={classes.input}
                              labelWidth={0}
                              onChange={(event) => inputChanged(event)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item md={12}>
                        <Grid container className={ classes.lineDetail }>
                          <Grid item md={1}></Grid>
                          <Grid item md={3} sm={12} className={ classes.textName }>
                            名前（カナ）
                          </Grid>
                          <Grid item md={6} sm={12} className={ classes.textName } textalign={'left'}>
                            <OutlinedInput
                              id="given_name_kana"
                              name="given_name_kana"
                              value={userData.given_name_kana}
                              className={classes.input}
                              labelWidth={0}
                              onChange={(event) => inputChanged(event)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item md={12}>
                        <Grid container className={ classes.lineDetail }>
                          <Grid item md={1}></Grid>
                          <Grid item md={3} sm={12} className={ classes.textName }>
                            電話番号
                          </Grid>
                          <Grid item md={6} sm={12} className={ classes.textName } textalign={'left'}>
                            <OutlinedInput
                              id="phone_number"
                              name="phone_number"
                              disabled={true}
                              value={userData.phone_number}
                              className={classes.input}
                              labelWidth={0}
                              onChange={(event) => inputChanged(event)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item md={12}>
                        <Grid container className={ classes.lineDetail }>
                          <Grid item md={1}></Grid>
                          <Grid item md={3} sm={12} className={ classes.textName }>
                            生年月日
                          </Grid>
                          <Grid item md={6} sm={12} className={ classes.textName } textalign={'left'}>
                            <OutlinedInput
                              id="birth_date"
                              name="birth_date"
                              type="date"
                              value={userData.birth_date}
                              className={classes.input}
                              labelWidth={0}
                              onChange={(event) => inputChanged(event)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item md={12}>
                        <Grid container className={ classes.lineDetail }>
                          <Grid item md={1}></Grid>
                          <Grid item md={3} sm={12} className={ classes.textName }>
                            都道府県
                          </Grid>
                          <Grid item md={6} sm={12} className={ classes.textName } textalign={'left'}>
                            <OutlinedInput
                              id="prefecture"
                              name="prefecture"
                              value={userData.prefecture}
                              className={classes.input}
                              labelWidth={0}
                              onChange={(event) => inputChanged(event)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item md={12}>
                        <Grid container className={ classes.lineDetail }>
                          <Grid item md={1}></Grid>
                          <Grid item md={3} sm={12} className={ classes.textName }>
                            市区町村
                          </Grid>
                          <Grid item md={6} sm={12} className={ classes.textName } textalign={'left'}>
                            <OutlinedInput
                              id="city"
                              name="city"
                              value={userData.city}
                              className={classes.input}
                              labelWidth={0}
                              onChange={(event) => inputChanged(event)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item md={12}>
                        <Grid container className={ classes.lineDetail }>
                          <Grid item md={1}></Grid>
                          <Grid item md={3} sm={12} className={ classes.textName }>
                            住所(ビル名を除く）
                          </Grid>
                          <Grid item md={6} sm={12} className={ classes.textName } textalign={'left'}>
                            <OutlinedInput
                              id="address"
                              name="address"
                              value={userData.address}
                              className={classes.input}
                              labelWidth={0}
                              onChange={(event) => inputChanged(event)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item md={12}>
                        <Grid container className={ classes.lineDetail }>
                          <Grid item md={1}></Grid>
                          <Grid item md={3} sm={12} className={ classes.textName }>
                            ビル名（部屋番号）
                          </Grid>
                          <Grid item md={6} sm={12} className={ classes.textName } textalign={'left'}>
                            <OutlinedInput
                              id="building"
                              name="building"
                              value={userData.building}
                              className={classes.input}
                              labelWidth={0}
                              onChange={(event) => inputChanged(event)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>

            <Box mt={10} textAlign="center">
              <Grid spacing={5} container justify={'center'}>
                {renderButtonBack()}
                <Grid item>
                  <Button
                    onClick={() => {
                      updateUserInfo({});
                    }}
                    className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                  >
                    <Add /> 追加する
                  </Button>
                </Grid>
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
      </PageInnerWrap>
    </PageContainer>
  );
};
// PropTypes
PageUserInfo.propTypes = {};
export default PageUserInfo;
