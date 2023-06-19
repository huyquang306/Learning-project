import React from 'react';
import PropTypes from 'prop-types';

// Base Components
import Button from 'js/shared/components/Button';
import { useStylesSidebarHidden as useStyles } from './SidebarHiddenStyles';

// Components(Material-UI)
import {
  Grid,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsOffOutlinedIcon from '@material-ui/icons/NotificationsOffOutlined';

const NOTIFICATION_STATUS_KEY = 'dishup-notification-status';
const FILTER_SORT_BY_TABLE_CODE = 'table_code';
const FILTER_SORT_BY_CREATED_AT = 'create_at';

const MainFilter = (props) => {
  const classes = useStyles(props);

  return (
    <Grid container className={classes.sideBarFilter}>
      <Grid item xs={6} md={12}>
        <Button
          className={classes.sideBarFilterBox}
          onClick={() => props.handleChangeFilter('sortBy', props.filter.sortBy === FILTER_SORT_BY_TABLE_CODE ? FILTER_SORT_BY_CREATED_AT : FILTER_SORT_BY_TABLE_CODE)}
        >
          {
            props.filter.sortBy === FILTER_SORT_BY_TABLE_CODE ? 'Order' : 'Bàn'
          }
        </Button>
      </Grid>

      {/*<Grid item xs={6} md={12}>*/}
      {/*  <FormControlLabel*/}
      {/*    className={classes.sideBarFilterBox}*/}
      {/*    control={<Checkbox color='default'/>}*/}
      {/*    label='Xếp theo thứ tự order'*/}
      {/*    classes={{label: classes.sideBarFilterBoxLabel}}*/}
      {/*    onChange={() => props.handleChangeFilter('isPriorityFirstOrder', !props.filter.isPriorityFirstOrder)}*/}
      {/*    checked={props.filter.isPriorityFirstOrder}*/}
      {/*  />*/}
      {/*</Grid>*/}

      <Grid item xs={6} md={12}>
        <FormControlLabel
          className={classes.sideBarFilterBox}
          control={<Checkbox color='default'/>}
          label='Đã hủy'
          classes={{label: classes.sideBarFilterBoxLabel}}
          onChange={() => props.handleChangeFilter('isCanceled', !props.filter.isCanceled)}
          checked={props.filter.isCanceled}
        />
      </Grid>

      <Grid item xs={6} md={12}>
        <FormControlLabel
          className={classes.sideBarFilterBox}
          control={<Checkbox color='default'/>}
          label='Đã phục vụ'
          classes={{label: classes.sideBarFilterBoxLabel}}
          onChange={() => props.handleChangeFilter('isShipped', !props.filter.isShipped)}
          checked={props.filter.isShipped}
        />
      </Grid>

      <Grid item xs={6} md={12}>
        <FormControlLabel
          className={classes.sideBarFilterBox}
          control={<Checkbox color='default'/>}
          label='Đang thực hiện'
          classes={{label: classes.sideBarFilterBoxLabel}}
          onChange={() => props.handleChangeFilter('isShipping', !props.filter.isShipping)}
          checked={props.filter.isShipping}
        />
      </Grid>

      <Grid item xs={6} md={12}>
        <Button
          className={`${classes.sideBarFilterBox} ${classes.sideBarNotiBox}`}
          onClick={() => {
            props.setIsShowNoti(!props.isShowNoti);
            localStorage.setItem(NOTIFICATION_STATUS_KEY, !props.isShowNoti);
          }}
        >
          {
            props.isShowNoti
              ? <NotificationsNoneIcon className={classes.sideBarFilterBoxIcon} />
              : <NotificationsOffOutlinedIcon className={classes.sideBarFilterBoxIcon}/>
          }
        </Button>
      </Grid>
    </Grid>
  );
};

MainFilter.propTypes = {
  filter: PropTypes.object,
  isShowNoti: PropTypes.bool,
  setIsShowNoti: PropTypes.func,
  handleChangeFilter: PropTypes.func,
};
MainFilter.defaultProps = {
  filter: {},
  isShowNoti: false,
  setIsShowNoti: () => {},
  handleChangeFilter: () => {},
};
export default MainFilter;
