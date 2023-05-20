import React, {useState} from 'react';
import PropTypes from 'prop-types';

// Components(Material-UI)
import {
  Box, Checkbox, FormControlLabel, OutlinedInput, Link
} from '@material-ui/core';
import TermsOfServiceDialog from 'js/shared/components/TermsOfServiceDialog';

// styles
import {useSetupFormStyles as useStyles} from '../styles';

// Utils
import {PAYMENT_METHOD_TYPES} from '../paymentConst';

const CustomerPaymentComponent = (props) => {
  const classes = useStyles(props);
  const {paymentInfo, handleChangeInput, handleChangeCheckbox} = props;
  
  // Local state
  const [isOpenTerms, setIsOpenTerms] = useState(false);
  
  return (
    <>
      {/* username */}
      <Box mt={1} className={classes.boxItems}>
        <Box width='30%' fontWeight={600}>
          請求先担当者名
        </Box>
        
        <Box width='70%'>
          <OutlinedInput
            id='name'
            name='name'
            value={paymentInfo.name}
            className={classes.input}
            labelWidth={0}
            classes={{input: classes.input}}
            placeholder='山田太郎'
            onChange={(event) => handleChangeInput(event)}
          />
        </Box>
      </Box>
      
      {/* Zip code */}
      <Box mt={1} className={classes.boxItems}>
        <Box width='30%' fontWeight={600}>
          郵便番号
        </Box>
        
        <Box width='70%'>
          <OutlinedInput
            id='zip_code'
            name='zip_code'
            value={paymentInfo.zip_code}
            className={classes.input}
            labelWidth={0}
            classes={{input: classes.input}}
            placeholder='1000001'
            onChange={(event) => handleChangeInput(event)}
          />
        </Box>
      </Box>
      
      {/* address */}
      <Box mt={1} className={classes.boxItems}>
        <Box width='30%' fontWeight={600}>
          住所
        </Box>
        
        <Box width='70%'>
          <OutlinedInput
            id='address'
            name='address'
            value={paymentInfo.address}
            className={classes.input}
            labelWidth={0}
            classes={{input: classes.input}}
            placeholder='東京都 千代田区 丸の内　１－１－１'
            onChange={(event) => handleChangeInput(event)}
          />
        </Box>
      </Box>
      
      {/* phone number */}
      <Box mt={1} className={classes.boxItems}>
        <Box width='30%' fontWeight={600}>
          電話番号
        </Box>
        
        <Box width='70%'>
          <OutlinedInput
            id='phone'
            name='phone'
            value={paymentInfo.phone}
            className={classes.input}
            labelWidth={0}
            classes={{input: classes.input}}
            placeholder='09012341234'
            onChange={(event) => handleChangeInput(event)}
          />
        </Box>
      </Box>
      
      {/* email */}
      <Box mt={1} className={classes.boxItems}>
        <Box width='30%' fontWeight={600}>
          メールアドレス
        </Box>
        
        <Box width='70%'>
          <OutlinedInput
            id='email'
            name='email'
            value={paymentInfo.email}
            className={classes.input}
            labelWidth={0}
            classes={{input: classes.input}}
            placeholder='a@aaaa.aaa.jp'
            onChange={(event) => handleChangeInput(event)}
          />
        </Box>
      </Box>
      
      {/* acceptTerm */}
      {
        paymentInfo.payment_method === PAYMENT_METHOD_TYPES.card && (
          <>
            <Box mt={1} className={classes.boxItems}>
              <Box width='35%' />
              
              <Box width='65%'>
                <FormControlLabel
                  control={<Checkbox checked={paymentInfo.acceptTerm} name='acceptTerm' />}
                  label={(
                    <Box>
                      <Link
                        href='#'
                        onClick={() => setIsOpenTerms(true)}
                        className={classes.termOfService}
                      >利用規約
                      </Link>に同意して利用する
                    </Box>
                  )}
                  onChange={(event) => handleChangeCheckbox(event)}
                />
              </Box>
            </Box>
            <TermsOfServiceDialog isOpen={isOpenTerms} setIsOpen={setIsOpenTerms} />
          </>
        )
      }
    </>
  );
}

// PropTypes
CustomerPaymentComponent.propTypes = {
  paymentInfo: PropTypes.object,
  handleChangeInput: PropTypes.func,
  handleChangeCheckbox: PropTypes.func,
};
CustomerPaymentComponent.defaultProps = {
  paymentInfo: {},
  handleChangeInput: () => {},
  handleChangeCheckbox: () => {},
};

export default CustomerPaymentComponent;
