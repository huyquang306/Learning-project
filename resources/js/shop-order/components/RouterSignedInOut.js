import React, {createElement} from 'react';
import PropTypes from 'prop-types';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import { shopInfoDefault } from 'js/shop/components/ShopInfoContext';

// Page Components
import PageLaunch from 'js/shop-order/components/PageLaunch';
import PageRegist from 'js/shop/components/PageRegist';
import PageSignin from 'js/shop/components/PageSignin';
import PageSendEmailToForgotPassword from 'js/shop/components/PageSendEmailToForgotPassword';
import PageSetting from 'js/shop-order/components/setting/PageSetting';
import PageCurrentPlan from 'js/shop-order/components/setting/PageCurrentPlan';
import PageMenuSetting from './setting/PageSettingMenu';
import PageTableList from 'js/shop-order/components/PageTableList';
import PageSettingTax from 'js/shop-order/components/setting/PageSettingTax';
import PageInfoSetting from 'js/shop-order/components/setting/PageSettingInfo';
import PageTableSetting from 'js/shop-order/components/setting/PageSettingTable';
import PagePrinterSetting from './setting/PageSettingPrinter';
import PageCategorySetting from 'js/shop-order/components/setting/PageCategorySetting.js';
import PageSettingCookPlace from 'js/shop-order/components/setting/CookPlace/PageSettingCookPlace';
import PageSettingChangePassword from 'js/shop-order/components/setting/PageSettingChangePassword';
import PageForgotPassword from 'js/shop/components/PageForgotPassword';
import PageSettingSubCategory from 'js/shop-order/components/setting/PageSettingSubCategory.js';
import PageRecommendationSetting from 'js/shop-order/components/PageRecommendationSetting';
import PageReserveList from 'js/shop-order/components/PageReserveList';
import PageReserveListNew from 'js/shop-order/components/PageReserveList/PageReserveListNew';
import PageOrderHistory from 'js/shop-order/components/PageOrderHistory';
import PageUserHistory from 'js/shop-order/components/PageUserHistory';
import PageUserHistoryDetail from 'js/shop-order/components/PageUserHistory/PageUserHistoryDetail.js';
import PageStaffs from 'js/shop-order/components/PageStaffs';
import PageMenu from 'js/shop-order/components/PageMenu';
import PageCourses from 'js/shop-order/components/PageMenu/PageCourses';
import PageAddCourse from 'js/shop-order/components/PageMenu/PageCourses/PageAddCourse';
import PageSamples from 'js/shop-order/components/PageSamples';
import PageNotAuthorityPlan from 'js/shop-order/components/PageNotAuthorityPlan';
import PageRedirect from 'js/shop/components/PageRedirect';
import PageVerifiedEmail from 'js/shop/components/PageVerifiedEmail';

// Utils
import { FUNCTIONS_CODE } from 'js/utils/components/Payment/paymentConst';
import { checkAuthorityFunction } from 'js/utils/components/Payment/utils';

const RouterBase = (props) => {
  return (
    <Router basename={process.env.MIX_BASENAME_SHOP_ORDER}>
      <Switch>{props.children}</Switch>
    </Router>
  );
};
RouterBase.propTypes = {
  children: PropTypes.node,
};

const PRINTER_LIST_PATH = '/setting/printer/list';

