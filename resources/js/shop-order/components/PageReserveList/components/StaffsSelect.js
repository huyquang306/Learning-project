import React from 'react';
import PropTypes from 'prop-types';

// Base Components
import CustomSelectorBase from 'js/shared/components/CustomSelectorBase';
import { useStylesNewReserve as useStyles } from '../newStyles';

// Utils
import {ALL_STAFFS_VALUE} from 'js/utils/helpers/dishupHelper';
import StaffOrdersComponent from "./StaffOrdersComponent";

const StaffsSelect = (props) => {
  const classes = useStyles(props);

  const options = () => {
    const {staffs} = props;
    let results = [
      {
        label: 'Tất cả',
        value: ALL_STAFFS_VALUE,
      }
    ];
    staffs.forEach(staffTmp => {
      const {hash_id, given_name} = staffTmp;
      results.push({
        label: given_name,
        value: hash_id,
      })
    });

    return results;
  };

  const handleChange = (e) => {
    const {value} = e.target;
    props.handleChangeFilter('selectedStaff', value);
  };

  return (
    <CustomSelectorBase
      id='selected_staff'
      name='selected_staff'
      className={classes.sideBarDesignSelect}
      value={props.filter.selectedStaff}
      optionArray={options()}
      onChange={handleChange}
    />
  );
};

StaffsSelect.propTypes = {
  staffs: PropTypes.array,
  filter: PropTypes.object,
  handleChangeFilter: PropTypes.func,
};
StaffsSelect.defaultProps = {
  staffs: [],
  filter: {},
  handleChangeFilter: () => {},
};
export default StaffsSelect;
