import React, { useEffect, useState } from 'react';
import Utils from "../../shared/utils";

import { makeStyles } from '@material-ui/core/styles';
import { TextField, IconButton, InputAdornment, Box, Grid } from '@material-ui/core';
import { VisibilityOff, Visibility } from '@material-ui/icons';
import { Check, CloseSharp } from '@material-ui/icons';

import { MAX_NUMBER_CHARS_PASSWORD, convertTwoBytesCharacter } from "../../utils/helpers/passwordHelper";

const useStyles = makeStyles(() => ({
  container: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#000',
  },
  input: {
    width: '100%',
    color: '#000',
    fontSize: '16px',
    height: '40px',
    borderRadius: '4px',
    paddingRight: '15px',
    '& .MuiInputBase-formControl': {
      paddingTop: '1px',
      paddingBottom: '1px',
    },
  },
  label: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 600px)': {
      transform: 'translateY(20px)',
    },
  },
  check: {
    fill: 'green'
  },
  error: {
    fill: 'red'
  }
}));

const DEFAULT_PASSWORD_INFO = {
  currentPassword: '',
  password: '',
  password_confirmation: '',
};

const regex = {
  eightCharacters: /^.{8,}$/,
  alphabet: /[a-zA-Z]/,
  number: /\d/,
};

