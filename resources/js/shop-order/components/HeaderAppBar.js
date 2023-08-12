/*
 * Obento-R お弁当販売
 Header
 */
// React
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Library
import PropTypes from 'prop-types';

// Material Component
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

// Services
import ShopAuthService from 'js/shop/shop-auth-service';

import Dialog from 'js/shared-order/components/Dialog';

const useStyles = makeStyles({
  appBar: {
    backgroundColor: '#FFA04B',
    alignItems: 'center',
    color: '#FFFFFF',
  },

  appBarToolbar: {
    width: '100%',
    textAlign: 'center',
  },

  appBarIconLeft: {
    flex: 1,
    textAlign: 'left',
    '& .MuiIconButton-root': {
      padding: '9px 0px',
    },

    '& .MuiSvgIcon-root': {
      marginRight: '12px',
    },

    '& .MuiIconButton-label, & a': {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      color: '#FFFFFF',
      fontSize: '20px',
      textDecoration: 'none',
    },
  },

  appBarTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '20px',
    ['@media (max-width: 500px)']: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      padding: '5px 0px',
    },
  },

  appBarIconRight: {
    flex: 1,
    textAlign: 'right',

    '& .MuiIconButton-label, & a': {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      color: '#E4E1B0',
      fontSize: '20px',
      textDecoration: 'none',

      '&:not(:last-child)': {
        marginRight: '20px',
        ['@media (max-width: 400px)']: {
          marginRight: '8px',
        },
      },
    },
  },

  drawer: {
    '&.MuiDrawer-root, & .MuiBackdrop-root, & .MuiDrawer-paper': {
      top: '48px !important',
    },
  },

  drawerItem: {
    minWidth: '246px',
    fontSize: '25px',
    padding: '15px 10px',
    color: '#000000',
    fontWeight: 600,
    textDecoration: 'none',
    borderBottom: '1px solid #BDBDBD',

    '&:hover': {
      opacity: '0.6',
    },
  },
});

const menuList = [
  {
    url: '/table/list',
    name: 'Danh sách bàn',
  },
  {
    url: '/reserve/list',
    name: 'Order cần phục vụ',
  },
  {
    url: '/order/list',
    name: 'Lịch sử đơn hàng',
  },
  {
    url: '/users/history',
    name: 'Danh sách khách hàng',
  },
  {
    url: '/menus/setting',
    name: 'Danh sách món',
  },
  {
    url: '/setting',
    name: 'Cài đặt',
  },
  {
    url: '/change-password',
    name: 'Đổi mật khẩu',
  },
];

const HeaderAppBar = (props) => {
  const classes = useStyles(props);

  const [showDivider, setShowDivider] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleToogleDivider = () => {
    if (showDivider) {
      setShowDivider(false);
    } else {
      setShowDivider(true);
    }
  };

  const renderHeaderLeft = () => {
    if (props.headerLeft) {
      if (props.headerLeftContent) return props.headerLeftContent;
      return (
        <IconButton onClick={handleToogleDivider}>
          <MenuIcon style={{ fontSize: 30 }} />
        </IconButton>
      );
    }

    return null;
  };

  const renderHeaderRight = () => {
    if (props.headerRightContent) return props.headerRightContent;

    return null;
  };

  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar variant="dense" className={classes.appBarToolbar}>
          <Box className={classes.appBarIconLeft}>{renderHeaderLeft()}</Box>
          <Typography valiant="div" className={classes.appBarTitle}>
            {props.title}
          </Typography>
          <Box className={classes.appBarIconRight}>{renderHeaderRight()}</Box>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        anchor="left"
        open={showDivider}
        onClose={() => setShowDivider(false)}
      >
        {menuList &&
          menuList.map((item) => (
            <Link className={classes.drawerItem} to={`${item.url}`} key={item.name}>
              {item.name}
            </Link>
          ))}

        <Box className={classes.drawerItem} onClick={() => setShowDialog(true)}>
          Đăng xuất
        </Box>
      </Drawer>

      <Dialog
        isOpen={showDialog}
        onClose={(isOpen) => setShowDialog(isOpen)}
        title="Xác nhận"
        message="Bạn chắc chắn muốn đăng xuất？"
        onConfirm={() => ShopAuthService.signOut()}
      />
    </>
  );
};

// PropTypes
HeaderAppBar.propTypes = {
  title: PropTypes.string,
  headerLeft: PropTypes.bool,
  headerRightContent: PropTypes.node,
  headerLeftContent: PropTypes.node,
};

HeaderAppBar.defaultProps = {
  title: 'undefined',
  headerLeft: true,
};

export default HeaderAppBar;
