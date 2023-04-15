import React from 'react';
import PropTypes from 'prop-types';

// Components(Material-UI)
import {
  Box,
  Grid,
} from '@material-ui/core';

// Base Components
import OrderCardComponent from 'js/shop-order/components/PageReserveList/components/OrderCardComponent';
import { useStylesNewReserve as useStyles } from '../newStyles';

// Utils
import {ALL_STAFFS_VALUE} from 'js/utils/helpers/dishupHelper';
const StaffOrdersComponent = (props) => {
  const classes = useStyles(props);
  const {staffs, filteredOrders, filter, handleShowShippingSelect, handleChangeOrderStatus, showChangeOrderStatus} = props;
  const {selectedStaff} = filter;
  let filteredStaffs = staffs;
  if (selectedStaff !== ALL_STAFFS_VALUE) {
    filteredStaffs = staffs.filter(staff => staff.hash_id === selectedStaff);
  }

  const ordersOfStaffs = (staff) => filteredOrders.filter(
    orderTmp => orderTmp.m_staffs.find(staffTmp => staffTmp.hash_id === staff.hash_id)
  );

  const renderOrders = (staffIndex, staff) => {
    const orders = ordersOfStaffs(staff);

    return (
      <>
        <Grid item xs={12} sm={12} md={3} className={classes.staffOrdersToggle}>{staff.given_name}</Grid>
        {
          orders.length ? (
            <Grid item xs={12} sm={12} md={9}>
              {
                staff.isQueue ? orders.map((order, orderIndex) => (
                  <div
                    className={classes.orderItemRightGrid}
                    key={orderIndex}
                  >
                    <OrderCardComponent
                      order={order}
                      handleShowShippingSelect={handleShowShippingSelect}
                      handleChangeOrderStatus={handleChangeOrderStatus}
                      showChangeOrderStatus={showChangeOrderStatus}
                      filter={filter}
                    />
                  </div>
                )) : (
                  <div
                    className={orders.length > 1 ? classes.card : null}
                  >
                    <OrderCardComponent
                      order={orders[0]}
                      handleShowShippingSelect={handleShowShippingSelect}
                      handleChangeOrderStatus={handleChangeOrderStatus}
                      showChangeOrderStatus={showChangeOrderStatus}
                      filter={filter}
                      isStyleGroup={orders.length > 1}
                    />
                  </div>
                )
              }
              {
                orders.length > 1 && (
                  <Box className={classes.staffOrderFooter} onClick={() => props.handleQueueOrders(staff.hash_id)}>
                    {
                      staff.isQueue ? '▲▲閉じる▲▲' : '▼▼開く▼▼'
                    }
                  </Box>
                )
              }
            </Grid>
          ) : null
        }
      </>
    )
  };

  return (
    <Grid item xs={6} sm={6} md={4} className={classes.mainStaffOrders}>
      <Box className={classes.staffOrdersTitle}>提供中</Box>

      <Box>
        {
          filteredStaffs.map((staff, staffIndex) => (
            <Box key={staffIndex} className={classes.mainStaffOrdersBorder}>
              <Box className={classes.mainsOrdersRightContent}>
                <Grid container alignItems='center'>
                  {
                    renderOrders(staffIndex, staff)
                  }
                </Grid>
              </Box>
            </Box>
          ))
        }
      </Box>
    </Grid>
  );
};

StaffOrdersComponent.propTypes = {
  staffs: PropTypes.array,
  filter: PropTypes.object,
  filteredOrders: PropTypes.array,
  handleShowShippingSelect: PropTypes.func,
  handleQueueOrders: PropTypes.func,
  showChangeOrderStatus: PropTypes.func,
  handleChangeOrderStatus: PropTypes.func,
};
StaffOrdersComponent.defaultProps = {
  staffs: [],
  filter: {},
  filteredOrders: [],
  handleShowShippingSelect: () => {},
  handleQueueOrders: () => {},
  showChangeOrderStatus: () => {},
  handleChangeOrderStatus: () => {},
};
export default StaffOrdersComponent;
