import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';

// Utils
import { ORDER_STATUS } from 'js/utils/helpers/courseHelper';

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
    marginTop: '50px',
    marginBottom: '25px',
  },
  staffRadio: {
    border: '1px solid gray',
    borderRadius: '5px',
    padding: '0 20px 0 0',
    marginRight: '25px',
    marginLeft: 0,
    marginBottom: '10px',
  },
}));

const ModalChangeStatusOrder = (props) => {
  const classes = useStyles();
  const { open, handleChangeOrderStatus, onClose, filter } = props;

  // Local state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [open]);

  const changeOrderStatus = (status) => {
    setIsLoading(true);
    handleChangeOrderStatus(status);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  const footerActions = () => {
    return (
      <React.Fragment>
        <Grid container>
          <Grid item xs={filter.isShipping ? 12 : 6} sm={filter.isShipping ? 4 : 6}>
            <Box display="flex" justifyContent={filter.isShipping ? 'center' : 'right'}>
              <ButtonCustom
                title="戻る"
                borderRadius="28px"
                bgcolor="#828282"
                borderColor="#828282"
                width="195px"
                disabled={isLoading}
                onClick={onClose}
              />
            </Box>
          </Grid>
          {filter.isShipping && (
            <Grid item xs={filter.isShipping ? 12 : 6} sm={filter.isShipping ? 4 : 6}>
              <Box justifyContent="center" display="flex">
                <ButtonCustom
                  title="調理中に戻す"
                  borderRadius="28px"
                  bgcolor="#828282"
                  borderColor="#828282"
                  width="195px"
                  disabled={isLoading}
                  onClick={() => changeOrderStatus(ORDER_STATUS.STATUS_ORDER)}
                />
              </Box>
            </Grid>
          )}
          <Grid item xs={filter.isShipping ? 12 : 6} sm={filter.isShipping ? 4 : 6}>
            <Box display="flex" justifyContent={filter.isShipping ? 'center' : 'left'}>
              <ButtonCustom
                title="提供完了"
                borderRadius="28px"
                bgcolor="#FFA04B"
                borderColor="#FFA04B"
                width="195px"
                disabled={isLoading}
                onClick={() => changeOrderStatus(ORDER_STATUS.STATUS_SHIPPED)}
              />
            </Box>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  return (
    <Modal
      open={open}
      title="ステータス変更"
      actions={footerActions()}
      minHeight="auto"
      maxHeight="auto"
    >
      <div className={classes.modalContent}>
        <Box
          className={classes.headerBox}
          display={{ xs: 'flex', sm: 'block' }}
          justifyContent={
            filter.isShipping ? { xs: 'center', sm: 'left' } : { xs: 'left', sm: 'left' }
          }
        >
          <ButtonCustom
            title="注文キャンセル"
            margin="0px"
            borderRadius="28px"
            bgcolor="#FFFFFF"
            borderColor="red"
            fgcolor="red"
            width="195px"
            onClick={() => changeOrderStatus(ORDER_STATUS.STATUS_CANCEL)}
            padding="8px 10px"
          />
        </Box>
        <Box className={classes.contentText}>料理の提供を完了しますか？</Box>
      </div>
    </Modal>
  );
};

// PropTypes
ModalChangeStatusOrder.propTypes = {
  open: PropTypes.bool,
  handleChangeOrderStatus: PropTypes.func,
  onClose: PropTypes.func,
  filter: PropTypes.object,
};

// defaultProps
ModalChangeStatusOrder.defaultProps = {
  open: false,
  handleChangeOrderStatus: () => {},
  onClose: () => {},
  filter: PropTypes.object,
};

export default ModalChangeStatusOrder;
