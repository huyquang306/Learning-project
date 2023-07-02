import React, {useState} from 'react';
import PropTypes from 'prop-types';

// Material Component
import { makeStyles } from '@material-ui/core/styles';
import { YEAR_MONTH_FORMAT, DATE_LIMIT_BEFORE, DATE_PICKER_YEAR_MONTH_FORMAT } from 'js/utils/helpers/timer';
import moment from 'moment';

const useStyles = makeStyles({
  icon: {
    color:'#707070',
    width: '30px'
  },
  input: {
    width: '200px',
    height: '50px',
    padding:'10px',
    textAlign: 'center',
    margin: '0px 10px'
  },
  datepicker: {
    display: 'flex',
    alignItems:'center'
  }
});

const HeaderAppBar = (props) => {
  const classes = useStyles(props);
  const { month } = props
  const [selectedMonth, setSelectedMonth] = useState(month)
  const handleNextMonth = () => {
    if(moment(selectedMonth) < moment().subtract(1, 'month')) {
      const month = moment(selectedMonth).add(1, 'month').format(YEAR_MONTH_FORMAT)
      setSelectedMonth(month)
      props.onChange(month)
    }
  }
  const handlePreMonth = () => {
    if(moment(selectedMonth) > moment(DATE_LIMIT_BEFORE)) {
      const month = moment(selectedMonth).subtract(1, 'month').format(YEAR_MONTH_FORMAT)
      setSelectedMonth(month)
      props.onChange(month)
    }
  }

  return (
    <div className={classes.datepicker}>
      <img className={classes.icon} src={`${process.env.MIX_ASSETS_PATH}/img/shared/arrow_left.png`} alt="logo" onClick={handlePreMonth} />
      <div>
        <input className={classes.input} value={moment(selectedMonth).format(DATE_PICKER_YEAR_MONTH_FORMAT)}/>
      </div>
      <img className={classes.icon} src={`${process.env.MIX_ASSETS_PATH}/img/shared/arrow_right.png`} alt="logo" onClick={handleNextMonth} />
    </div>
  );
};

// PropTypes
HeaderAppBar.propTypes = {
  onChange: PropTypes.func,
  month: PropTypes.string
};
HeaderAppBar.defaultProps = {
  onChange: () => {},
  month: ''
};

export default HeaderAppBar;
