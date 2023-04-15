/*
 *
 * time selector (MaterialUIのTimePicker 使いづらいので...)
 *
 */
import React from 'react';
import CustomSelectorBase from './CustomSelectorBase';
import Utils from 'js/shared/utils';

const TimeSelector = (props) => {
  const tickMinutes = 30;
  const timeOptions = new Array((24 * 60) / tickMinutes).fill(0).map((_, idx) => {
    const hour = Math.floor(idx / 2);
    const hour00 = Utils.to2digit(hour);
    const minutes = idx % 2 > 0 ? `${(idx % 2) * tickMinutes}` : '00';
    return {
      value: `${hour00}:${minutes}:00`,
      label: `${hour}:${minutes}`,
      // label: `${hour}時` + (minutes === '00' ? '' : `${minutes}分`),
    };
  });
  return <CustomSelectorBase optionArray={timeOptions} {...props} />;
};

export default TimeSelector;
