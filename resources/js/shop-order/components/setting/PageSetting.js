// React
import React from 'react';
import { Link } from 'react-router-dom';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared-order/components/PageInnerContainer';

// Components(Material-UI)
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  contentWrap: {
    position: 'absolute',
    width: '100%',
    height: 'calc(100% - 64px)',
    display: 'flex',
    padding: '300px 30px',
  },
  link: {
    backgroundColor: '#FFF',
    color: '#FFA04B',
    borderRadius: 5,
    border: '1px #FFA04B solid',
    fontSize: '35px',
    fontWeight: 600,
    display: 'flex',
    textDecoration: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    height: '160px',
    boxShadow:
      '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    '&:hover': {
      backgroundColor: '#FFA04B',
      color: '#F2F2F2',
      boxShadow:
        '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
      transition: 'all 0.5s',
    },
    '@media (max-width: 600px)': {
      fontSize: '25px',
    },
  },
}));

const PageSetting = (props) => {
  const classes = useStyles(props);
  const menuSettings = [
    {
      url: '/setting/info',
      label: '店舗基本設定',
    },
    {
      url: '/setting/table/list',
      label: 'テーブル登録',
    },
    {
      url: '/staffs',
      label: 'スタッフ設定',
    },
    {
      url: '/setting/cook-place/list',
      label: '調理場設定',
    },
    {
      url: '/setting/printer/list',
      label: 'プリンター設定',
    },
    {
      url: '/setting/tax',
      label: '会計・税率設定',
    },
    {
      url: '/setting/current-plan',
      label: 'プラン・請求',
    },
  ];

  return (
    <PageContainer padding="0px">
      <style>{'body { background-color: white}'}</style>
      <div className={classes.root}>
        <HeaderAppBar title="店舗設定" />
        <PageInnerContainer>
          <Box className={classes.contentWrap}>
            <Grid
              container
              spacing={4}
              alignContent={'center'}
              alignItems={'center'}
              style={{ margin: 0 }}
            >
              {menuSettings &&
                menuSettings.map((menu, index) => (
                  <Grid item xs={4} sm={4} key={index}>
                    <Box display={'flex'} justifyContent={'center'}>
                      <Link to={menu.url} className={classes.link}>
                        {menu.label}
                      </Link>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </PageInnerContainer>
      </div>
    </PageContainer>
  );
};

PageSetting.propTypes = {};
export default PageSetting;
