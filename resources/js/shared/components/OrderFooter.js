/**
 * Footer Order
 */

// React
import React, { useState } from 'react';

// Library
import PropTypes from 'prop-types';

// Material UI component
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Component shared
import Button from '../../shared-order/components/Button';
import Modal from '../../customer-order/components/Modal';

const useStyles = makeStyles({
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: (props) => props.padding,
    backgroundColor: (props) => props.bgColor,
    zIndex: '2',
  },
  btnFooter: {
    fontWeight: 600,
    margin: '3px',
  },
  numberOrder: {
    zIndex: 1,
    position: 'absolute',
    right: '8px',
    top: '-18px',
    width: '38px',
    height: '38px',
    backgroundColor: 'red',
    borderRadius: '50%',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#F2F2F2',
    textAlign: 'center',
    lineHeight: '38px',
  },
});

const ORDERGROUP_STATUS = {
  PRE_ORDER: 0,
  ORDERING: 1,
  REQUEST_CHECKOUT: 2,
  WAITING_CHECKOUT: 3,
  CHECKED_OUT: 4,
  CANCEL: 9,
};

const OrderFooter = (props) => {
  const classes = useStyles(props);
  const [isShowModalWaiting, setIsShowModalWaiting] = useState(false);
  
  const confirmOrder = () => {
    if (
      props.statusOfOrderGroup >= ORDERGROUP_STATUS.REQUEST_CHECKOUT &&
      props.statusOfOrderGroup < ORDERGROUP_STATUS.CHECKED_OUT
    ) {
      // Requested checkout -> waiting payment
      setIsShowModalWaiting(true);
    } else {
      props.buttonOrder();
    }
  };
  
  return (
    <Box className={classes.footer}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box
          color="#ffffff"
          fontSize={10}
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          lineHeight={1.3}
        >
          <Button
            bgcolor="#ffffff"
            fgcolor="#333333"
            classes={{
              root: classes.btnFooter,
            }}
            style={{
              borderStyle: 'none',
              padding: '8px 20px',
              color: '#FFA04B',
              boxShadow: 'none',
            }}
            onClick={() => props.buttonBack()}
          >
            Quay lại
          </Button>
        </Box>
        
        {/* only display button when having at least one selected item */}
        {props.lengthOfPreOrderList > 0 && (
          <Box position="relative">
            <Box className={classes.numberOrder}>{props.numberOfOrders}</Box>
            <Button
              bgcolor="#ffffff"
              fgcolor="#333333"
              borderColor="red"
              classes={{
                root: classes.btnFooter,
              }}
              style={{
                boxShadow: 'none',
                color: 'red',
              }}
              onClick={() => confirmOrder()}
            >
              Gọi món
            </Button>
          </Box>
        )}
        
        {/* Modal waiting payment  */}
        {isShowModalWaiting && (
          <Modal
            open={isShowModalWaiting}
            title="Notice"
            maxWidth="450px"
            minHeight="320px"
            maxHeight="520px"
            onClose={() => setIsShowModalWaiting(false)}
          >
            <div style={{ marginTop: '35%' }}>
              <Box textAlign="center">Accounting. please tell the store clerk about additional orders</Box>
            </div>
          </Modal>
        )}
      </Box>
    </Box>
  );
};

// PropTypes
OrderFooter.propTypes = {
  bgColor: PropTypes.string,
  padding: PropTypes.string,
  lengthOfPreOrderList: PropTypes.number,
  numberOfOrders: PropTypes.number,
  buttonBack: PropTypes.func,
  buttonOrder: PropTypes.func,
};

OrderFooter.defaultProps = {
  bgColor: '#ffffff',
  padding: '0 10px',
  lengthOfPreOrderList: 0,
  numberOfOrders: 0,
  buttonBack: () => {},
  buttonOrder: () => {},
};

export default OrderFooter;
