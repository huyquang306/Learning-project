import React from 'react';
import FullScreenDialog from 'js/shared/components/FullscreenDialog';

const TermsOfServiceDialog = (props) => {
  return (
    <FullScreenDialog {...props} title="利用規約">
      Terms of service
    </FullScreenDialog>
  );
};

export default TermsOfServiceDialog;
