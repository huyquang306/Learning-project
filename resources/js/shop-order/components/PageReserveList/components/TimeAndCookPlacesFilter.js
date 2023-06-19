import React from 'react';
import PropTypes from 'prop-types';

// packages
import { useStylesNewReserve as useStyles } from '../newStyles';

// Base Components
import Button from 'js/shared/components/Button';
import CookPlaceSelect from './CookPlaceSelect';

// Components(Material-UI)
import {
  Box,
  Grid,
} from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

// Library
import moment from 'moment';
moment.locale('vi');

const REFRESH_IN_SECONDS = 10;

const TimeAndCookPlacesFilter = (props) => {
  const classes = useStyles(props);
  const {handleRefreshOrders} = props;

  const handleRefreshData = () => {
    const old = moment(props.refresh.refreshAt).add(REFRESH_IN_SECONDS, 'seconds');
    const now = new Date();

    // can refresh data in REFRESH_IN_SECONDS seconds
    if (old <= now) {
      handleRefreshOrders();
    }
  };

  return (
    <Box className={classes.headerCookPlace}>
      <Box className={classes.headerCookPlaceLine}>
        <Grid container justify='space-between'>
          <Grid item xs={5} sm={4} md={2}>
            <Box
              className={classes.headerTimeRefresh}
              onClick={handleRefreshData}
            >
              <SyncIcon style={{ color: '#DADADA', fontSize: 30 }} />
              <Box>
                <p style={{ color: '#4F4F4F', fontSize: 12 }}>Cập nhật lần cuối</p>
                <p style={{ color: '#4F4F4F', fontSize: 17 }}>
                  {moment(props.refresh.refreshAt).format('HH:mm:ss')}
                </p>
              </Box>
            </Box>
          </Grid>

          <Box component={Grid} item md={10} display={{ xs: 'none', sm: 'none', md: 'block' }}>
            <CookPlaceSelect
              filter={props.filter}
              cookPlaces={props.cookPlaces}
              handleChangeFilter={props.handleChangeFilter}
            />
          </Box>

          {/* Hidden mobile*/}
          <Box component={Grid} item xs={4} display={{ xs: 'block', sm: 'block', md: 'none' }}>
            <Button
              className={classes.buttonDrawerSidebar}
              onClick={() => props.setIsDrawerRight(true)}
            >＜＜ Mở ＜＜</Button>
          </Box>
          {/* Hidden mobile*/}
        </Grid>
      </Box>
    </Box>
  );
};

TimeAndCookPlacesFilter.propTypes = {
  filter: PropTypes.object,
  refresh: PropTypes.object,
  cookPlaces: PropTypes.array,
  handleChangeFilter: PropTypes.func,
  setIsDrawerRight: PropTypes.func,
  handleRefreshOrders: PropTypes.func,
};
TimeAndCookPlacesFilter.defaultProps = {
  filter: {},
  refresh: {},
  cookPlaces: [],
  handleChangeFilter: () => {},
  setIsDrawerRight: () => {},
  handleRefreshOrders: () => {},
};
export default TimeAndCookPlacesFilter;
