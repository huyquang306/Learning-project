/*
  プライバシーポリシーダイアログ
*/

import React from 'react';
import FullScreenDialog from 'js/shared/components/FullscreenDialog';

const PrivacyPolicyDialog = (props) => {
  return (
    <FullScreenDialog {...props} title="Chính sách bảo mật">
      Privacy Policy
    </FullScreenDialog>
  );
};
export default PrivacyPolicyDialog;
