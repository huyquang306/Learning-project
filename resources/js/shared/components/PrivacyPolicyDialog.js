/*
  プライバシーポリシーダイアログ
*/

import React from 'react';
import FullScreenDialog from 'js/shared/components/FullscreenDialog';

const PrivacyPolicyDialog = (props) => {
  return (
    <FullScreenDialog {...props} title="プライバシーポリシー">
      Privacy Policy
    </FullScreenDialog>
  );
};
export default PrivacyPolicyDialog;
