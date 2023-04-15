import React, { useEffect, useState } from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';

// Library
import PropTypes from 'prop-types';

// Material Component
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

// Utils
import {deleteCookie, getCookie, CUSTOMER_AUTH_KEY} from 'js/utils/components/cookie/cookie';

const useStyles = makeStyles({
  appBar: {
    backgroundColor: '#FFA04B',
    alignItems: 'center',
    color: '#FFFFFF',
  },

  appBarToolbar: {
    width: '100%',
    minHeight: '43px',
    textAlign: 'center',
  },

  appBarIconLeft: {
    flex: 1,
    textAlign: 'left',
  },

  appBarTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '20px',
  },

  appBarIconRight: {
    flex: 1,
    textAlign: 'right',

    '& .MuiIconButton-root': {
      padding: '6px 0px',
    },

    '& .MuiIconButton-label, & a': {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      color: '#FFFFFF',
      fontSize: '20px',
      textDecoration: 'none',
    },
  },

  drawer: {
    '&.MuiDrawer-root, & .MuiBackdrop-root, & .MuiDrawer-paper': {
      width: '80%',
    },
  },

  drawerItem: {
    display: 'flex',
    alignItems: 'center',
    width: '130px',
    height: '43px',
    padding: '2px 5px',
    color: '#000000',
    fontWeight: 600,
    lineHeight: 1.1,
    textDecoration: 'none',
    borderBottom: '1px solid #BDBDBD',

    '&:hover': {
      opacity: '0.6',
    },

    '&:nth-child(even)': {
      backgroundColor: '#FFA04B',
    },
  },

  menu: {
    backgroundColor: '#F2F2F2',
  },
  menuItem: {
    display: 'block',
    padding: '5px',
    backgroundColor: '#ffffff',
    color: '#FFA04B',
    textDecoration: 'none',
    border: '1px solid #BDBDBD',
    borderBottom: '0',

    '&:last-child': {
      borderBottom: '1px solid #BDBDBD',
    },
  },
});

const HeaderAppBar = (props) => {
  const history = useHistory();

  const shop_hash_id = localStorage.getItem('shopHash');
  const [categories, setCategories] = useState([]);
  const table_code = localStorage.getItem('tableCode') || '';

  const classes = useStyles(props);

  const [showDivider, setShowDivider] = useState(false);

  const orderLink = localStorage.getItem('orderLinkForOneQRCode');

  const userHashId = getCookie('userHashId');

  const handleToogleDivider = () => {
    if (showDivider) {
      setShowDivider(false);
    } else {
      setShowDivider(true);
    }
  };

  const renderHeaderRight = () => {
    if (props.headerRight)
      return (
        <IconButton onClick={handleToogleDivider}>
          <MenuIcon style={{ fontSize: 30 }} />
        </IconButton>
      );

    return null;
  };

  const handleLogin = () => {
    deleteCookie(CUSTOMER_AUTH_KEY);
    deleteCookie('userHashId');
    history.push('/register');
  };

  const renderLoginLink = () => {
    if (!userHashId)
      return (
        <Link
          className={classes.menuItem}
          onClick={handleLogin}
        >
          登録/ログイン
        </Link>
      );

    return null;
  };

  const handleLogout = () => {
    deleteCookie(CUSTOMER_AUTH_KEY);
    deleteCookie('userHashId');
    setShowDivider(false);
    history.push(`/${orderLink}`);
  };

  const renderLogoutLink = () => {
    if (userHashId)
      return (
        <Link
          className={classes.menuItem}
          onClick={handleLogout}
        >
          ログアウト
        </Link>
      );

    return null;
  };

  useEffect(() => {
    let category_param = {
      tier_number: 1,
      parent_id: 0,
    };
    CustomerOrderApiService.getCategoryList(shop_hash_id, category_param).then((response) => {
      setCategories(response);
    });
  }, []);

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar variant="dense" className={classes.appBarToolbar}>
          <Box className={classes.appBarIconLeft} />
          <Typography valiant="div" className={classes.appBarTitle}>
            {props.title}
          </Typography>
          <Box className={classes.appBarIconRight}>{renderHeaderRight()}</Box>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        anchor="right"
        open={showDivider}
        onClose={() => setShowDivider(false)}
      >
        <Box px={1} className={classes.menu}>
          <Box py={2} fontWeight={600}>
            卓番号：{table_code}
          </Box>

          <Box>
            <Link
              className={classes.menuItem}
              to={'/' + shop_hash_id}
              onClick={() => setShowDivider(false)}
            >
              TOPへ
            </Link>
            <Link
              className={classes.menuItem}
              to={'/' + shop_hash_id + '/pre_order/list'}
              onClick={() => setShowDivider(false)}
            >
              未注文リスト
            </Link>
            <Link
              className={classes.menuItem}
              to={'/' + shop_hash_id + '/order/list'}
              onClick={() => setShowDivider(false)}
            >
              注文履歴
            </Link>
          </Box>

          <Box pb={1} pt={5} fontWeight={600}>
            商品
          </Box>

          <Box>
            <Link
              className={classes.menuItem}
              to={'/' + shop_hash_id + '/recommend/menu/list'}
              onClick={() => setShowDivider(false)}
            >
              おすすめ
            </Link>
            {categories &&
              categories.map((item, index) => (
                <Link
                  key={index}
                  className={classes.menuItem}
                  to={`/${shop_hash_id}/category/${item.code}/menu/list`}
                  onClick={() => setShowDivider(false)}
                >
                  {item.name}
                </Link>
              ))}
          </Box>

          <Box pb={1} pt={5} fontWeight={600}>
            ユーザー
          </Box>

          <Box>
            {renderLoginLink()}
            {renderLogoutLink()}
          </Box>

          {/* <Box pb={1} pt={5} fontWeight={600}>
            設定
          </Box>

          <Box>
            <Link className={classes.menuItem} to="/">
              言語設定
            </Link>
          </Box> */}
        </Box>
      </Drawer>
    </>
  );
};

// PropTypes
HeaderAppBar.propTypes = {
  title: PropTypes.string,
  headerRight: PropTypes.bool,
};

HeaderAppBar.defaultProps = {
  title: '',
  headerRight: true,
};

export default HeaderAppBar;
