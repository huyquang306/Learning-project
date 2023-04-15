import React from 'react';

// Base Components
import MainFilter from './MainFilter';
import StaffsSelect from './StaffsSelect';
import { useStylesNewReserve as useStyles } from '../newStyles';

// Components(Material-UI)
import {Box} from '@material-ui/core';

// Utils
import moment from 'moment';
import PropTypes from 'prop-types';
moment.locale('ja');

const RightSidebarFilter = (props) => {
  const classes = useStyles(props);

  return (
    <>
      <Box className={classes.sideBarHeader}>
        <StaffsSelect
          staffs={props.staffs}
          filter={props.filter}
          handleChangeFilter={props.handleChangeFilter}
        />
      </Box>

      <Box className={classes.sideBarFilter}>
        <MainFilter
          filter={props.filter}
          isShowNoti={props.isShowNoti}
          setIsShowNoti={props.setIsShowNoti}
          handleChangeFilter={props.handleChangeFilter}
        />
      </Box>
    </>
  );
};

RightSidebarFilter.propTypes = {
  staffs: PropTypes.array,
  filter: PropTypes.object,
  isShowNoti: PropTypes.bool,
  setIsShowNoti: PropTypes.func,
  handleChangeFilter: PropTypes.func,
};
RightSidebarFilter.defaultProps = {
  staffs: [],
  filter: {},
  isShowNoti: false,
  setIsShowNoti: () => {},
  handleChangeFilter: () => {},
};
export default RightSidebarFilter;
