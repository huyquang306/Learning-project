import React from 'react';
import PropTypes from 'prop-types';

// Base Components
import { useStylesSidebarHidden as useStyles } from './SidebarHiddenStyles';

// Components(Material-UI)
import {
  FormControlLabel,
  Radio, RadioGroup,
} from '@material-ui/core';

// Utils
import { ALL_COOK_PLACE_VALUE } from 'js/utils/helpers/dishupHelper';

const CookPlaceSelect = (props) => {
  const classes = useStyles(props);

  return (
    <RadioGroup row aria-label='Shop cook place' name='shop_cook_place_id' className={ `${classes.headerCookPlaceRadioGroup} cookPlaceRadioGroup`}>
      <FormControlLabel
        className={classes.headerCookPlaceRadio}
        value={ALL_COOK_PLACE_VALUE}
        control={<Radio color='default'/>}
        classes={{ label: classes.headerCookPlaceRadioLabel }}
        label='すべて表示'
        onChange={() => props.handleChangeFilter('cook_place', ALL_COOK_PLACE_VALUE)}
        checked={props.filter.cook_place === ALL_COOK_PLACE_VALUE}
      />
      {
        props.cookPlaces.map((cookPlace, cookPlaceIndex) => (
          <FormControlLabel
            key={cookPlaceIndex}
            className={classes.headerCookPlaceRadio}
            value={cookPlace.id}
            control={<Radio color='default'/>}
            classes={{ label: classes.headerCookPlaceRadioLabel }}
            label={cookPlace.name}
            onChange={() => props.handleChangeFilter('cook_place', cookPlace.id)}
            checked={props.filter.cook_place === cookPlace.id}
          />
        ))
      }
    </RadioGroup>
  );
};

CookPlaceSelect.propTypes = {
  filter: PropTypes.object,
  cookPlaces: PropTypes.array,
  handleChangeFilter: PropTypes.func,
};
CookPlaceSelect.defaultProps = {
  filter: {},
  cookPlaces: [],
  handleChangeFilter: () => {},
};
export default CookPlaceSelect;
