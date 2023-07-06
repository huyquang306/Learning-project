import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

// Services
import AdminApiService from 'js/admin/actions/admin-api-service';

// Component
import {
  Box,
  Button, Checkbox, FormControlLabel, OutlinedInput
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Modal from 'js/shared-order/components/Modal';
import ButtonCustom from 'js/shared-order/components/Button';
import NumberFormatCustom from 'js/utils/components/Input/NumberFormatCustom';
import { useStylesServicePlanItem as useStyles } from './styles';

// utils
import Utils from 'js/shared/utils';
import { FUNCTIONS_CODE } from 'js/utils/components/Payment/paymentConst';
import { checkValidation } from './validationServicePlan';
import CircularProgress from '@material-ui/core/CircularProgress';

const DEFAULT_SERVICE_PLAN_OPTION = [{
  id: null,
  name: '',
  min_value: 0,
  additional_price: 0,
}];
const DEFAULT_CONDITION = {
  id: null,
  m_service_plan_id: null,
  m_function_id: undefined,
  is_restricted: 1,
  restricted_value: 0,
  m_function: {
    m_service_plan_options: DEFAULT_SERVICE_PLAN_OPTION,
  }
};
const DEFAULT_SERVICE_PLAN = {
  id: null,
  hash_id: '',
  name: '',
  description: '',
  price: 0,
  initial_price: 0,
  r_function_conditions: [
    DEFAULT_CONDITION,
  ],
};

const ModalServicePlanCondition = (props) => {
  const classes = useStyles();
  const {showWarningMessage, showSuccessMessage} = props;

  // Local state
  const [isSubmit , setIsSubmit] = useState(false);
  const [servicePlans, setServicePlans] = useState([]);
  const [systemFunctions, setSystemFunctions] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(DEFAULT_SERVICE_PLAN);

  useEffect(() => {
    if (props.open) {
      getServicePlans();
      getSystemFunctions();
    } else {
      setSelectedPlan(DEFAULT_SERVICE_PLAN);
    }
  }, [props.open]);

  const getServicePlans = async () => {
    try {
      const response = await AdminApiService.getServicePlans();
      if (response && response.length) {
        setServicePlans(response);
        if (!selectedPlan.hash_id) {
          setSelectedPlan(response[0]);
        }
      }
    } catch (e) {
      // TODO: translate
      showWarningMessage('GET service plans errors');
    }
  };

  const getSystemFunctions = async () => {
    try {
      const response = await AdminApiService.getFunctionConditions();
      setSystemFunctions(response);
    } catch (error) {
      // TODO: translate
      showWarningMessage('get functions condition errors');
    }
  };

  const getQRFunction = () => systemFunctions && systemFunctions.find(func => func.code === FUNCTIONS_CODE.qr);

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    const selectedPlanClone = Utils.cloneDeep(selectedPlan);
    selectedPlanClone[name] = value;
    setSelectedPlan(selectedPlanClone);
  };

  const handleChangeMaxQRCodeNumber = (event) => {
    const {value} = event.target;
    const selectedPlanClone = Utils.cloneDeep(selectedPlan);
    if (selectedPlanClone.r_function_conditions) {
      const qrConditionIndex = selectedPlanClone.r_function_conditions.findIndex(conditionTmp => {
        return conditionTmp.m_function && conditionTmp.m_function.code === FUNCTIONS_CODE.qr;
      });

      if (qrConditionIndex > -1) {
        if (selectedPlanClone.r_function_conditions[qrConditionIndex].m_function.m_service_plan_options) {
          selectedPlanClone.r_function_conditions[qrConditionIndex].restricted_value = value;
        }
      } else {
        // create a new condition
        const newCondition = Utils.cloneDeep(DEFAULT_CONDITION);
        const qrFunction = getQRFunction();
        if (qrFunction) {
          newCondition.m_function_id = qrFunction.id;
          newCondition.restricted_value = value;
          selectedPlanClone.r_function_conditions.push(newCondition);
        }
      }
      setSelectedPlan(selectedPlanClone);
    }
  };

  const handleChangeQRExtendPrice = (event) => {
    const {value} = event.target;
    const selectedPlanClone = Utils.cloneDeep(selectedPlan);
    if (selectedPlanClone.r_function_conditions) {
      const qrConditionIndex = selectedPlanClone.r_function_conditions.findIndex(conditionTmp => {
        return conditionTmp.m_function && conditionTmp.m_function.code === FUNCTIONS_CODE.qr;
      });

      if (qrConditionIndex > -1) {
        if (selectedPlanClone.r_function_conditions[qrConditionIndex].m_function.m_service_plan_options) {
          selectedPlanClone.r_function_conditions[qrConditionIndex].m_function.m_service_plan_options[0].additional_price = value;
        }
      } else {
        // create a new condition
        const newCondition = Utils.cloneDeep(DEFAULT_CONDITION);
        const qrFunction = getQRFunction();
        if (qrFunction) {
          newCondition.m_function_id = qrFunction.id;
          newCondition.m_function = qrFunction;
          newCondition.m_function.m_service_plan_options[0].additional_price = value;
          selectedPlanClone.r_function_conditions.push(newCondition);
        }
      }
      setSelectedPlan(selectedPlanClone);
    }
  };

  const handleChangeUnLimitQR = (event) => {
    const {checked} = event.target;
    const maxValue = checked ? null : 1;
    const selectedPlanClone = Utils.cloneDeep(selectedPlan);
    if (selectedPlanClone.r_function_conditions) {
      const qrConditionIndex = selectedPlanClone.r_function_conditions.findIndex(conditionTmp => {
        return conditionTmp.m_function && conditionTmp.m_function.code === FUNCTIONS_CODE.qr;
      });

      if (qrConditionIndex > -1) {
        if (selectedPlanClone.r_function_conditions[qrConditionIndex].m_function.m_service_plan_options) {
          selectedPlanClone.r_function_conditions[qrConditionIndex].restricted_value = maxValue;
          if (checked) {
            selectedPlanClone.r_function_conditions[qrConditionIndex].m_function.m_service_plan_options[0].additional_price = null;
          }
        }
      } else {
        // create a new condition
        const newCondition = Utils.cloneDeep(DEFAULT_CONDITION);
        const qrFunction = getQRFunction();
        if (qrFunction) {
          newCondition.m_function_id = qrFunction.id;
          newCondition.m_function = qrFunction;
          newCondition.restricted_value = maxValue;
          if (checked) {
            newCondition.m_function.m_service_plan_options[0].additional_price = null;
          }
          selectedPlanClone.r_function_conditions.push(newCondition);
        }
      }
      setSelectedPlan(selectedPlanClone);
    }
  };

  const handleChangeDisableExtendPrice = (event) => {
    const {checked} = event.target;
    const extendPriceValue = checked ? null : 1;
    const selectedPlanClone = Utils.cloneDeep(selectedPlan);
    if (selectedPlanClone.r_function_conditions) {
      const qrConditionIndex = selectedPlanClone.r_function_conditions.findIndex(conditionTmp => {
        return conditionTmp.m_function && conditionTmp.m_function.code === FUNCTIONS_CODE.qr;
      });

      if (qrConditionIndex > -1) {
        if (selectedPlanClone.r_function_conditions[qrConditionIndex].m_function.m_service_plan_options) {
          selectedPlanClone
            .r_function_conditions[qrConditionIndex]
            .m_function
            .m_service_plan_options[0]
            .additional_price = extendPriceValue;
          if (!checked
            && !selectedPlanClone.r_function_conditions[qrConditionIndex].restricted_value
          ) {
            selectedPlanClone.r_function_conditions[qrConditionIndex].restricted_value = 1;
          }
        }
      } else {
        // create a new condition
        const newCondition = Utils.cloneDeep(DEFAULT_CONDITION);
        const qrFunction = getQRFunction();
        if (qrFunction) {
          newCondition.m_function_id = qrFunction.id;
          newCondition.m_function = qrFunction;
          newCondition.m_function.m_service_plan_options[0].additional_price = extendPriceValue;
          if (!checked) {
            newCondition.restricted_value = 1;
          }
          selectedPlanClone.r_function_conditions.push(newCondition);
        }
      }
      setSelectedPlan(selectedPlanClone);
    }
  };

  const handleSubmit = async () => {
    const errors = checkValidation(selectedPlan);
    const selectedPlanClone = Utils.cloneDeep(selectedPlan);
    const qrConditionIndex = selectedPlanClone.r_function_conditions.findIndex(conditionTmp => {
      return conditionTmp.m_function && conditionTmp.m_function.code === FUNCTIONS_CODE.qr;
    });
    if (errors.length > 0) {
      showWarningMessage(errors[0]);
      return;
    }

    selectedPlanClone.r_function_conditions[qrConditionIndex].is_restricted = 1;

    if (!selectedPlanClone?.r_function_conditions[qrConditionIndex]?.restricted_value) {
      selectedPlanClone.r_function_conditions[qrConditionIndex].restricted_value = 0
    }

    if (!selectedPlanClone?.r_function_conditions[qrConditionIndex]?.m_function?.m_service_plan_options[0]?.additional_price) {
      selectedPlanClone.r_function_conditions[qrConditionIndex].m_function.m_service_plan_options[0].additional_price = 0
    }

    setIsSubmit(true);
    try {
      await AdminApiService.updateServicePlan(selectedPlan.hash_id, selectedPlanClone);
      await getServicePlans();
      // TODO: translate
      showSuccessMessage('Cập nhật thông tin thành công');
      setIsSubmit(false);
      props.onClose();
    } catch (error) {
      setIsSubmit(false);
      // TODO: translate
      showWarningMessage('Có lỗi xảy ra');
    }
  };

  const renderActions = () => (
    <>
      <ButtonCustom
        title='Đóng'
        borderRadius='28px'
        bgcolor='#828282'
        borderColor='#828282'
        width='176px'
        onClick={props.onClose}
      />
      <Button
        className={classes.buttonSubmit}
        onClick={handleSubmit}
        disabled={isSubmit}
      >
        Lưu
        {
          isSubmit ? <CircularProgress  style={{ marginLeft: 10, width: 20, height: 20 }}/> : null
        }
      </Button>
    </>
  );

  let extendPrice = null;
  let qrLimitMaxValue = null;
  const qrCondition = selectedPlan.r_function_conditions && selectedPlan.r_function_conditions
    .find(conditionTmp => {
      return conditionTmp.m_function && conditionTmp.m_function.code === FUNCTIONS_CODE.qr;
    });
  if (qrCondition && qrCondition.m_function.m_service_plan_options && qrCondition.m_function.m_service_plan_options[0].additional_price !== '') {
    extendPrice = qrCondition.m_function.m_service_plan_options[0].additional_price;
  }
  if (qrCondition && qrCondition.m_function.m_service_plan_options && qrCondition.restricted_value !== '') {
    qrLimitMaxValue = qrCondition.restricted_value;
  }

  return (
    <Modal
      open={props.open}
      actions={renderActions()}
      maxHeight='auto'
      minHeight='auto'
      maxWidth='75%'
    >
      <Box className={classes.contentDetail} ml={3} mr={5} mt={3}>
        <Box className={classes.buttonBox}>
          {
            servicePlans && servicePlans.map((servicePlan, servicePlanIndex) => (
              <Button
                key={servicePlanIndex}
                variant='contained'
                className={`${classes.buttonSelect} ${selectedPlan.id === servicePlan.id ? classes.buttonSelectActive : null}`}
                onClick={() => setSelectedPlan(servicePlan)}
              >
                {selectedPlan.id === servicePlan.id ? <Check /> : null}
                {servicePlan.name}
              </Button>
            ))
          }
        </Box>

        <Box mt={5}>
          {/*<Box display='flex' alignItems='center'>*/}
          {/*  <Box width='40%' className={classes.inputLabel}>Phí tiêu chuẩn</Box>*/}
          {/*  <Box width='60%' display='flex' alignItems='center'>*/}
          {/*    <NumberFormatCustom*/}
          {/*      customInput={OutlinedInput}*/}
          {/*      name='initial_price'*/}
          {/*      className={classes.inputBox}*/}
          {/*      classes={{ input: classes.input }}*/}
          {/*      endAdornment='VND'*/}
          {/*      onChange={handleInputChange}*/}
          {/*      value={selectedPlan.initial_price ? parseInt(selectedPlan.initial_price) : 0}*/}
          {/*    />*/}
          {/*  </Box>*/}
          {/*</Box>*/}

          <Box display='flex' alignItems='center' mt={2}>
            <Box width='40%' className={classes.inputLabel}>Phí dịch vụ</Box>
            <Box width='60%' display='flex' alignItems='center'>
              <NumberFormatCustom
                customInput={OutlinedInput}
                name='price'
                className={classes.inputBox}
                classes={{ input: classes.input }}
                endAdornment='VND'
                onChange={handleInputChange}
                value={selectedPlan.price ? parseInt(selectedPlan.price) : 0}
              />
            </Box>
          </Box>

          <Box mt={2}>
            <FormControlLabel
              control={
                <Checkbox
                  color='default'
                  checked={qrLimitMaxValue === null || Number(qrLimitMaxValue) === 0}
                  onChange={handleChangeUnLimitQR}
                />
              }
              label='Không giới hạn số QR'
            />
          </Box>
          <Box display='flex' alignItems='center'>
            <Box
              width='40%'
              className={`${classes.inputLabel} ${qrLimitMaxValue === null ? classes.inputLabelDisable : ''}`}
            >Số lương QR giới hạn</Box>
            <Box width='60%' display='flex' alignItems='center'>
              <NumberFormatCustom
                customInput={OutlinedInput}
                name='restricted_value'
                className={classes.inputBox}
                classes={{ input: classes.input }}
                endAdornment='QR'
                onChange={handleChangeMaxQRCodeNumber}
                value={(qrLimitMaxValue !== null && Number(qrLimitMaxValue) !== 0) ? qrLimitMaxValue : ''}
                disabled={qrLimitMaxValue === null || Number(qrLimitMaxValue) === 0}
                isAllowed={values => values.value > 0}
              />
            </Box>
          </Box>

          <Box mt={2}>
            <FormControlLabel
              control={
                <Checkbox
                  color='default'
                  checked={extendPrice === null || Number(extendPrice) === 0}
                  onChange={handleChangeDisableExtendPrice}
                />
              }
              label='Cho phép dùng quá số QR'
            />
          </Box>
          <Box display='flex' alignItems='center'>
            <Box
              width='40%'
              className={`${classes.inputLabel} ${(extendPrice === null || Number(extendPrice) === 0) ? classes.inputLabelDisable : ''}`}
            >Phí dùng thêm QR</Box>
            <Box width='60%' display='flex' alignItems='center'>
              <NumberFormatCustom
                customInput={OutlinedInput}
                name='additional_price'
                className={classes.inputBox}
                classes={{ input: classes.input }}
                endAdornment='VND'
                onChange={handleChangeQRExtendPrice}
                value={(extendPrice !== null && Number(extendPrice) !== 0) ? Number(extendPrice) : ''}
                disabled={extendPrice === null || Number(extendPrice) === 0}
                isAllowed={values => values.value > 0}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

// PropTypes
ModalServicePlanCondition.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  showWarningMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

// defaultProps
ModalServicePlanCondition.defaultProps = {
  open: false,
  onClose: () => {},
  showWarningMessage: () => {},
  showSuccessMessage: () => {},
};

export default ModalServicePlanCondition;
