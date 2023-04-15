/*
 *
 * custom selector
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem } from '@material-ui/core';

const CustomSelectorBase = (props) => {
  const handleSelectChange = (event) => {
    const menuItem = event.target;
    props.onChange({
      target: {
        id: menuItem.name,
        name: menuItem.name,
        value: menuItem.value,
      },
    });
  };
  const { optionArray, ...innerProps } = props; // optionArray
  
  return (
    <Select
      {...innerProps}
      onChange={handleSelectChange}
      variant="outlined"
      name={props.id || props.name}
    >
      {optionArray.map((opt, idx) => (
        <MenuItem value={opt.value} key={idx} selected={opt.value === props.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
};

CustomSelectorBase.propTypes = {
  optionArray: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

CustomSelectorBase.defaultProps = {
  onChange: () => {},
  id: '',
  name: '',
  value: '',
  disabled: false,
};

export default CustomSelectorBase;
