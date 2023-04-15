import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Components
import PageContainer from 'js/shared/components/PageContainer';
import { Box } from '@material-ui/core';
import Modal from 'js/shared/components/Modal';
import Button from 'js/shared/components/Button';
import Waiting from 'js/shared/components/Waiting';

// Services
import CustomerOrderApiService from 'js/customer-order/customer-or-api-service';

const PageTableSignin = (_props) => {
  const history = useHistory();

  // Local state
  const [errorMessage, setErrorMessage] = useState(null);
  // waiting
  const [wait, setWait] = useState(false);

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const shopHash = params.get('redirect_url');
  const tableHash = params.get('table');

  useEffect(() => {
    // get status of ordergroup
    getOrdergroup();
  }, []);

  // エラー時のボタン動作
  const handleErrorModalButtonClick = () => {
    window.open("about:blank", "_self");
    window.close();
  };

  const getOrdergroup = async () => {
    try {
      // テーブルQRコード対応（shopHashとtableCodeで最新のordergroupを取得 or 新規発行）
      setWait(true);
      const res_ordergroup = await CustomerOrderApiService.getActiveOrdergroupByShopHashAndTableHash(shopHash, tableHash);
      const res_shop = await CustomerOrderApiService.getShop(shopHash);
      const tableCode = res_ordergroup.table_code;

      // 店舗発行のオーダーの流れにするためのリダイレクト
      const redirectLink = `/register?redirect_url=${shopHash}&ordergroup_hash_id=${res_ordergroup.hash_id}&shop_name=${encodeURI(
        res_shop.name
      )}&table_code=${encodeURI(tableCode)}`;

      setWait(false);

      // リダイレクト
      history.push(redirectLink);
    } catch (error) {
      setWait(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <PageContainer>
      {/* Error modal */}
      <Modal title='' open={!!errorMessage}>
        <Box>{errorMessage}</Box>
        <br />
        <Button onClick={handleErrorModalButtonClick}>画面閉じる</Button>
      </Modal>
      <Waiting isOpen={wait} />
    </PageContainer>
  );
};
// PropTypes
PageTableSignin.propTypes = {};
export default PageTableSignin;
