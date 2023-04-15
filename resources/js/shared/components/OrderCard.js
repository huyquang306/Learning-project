import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import LensIcon from '@material-ui/icons/Lens';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
  unActive: {
    border: '0.5px dashed #828282',
    boxSizing: 'border-box',
    borderRadius: '7px',
    height: '120px',
    margin: '2px',
    textAlign: 'center',
    lineHeight: '120px',
  },
  orderActive: {
    backgroundColor: '#E4E1B0',
    borderRadius: '8px',
    marginTop: '2px',
  },
  addButton: {
    color: '#BDBDBD',
    margin: '0 auto',
  },
  iconOrderActive: {
    color: 'rgba(255, 0, 0, 0.67)',
    fontSize: '14px',
  },
  orderName: {
    fontSize: '20spx',
    lineHeight: '20px',
    paddingLeft: '2px',
  },
  numberOrder: {
    textAlign: 'center',
    marginRight: '5px',
    backgroundColor: '#FDFDFD',
    borderRadius: '20px',
    fontWeight: 'bold',
  },
});

const OrderCard = (props) => {
  const classes = useStyles();
  const active = (props.orders && props.orders.length) > 0;
  const orders = props.orders;
  
  if (!active) {
    return (
      <div className={classes.unActive}>
        <IconButton edge="start" className={classes.addButton} color="inherit">
          <AddIcon fontSize={'large'} />
        </IconButton>
      </div>
    );
  }
  
  return (
    <>
      {orders.map((order, index) => {
        return (
          <div className={classes.orderActive} key={index}>
            <Grid container>
              <Grid item xs={1}>
                {order.status && (
                  <LensIcon className={classes.iconOrderActive} fontSize={'small'} />
                )}
              </Grid>
              <Grid item xs={9}>
                <Typography>{order.name}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.numberOrder}>{order.number}</Typography>
              </Grid>
            </Grid>
          </div>
        );
      })}
    </>
  );
};

OrderCard.propTypes = {
  orders: PropTypes.array.isRequired,
};
export default OrderCard;
