/*
 Fullscreen Dialog
*/

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Container,
} from '@material-ui/core/';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  // title bar
  appBar: {
    position: 'fixed',
    backgroundColor: '#666',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  
  // content body
  contentBody: {
    padding: '80px 10px',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = (props) => {
  const classes = useStyles();
  
  return (
    <Dialog fullScreen open={props.isOpen} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {props.title}
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => {
              props.setIsOpen(false);
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container className={classes.contentBody}>{props.children}</Container>
    </Dialog>
  );
};
// PropTypes
FullScreenDialog.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};
FullScreenDialog.defaultProps = {
  title: 'Title',
};
export default FullScreenDialog;
