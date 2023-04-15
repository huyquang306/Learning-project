import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Utils from 'js/shared/utils';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

import ShopOrderApiService from 'js/shop-order/shop-order-api-service';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Box, OutlinedInput } from '@material-ui/core';

// Utils
import {checkValidation} from './validationCookPlace';

const useStyles = makeStyles(() => ({
  modalContent: {},
  buttonHeader: {
    textAlign: 'center',
    color: '#fff',
    fontSize: '18px',
    background: '#F2C94C',
    padding: '8px 20px',
    borderRadius: '28px',
    width: '220px',
    '&:hover': {
      background: '#F2C94C',
    },
  },
  contentDetail: {
    color: '#000000',
    fontSize: '18px',
    fontWeight: 400,
  },
  select: {
    width: '80%',
    color: '#828282',
    fontSize: '20px',
    height: '40px',
    marginRight: '24px',
  },
  input: {
    width: '100%',
    color: '#4F4F4F',
    fontSize: '24px',
    height: '48px',
    borderRadius: '4px',
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
}));
const DEFAULT_COOK_PLACE = {
  id: null,
  name: '',
};

const ModalSettingCookPlace = (props) => {
  const classes = useStyles();

  // Context
  const [shop] = useContext(ShopInfoContext);

  // Local state
  const [cookPlace, setCookPlace] = useState(DEFAULT_COOK_PLACE);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    if (props.open) {
      if (props.cookPlace) {
        setCookPlace(props.cookPlace);
      } else {
        setCookPlace(DEFAULT_COOK_PLACE);
      }
    }
  }, [props.open]);

  const inputChanged = (event) => {
    const newCookPlace = Utils.cloneDeep(cookPlace);
    newCookPlace[event.target.name] = event.target.value;
    setCookPlace(newCookPlace);
  };

  const handleSubmit = async () => {
    const errors = checkValidation(cookPlace);
    setInProgress(true);

    if (errors.length > 0) {
      props.showWarningMessage(errors[0]);
      setInProgress(false);

      return;
    }

    try {
      let newCookPlaces = Utils.cloneDeep(props. cookPlaces);
      if (cookPlace && cookPlace.id && cookPlace.hash_id) {
        const updateCookPlace = await ShopOrderApiService.updateCookPlace(
          shop.hashId,
          cookPlace.hash_id,
          {name: cookPlace.name}
        );

        const cookPlaceIndex = newCookPlaces.findIndex(cookTmp => cookTmp.id === cookPlace.id);
        if (cookPlaceIndex > -1) {
          newCookPlaces[cookPlaceIndex] = updateCookPlace;
        }
        props.setCookPlaces(newCookPlaces);
        props.showSuccessMessage('更新しました。');
      } else {
        const newCookPlace = await ShopOrderApiService.createCookPlace(
          shop.hashId,
          {name: cookPlace.name}
        );
        newCookPlaces.push(newCookPlace);
        props.setCookPlaces(newCookPlaces);
        props.showSuccessMessage('作成しました。');
      }
      setInProgress(false);
      props.onClose();
    } catch (error) {
      setInProgress(false);
      if (error?.result[0]?.errorCode === 'The name has already been taken.') {
        props.showWarningMessage('すでに使われている調理場名です');
        return;
      }

      props.showWarningMessage(error.message);
    }
  }

  const actionModal = () => (
    <Box textAlign="center">
      <ButtonCustom
        title="戻る"
        borderRadius="28px"
        bgcolor="#828282"
        borderColor="#828282"
        width="176px"
        onClick={props.onClose}
      />
      <ButtonCustom
        title="保存"
        borderRadius="28px"
        bgcolor="#FFA04B"
        borderColor="#FFA04B"
        width="176px"
        disabled={inProgress}
        onClick={handleSubmit}
      />
    </Box>
  );

  return (
    <Modal
      actions={actionModal()}
      open={props.open}
      title="調理場設定"
      onClose={props.onClose}
    >
      <Box mt={8} mb={5} p='0 50px'>
        <Box mt={3} display='flex' alignItems='center'>
          <Box width='30%' textAlign='left'>調理場名</Box>

          <Box width='70%' textAlign='left'>
            <OutlinedInput
              id='name'
              name='name'
              value={cookPlace.name}
              className={classes.input}
              labelWidth={0}
              onChange={(e) => inputChanged(e)}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

// PropTypes
ModalSettingCookPlace.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  cookPlace: PropTypes.object,
  cookPlaces: PropTypes.array,
  setCookPlaces: PropTypes.func,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalSettingCookPlace.defaultProps = {
  open: false,
  onClose: () => {},
  cookPlace: null,
  cookPlaces: [],
  setCookPlaces: () => {},
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalSettingCookPlace;
