import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router';

import moment from 'moment';

// Services
import ShopAuthService from 'js/shop/shop-auth-service';
import ShopApiService, { ENDPOINTS } from 'js/shop/shop-api-service';

// Components
import PageContainer from 'js/shared/components/PageContainer.js';
import HeaderAppBar from 'js/shop/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import CustomButton from 'js/shared/components/Button.js';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import { Container, Box, ButtonGroup, Button, Paper, Grid } from '@material-ui/core';

// icons
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

//
// style
//
const useStyles = makeStyles({
  // 期間選択ボタングループ
  selector: {
    width: '90%',
    textAlign: 'center',
    margin: '20px auto',

    '& .MuiButtonGroup-root': {
      width: '100%',

      '& .MuiButton-root': {
        width: '50%',
        '&[data-selected="YES"]': {
          backgroundColor: '#888',
          color: '#fff',
        },
      },
    },
  },

  // Date indicator
  dateIndicator: {
    width: '90%',
    textAlign: 'center',
  },

  // 工事中
  underconstruction: {
    width: '90%',
    margin: '30px auto',
    textAlign: 'center',
    '& .MuiPaper-root': {
      padding: '20px 5px',
    },
    '& h3': {
      margin: '20px auto',
    },
    '& p': {
      textAlign: 'left',
      width: '80%',
      margin: '20px auto',
    },
  },
});

const TERM = {
  DAY: 'DAY',
  WEEK: 'WEEK',
};

//
//
//
const PageStatistics = (props) => {
  const classes = useStyles(props);
  const history = useHistory();

  //
  // 期間選択
  //
  const [selectedTerm, setSelectedTerm] = useState(TERM.DAY);
  useEffect(() => {
    console.debug('[PageStatistics] on Selected', selectedTerm);
  }, [selectedTerm]);

  //
  // render
  //
  return (
    <PageContainer padding="0" backgroundColor="#eee">
      <HeaderAppBar title="分析" backButton={true} settingButton={false} />

      {/* 期間選択 */}
      <Container className={classes.selector}>
        <ButtonGroup size="small" variant="outlined">
          <Button
            data-selected={selectedTerm === TERM.DAY ? 'YES' : 'NO'}
            onClick={() => {
              setSelectedTerm(TERM.DAY);
            }}
          >
            日
          </Button>
          <Button
            data-selected={selectedTerm === TERM.WEEK ? 'YES' : 'NO'}
            onClick={() => {
              setSelectedTerm(TERM.WEEK);
            }}
          >
            週
          </Button>
        </ButtonGroup>
      </Container>

      {/* 日付 */}
      <Container className={classes.dateIndicator}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <ChevronLeftIcon />
          </Grid>
          <Grid item xs={8}>
            {selectedTerm === TERM.DAY
              ? moment().format('YYYY/MM/DD')
              : moment().format('YYYY/MM/DD') + '〜' + moment().add(6, 'days').format('YYYY/MM/DD')}
          </Grid>

          <Grid item xs={2}>
            <ChevronRightIcon />
          </Grid>
        </Grid>
      </Container>

      <Container className={classes.underconstruction}>
        <Paper elevation={3}>
          <h3>ご利用ありがとうございます</h3>

          <p>
            申し訳ございません。 詳細分析画面は現在開発中となります。
            これからのお弁当あーるの開発にご期待ください。
          </p>
          <CustomButton onClick={() => history.goBack()}>OK </CustomButton>
        </Paper>
      </Container>

      <PageInnerContainer backgroundColor="rgba(200,200,200,0.1)"></PageInnerContainer>
    </PageContainer>
  );
};
// PropTypes
PageStatistics.propTypes = {};
export default PageStatistics;
