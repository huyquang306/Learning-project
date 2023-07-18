import React from 'react';
import FullScreenDialog from 'js/shared/components/FullscreenDialog';

const TermsOfServiceDialog = (props) => {
  return (
    <FullScreenDialog {...props} title="Điều khoản dịch vụ">
      Terms of service
    </FullScreenDialog>
  );
};

export default TermsOfServiceDialog;
