import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Box, OutlinedInput } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  inputDiv: {
    padding: 20,
  },
  input: {
    width: '100%',
    color: '#4F4F4F',
    fontSize: '24px',
    height: '48px',
    borderRadius: '4px',
  },
}));

const ModalConfirmationCode = (props) => {
  const classes = useStyles();
  const [code, setCode] = useState('');
  
  useEffect(() => {
    if (props.open) {
      setCode('');
    }
  }, [props.open]);
  
  const actionModal = () => {
    return (
      <Box textAlign="center">
        <ButtonCustom
          title="戻る"
          borderRadius="28px"
          bgcolor="#828282"
          borderColor="#828282"
          width="120px"
          onClick={ props.onClose }
        />
        <ButtonCustom
          title="OK"
          borderRadius="28px"
          bgcolor="#FFA04B"
          borderColor="#FFA04B"
          width="120px"
          onClick={ () => props.onSubmit(code) }
        />
      </Box>
    );
  };
  
  const onChange = (event) => {
    const { value } = event.target;
    setCode(value);
  }
  
  return (
    <Modal
      actions={ actionModal() }
      open={ props.open }
      title={ props.title }
      maxWidth='400px'
      minHeight='none'
    >
      <Box className={ classes.inputDiv }>
        <Box textAlign='left'>
          <OutlinedInput
            id="code"
            name="code"
            className={ classes.input }
            labelWidth={ 0 }
            value={ code }
            onChange={ onChange }
          />
        </Box>
      </Box>
    </Modal>
  );
};

// PropTypes
ModalConfirmationCode.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

// defaultProps
ModalConfirmationCode.defaultProps = {
  open: false,
  onClose: () => {},
  onSubmit: () => {},
};

export default ModalConfirmationCode;
