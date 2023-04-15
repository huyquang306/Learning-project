import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

// Components(Material-UI)
import {
  Box,
  Grid,
} from '@material-ui/core';
import { ALL_STAFFS_VALUE } from 'js/utils/helpers/dishupHelper'

// Base Components
import OrderCardComponent from 'js/shop-order/components/PageReserveList/components/OrderCardComponent';
import { useStylesNewReserve as useStyles } from '../newStyles';

const MainOrdersComponents = (props) => {
  const classes = useStyles(props);
  const { filteredOrders, filter, handleShowShippingSelect, showChangeOrderStatus } = props;

  // Local state
  const [isLongPress, setIsLongPress] = useState(false);

  // get orders that have not been pick to staff to shipping
  let mainOrders = filter.isShipping ? filteredOrders.filter(orderTmp => orderTmp.m_staffs.length === 0) : filteredOrders;
  mainOrders = (filter.selectedStaff != ALL_STAFFS_VALUE && !filter.isShipping) ? mainOrders.filter(orderTmp => {
    return (orderTmp.m_staffs.length > 0 ? orderTmp.m_staffs.findIndex(staff => {
      return staff.hash_id === filter.selectedStaff;
    }) > -1 : false)
  }) : mainOrders

  return (
    <Grid item xs={filter.isShipping ? 6 : 12} sm={filter.isShipping ? 6 : 12} md={filter.isShipping ? 7 : 12} className={classes.mainOrders}>
      <Box className={classes.mainOrdersTitle}>調理中</Box>
      <Box className={classes.mainsOrdersLeftContent}>
        {
          mainOrders.map((order, index) => (
            <Draggable
              cancel='.no-drag'
              bounds='parent'
              key={`${filter.sortBy}-${index}`}
              defaultClassName={classes.orderItemDragBox}
              defaultClassNameDragging={isLongPress ? classes.orderItemDragging : ''}
              onDrag={() => isLongPress}
            >
              <div
                className={`${classes.orderItemGrid} ${filter.isShipping ? 'isShowShipping' : ''}`}
                key={index}
              >
                <OrderCardComponent
                  order={order}
                  handleShowShippingSelect={handleShowShippingSelect}
                  showChangeOrderStatus={showChangeOrderStatus}
                  isLongPress={isLongPress}
                  setIsLongPress={setIsLongPress}
                  filter={filter}
                />
              </div>
            </Draggable>
          ))
        }
      </Box>
    </Grid>
  );
};

MainOrdersComponents.propTypes = {
  filteredOrders: PropTypes.array,
  filter: PropTypes.object,
  handleShowShippingSelect: PropTypes.func,
  showChangeOrderStatus: PropTypes.func,
};
MainOrdersComponents.defaultProps = {
  filteredOrders: [],
  filter: {},
  handleShowShippingSelect: () => {},
  showChangeOrderStatus: () => {},
};
export default MainOrdersComponents;
