import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Label from 'js/shared/components/Label';

// Utils
import { renderUrlImageS3 } from 'js/utils/helpers/image';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    width: '172px',
    left: '7px',
    margin: '5px',
    display: 'inline-grid',
    '& .MuiCardContent-root': {
      padding: '8px',
      width: '100%',
      display: 'inline-grid',
      gridTemplateColumns: '2fr 1fr',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '& .MuiTypography-subtitle1': {
      fontWeight: 600,
    },
    '& .MuiTypography-gutterBottom': {
      marginBottom: 0,
    },
    '& .MuiChip-root': {
      position: 'absolute',
      width: '60px',
      fontSize: '12px',
      top: '0%',
      right: '0%',
      zIndex: 2,
      height: '24px',
      lineHeight: '16px',
    },
    '& .MuiChip-label': {
      paddingLeft: '0px',
      paddingRight: '0px',
    },
  },
  media: {
    height: 140,
  },
});

const OnsaleItemCard = (props) => {
  const classes = useStyles();
  
  return (
    <Card className={classes.root}>
      {props.status === 'onsale' ? (
        <Label label="Sale" bgcolor="#97C633" fgcolor="#FFFFFF" />
      ) : (
        <Label label="Sold out" bgcolor="#E35649" fgcolor="#FFFFFF" />
      )}
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={props.img ? renderUrlImageS3(props.img) : `${process.env.MIX_ASSETS_PATH}img/shared/noimage.png`}
        />
        <CardContent vertical-align="middle">
          <Typography gutterBottom variant="subtitle1">
            {props.itemName}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="right">
            {'₫' + props.itemPrice.toLocaleString()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

// PropTypes
OnsaleItemCard.propTypes = {
  img: PropTypes.string,
  itemName: PropTypes.string,
  itemPrice: PropTypes.number,
  status: PropTypes.string,
};
// defaultProps
OnsaleItemCard.defaultProps = {
  img: null,
  itemName: null,
  itemPrice: 0,
  status: null,
};

export default OnsaleItemCard;
