/*
 * Obento-R 規約モーダル（非利用になったが念の為残す：2022/08/22）
 */

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

// Material-UI
import { Box, Container, Checkbox, Link } from '@material-ui/core';
import Modal from 'js/shared/components/Modal';
import Button from 'js/shared/components/Button';

// Dialogs
import PrivacyPolicyDialog from 'js/shared/components/PrivacyPolicyDialog';
import TermsOfServiceDialog from 'js/shared/components/TermsOfServiceDialog';

const AgreementModal = (props) => {
  // history
  const history = useHistory();
  // modal state
  const [modalOpen, setModalOpen] = useState(props.open);
  // button state
  const [isAgreeDisabled, setIsAgreeDisabled] = useState(true);
  // checkbox state
  const [isChecked, setIsChecked] = useState({
    term: false,
    privacy: false,
  });
  // dialogs state
  const [isOpenPP, setIsOpenPP] = useState(false);
  const [isOpenTerms, setIsOpenTerms] = useState(false);

  // button handler
  const handleClickAgree = (_event) => {
    setModalOpen(false);
  };
  const handleClickDisagree = (_event) => {
    setModalOpen(false);
    history.push('/');
  };

  // checkbox handler
  const handleChangeCheckbox = (event) => {
    const target = event.target;
    check(target.name, target.checked);
  };
  const check = (name, isChecked) => {
    setIsChecked((prev) => {
      const current = { ...prev };
      current[name] = isChecked;
      return current;
    });
  };

  // isChecked に連動して同意ボタン状態変化
  useEffect(() => {
    const isCheckComplete = Object.keys(isChecked).reduce((isComp, key) => {
      return isComp && isChecked[key];
    }, true);
    setIsAgreeDisabled(!isCheckComplete);
  }, [isChecked]);

  // render
  return (
    <>
      <Modal open={modalOpen}>
        本サービスをご利用いただくにあたり、利用規約とプライバシーポリシーに同意いただく必要がございます。
        <Container>
          <Checkbox
            name="term"
            color="default"
            onChange={handleChangeCheckbox}
            checked={isChecked.term}
          />
          <Link
            href="#"
            onClick={() => {
              setIsOpenTerms(true);
              check('term', true);
            }}
          >
            利用規約
          </Link>
          <br />
          <Checkbox
            name="privacy"
            color="default"
            onChange={handleChangeCheckbox}
            checked={isChecked.privacy}
          />
          <Link
            href="#"
            onClick={() => {
              setIsOpenPP(true);
              check('privacy', true);
            }}
          >
            プライバシーポリシー
          </Link>
        </Container>
        <Box textAlign="center">
          <Button
            title="同意しない"
            padding="8px 20px"
            bgcolor="#E35649"
            onClick={handleClickDisagree}
          />
          <Button
            title="同意する"
            padding="8px 20px"
            onClick={handleClickAgree}
            disabled={isAgreeDisabled}
          />
        </Box>
      </Modal>

      {/* 規約・プライバシポリシー */}
      <TermsOfServiceDialog isOpen={isOpenTerms} setIsOpen={setIsOpenTerms} />
      <PrivacyPolicyDialog isOpen={isOpenPP} setIsOpen={setIsOpenPP} />
    </>
  );
};
AgreementModal.propTypes = {
  open: PropTypes.bool,
};
AgreementModal.defaultProps = {
  open: true,
};
export default AgreementModal;
