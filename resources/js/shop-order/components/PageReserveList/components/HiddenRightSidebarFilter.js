import React from 'react';
import PropTypes from 'prop-types';

// Components(Material-UI)
import {Box} from '@material-ui/core';

// Base Components
import MainFilter from './MainFilter';
import CookPlaceSelect from './CookPlaceSelect';
import { useStylesSidebarHidden as useStyles } from './SidebarHiddenStyles';
import StaffsSelect from './StaffsSelect';

const HiddenRightSidebarFilter = (props) => {
  const classes = useStyles(props);

  return (
    <Box>
      <Box className={classes.hiddenSidebarHeader}>
        <Box
          className={classes.hiddenButton}
          onClick={() => props.setIsDrawerRight(false)}
        >＞＞閉じる＞＞</Box>

        <CookPlaceSelect
          filter={props.filter}
          cookPlaces={props.cookPlaces}
          handleChangeFilter={props.handleChangeFilter}
        />
      </Box>

      <Box className={classes.hiddenSidebarBoxFilter}>
        <StaffsSelect
          staffs={props.staffs}
          filter={props.filter}
          handleChangeFilter={props.handleChangeFilter}
        />

        <MainFilter
          filter={props.filter}
          isShowNoti={props.isShowNoti}
          setIsShowNoti={props.setIsShowNoti}
          handleChangeFilter={props.handleChangeFilter}
        />
      </Box>
    </Box>
  );
};

HiddenRightSidebarFilter.propTypes = {
  staffs: PropTypes.array,
  filter: PropTypes.object,
  cookPlaces: PropTypes.array,
  isShowNoti: PropTypes.bool,
  setIsShowNoti: PropTypes.func,
  handleChangeFilter: PropTypes.func,
  setIsDrawerRight: PropTypes.func,
};
HiddenRightSidebarFilter.defaultProps = {
  staffs: [],
  filter: {},
  cookPlaces: [],
  isShowNoti: false,
  setIsShowNoti: () => {},
  handleChangeFilter: () => {},
  setIsDrawerRight: () => {},
};
export default HiddenRightSidebarFilter;
