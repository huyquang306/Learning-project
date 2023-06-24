/*
  AuthBase Class
 */
import AuthBase from 'js/shared/auth-base';
import { createContext } from 'react';

class CustomerOrderAuthService extends AuthBase {
  constructor() {
    super();
    this.context = createContext();
  }
}

// singleton
export default new CustomerOrderAuthService();
