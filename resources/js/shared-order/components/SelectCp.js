import React from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';

const BootstrapInput = withStyles(() => ({
  input: {
    height: '46px',
    padding: '5px 16px',
    border: '1px solid #000000',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'flex-end',
  },
}))(InputBase);

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

const CustomizedSelects = (props) => {
  const classes = useStyles();
  const [age, setAge] = React.useState('');
  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <div>
      <FormControl className={classes.root}>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={age}
          onChange={handleChange}
          input={<BootstrapInput props={props} />}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

//PropTypes
CustomizedSelects.propTypes = {};

//Default props
CustomizedSelects.defaultProps = {};

export default CustomizedSelects;
