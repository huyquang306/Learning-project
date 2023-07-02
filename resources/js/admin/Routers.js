import React, {createElement, useContext} from 'react';
import PropTypes from 'prop-types';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import GlobalContext from 'js/admin/GlobalContext';

// Page Components
import ShopListPage from 'js/admin/pages/ShopListPage';

// Router private
const PrivateRoute = ({ component, ...rest }) => {
  const {state} = useContext(GlobalContext);
  const routeComponent = (props) => state.isAuthenticated
    ? createElement(component, props)
    : <Redirect to={{ pathname: '/' }} />;

  return <Route {...rest} render={routeComponent}/>;
};
PrivateRoute.propTypes = {
  component: PropTypes.elementType
};

const RouterSignedInOut = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute path='/' exact component={ShopListPage} />
        {/* Redirect to base if the page cannot be found */}
        <Redirect to={{ pathname: '/' }} />
      </Switch>
    </Router>
  );
};

RouterSignedInOut.propTypes = {};
export default RouterSignedInOut;
