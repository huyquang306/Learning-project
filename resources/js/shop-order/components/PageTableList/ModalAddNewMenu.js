import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

// Components(Material-UI)
import { Box, OutlinedInput } from '@material-ui/core';
import { useStylesOrderManager as useStyles } from './styles';

// Base Components
import ModalChildren from './ModalChildren';
import ButtonCore from 'js/shared/components/Button';

// Service
import ShopApiService from 'js/shop/shop-api-service';

// Utils
import Utils from 'js/shared/utils';
import { ROUND_DOWN, hanldePriceFractionMode } from 'js/utils/helpers/const';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';
import { ORDER_STATUS } from 'js/utils/helpers/courseHelper';
import {
  validateName,
  validatePrice,
} from 'js/shop-order/components/setting/itemSettingMenu/validationSettingMenu';

const DEFAULT_QUANTITY_ORDER = 1;
const DEFAULT_TAX_RATE = 0.1;
const DEFAULT_NEW_MENU = {
  menu_name: '',
  price: '',
  quantity: DEFAULT_QUANTITY_ORDER,
  isNewMenu: true,
  new_hash_id: 1,
  tax_rate: DEFAULT_TAX_RATE,
  tax_value: 0,
};
const ModalAddNewMenu = (props) => {
  const classes = useStyles(props);
  const { showModalAddNewMenu, setShowModalAddNewMenu, onConfirmOrderDetail } = props;
  const [shop] = useContext(ShopInfoContext);

  //state
  const [newMenuData, setNewMenuData] = useState(DEFAULT_NEW_MENU);
  const [priceFractionMode, setPriceFractionMode] = useState(ROUND_DOWN);

  useEffect(() => {
    getShopTaxInfo();
  }, []);

  // get shop tax info
  const getShopTaxInfo = async () => {
    const shopTaxInfo = await ShopApiService.getShopTaxInfo(shop?.hashId);
    setPriceFractionMode(shopTaxInfo?.price_fraction_mode);
  };

  const handleValueBeforeRound = (price, percenTaxValue) =>
    (price * 100 * percenTaxValue) / (100 + 100 * percenTaxValue);

  const onConfirmAddNewMenu = () => {
    const newMenuDataClone = Utils.cloneDeep(newMenuData);
    newMenuDataClone.hash_id = new Date().getTime();
    newMenuDataClone.name = newMenuDataClone.menu_name;
    newMenuDataClone.tax_value = hanldePriceFractionMode(
      handleValueBeforeRound(parseFloat(newMenuDataClone.price), DEFAULT_TAX_RATE),
      0,
      priceFractionMode
    );
    newMenuDataClone.amount = Number(newMenuDataClone.price) * Number(newMenuDataClone.quantity);
    newMenuDataClone.price = newMenuDataClone?.price ? Number(newMenuDataClone.price) : '';
    newMenuDataClone.origin_price = newMenuDataClone?.price ? Number(newMenuDataClone.price) : '';
    newMenuDataClone.status = ORDER_STATUS.STATUS_ORDER;

    let errors = [];
    validatePrice(newMenuDataClone, errors);
    validateName(newMenuDataClone, errors);
    
    if (errors.length > 0) {
      props.showWarningMessage(errors[0]);
      return;
    }

    setNewMenuData(DEFAULT_NEW_MENU);
    setShowModalAddNewMenu(false);
    onConfirmOrderDetail(newMenuDataClone, true);
  };

  const handleDecrement = () => {
    let order = Utils.cloneDeep(newMenuData);
    const { quantity } = order;
    order.quantity = quantity > DEFAULT_QUANTITY_ORDER ? quantity - 1 : DEFAULT_QUANTITY_ORDER;
    setNewMenuData(order);
  };

  const handleIncrement = () => {
    let order = Utils.cloneDeep(newMenuData);
    order.quantity += 1;
    setNewMenuData(order);
  };

  const inputChanged = (event) => {
    const newMenuDataClone = Utils.cloneDeep(newMenuData);
    const { name, value } = event.target;

    if (name === 'price') {
      newMenuDataClone[name] = value;
      newMenuDataClone.menu_name = `商品－${value}`;
    } else {
      newMenuDataClone[name] = value;
    }
    
    setNewMenuData(newMenuDataClone);
  };

  return (
    <ModalChildren
      isOpen={showModalAddNewMenu}
      isModalShowAddNewMenu={true}
      title="メニューなし商品"
      onClose={() => {
        setShowModalAddNewMenu(false);
        setNewMenuData(DEFAULT_NEW_MENU);
      }}
      onConfirm={onConfirmAddNewMenu}
      customClass={classes.smallModalCard}
    >
      <Box display="flex" alignItems="center" className={classes.prodItem} flexDirection="column">
        <Box mb={4}>
          <OutlinedInput
            id="price"
            name="price"
            value={newMenuData.price}
            className={`${classes.input} ${classes.inputPrice}`}
            placeholder='金額'
            classes={{
              input: classes.inputPrice,
            }}
            labelWidth={0}
            onChange={inputChanged}
          />
        </Box>
        <Box mb={4}>
          <OutlinedInput
            id="menu_name"
            name="menu_name"
            value={newMenuData.menu_name}
            className={`${classes.input}`}
            placeholder='商品名'
            labelWidth={0}
            onChange={inputChanged}
          />
        </Box>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ButtonCore
          padding="0"
          borderRadius="50%"
          classes={{ root: classes.customButton }}
          style={{ background: '#E4E1B0', color: '#333333' }}
          onClick={handleDecrement}
        >
          ー
        </ButtonCore>
        <Box display="flex" alignItems="baseline" fontSize={50} fontWeight="fontWeightBold">
          {newMenuData.quantity}
          <Box fontSize={23} fontWeight="fontWeightRegular">
            個
          </Box>
        </Box>
        <ButtonCore
          padding="0"
          borderRadius="50%"
          bgcolor="#F2994B"
          fgcolor="#ffffff"
          classes={{ root: classes.customButton }}
          onClick={handleIncrement}
        >
          ＋
        </ButtonCore>
      </Box>
    </ModalChildren>
  );
};

ModalAddNewMenu.propTypes = {
  showModalAddNewMenu: PropTypes.bool,
  onConfirmOrderDetail: PropTypes.func,
  setShowModalAddNewMenu: PropTypes.func,
  showWarningMessage: PropTypes.func
};

ModalAddNewMenu.defaultProps = {
  showModalAddNewMenu: false,
  onConfirmOrderDetail: () => {},
  setShowModalAddNewMenu: () => {},
  showWarningMessage: () => {}
};

export default ModalAddNewMenu;
