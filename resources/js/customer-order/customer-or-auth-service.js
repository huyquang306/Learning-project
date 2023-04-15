/*
  AuthBase Class
  認証の基本機能を提供する
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
