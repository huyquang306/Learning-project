import React from 'react';
import PropTypes from 'prop-types';

// Component
import Modal from 'js/shared-order/components/Modal';

// Components(Material-UI)
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from 'js/shared/components/Button';
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';

const useStyles = makeStyles(() => ({
    modalContent: {
        maxWidth: '470px',
    },
    right: {
        fontSize: '24px',
        color: '#4F4F4F',
        fontWeight: 700,
    },
    lineDetail: {
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        marginTop: '40%',
        marginLeft: '10%',
        marginRight: '10%',
    },
    footerActions: {
        padding: '0px 15px 0px 15px',
        display: 'flex',
        width: '100%',
    },
    footerButton: {
        width: '100%',
    },
}));

const ModalConfirmOrder = (props) => {
  const classes = useStyles();

    return (
        <Modal
            open={ props.open }
            title="お店を応援しよう！"
            onClose={ props.onClose }
            maxWidth="450px"
        >
            <div className={classes.modalContent}>
                <Box textAlign="right">
                    <Box className={ classes.lineDetail }>
                        <Box width={'100%'} textAlign={'center'}>
                          <DoneOutlineOutlinedIcon />
                          <b>ハッシュタグが<br />コピーできました</b>
                          <br /><br />
                          <b>Instagramで<br />写真を投稿してください</b>
                          <Button
                            title="インスタグラムを起動する"
                            bgcolor="#f2994b"
                            fgcolor="#ffffff"
                            borderRadius="30px"
                            padding="12px 20px"
                            onClick={ props.onSubmit }
                          >
                          </Button>
                          <div>
                            <b>外部ページを開きます</b>
                          </div>
                        </Box>
                    </Box>
                </Box>
            </div>
        </Modal>
    );
};

// PropTypes
ModalConfirmOrder.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func
};

// defaultProps
ModalConfirmOrder.defaultProps = {
    open: false,
    onClose: () => {},
    onSubmit: () => {},
};

export default ModalConfirmOrder;
