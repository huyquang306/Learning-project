import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

import ShopAuthService from 'js/shop/shop-auth-service';
import PageContainer from 'js/shared/components/PageContainer';
import HeaderAppBar from 'js/shop/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';

import PrivacyPolicyDialog from 'js/shared/components/PrivacyPolicyDialog';
import TermsOfServiceDialog from 'js/shared/components/TermsOfServiceDialog';

import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';

import StoreOutlinedIcon from '@material-ui/icons/StoreOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined';

const useStyles = makeStyles({
  listRoot: {
    backgroundColor: '#fff',
    '& .MuiListItem-button': {
      borderBottom: '1px solid #eee',
    },
  },
  listDivider: {
    backgroundColor: '#E35649',
    color: '#fff',
    padding: '5px 10px',
    fontSize: '12px',
    lineHeight: '14px',
  },
});

//
// PageSetting Component
//
const PageSetting = (props) => {
  const classes = useStyles(props);
  const history = useHistory();
  
  const [isOpenPP, setIsOpenPP] = useState(false);
  const [isOpenTerms, setIsOpenTerms] = useState(false);
  
  const subMenu = props.match.params.subMenu;
  const label = 'Setting : ' + (subMenu || 'Menu');

  return (
    <PageContainer padding="0px">
      <HeaderAppBar title={label} backButton={true} settingButton={false} />
      
      <PageInnerContainer backgroundColor="rgba(200,200,200,0.1)">
        <List component="nav" className={classes.listRoot} aria-label="contacts">
          {/* Divider */}
          <ListItem divider className={classes.listDivider}>
            Shop Information
          </ListItem>
          
          <ListItem
            button
            onClick={() => {
              alert('Alert');
            }}
          >
            <ListItemIcon>
              <StoreOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Shop Information" />
          </ListItem>
          
          <ListItem
            button
            onClick={() => {
              alert('Alert');
            }}
          >
            <ListItemIcon>
              <RoomOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Shop Location" />
          </ListItem>
          
          {/* <ListItem button> */}
          {/*   <ListItemIcon> */}
          {/*     <LockOutlinedIcon /> */}
          {/*   </ListItemIcon> */}
          {/*   <ListItemText primary="暗証番号" /> */}
          {/* </ListItem> */}
          
          {/* Divider */}
          <ListItem divider className={classes.listDivider}>
            Analysis
          </ListItem>
          
          <ListItem button onClick={() => history.push('/statistics')}>
            <ListItemIcon>
              <EqualizerOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Views Graph" />
          </ListItem>
          
          {/* Divider */}
          <ListItem divider className={classes.listDivider}>
            Others
          </ListItem>
          
          <Divider />
          <ListItem button onClick={() => setIsOpenPP(true)}>
            <ListItemText primary="Privacy Policy" />
          </ListItem>
          
          <ListItem button onClick={() => setIsOpenTerms(true)}>
            <ListItemText primary="Terms of Service" />
          </ListItem>
          
          <ListItem button onClick={() => ShopAuthService.signOut()}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </PageInnerContainer>
      
      <TermsOfServiceDialog isOpen={isOpenTerms} setIsOpen={setIsOpenTerms} />
      <PrivacyPolicyDialog isOpen={isOpenPP} setIsOpen={setIsOpenPP} />
    </PageContainer>
  );
};
// PropTypes
PageSetting.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subMenu: PropTypes.string,
    }),
  }).isRequired,
};
export default PageSetting;