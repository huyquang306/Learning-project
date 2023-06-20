import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import {Box, FormControlLabel, Grid, Radio, RadioGroup} from '@material-ui/core';

// Utils
import {ORDER_STATUS} from 'js/utils/helpers/courseHelper';

const useStyles = makeStyles(() => ({
  headerBox: {
    display: 'flex',
    color: 'red',
    '& button': {
      border: '1px solid red',
    },
  },
  modalContent: {
    height: 'auto',
    overflow: 'hidden',
    padding: '15px',
    textAlign: 'center',
    fontSize: '20px',
  },
  contentText: {
    marginTop: '15px',
    marginBottom: '25px',
  },
  staffRadio: {
    border: '1px solid gray',
    borderRadius: '25px',
    padding: '0 20px 0 0',
    marginRight: '25px',
    marginLeft: 0,
    marginBottom: '10px',
    width: '80%',
    '@media (max-width: 600px)' : {
      width: '85%',
    },
  },
  staffsBox: {
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: '200px',
    minHeight: '100px',
    padding: '0 80px',
    '@media (max-width: 700px)' : {
      padding: '0 20px',
    },
    '@media (max-width: 600px)' : {
      padding: 0,
    },
    '@media (max-height: 800px)' : {
      height: '130px',
    },
  },
}));

const ModalChangeOrderShipping = (props) => {
  const classes = useStyles();
  const {open, staffs, onClose, handleChangeOrderStatus, setToast} = props;

  // Local state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedStaff('');
    setIsLoading(false);
  }, [open]);

  // Local state
  const [selectedStaff, setSelectedStaff] = useState('');

  const changeOrderStatus = (status, staffHashId = null) => {
    if (status === ORDER_STATUS.STATUS_SHIPPING && !staffHashId) {
      setToast({ isShow: true, status: 'warning', message: 'Chưa có nhân viên nào được chọn' });

      return;
    }

    setIsLoading(true);
    handleChangeOrderStatus(status, staffHashId);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  }

  const footerActions = () => {
    return (
      <React.Fragment>
        <ButtonCustom
          title='Quay lại'
          borderRadius='28px'
          bgcolor='#828282'
          borderColor='#828282'
          width='176px'
          onClick={onClose}
        />
        <ButtonCustom
          title='Đồng ý'
          borderRadius='28px'
          bgcolor='#FFA04B'
          borderColor='#FFA04B'
          width='176px'
          disabled={isLoading}
          onClick={() => changeOrderStatus(ORDER_STATUS.STATUS_SHIPPING, selectedStaff)}
        />
      </React.Fragment>
    );
  };

  return (
    <Modal
      open={open}
      title='Chọn nhân viên'
      actions={footerActions()}
      minHeight='auto'
      maxHeight='auto'
    >
      <div className={classes.modalContent}>
        <Box className={classes.headerBox}>
          <ButtonCustom
            title='Hủy món'
            margin='0px'
            borderRadius='28px'
            bgcolor='#FFFFFF'
            borderColor='red'
            fgcolor='red'
            width='auto'
            onClick={() => changeOrderStatus(ORDER_STATUS.STATUS_CANCEL)}
          />
        </Box>

        <Box className={classes.contentText}>
          Bạn có muốn chọn nhân viên này để phục vụ?
        </Box>

        <Box className={classes.staffsBox}>
          <RadioGroup row aria-label='staff select' name='selectedStaff'>
            {
              staffs.map((staff, staffIndex) => (
                <Grid key={staffIndex} item xs={6} sm={6} md={4}>
                  <FormControlLabel
                    className={classes.staffRadio}
                    value={staff.hash_id}
                    control={<Radio color='default'/>}
                    label={staff.given_name}
                    onClick={() => setSelectedStaff(staff.hash_id)}
                  />
                </Grid>
              ))
            }
          </RadioGroup>
        </Box>
      </div>
    </Modal>
  );
};

// PropTypes
ModalChangeOrderShipping.propTypes = {
  open: PropTypes.bool,
  staffs: PropTypes.array,
  onClose: PropTypes.func,
  handleChangeOrderStatus: PropTypes.func,
  setToast: PropTypes.func,
};

// defaultProps
ModalChangeOrderShipping.defaultProps = {
  open: false,
  staffs: [],
  onClose: () => {},
  handleChangeOrderStatus: () => {},
  setToast: () => {},
};

export default ModalChangeOrderShipping;
