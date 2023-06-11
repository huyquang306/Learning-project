import React from 'react';
import { Link, useHistory } from 'react-router-dom';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared-order/components/PageInnerContainer';
import Footer from 'js/shared-order/components/Footer';

// Components(Material-UI)
import { useStylesPageMenu as useStyles} from './styles';
import { Grid, Box, Button } from '@material-ui/core';

const PageSetting = (props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const menuSettings = [
    {
      url: '/setting/menu/list',
      label: 'Món ăn',
    },
    {
      url: '/menus/courses',
      label: 'Set ăn',
    },
    {
      url: '/setting/recommend/list',
      label: 'Món ăn gợi ý',
    },
  ];

  return (
    <PageContainer padding="0px">
      <div className={ classes.root }>
        <HeaderAppBar title="Danh sách thực đơn" />
        <PageInnerContainer>
          <Box className={ classes.contentWrap }>
            <Grid className={ classes.menuGridWrap } container spacing={ 4 } alignContent='center' alignItems='center'>
              { menuSettings &&
              menuSettings.map((menu, index) => (
                <Grid item xs={ 6 } sm={ 4 } key={ index }>
                  <Box display='flex' justifyContent='center'>
                    <Link to={ menu.url } className={ classes.link }>
                      { menu.label }
                    </Link>
                  </Box>
                </Grid>
              )) }
            </Grid>
          </Box>
        </PageInnerContainer>
      </div>
    </PageContainer>
  );
};

PageSetting.propTypes = {};
export default PageSetting;
