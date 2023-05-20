import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {ON_BOARDING_CONFIG} from 'js/utils/helpers/const';

const useOnboardingScript = ({ shopInfo, userGroupId, userGroupName }) => {
  useEffect(() => {
    const ignitionUrl = process.env.MIX_IGNITION_URL;
    const scriptTag = document.createElement('script');
    
    if (!ignitionUrl) {
      return;
    }
    
    scriptTag.text = `var userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('msie') === -1 && userAgent.indexOf('trident') === -1) {
      var ONB = ONB || {};
      ONB.ignition_url = '${ignitionUrl}';
      
      // Custom Area Start=====================
      ONB._queryparam = {
        user_id: '${shopInfo?.hashId}',
        user_name: '${shopInfo?.name}',
        user_group_id: '${userGroupId}',
        user_group_name: '${userGroupName}',
      };
      ONB.black_list = ['Onboardingを除外したいパスをカンマ区切りで指定'];
      ONB._custom_functions = {
        // "Onboardingイベント名" : "お客様CallBack関数"
        ready: 'callback関数名',
        intro_displayed: 'callback関数名',
        goal_started: 'callback関数名',
        step_displayed: 'callback関数名',
        step_forwarded: 'callback関数名',
        step_aborted: 'callback関数名',
        goal_completed: 'callback関数名',
        hint_displayed: 'callback関数名',
        hint_hidden: 'callback関数名',
      };

      // Custom Area End======================
      ONB.embed = function () {
        for (ONB.item in ONB._queryparam) {
          ONB.ignition_url += '&' + ONB.item + '=' + encodeURIComponent(ONB._queryparam[ONB.item]);
        }
        for (ONB.d = 0; ONB.d < ONB.black_list.length; ONB.d++) {
          if (location.href.indexOf(ONB.black_list[ONB.d]) != -1) {
            return;
          }
        }
        if (Object.keys(ONB._custom_functions).length > 0) {
          ONB.ignition_url +=
            '&custom_functions=' + encodeURIComponent(JSON.stringify(ONB._custom_functions));
        }
        (ONB.b = document.createElement('script')),
          (ONB.c = document.getElementsByTagName('head')[0]);
        ONB.b.src = ONB.ignition_url;
        ONB.b.id = 'stands_onbd_point';
        ONB.b.charset = 'utf-8';
        ONB.b.async = 'async';
        ONB.c.appendChild(ONB.b);
      };
      ONB.embed();
    }`;
    scriptTag.async = true;
    scriptTag.type = 'text/javascript';
    
    if (shopInfo?.hashId) {
      document.body.appendChild(scriptTag);
      
      return () => {
        document.body.removeChild(scriptTag);
      };
    }
  }, [shopInfo]);
  
  return <></>;
};

// PropTypes
useOnboardingScript.propTypes = {
  shopInfo: PropTypes.object,
  userGroupId: PropTypes.string,
  userGroupName: PropTypes.string,
};

// defaultProps
useOnboardingScript.defaultProps = {
  shopInfo: {},
  userGroupId: ON_BOARDING_CONFIG.USER_GROUP_ID.SHOP,
  userGroupName: ON_BOARDING_CONFIG.USER_GROUP_NAME.SHOP,
};

export default useOnboardingScript;
