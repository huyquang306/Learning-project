/*
 *
 * prefecture selector
 *
 */
import React from 'react';
import CustomSelectorBase from './CustomSelectorBase';
import PropTypes from 'prop-types';

const OPTION_DEFAULT = 'Select prefecture';

const PrefSelector = (props) => {
  const prefList = [
    OPTION_DEFAULT,
    'Hoang Mai',
    'Hai Ba Trung',
    'Ba Dinh',
    'Cau Giay',
  ];
  const prefOptions = prefList.map((str) => ({
    value: str,
    label: str,
  }));
  const value = props.value || OPTION_DEFAULT;
  
  const handleChange = (event) => {
    const {target} = event;
    const selectorValue = target.value;
    if (selectorValue === OPTION_DEFAULT) {
      event.target.value = '';
    }
    props.onChange(event);
  };
  
  return <CustomSelectorBase
    optionArray={prefOptions}
    {...props}
    value={value}
    onChange={handleChange}
  />;
};

PrefSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default PrefSelector;
