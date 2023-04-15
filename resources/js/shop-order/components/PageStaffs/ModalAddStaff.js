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
const DEFAULT_STAFF = {
  hash_id: null,
  given_name: '',
};

const ModalAddStaff = (props) => {
  const classes = useStyles();

  // Context
  const [shop] = useContext(ShopInfoContext);

  // Local state
  const [staffInfo, setStaffInfo] = useState(DEFAULT_STAFF);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    const {open, staff} = props;
    if (open) {
      if (staff) {
        setStaffInfo(staff);
      } else {
        setStaffInfo(DEFAULT_STAFF);
      }
    }
  }, [props.open]);

  const inputChanged = (event) => {
    const newStaff = Utils.cloneDeep(staffInfo);
    const {name, value} = event.target;
    newStaff[name] = value;
    setStaffInfo(newStaff);
  };

  const handleSubmit = async () => {
    const {showWarningMessage, showSuccessMessage, getStaffs, currentPage, onClose} = props;
    const errors = checkValidation(staffInfo);
    setInProgress(true);

    if (errors.length > 0) {
      showWarningMessage(errors[0]);
      setInProgress(false);

      return;
    }

    try {
      if (staffInfo && staffInfo.hash_id) {
        await ShopOrderApiService.updateStaff(
          shop.hashId,
          staffInfo.hash_id,
          {given_name: staffInfo.given_name}
        );

        showSuccessMessage('更新しました。');
      } else {
        await ShopOrderApiService.createStaff(
          shop.hashId,
          {given_name: staffInfo.given_name}
        );

        showSuccessMessage('作成しました。');
      }
      getStaffs({page: currentPage});
      setInProgress(false);
      onClose();
    } catch (error) {
      setInProgress(false);
      showWarningMessage(error.message);
    }
  }

  const actionModal = () => (
    <Box textAlign='center'>
      <ButtonCustom
        title='戻る'
        borderRadius='28px'
        bgcolor='#828282'
        borderColor='#828282'
        width='176px'
        onClick={props.onClose}
      />
      <ButtonCustom
        title='保存'
        borderRadius='28px'
        bgcolor='#FFA04B'
        borderColor='#FFA04B'
        width='176px'
        disabled={inProgress}
        onClick={handleSubmit}
      />
    </Box>
  );

  return (
    <Modal
      actions={actionModal()}
      open={props.open}
      title='スタッフ設定'
    >
      <Box mt={8} mb={5} p='0 50px'>
        <Box mt={3} display='flex' alignItems='center'>
          <Box width='30%' textAlign='left'>スタッフ名</Box>

          <Box width='70%' textAlign='left'>
            <OutlinedInput
              id='given_name'
              name='given_name'
              value={staffInfo.given_name}
              className={classes.input}
              labelWidth={0}
              onChange={inputChanged}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

// PropTypes
ModalAddStaff.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  staff: PropTypes.object,
  currentPage: PropTypes.number,
  getStaffs: PropTypes.func,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalAddStaff.defaultProps = {
  open: false,
  onClose: () => {},
  staff: null,
  currentPage: 0,
  getStaffs: () => {},
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalAddStaff;
