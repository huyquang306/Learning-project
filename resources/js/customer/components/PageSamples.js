/*
 * React 確認用 サンプル集
 */
import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Utils from 'js/shared/utils';

// Components
import LinkButton from 'js/shared/components/LinkButton';
import Button from 'js/shared/components/Button';
import ButtonSquare from 'js/shared/components/ButtonSquare';
import ButtonOnSale from 'js/shared/components/ButtonOnSale';
import Footer from 'js/shared/components/Footer';
import Card from 'js/shared/components/Card';
import Label from 'js/shared/components/Label';
import Modal from 'js/shared/components/Modal';
import Checkbox from 'js/shared/components/Checkbox';
import InputPinField from 'js/shared/components/InputPinField';
import ItemCard from 'js/shared/components/ItemCard';
import OnsaleItemCard from 'js/shared/components/OnsaleItemCard';
import DialogCard from 'js/shared/components/DialogCard';
import Chips from 'js/shared/components/Chips';
import LinkChips from 'js/shared/components/LinkChips';
import Drawer from 'js/shared/components/Drawer';
import PageContainer from 'js/shared/components/PageContainer';
import { RecaptchaContainer } from 'js/shared/auth-base';
import PropTypes from 'prop-types';
import { Grid, Box } from '@material-ui/core';
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import AddAPhotoOutlinedIcon from '@material-ui/icons/AddAPhotoOutlined';
import DirectionsWalkOutlinedIcon from '@material-ui/icons/DirectionsWalkOutlined';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import RestaurantOutlinedIcon from '@material-ui/icons/RestaurantOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

const SampleRouter = (props) => {
  return (
    <Router basename={process.env.MIX_BASENAME_SHOP}>
      <Switch>
        <Route path="/sample/" exact>
          <PageSampleContainer> menu </PageSampleContainer>
        </Route>
        <Route path="/sample/00">
          <PageSample00 {...props} />
        </Route>
        <Route path="/sample/01">
          <PageSample01 />
        </Route>
        <Route path="/sample/02">
          <PageSample02 />
        </Route>
        <Route path="/sample/03">
          <PageSample03 />
        </Route>
      </Switch>
    </Router>
  );
};
export default SampleRouter;

const PageSampleContainer = (props) => {
  return (
    <Router basename={process.env.MIX_BASENAME_CUSTOMER}>
      <StyledAppContainer>
        <h1>購買顧客画面TOP</h1>
        <LinkButton title="sample1" to="/sample1" />
        <LinkButton title="sample2" to="/sample2" />
        <LinkButton title="sample3" to="/sample3" />
        <LinkButton />

        <Switch>
          <Route path="/sample1">
            <h2>Sample1</h2>
          </Route>
          <Route path="/sample2">
            <h2>Sample2</h2>
          </Route>
          <Route path="/sample3">
            <h2>Sample3</h2>
          </Route>
        </Switch>
      </StyledAppContainer>
    </Router>
  );
};
// PropTypes
PageSampleContainer.propTypes = {
  children: PropTypes.node,
};
