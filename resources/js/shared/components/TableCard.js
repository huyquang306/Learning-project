import React from 'react';
import OrderCard from './OrderCard';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('xs')]: {
      flex: '0 0 calc(100% )',
    },
    [theme.breakpoints.up('sm')]: {
      flex: '0 0 calc(100% / 2 )',
    },
    [theme.breakpoints.up('md')]: {
      flex: '0 0 calc(100% / 3 )',
    },
    [theme.breakpoints.up('lg')]: {
      flex: '0 0 calc(100% / 5)',
    },
    paddingLeft: '10px',
    paddingRight: '10px',
    borderRadius: '8px',
  },
  card: {
    backgroundColor: '#FDFDFD',
    marginBottom: '8px',
  },
  header: {
    textAlign: 'center',
    borderRadius: '8px',
  },
  headerActive: {
    backgroundColor: '#FFA04B',
    color: '#FDFDFD',
  },
  headerInActive: {
    backgroundColor: '#E0E0E0',
    color: '#828282',
  },
  cardContent: {
    padding: '5px',
  },
  cardOrder: {
    padding: '0px',
    marginTop: '2px',
    height: '120px',
  },
  numberPeople: {
    textAlign: 'left',
    fontSize: '16px',
    color: '#828282',
  },
  time: {
    textAlign: 'right',
    fontSize: '18px',
    color: '#4F4F4F',
  },
}));

const TableCard = (props) => {
  const classes = useStyles();
  const active = !!props.table.status;
  const orders = props.table.orders ? props.table.orders : [];
  
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <div
          className={[
            classes.cardContent,
            classes.header,
            active ? classes.headerActive : classes.headerInActive,
          ].join(' ')}
        >
          <Typography>{props.table.name}</Typography>
        </div>
        
        <div className={classes.cardOrder}>
          <OrderCard orders={orders} />
        </div>
        
        <div className={classes.cardContent}>
          <Grid container>
            <Grid item xs={6}>
              <Typography className={classes.numberPeople}>３名</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.time}>0:45</Typography>
            </Grid>
          </Grid>
        </div>
      </Card>
    </div>
  );
};
TableCard.propTypes = {
  table: PropTypes.isRequired,
};
export default TableCard;