const RouterSignedInOut = (props) => {
  const isAuthenticated = props.isSignedIn;
  const isRegistedShop = props.shopInfo.hashId;
  const {authUser} = props;

  const checkAuthorityPlan = (path) => {
    const servicePlan = props.shopInfo.service_plan;
    if (servicePlan) {
      const rFunctionConditions = servicePlan.r_function_conditions;
      if (path === PRINTER_LIST_PATH) {
        return checkAuthorityFunction(rFunctionConditions, FUNCTIONS_CODE.printer);
      }
    }

    return true;
  };

  // Router private
  const PrivateRoute = ({ component, ...rest }) => {
    const routeComponent = (props) => {
      // Check login fire bases
      if (isAuthenticated) {
        // Check register shop
        if (isRegistedShop) {
          // Check verify email
          if (authUser.phoneNumber || authUser.emailVerified) {
            if (checkAuthorityPlan(rest.path)) {
              return createElement(component, props);
            }

            return <Redirect to='/not-authority' />;
          }

          return <Redirect to={{ pathname: `/` }} />;
        } else {
          return <Redirect to={{ pathname: '/register' }} />;
        }
      }

      return <Redirect to={{ pathname: '/' }} />;
    };

    return <Route {...rest} render={routeComponent}/>;
  };
  PrivateRoute.propTypes = {
    component: PropTypes.elementType
  };

  // Router logged in by email
  const LoginByEmailRoute = ({ component, ...rest }) => {
    const routeComponent = (props) => createElement(component, props);

    return <Route {...rest} render={routeComponent} />;
  };
  LoginByEmailRoute.propTypes = {
    component: PropTypes.elementType,
  };

  return (
    <RouterBase>
      <Route path="/example" exact component={PageSamples} />
      <Route exact path="/">
        {isAuthenticated && isRegistedShop ? (
          authUser.phoneNumber || authUser.emailVerified ? (
            <Redirect to="/table/list" />
          ) : (
            <Redirect to="/verify-forgot-password" />
          )
        ) : (
          <PageLaunch />
        )}
      </Route>
      {/* If user login by phoneNumber (forgotPassword feature) */}
      <Route path="/regist" exact>
        {isAuthenticated && isRegistedShop ? <Redirect to="/table/list" /> : <PageRegist />}
      </Route>
      <Route exact path="/signin">
        {isAuthenticated && isRegistedShop ? <Redirect to="/table/list" /> : <PageSignin />}
      </Route>
      <Route exact path="/verify-email">
        {isAuthenticated && isRegistedShop ? <Redirect to="/table/list" /> : <PageVerifiedEmail />}
      </Route>

      <Route exact path="/verify-forgot-password">
        {isAuthenticated ? <Redirect to="/table/list" /> : <PageSendEmailToForgotPassword />}
      </Route>
      <LoginByEmailRoute exact path="/forgot-password" component={PageForgotPassword} />

      {/* Redirect route */}
      <Route exact path="/redirect" component={PageRedirect} />

      {/* Add public pages here */}
      <PrivateRoute path="/table/list" exact component={PageTableList} />
      <PrivateRoute path="/reserve/list" exact component={PageReserveList} />
      <PrivateRoute path="/reserve/list/new" exact component={PageReserveListNew} />
      <PrivateRoute path="/order/list" exact component={PageOrderHistory} />
      <PrivateRoute path="/users/history" exact component={ PageUserHistory } />
      <PrivateRoute path="/users/history/order-detail/:userHashId" exact component={ PageUserHistoryDetail } />
      <PrivateRoute path="/staffs" exact component={ PageStaffs } />
      <PrivateRoute path="/menus/setting" exact component={ PageMenu } />
      <PrivateRoute path="/menus/courses" exact component={ PageCourses } />
      <PrivateRoute path="/menus/courses/add" exact component={ PageAddCourse } />
      <PrivateRoute path="/menus/courses/:courseHashId" exact component={ PageAddCourse } />
      <PrivateRoute path="/setting" exact component={PageSetting} />
      <PrivateRoute path="/setting/current-plan" exact component={PageCurrentPlan} />
      <PrivateRoute path="/setting/menu/list" exact component={PageMenuSetting} />
      <PrivateRoute path="/setting/table/list" exact component={PageTableSetting} />
      <PrivateRoute path="/setting/info" exact component={PageInfoSetting} />
      <PrivateRoute path="/setting/tax" exact component={PageSettingTax} />
      <PrivateRoute path={PRINTER_LIST_PATH} exact component={PagePrinterSetting} />
      <PrivateRoute path="/setting/category/list" exact component={PageCategorySetting} />
      <PrivateRoute path="/setting/cook-place/list" exact component={PageSettingCookPlace} />
      <PrivateRoute path="/change-password" exact component={PageSettingChangePassword} />
      <PrivateRoute
        path="/setting/category/:categoryId/subcategory/list"
        exact
        component={PageSettingSubCategory}
      />
      <PrivateRoute path="/setting/recommend/list" exact component={PageRecommendationSetting} />
      <Route path="/not-authority" exact component={PageNotAuthorityPlan} />
      {/* Add private pages here */}
      <Redirect to={{ pathname: '/' }} /> {/* Redirect to base if the page cannot be found */}
    </RouterBase>
  );
};
RouterSignedInOut.propTypes = {
  isSignedIn: PropTypes.oneOfType([PropTypes.bool.isRequired, PropTypes.oneOf([null]).isRequired])
    .isRequired,
  shopInfo: PropTypes.object,
  authUser: PropTypes.object,
};
RouterSignedInOut.defaultProps = {
  isSignedIn: null,
  shopInfo: shopInfoDefault,
  authUser: {},
};

export default RouterSignedInOut;
