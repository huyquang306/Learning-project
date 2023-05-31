import ApiBase, { HTTP_METHOD as METHOD } from 'js/shared/api-base';

class PaymentApiService extends ApiBase {
  constructor(param) {
    super(param);
  }
}

export default new PaymentApiService();