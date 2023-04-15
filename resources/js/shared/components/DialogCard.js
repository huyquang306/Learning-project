import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    width: '300px',
    '& .MuiCardContent-root': {
      paddingBottom: '8px',
      textAlign: 'center',
    },
    '& .MuiTypography-subtitle1': {
      fontWeight: 600,
    },
    '& .MuiCardActions-root': {
      background: '#EDEEEF',
      padding: '8px 32px',
    },
    '& .MuiButton-outlinedSecondary': {
      background: '#FFFFFF',
      margin: '0px 10px',
    },
    '& .MuiButton-containedSecondary': {
      /* margin: '0px 10px', */
      margin: 'auto',
    },
  },
  media: {
    height: 140,
  },
});

const DialogCard = (props) => {
  const classes = useStyles();
  
  // button handler
  const handleClickAgree = (_event) => {
    props.agreeStatus(true);
  };
  
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="subtitle1">
            Please allow the location information acquisition of the terminal or browser
          </Typography>
          <Typography variant="body2" color="textSecondary">
            If you allow it, you can display the lunch box sales information of the nearest store.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {/*
        <Button variant="outlined" color="secondary" onClick={handleClickDisagree}>
          無視する
        </Button>
        */}
        <Button variant="contained" color="secondary" onClick={handleClickAgree}>
          Got it
        </Button>
      </CardActions>
    </Card>
  );
};

// PropTypes
DialogCard.propTypes = {
  img: PropTypes.string,
  agreeStatus: PropTypes.func,
};
// defaultProps
DialogCard.defaultProps = {
  img: '',
  agreeStatus: () => {
    /* nop */
  },
};

export default DialogCard;
