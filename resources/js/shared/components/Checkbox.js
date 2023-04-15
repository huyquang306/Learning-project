import React, { useState } from 'react';
import CheckboxCore from '@material-ui/core/Checkbox';

const Checkbox = (_props) => {
  const [checked, setChecked] = useState(false);
  
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  
  return (
    <CheckboxCore
      color="default"
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'checkbox' }}
    />
  );
};

export default Checkbox;
