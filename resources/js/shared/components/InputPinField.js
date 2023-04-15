import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { InputBase } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import MaskedInput from 'react-text-mask';

const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;
  
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/]}
      placeholder="-"
      placeholderChar=" "
      showMask
    />
  );
};

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    '& .MuiInputBase-input': {
      'text-align': 'center',
      'font-size': '40px',
      padding: '0px 0px',
    },
  },
  text: {
    width: '7ch',
    left: '0%',
    right: '0%',
    top: '0%',
    bottom: '0%',
    background: '#FFFFFF',
    border: '2px solid #CACBCF',
    'box-sizing': 'border-box',
    'border-radius': '30px',
    outline: 'none',
    padding: '6px 10px',
  },
}));

const InputPinField = (props) => {
  const classes = useStyles();
  const [values, setValues] = useState(false);
  
  const divRef1 = useRef(null);
  const divRef2 = useRef(null);
  const divRef3 = useRef(null);
  const divRef4 = useRef(null);
  
  useEffect(() => {
    divRef1.current.select();
  }, []);
  
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    
    const pin_no = Number(event.target.name.replace('pin', ''));
    if (pin_no === 1) {
      divRef2.current.select();
    } else if (pin_no === 2) {
      divRef3.current.select();
    } else if (pin_no === 3) {
      divRef4.current.select();
    }
    
    // ４つとも入力完了
    if (
      divRef1.current.value.trim() &&
      divRef2.current.value.trim() &&
      divRef3.current.value.trim() &&
      divRef4.current.value.trim()
    ) {
      return props.buttonDisabledChange(false);
    }
    return props.buttonDisabledChange(true);
  };
  
  return (
    <div className={classes.root}>
      <FormControl>
        <InputBase
          inputRef={divRef1}
          className={classes.text}
          value={values.textmask1}
          onChange={handleChange}
          name="pin1"
          id="formatted-text-mask-input1"
          inputComponent={TextMaskCustom}
        />
      </FormControl>
      <FormControl>
        <InputBase
          inputRef={divRef2}
          className={classes.text}
          value={values.textmask2}
          onChange={handleChange}
          name="pin2"
          id="formatted-text-mask-input2"
          inputComponent={TextMaskCustom}
        />
      </FormControl>
      <FormControl>
        <InputBase
          inputRef={divRef3}
          className={classes.text}
          value={values.textmask3}
          onChange={handleChange}
          name="pin3"
          id="formatted-text-mask-input3"
          inputComponent={TextMaskCustom}
        />
      </FormControl>
      <FormControl>
        <InputBase
          inputRef={divRef4}
          className={classes.text}
          value={values.textmask4}
          onChange={handleChange}
          name="pin4"
          id="formatted-text-mask-input4"
          inputComponent={TextMaskCustom}
        />
      </FormControl>
    </div>
  );
};

// PropTypes
InputPinField.propTypes = {
  buttonDisabledChange: PropTypes.func,
};
// defaultProps
InputPinField.defaultProps = {
  buttonDisabledChange: () => {
    /*nop*/
  },
};

export default InputPinField;
