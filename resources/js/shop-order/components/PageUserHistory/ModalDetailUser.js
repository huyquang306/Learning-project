import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

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
    height: '40px',
    display: 'flex',
    alignItems: 'center',
  },
}));

const ModalDetailUser = (props) => {
  const classes = useStyles();
  const initData = {
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
  };
  const [tableData, setTableData] = useState(initData);

  useEffect(() => {
    if (Object.keys(props.userDetailData).length === 0) {
      resetTableData();
    } else {
      setTableData(props.userDetailData);
    }
  }, [props.userDetailData]);

  const resetTableData = () => {
    setTableData(initData);
  };

  const actionModal = () => {
    return (
      <Box textAlign="center">
        <ButtonCustom
          title="戻る"
          borderRadius="28px"
          bgcolor="#828282"
          borderColor="#828282"
          width="176px"
          onClick={props.onClose}
        />
      </Box>
    );
  };

  return (
    <Modal actions={actionModal()} open={props.open} title="ユーザーの詳細" onClose={props.onClose}>
      <Box mt={4} mb={4}>
        <Box className={ classes.lineDetail }>
          <Box width={'50%'} textAlign={'center'}>
            ニックネーム
          </Box>
          <Box width={'50%'} textAlign={'left'}>
            {tableData.nick_name}
          </Box>
        </Box>

        <Box className={ classes.lineDetail }>
          <Box width={'50%'} textAlign={'center'}>
            メールアドレス
          </Box>
          <Box width={'50%'} textAlign={'left'}>
            {tableData.email}
          </Box>
        </Box>

        <Box className={ classes.lineDetail }>
          <Box width={'50%'} textAlign={'center'}>
            姓前
          </Box>
          <Box width={'50%'} textAlign={'left'}>
            {tableData.family_name}
          </Box>
        </Box>

        <Box className={ classes.lineDetail }>
          <Box width={'50%'} textAlign={'center'}>
            名前
          </Box>
          <Box width={'50%'} textAlign={'left'}>
            {tableData.given_name}
          </Box>
        </Box>

        <Box className={ classes.lineDetail }>
          <Box width={'50%'} textAlign={'center'}>
            姓前（カナ）
          </Box>
          <Box width={'50%'} textAlign={'left'}>
            {tableData.family_name_kana}
          </Box>
        </Box>
        
        <Box className={ classes.lineDetail }>
          <Box width={'50%'} textAlign={'center'}>
            名前（カナ）
          </Box>
          <Box width={'50%'} textAlign={'left'}>
            {tableData.given_name_kana}
          </Box>
        </Box>

        <Box className={ classes.lineDetail }>
          <Box width={'50%'} textAlign={'center'}>
            電話番号
          </Box>
          <Box width={'50%'} textAlign={'left'}>
            {tableData.phone_number}
          </Box>
        </Box>

        <Box className={ classes.lineDetail }>
          <Box width={'50%'} textAlign={'center'}>
            生年月日
          </Box>
          <Box width={'50%'} textAlign={'left'}>
            {tableData.birth_date}
          </Box>
        </Box>

        <Box className={ classes.lineDetail }>
          <Box width={'50%'} textAlign={'center'}>
            都道府県
          </Box>
          <Box width={'50%'} textAlign={'left'}>
            {tableData.prefecture}
          </Box>
        </Box>

        <Box className={ classes.lineDetail }>
          <Box width={'50%'} textAlign={'center'}>
            市区町村
          </Box>
          <Box width={'50%'} textAlign={'left'}>
            {tableData.city}
          </Box>
        </Box>

        <Box className={ classes.lineDetail }>
          <Box width={'50%'} textAlign={'center'}>
            住所(ビル名を除く）
          </Box>
          <Box width={'50%'} textAlign={'left'}>
            {tableData.address}
          </Box>
        </Box>

        <Box className={ classes.lineDetail }>
          <Box width={'50%'} textAlign={'center'}>
            ビル名（部屋番号）
          </Box>
          <Box width={'50%'} textAlign={'left'}>
            {tableData.building}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

// PropTypes
ModalDetailUser.propTypes = {
  open: PropTypes.bool,
  userDetailData: PropTypes.object,
  onClose: PropTypes.func,
  getTables: PropTypes.func,
};

// defaultProps
ModalDetailUser.defaultProps = {
  open: false,
  userDetailData: {},
  onClose: () => {},
  getTables: () => {},
};

export default ModalDetailUser;
