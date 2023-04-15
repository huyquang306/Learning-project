import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  CardActions,
  Typography,
} from '@material-ui/core';

// Utils
import { renderUrlImageS3 } from 'js/utils/helpers/image';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    width: '172px',
    height: '259px',
    // left: '7px',
    // top: '82px',
    margin: '5px',
    display: 'inline-grid',
    verticalAlign: 'top',
    
    '& .MuiCardContent-root': {
      padding: '8px',
    },
    '& .MuiTypography-subtitle1': {
      fontWeight: 600,
    },
    '& .MuiCardActions-root': {
      marginTop: '0px',
      padding: '5px 15px',
    },
    '& .MuiButton-root': {
      margin: '0px 5px',
    },
  },
  media: {
    height: 100,
  },
  
  cardActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ItemCard = (props) => {
  const classes = useStyles();
  
  const imagePath = renderUrlImageS3(props.img);
  
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia className={classes.media} image={imagePath} title="Contemplative Reptile" />
        <CardContent>
          <Typography gutterBottom variant="subtitle1">
            {props.itemName}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="right">
            {`￥${Number(props.itemPrice).toLocaleString()}`}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>{props.children}</CardActions>
    </Card>
  );
};

// PropTypes
ItemCard.propTypes = {
  children: PropTypes.node.isRequired,
  img: PropTypes.string,
  itemName: PropTypes.string,
  itemPrice: PropTypes.number,
};
// defaultProps
ItemCard.defaultProps = {
  img: '',
  itemName: '',
  itemPrice: 9999999,
};

export default ItemCard;
