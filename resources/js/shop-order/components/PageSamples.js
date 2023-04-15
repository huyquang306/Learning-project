import React, { useState } from 'react';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import PageInnerContainer from 'js/shared-order/components/PageInnerContainer';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import FlashMessage from 'js/shared-order/components/FlashMessage';
import Dialog from 'js/shared-order/components/Dialog';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    height: 'calc(100vh - 64px)',
    overflow: 'hidden',
  },
  content: {
    flex: '0 0 calc(100vw - 360px)',
    padding: '10px 15px',
    overflow: 'scroll',
    position: 'relative',
  },
  contentTable: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '-10px',
    marginRight: '-10px',
  },
  sideBar: {
    flex: '0 0 360px',
    padding: '10px 12px',
    backgroundColor: '#fff',
    overflow: 'scroll',
  },
}));

const PageSamples = (props) => {
  const classes = useStyles(props);

  const [showDialog, setShowDialog] = useState(false);

  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  return (
    <PageContainer padding="0px">
      <div className={classes.root}>
        {/* <HeaderAppBar title="PageSamples" /> */}
        <PageInnerContainer backgroundColor={'#FFFFFF'}>
          <div style={{ padding: '20px', paddingTop: '100px' }}>
            <h2 style={{ paddingBottom: '18px' }}>Dialog</h2>
            <Button
              style={{ marginRight: '20px' }}
              variant="contained"
              onClick={() => setShowDialog(true)}
            >
              Dialog
            </Button>
          </div>

          <div style={{ padding: '20px', paddingTop: '20px' }}>
            <h2 style={{ paddingBottom: '18px' }}>Flash message</h2>
            <Button
              style={{ marginRight: '20px' }}
              variant="contained"
              onClick={() =>
                setToast({
                  isShow: true,
                  message: 'This is a success alert — check it out!',
                  status: 'success',
                })
              }
            >
              Success
            </Button>
            <Button
              style={{ marginRight: '20px' }}
              variant="contained"
              color="primary"
              onClick={() =>
                setToast({
                  isShow: true,
                  message: 'This is an info alert — check it out!',
                  status: 'info',
                })
              }
            >
              Info
            </Button>
            <Button
              style={{ marginRight: '20px' }}
              variant="contained"
              color="secondary"
              onClick={() =>
                setToast({
                  isShow: true,
                  message: 'This is an error alert — check it out!',
                  status: 'error',
                })
              }
            >
              Error
            </Button>
            <Button
              style={{ marginRight: '20px' }}
              variant="contained"
              color="primary"
              onClick={() =>
                setToast({
                  isShow: true,
                  message: 'This is a warning alert — check it out!',
                  status: 'warning',
                })
              }
            >
              Warning
            </Button>
          </div>

          <FlashMessage
            isOpen={toast.isShow}
            onClose={(isOpen) => setToast({ ...toast, isShow: isOpen })}
            status={toast.status}
            message={toast.message}
          />

          <Dialog
            isOpen={showDialog}
            onClose={(isOpen) => setShowDialog(isOpen)}
            title="Dialog title"
            message="Dialog body text goes here."
            onConfirm={() =>
              setToast({
                isShow: true,
                message: 'onConfirm!',
                status: 'info',
              })
            }
          />
        </PageInnerContainer>
      </div>
    </PageContainer>
  );
};

PageSamples.propTypes = {};
export default PageSamples;
