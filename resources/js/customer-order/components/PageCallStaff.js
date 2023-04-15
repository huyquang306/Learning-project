/**
 * Page Call Staff
 */

// React
import React from 'react';
import { Link } from 'react-router-dom';

// Material UI component
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Component
import HeaderAppBar from './HeaderAppBar';
import PageInnerWrap from './PageInnerWrap';

// Component shared
import PageContainer from '../../shared/components/PageContainer';
import PageInnerContainer from '../../shared/components/PageInnerContainer';

// Style
const useStyles = makeStyles({
  item: {
    display: 'block',
    fontSize: '20px',
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '29px 0',
    backgroundColor: '#FFA04B',
  },
});

const PageCallStaff = () => {
  const classes = useStyles();

  return (
    <PageContainer padding="0">
      <HeaderAppBar title="店員呼し出し" />
      <PageInnerWrap>
        <PageInnerContainer padding="40px 30px">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Link to="/" className={classes.item}>
                店員呼び出し
              </Link>
            </Grid>
            <Grid item xs={6}>
              <Link to="/123456/billing" className={classes.item}>
                お会計
              </Link>
            </Grid>
          </Grid>
        </PageInnerContainer>
      </PageInnerWrap>
    </PageContainer>
  );
};

export default PageCallStaff;
