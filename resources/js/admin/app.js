import React from 'react';
import ReactDOM from 'react-dom';

// components
import AppContainer from 'js/admin/AppContainer';

// Services
import AdminApiService from 'js/admin/actions/admin-api-service';

// Api service initialize
AdminApiService.init({
  prefix: process.env.MIX_API_ADMIN_PREFIX,
});

if (document.getElementById('appRoot')) {
  ReactDOM.render(<AppContainer />, document.getElementById('appRoot'));
}
