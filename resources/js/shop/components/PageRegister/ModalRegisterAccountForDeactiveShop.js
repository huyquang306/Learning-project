import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Material-UI
import Modal from 'js/shared-order/components/Modal';
import { Box, TextField, Grid } from '@material-ui/core';
import Button from 'js/shared/components/Button';

//Base Component
import ConfirmPassword from 'js/shop/components/ConfirmPassword';

// service
import ShopAuthService from 'js/shop/shop-auth-service';
import ShopApiService from 'js/shop/shop-api-service';

// Styles
import { useStylesModalRegisterAccount as useStyles } from './style';

// Utils
import Utils from 'js/shared/utils';
import { MAX_NUMBER_CHARS_EMAIL } from 'js/utils/helpers/emailHelper';
import { convertTwoBytesCharacter } from 'js/utils/helpers/passwordHelper';

// Validation
import { checkValidation } from './validateResgiterAccount';

const ACCOUNT_DEFAULT = {
  email: '',
  password: '',
  password_confirmation: '',
};

const ModalRegisterAccountForDeactiveShop = (props) => {
  const { selectedShop, open, onClose, showWarningMessage, infoAccountTypeModelRobot } = props;
  const classes = useStyles(props);
  
  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [account, setAccount] = useState(ACCOUNT_DEFAULT);
  const [disabledPassword, setDisabledPassword] = useState(false);
  
  useEffect(() => {
    setButtonDisabled(true);
    if (open) {
      infoAccountTypeModelRobot
        ? setAccount(infoAccountTypeModelRobot)
        : setAccount(ACCOUNT_DEFAULT);
      infoAccountTypeModelRobot ? setDisabledPassword(true) : setDisabledPassword(false);
    }
  }, [open]);
  
  const handleChange = (event) => {
    const { target } = event;
    const key = target.id;
    const { value } = target;
    const accountClone = Utils.cloneDeep(account);
    accountClone[key] = convertTwoBytesCharacter(value);
    if (infoAccountTypeModelRobot && key === 'email') {
      if (value === infoAccountTypeModelRobot.email) {
        setDisabledPassword(true);
        setButtonDisabled(true)
      } else {
        setButtonDisabled(false)
        setDisabledPassword(false);
      }
    }
    setAccount(accountClone);
  };
  
  const createShopTemp = async () => {
    let infoShop = {
      email: account.email,
      is_active_shop: true,
      hash_id: selectedShop.hash_id
    };
    try {
      await ShopApiService.createShopTemp(infoShop);
    } catch (error) {
      showWarningMessage(error.message);
    }
  };
  
  const handleSubmit = async () => {
    // Validate
    const errors = checkValidation(account);
    if (errors && errors.length) {
      showWarningMessage(errors[0]);
      
      return;
    }
    
    try {
      setIsLoading(true);
      await ShopAuthService.createUserWithEmailAndPassword(account.email, account.password);
      await ShopAuthService.signInWithEmailAndPassword(account.email, account.password);
      createShopTemp();
      setIsLoading(false);
      onClose();
      props.moveToNextStep(account);
    } catch (error) {
      setIsLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        showWarningMessage('このメールアドレスは既に登録済みです。');
        
        return;
      }
      showWarningMessage(`エラー(${error.code})。もう一度お試しください。`);
      
      return;
    }
  };
  
  const actionModal = () => {
    return (
      <Box textAlign='center'>
        <Button
          title='同意しない'
          bgcolor='#FFF'
          fgcolor='#92C53D'
          borderColor='#92C53D'
          onClick={onClose}
        ></Button>
        <Button
          title='同意して進む'
          bgcolor='#86BE27'
          fgcolor='#F7FAEE'
          disabled={
            !(account.email && account.password && account.password_confirmation) ||
            buttonDisabled ||
            isLoading
          }
          onClick={handleSubmit}
        ></Button>
      </Box>
    );
  };
  
  return (
    <Modal
      open={open}
      titleBgColor='#31333F'
      actions={actionModal()}
      title='自動セットアップの確認'
      maxWidth='80%'
      maxHeight='80vh'
    >
      <Box padding='20px 40px'>
        <Box>
          <Box textAlign='center'>
            以下の店舗が選択されました。この店舗を自動セットアップしますか？
          </Box>
          <Box textAlign='center'>Web公開情報をもとに店舗・メニューが初期設定されます</Box>
          <Box className={classes.shopName}>「{selectedShop ? selectedShop.name : ''}」</Box>
          <Box display='flex' alignItems='end'>
            <Box width='35%'>
              <img className={classes.robotIcon} src='/icon/robot.png' width='220px' />
            </Box>
            <Box width='65%' className={classes.searchNotify}>
              <Box>【ご注意】上記店舗の方のみご利用ください</Box>
              <Box>嘘偽同意により発生したトラブル・損害賠償は実行者の責任になります</Box>
            </Box>
          </Box>
        </Box>
        
        <Box mt={2}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={2}>
              <Box className={classes.label} flexDirection={{ xs: 'row', sm: 'column' }}>
                メールアドレス
                <Box>(ログインID)</Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={10}>
              <TextField
                id='email'
                inputProps={{
                  maxLength: MAX_NUMBER_CHARS_EMAIL,
                  type: 'text',
                }}
                variant='outlined'
                value={account.email}
                fullWidth
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          
          <ConfirmPassword
            isChangePassword={false}
            handleChange={handleChange}
            handleDisabledButton={(value) => !disabledPassword && setButtonDisabled(!value)}
            shop={account}
            disabledPassword={disabledPassword}
          />
        </Box>
      </Box>
    </Modal>
  );
};

ModalRegisterAccountForDeactiveShop.propTypes = {
  selectedShop: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  showWarningMessage: PropTypes.func,
  handleSuccess: PropTypes.func,
};
ModalRegisterAccountForDeactiveShop.defaultProps = {
  selectedShop: null,
  open: true,
  onClose: () => {},
  showWarningMessage: () => {},
  handleSuccess: () => {},
};

export default ModalRegisterAccountForDeactiveShop;
