import React from 'react';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import ModalActionIsNotAuthority from 'js/utils/components/Payment/ModalActionIsNotAuthority';

const PageNotAuthorityPlan = () => {
  
  return (
    <PageContainer padding='0px'>
      <HeaderAppBar title='Not Authority' />
      <PageInnerContainer padding={'8px 16px'}>
        <ModalActionIsNotAuthority
          open={true}
        />
      </PageInnerContainer>
    </PageContainer>
  );
};

PageNotAuthorityPlan.propTypes = {};
export default PageNotAuthorityPlan;
