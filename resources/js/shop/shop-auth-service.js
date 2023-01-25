import { createContext } from "react";
import AuthBase from "../shared/auth-base";

class ShopAuthService extends AuthBase {
  constructor() {
    super();
    this.context = createContext();
  }
}

export default new ShopAuthService();