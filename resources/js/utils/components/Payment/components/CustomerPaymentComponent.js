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
          Tên người thanh toán
        </Box>
        
        <Box width='70%'>
          <OutlinedInput
            id='name'
            name='name'
            value={paymentInfo.name}
            className={classes.input}
            labelWidth={0}
            classes={{input: classes.input}}
            placeholder=''
            onChange={(event) => handleChangeInput(event)}
          />
        </Box>
      </Box>
      
      {/* Zip code */}
      <Box mt={1} className={classes.boxItems}>
        <Box width='30%' fontWeight={600}>
          Postal Code
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
          Địa chỉ
        </Box>
        
        <Box width='70%'>
          <OutlinedInput
            id='address'
            name='address'
            value={paymentInfo.address}
            className={classes.input}
            labelWidth={0}
            classes={{input: classes.input}}
            placeholder=''
            onChange={(event) => handleChangeInput(event)}
          />
        </Box>
      </Box>
      
      {/* phone number */}
      <Box mt={1} className={classes.boxItems}>
        <Box width='30%' fontWeight={600}>
          Số điện thoại
        </Box>
        
        <Box width='70%'>
          <OutlinedInput
            id='phone'
            name='phone'
            value={paymentInfo.phone}
            className={classes.input}
            labelWidth={0}
            classes={{input: classes.input}}
            placeholder=''
            onChange={(event) => handleChangeInput(event)}
          />
        </Box>
      </Box>
      
      {/* email */}
      <Box mt={1} className={classes.boxItems}>
        <Box width='30%' fontWeight={600}>
          Email
        </Box>
        
        <Box width='70%'>
          <OutlinedInput
            id='email'
            name='email'
            value={paymentInfo.email}
            className={classes.input}
            labelWidth={0}
            classes={{input: classes.input}}
            placeholder=''
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
                      >Điều khoản dịch vụ
                      </Link>
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