const ConfirmPassword = (props) => {
  const classes = useStyles(props);
  const {
    isChangePassword,
    handleChange,
    handleDisabledButton,
    disabledPassword,
    handleChangeInputChangePassWord,
    shop,
    title,
  } = props;
  // local state
  const [passwordInfo, setPasswordInfo] = useState({
    ...DEFAULT_PASSWORD_INFO,
    password: (shop && shop.password) || '',
    password_confirmation: (shop && shop.password_confirmation) || '',
  });
  const [checkList, setCheckList] = useState({
    eightCharacters: false,
    alphabet: false,
    number: false,
  });
  const [showCheckList, setShowCheckList] = useState(false);
  const [matchingPassword, setMatchingPassword] = useState(false);
  const [showTextMatching, setShowTextMatching] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  
  useEffect(() => {
    const checkListClone = Utils.cloneDeep(checkList);
    
    passwordInfo.password_confirmation === passwordInfo.password && passwordInfo.password.length
      ? setMatchingPassword(true)
      : setMatchingPassword(false);
    
    passwordInfo.password_confirmation.length
      ? setShowTextMatching(true)
      : setShowTextMatching(false);
    
    passwordInfo.password.length ? setShowCheckList(true) : setShowCheckList(false);
    
    regex.eightCharacters.test(passwordInfo.password)
      ? (checkListClone.eightCharacters = true)
      : (checkListClone.eightCharacters = false);
    
    regex.alphabet.test(passwordInfo.password)
      ? (checkListClone.alphabet = true)
      : (checkListClone.alphabet = false);
    
    regex.number.test(passwordInfo.password)
      ? (checkListClone.number = true)
      : (checkListClone.number = false);
    
    const check =
      !!(checkListClone.alphabet &&
        checkListClone.eightCharacters &&
        checkListClone.number &&
        passwordInfo.password_confirmation === passwordInfo.password &&
        passwordInfo.password.length);
    
    setCheckList(checkListClone);
    handleDisabledButton(check);
  }, []);
  
  const handleChangeInput = (event) => {
    const newPasswordInfo = Utils.cloneDeep(passwordInfo);
    const checkListClone = Utils.cloneDeep(checkList);
    
    const { name, value } = event.target;
    newPasswordInfo[name] = convertTwoBytesCharacter(value);
    
    if (name === 'password_confirmation') {
      convertTwoBytesCharacter(value) === newPasswordInfo.password ? setMatchingPassword(true) : setMatchingPassword(false);
      value.length ? setShowTextMatching(true) : setShowTextMatching(false);
      
      const check =
        !!(checkListClone.alphabet &&
          checkListClone.eightCharacters &&
          checkListClone.number &&
          convertTwoBytesCharacter(value) === newPasswordInfo.password);
      
      handleDisabledButton(check);
    } else if (name === 'password') {
      value.length ? setShowCheckList(true) : setShowCheckList(false);
      
      regex.eightCharacters.test(convertTwoBytesCharacter(value))
        ? (checkListClone.eightCharacters = true)
        : (checkListClone.eightCharacters = false);
      
      regex.alphabet.test(convertTwoBytesCharacter(value))
        ? (checkListClone.alphabet = true)
        : (checkListClone.alphabet = false);
      
      regex.number.test(convertTwoBytesCharacter(value)) ? (checkListClone.number = true) : (checkListClone.number = false);
      convertTwoBytesCharacter(value) === newPasswordInfo.password_confirmation
        ? setMatchingPassword(true)
        : setMatchingPassword(false);
      
      const check =
        !!(checkListClone.alphabet &&
          checkListClone.eightCharacters &&
          checkListClone.number &&
          convertTwoBytesCharacter(value) === newPasswordInfo.password_confirmation);
      
      handleDisabledButton(check);
    }
    handleChange && handleChange(event);
    handleChangeInputChangePassWord && handleChangeInputChangePassWord(event);
    setPasswordInfo(newPasswordInfo);
    setCheckList(checkListClone);
  };
  
  const togglePassword = () => setShowPassword(!showPassword);
  
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  
  const toggleCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
  
  return (
    <>
      {/* Current password */}
      {isChangePassword && (
        <Grid container spacing={4}>
          <Grid item xs={12} sm={2}>
            <Box className={classes.label}>Current password</Box>
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              name='currentPassword'
              value={passwordInfo.currentPassword}
              onChange={handleChangeInput}
              fullWidth
              variant='outlined'
              inputProps={{
                maxLength: MAX_NUMBER_CHARS_PASSWORD,
                type: showCurrentPassword ? 'text' : 'password',
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={toggleCurrentPassword}>
                      {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      )}
      {/* END Current password */}
      
      {/* New password */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={2}>
          <Box className={classes.label}> {title ? title : 'New password'}</Box>
        </Grid>
        <Grid item xs={12} sm={10}>
          <TextField
            id='password'
            name='password'
            inputProps={{
              maxLength: MAX_NUMBER_CHARS_PASSWORD,
              type: showPassword ? 'text' : 'password',
            }}
            variant='outlined'
            value={passwordInfo.password}
            fullWidth
            disabled={disabledPassword}
            onChange={handleChangeInput}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={togglePassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      {showCheckList && (
        <Box>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={2}></Grid>
            <Grid item xs={12} sm={10}>
              <Box textAlign='left' display='flex' mt={1} fontWeight={400} fontSize={14}>
                {checkList.alphabet ? <Check className={classes.check}/> : <CloseSharp className={classes.error}/>}
                Must contain alphabetic characters
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={0}>
            <Grid item sm={2}></Grid>
            <Grid item sm={10}>
              <Box textAlign='left' display='flex' mt={1} fontWeight={400} fontSize={14}>
                {checkList.number ? <Check className={classes.check}/> : <CloseSharp className={classes.error}/>}
                Must contain numbers
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={0}>
            <Grid item sm={2}></Grid>
            <Grid item sm={10}>
              <Box textAlign='left' display='flex' mt={1} mb={2} fontWeight={400} fontSize={14}>
                {checkList.eightCharacters ? <Check className={classes.check}/> : <CloseSharp className={classes.error}/>}
                Must contain 8 characters or more
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
      {/* END New password */}
      
      {/* Password Confirmation */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={2}>
          <Box className={classes.label}>Password Confirmation</Box>
        </Grid>
        <Grid item xs={12} sm={10}>
          <TextField
            id='password_confirmation'
            name='password_confirmation'
            inputProps={{
              maxLength: MAX_NUMBER_CHARS_PASSWORD,
              type: showConfirmPassword ? 'text' : 'password',
            }}
            variant='outlined'
            value={passwordInfo.password_confirmation}
            fullWidth
            disabled={disabledPassword}
            onChange={handleChangeInput}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={toggleConfirmPassword}>
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      
      {showTextMatching && (
        <Grid container spacing={0}>
          <Grid item sm={2}></Grid>
          <Grid item sm={10}>
            <Box textAlign='left' display='flex' mt={2} fontWeight={400} fontSize={14}>
              {matchingPassword ? <Check className={classes.check}/> : <CloseSharp className={classes.error}/>}
              Password must match
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};

ConfirmPassword.propTypes = {};
export default ConfirmPassword;