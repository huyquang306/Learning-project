// Components(Material-UI)
import { Button, Box, Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { showtaxValue } from 'js/utils/helpers/const';

const NewItemHourPrice = (props) => {
  const businessHourPrice = props?.businessHourPrice;
  const shop = props.shop;
  const key = props?.keyValue;
  const priceValue = props?.hanldePriceFractionMode(Number(businessHourPrice?.price), 0) || 0;
  const taxValue = props?.hanldePriceFractionMode(Number(businessHourPrice?.tax_value), 0) || 0;
  const currencyName = shop?.mShopPosSetting?.m_currency?.name;

  const renderBusinessHour = (businessHourPrice) => {
    if (businessHourPrice?.m_shop_business_hour) {
      return businessHourPrice?.m_shop_business_hour?.start_time?.slice(0, 5)
        + ' ～ '
        + businessHourPrice?.m_shop_business_hour?.finish_time?.slice(0, 5);
    }

    return '設定なし';
  };

  return (
    <Grid container spacing={2} key={key} className='list-setting-price'>
      <Grid item sm={1}>
        <Box className='wrap-checkbox'>
          <FormControlLabel
            control={
              <Checkbox
                checked={businessHourPrice?.display_flg == 1 ? true : false}
                value={businessHourPrice?.display_flg == 1 ? true : false}
                color='default'
              />
            }
            onChange={(event) => props.handleCheckBoxTime(event, key)}
          />
        </Box>
      </Grid>
      <Grid item sm={4}>
        <Box height='100%' display='flex' alignItems='center' justifyContent='center'>
          {renderBusinessHour(businessHourPrice)}
        </Box>
      </Grid>
      <Grid item sm={5}>
        <Box height='100%' display='flex' alignItems='center'>
          {showtaxValue(priceValue, currencyName, false)} {'  '}
          {showtaxValue(taxValue, currencyName)}
        </Box>
      </Grid>
      <Grid item sm={2}>
        <Box height='100%' display='flex' alignItems='center' justifyContent='start' whiteSpace='nowrap'>
          <Button
            variant='outlined'
            style={{ color: '#d32f2f', border: '2px solid rgba(211, 47, 47, 1)' }}
            onClick={() => props.handleRemoveSettingPrice(key)}
          >
            削除する
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

// PropTypes
NewItemHourPrice.propTypes = {
  menuData: PropTypes.object,
  shop: PropTypes.object,
  hanldePriceFractionMode: PropTypes.func,
  handleCheckBoxTime: PropTypes.func,
  handleRemoveSettingPrice: PropTypes.func,
};

// defaultProps
NewItemHourPrice.defaultProps = {
  menuData: {},
  shop: {},
  hanldePriceFractionMode: () => {},
  handleCheckBoxTime: () => {},
  handleRemoveSettingPrice: () => {},
};

export default NewItemHourPrice;
