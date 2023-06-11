import React from 'react';
import PropTypes from 'prop-types';

// Components(Material-UI)
import { Button, Box, Grid, FormControlLabel, Checkbox, OutlinedInput } from '@material-ui/core';

// Components
import NewItemHourPrice from './NewItemHourPrice';
import CustomSelectorBase from 'js/shared/components/CustomSelectorBase';

// Styles
import { useStylesSettingMenu } from './styles.js';

// utils
import { showtaxValue } from 'js/utils/helpers/const';

const SettingPriceTab = (props) => {
  const classes = useStylesSettingMenu();
  const draftDataSettingPrice = props?.draftDataSettingPrice;
  const shop = props?.shop;
  const menuData = props?.menuData;
  const businessHours = props?.businessHours;
  const taxValue =
    props?.hanldePriceFractionMode(Number(props?.draftDataSettingPrice?.tax_value), 0) || 0;
  const currencyName = shop?.mShopPosSetting?.m_currency?.name;

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item sm={1} xs={12}>
          <Box className='wrap-checkbox' display={{ xs: 'flex', sm: 'block' }} alignItems='center'>
            <Box
              className={classes.labelCheckbox}
              textAlign='left'
              whiteSpace='nowrap'
              minWidth='25%'
            >
              In use
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={draftDataSettingPrice.display_flg == 1 ? true : false}
                  name='is_show'
                  value={draftDataSettingPrice.display_flg == 1 ? true : false}
                  color='default'
                  disabled={businessHours.length === 0}
                />
              }
              onChange={(event) => props.handleDraftSettingPrice(event)}
            />
          </Box>
        </Grid>

        <Grid item md={4} sm={5} xs={12}>
          <Box display={{ xs: 'flex', sm: 'block' }} alignItems='center' className='time-frame'>
            <Box
              className={'second'}
              textAlign={{ xs: 'left', sm: 'center' }}
              whiteSpace='nowrap'
              minWidth='25%'
            >
              Khung giờ
            </Box>

            <Box>
              <CustomSelectorBase
                className={classes.select}
                value={draftDataSettingPrice.m_shop_business_hour?.value}
                optionArray={businessHours}
                id='time'
                name='time'
                onChange={(event) => props.handleDraftSettingPrice(event)}
                disabled={businessHours.length === 0}
              />

              {
                businessHours.length === 0 && <Box className={classes.textDanger}>Vui lòng chọn khung giờ</Box>
              }
            </Box>
          </Box>
        </Grid>
        <Grid item sm={4} md={5} xs={12}>
          <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }}>
            <Box display={{ xs: 'flex', sm: 'block' }}>
              <Box
                className={'first'}
                whiteSpace='nowrap'
                textAlign={{ xs: 'left', sm: 'center' }}
                minWidth='25%'
              >
                Giá
              </Box>

              <OutlinedInput
                id='draft_price'
                name='draft_price'
                value={draftDataSettingPrice.price}
                className={`${classes.input} + 'draft_price_input' + ${classes.inputPrice}`}
                classes={{
                  input: classes.inputPrice,
                }}
                labelWidth={0}
                onChange={(event) => props.handleDraftSettingPrice(event)}
                disabled={businessHours.length === 0}
              />
            </Box>

            <Box
              style={{ fontWeight: 400, whiteSpace: 'nowrap' }}
              alignSelf={{ xs: 'center', md: 'flex-end' }}
              ml={1}
              mb={1}
              className={classes.textShowTax}
              width={{ xs: '65%' }}
            >
              {/*{showtaxValue(taxValue, currencyName)}*/}
            </Box>
          </Box>
        </Grid>

        <Grid item sm={2} xs={12}>
          <Box
            height='100%'
            whiteSpace='nowrap'
            display={{ xs: 'flex', sm: 'block' }}
            justifyContent='center'
          >
            <Button
              variant='outlined'
              style={{ color: '#2e7d32', border: '2px solid rgba(46, 125, 50, 0.5)', padding: '6px 15px', marginTop: '27px' }}
              onClick={() => props.addNewSettingPrice()}
              disabled={businessHours.length === 0}
            >
              Thêm
            </Button>
          </Box>
        </Grid>
      </Grid>

      {menuData?.m_shop_business_hour_prices &&
        menuData?.m_shop_business_hour_prices?.length !== 0 && (
          <Grid container spacing={2}>
            <Grid item md={2}></Grid>
            <Grid item md={8}>
              <img src={`${process.env.MIX_ASSETS_PATH}/img/shared/arrow_down.png`} />
            </Grid>
            <Grid item md={2}></Grid>
          </Grid>
        )}
      {menuData?.m_shop_business_hour_prices?.map((item, key) => (
        <NewItemHourPrice
          businessHourPrice={item}
          shop={shop}
          key={key}
          keyValue={key}
          handleCheckBoxTime={props.handleCheckBoxTime}
          handleRemoveSettingPrice={props.handleRemoveSettingPrice}
          hanldePriceFractionMode={props.hanldePriceFractionMode}
        />
      ))}
    </Box>
  );
};

// PropTypes
SettingPriceTab.propTypes = {
  menuData: PropTypes.object,
  shop: PropTypes.object,
  draftDataSettingPrice: PropTypes.object,
  handleDraftSettingPrice: PropTypes.func,
  addNewSettingPrice: PropTypes.func,
  hanldePriceFractionMode: PropTypes.func,
  handleCheckBoxTime: PropTypes.func,
  handleRemoveSettingPrice: PropTypes.func,
  businessHours: PropTypes.array,
};

// defaultProps
SettingPriceTab.defaultProps = {
  menuData: {},
  shop: {},
  draftDataSettingPrice: {},
  handleDraftSettingPrice: () => {},
  addNewSettingPrice: () => {},
  hanldePriceFractionMode: () => {},
  handleCheckBoxTime: () => {},
  handleRemoveSettingPrice: () => {},
  businessHours: [],
};

export default SettingPriceTab;
