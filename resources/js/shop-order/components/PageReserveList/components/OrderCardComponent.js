import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';
moment.locale('ja');

// Components(Material-UI)
import {
  Box,
  Button,
  Grid,
} from '@material-ui/core';
// Base Components
import { useStyleOrderCard as useStyles } from '../newStyles';

// Utils
import Utils from 'js/shared/utils';
import {ORDER_STATUS} from 'js/utils/helpers/courseHelper';
import {TIME_SECONDS_FORMAT, DATE_TIME_SECONDS_FORMAT, momentJP} from 'js/utils/helpers/timer';
import useLongPress from 'js/utils/helpers/useLongPress';
import { ENTER_KEY_CODE } from 'js/utils/helpers/const';

const CONST_NEW_ORDER_TIMES = 1 // minutes

const OrderCardComponent = (props) => {
  const classes = useStyles(props);
  const {order, filter, isLongPress, setIsLongPress, isStyleGroup} = props;

  // Local State
  const [isOverTimeCook, setIsOverTimeCook] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    checkOverTimeCook();
    checkIsNew();

    const timerInterval = setInterval(() => {
      checkOverTimeCook();
      checkIsNew();
    }, Utils.REFRESH_SECOND());

    return () => clearInterval(timerInterval);
  }, [props.order]);

  const onFinish = () => setIsLongPress(false);
  const onLongPress = () => setIsLongPress(true);
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const onClick = () => {
    // Disable click when long press other elements
    if (isLongPress) return;

    handleClickOrder();
  }
  const longPressEvent = useLongPress(onLongPress, onClick, onFinish, defaultOptions);

  const handleClickOrder = () => {
    if ([
      ORDER_STATUS.STATUS_FINISH,
      ORDER_STATUS.STATUS_CANCEL,
      ORDER_STATUS.STATUS_SHIPPED,
    ].includes(order.status)) {
      return;
    }

    if (!filter.isShipping || order.status === ORDER_STATUS.STATUS_SHIPPING) {
      props.showChangeOrderStatus(order);
      return;
    }

    if (order.status === ORDER_STATUS.STATUS_ORDER) {
      props.handleShowShippingSelect(order);
      return;
    }
  };

  const checkOverTimeCook = () => {
    if (order && order.m_menu) {
      const expectTime = moment(order.ordered_at, DATE_TIME_SECONDS_FORMAT)
        .add(order.m_menu.estimated_preparation_time, 'minutes');
      const now = momentJP();
      if (order.status === ORDER_STATUS.STATUS_ORDER && expectTime < now) {
        setIsOverTimeCook(true);
      } else {
        setIsNew(false);
      }
    }
  };

  const checkIsNew = () => {
    if (order) {
      const orderedTime = moment(order.ordered_at, DATE_TIME_SECONDS_FORMAT)
        .add(CONST_NEW_ORDER_TIMES, 'minutes');
      const now = momentJP();
      if (order.status === ORDER_STATUS.STATUS_ORDER && orderedTime >= now) {
        setIsNew(true);
      } else {
        setIsNew(false);
      }
    }
  };

  const getOrderedAtTime = () => order.ordered_at
    ? moment(order.ordered_at, DATE_TIME_SECONDS_FORMAT).format(TIME_SECONDS_FORMAT)
    : null;

  const getClassesOrder = () => {
    if (isNew) return 'isNew';

    switch (order.status) {
      case ORDER_STATUS.STATUS_CANCEL: return 'cancel';
      case ORDER_STATUS.STATUS_SHIPPING: return 'shipping';
      case ORDER_STATUS.STATUS_SHIPPED:
      case ORDER_STATUS.STATUS_FINISH: return 'shipped';
      default:
        if (isOverTimeCook) return 'cookOvertime';

        return '';
    }
  };

  return (
    <Button onKeyPress={(e) => (e.keyCode === ENTER_KEY_CODE || e.which === ENTER_KEY_CODE) && handleClickOrder()} 
      {...longPressEvent} className={`${classes.orderCard} ${isStyleGroup ? 'isGroup': ''}`}>
      <Box className={`${classes.orderItem} ${getClassesOrder()}`}>
        <Grid container className={classes.orderItemRow}>
          <Grid item xs={4}>
            {
              order.status === ORDER_STATUS.STATUS_CANCEL
                ? <span className={classes.textDangerCancel}>【取消】</span>
                : getOrderedAtTime()
            }
          </Grid>
          <Grid item xs={8} className={classes.orderItemTextRight}>テーブル番号: {order.table_codes}</Grid>
        </Grid>
        <Grid container className={classes.orderItemContent}>
          <Grid item xs={4}>{order.is_first_order ? '○新規○' : '○追加○'}</Grid>
          <Grid item xs={8} className={classes.orderItemTextRight}>数量</Grid>
        </Grid>
        <Box className={classes.orderItemDotLine}/>
        <Grid container className={classes.orderItemContent}>
          <Grid item xs={10}>{order.name}</Grid>
          <Grid item xs={2} className={classes.orderItemTextRight}>{order.quantity}</Grid>
        </Grid>
      </Box>
    </Button>
   
  );
};

OrderCardComponent.propTypes = {
  order: PropTypes.object,
  filter: PropTypes.object,
  handleShowShippingSelect: PropTypes.func,
  showChangeOrderStatus: PropTypes.func,
  handleChangeOrderStatus: PropTypes.func,
  isLongPress: PropTypes.bool,
  setIsLongPress: PropTypes.func,
  isStyleGroup: PropTypes.bool,
};
OrderCardComponent.defaultProps = {
  order: {},
  filter: {},
  handleShowShippingSelect: () => {},
  showChangeOrderStatus: () => {},
  handleChangeOrderStatus: () => {},
  isLongPress: false,
  setIsLongPress: () => {},
  isStyleGroup: false,
};
export default OrderCardComponent;
