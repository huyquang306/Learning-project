import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import {isEmpty} from "lodash";
import { ORDER_TYPE, ORDER_STATUS } from 'js/utils/helpers/courseHelper';

const useStyles = makeStyles({
  unActive: {
    boxSizing: 'border-box',
    borderRadius: '7px',
    height: '200px',
    margin: '2px',
    textAlign: 'center',
    lineHeight: '95px',
    overflowY: 'auto',
    padding: '5px',
  },
  orderActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: '7px',
    marginTop: '4px',
    '&.courseOver': {
      backgroundColor: 'rgba(255, 0, 0, 0.67) !important',
    },
  },
  addButton: {
    color: '#BDBDBD',
    margin: '0 auto',
    '&.selected': {
      color: '#4E7376',
    },
  },
  iconOrderActive: {
    color: 'rgba(255, 0, 0, 0.67)',
    fontSize: '14px',
  },
  orderName: {
    fontSize: '20spx',
    lineHeight: '20px',
    paddingLeft: '2px',
  },
  numberOrder: {
    width: '19px',
    height: '19px',
    textAlign: 'center',
    backgroundColor: '#FDFDFD',
    borderRadius: '50%',
    border: '1px solid #000',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    
    '& span': {
      marginTop: '2px',
    },
    '&.preparing': {
      backgroundColor: '#FFA04B',
      color: '#FFFFFF',
      border: '1px solid #FFA04B',
    },
    '&.cancelled': {
      backgroundColor: '#FFFFFF',
      color: 'red',
      border: '1px solid red',
    },
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    height: '24px',
    flex: 1,
    width: 'calc(100% - 20px)',
    
    '& span': {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      display: 'inline-block',
      backgroundColor: 'transparent',
      '&.active': {
        backgroundColor: 'rgba(255, 0, 0, 0.67)',
      },
    },
  },
  itemTitle: {
    fontSize: '14px',
    lineHeight: '16px',
    color: '#000000',
    marginLeft: '2px',
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
  cancelOrder: {
    display: 'unset',
    color: 'red',
    marginLeft: '-5px',
  }
});

const OrderCard = (props) => {
  const { orders, selected, filterStatus, course, overTimeCourse } = props;
  const classes = useStyles();
  const active = (orders && orders.length) > 0;
  
  if (!active && isEmpty(course)) {
    return (
      <div className={`${classes.unActive} ${selected ? ' selected' : ' '}`}>
        <IconButton
          edge="start"
          className={`${classes.addButton} ${selected ? ' selected' : ''}`}
          color="inherit"
        >
        </IconButton>
      </div>
    );
  }
  
  return (
    <div className={`${classes.unActive} ${selected ? ' selected' : ' '}`}>
      {orders.map((order, index) => {
        if (filterStatus.indexOf(order.status) > -1) {
          return (
            <div className={`${classes.orderActive} ${overTimeCourse
            && order.status != ORDER_STATUS.STATUS_CANCEL
            && order.order_type == ORDER_TYPE.ORDER_COURSE ? ' courseOver' : ' '}`} key={index}>
              <div className={classes.item}>
                <div className={classes.itemLeft}>
                  <Fragment>
                    <div className={classes.itemTitle}>{order.name}</div>
                  </Fragment>
                </div>
                <div>
                  <div className={[
                    classes.numberOrder,
                    (order.status === ORDER_STATUS.STATUS_ORDER || order.status === ORDER_STATUS.STATUS_SHIPPING) ? 'preparing' : '',
                    (order.status === ORDER_STATUS.STATUS_FINISH || order.status === ORDER_STATUS.STATUS_SHIPPED) ? 'finished' : '',
                    order.status === ORDER_STATUS.STATUS_CANCEL ? 'cancelled' : '',
                  ].join(' ')}>
                    <span>{order.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

OrderCard.propTypes = {
  orders: PropTypes.array.isRequired,
  selected: PropTypes.bool,
  filterStatus: PropTypes.array,
  course: PropTypes.object,
  ordergroup: PropTypes.object,
  overTimeCourse: PropTypes.bool,
};

OrderCard.defaultProps = {
  filterStatus: [0, 1],
  course: {},
  ordergroup: {},
};

export default OrderCard;
