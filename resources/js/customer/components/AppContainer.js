/*
 * Obento-R 購買顧客側画面
 *
 */

import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import styled from 'styled-components';

// style
import 'css/style.css';
// components
import SampleRouter from 'js/customer/components/PageSamples';

// context
import ShopInfoContext from 'js/customer/components/ShopInfoContext';

// Page Components
import PageLaunch from 'js/customer/components/PageLaunch.js';
import PageSearchMap from 'js/customer/components/PageSearchMap.js';
import PageOnsale from 'js/customer/components/PageOnsale.js';

const StyledAppContainer = styled.div`
  margin: 0px;
  width: 100vw;
  position: relative;
  background: #ffffff;
`;

//
// AppContainer Component
//

const AppContainer = () => {
  return (
    <ShopInfoContext.Provider value={{ hashId: null, lat: null, lng: null }}>
      <StyledAppContainer>
        <Router basename={process.env.MIX_BASENAME_CUSTOMER}>
          <Switch>
            {/* 開発サンプル */}
            <Route path="/sample/">
              <SampleRouter />
            </Route>
            {/* 各ページへ */}
            <Route path="/" exact component={PageLaunch} />
            <Route path="/searchmap" exact component={PageSearchMap} />
            <Route path="/onsale/:shopHash" exact component={PageOnsale} />
            {/* unmatch */}
            <Redirect to="/" />
          </Switch>
        </Router>
      </StyledAppContainer>
    </ShopInfoContext.Provider>
  );
};

export default AppContainer;
