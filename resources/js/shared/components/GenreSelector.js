/*
 *
 * genre selector
 *
 */

import React, { useState, useEffect } from 'react';
import CustomSelectorBase from './CustomSelectorBase';

// service
import ShopApiService, { ENDPOINTS } from 'js/shop/shop-api-service';

const GenreSelector = (props) => {
  const [genreList, setGenreList] = useState([{ value: '-', label: 'Please select' }]);
  
  useEffect(() => {
    ShopApiService.request(ENDPOINTS.GET_GENRE, null, null).then((result) => {
      console.debug('[app] api response', result);
      const list = result.map((item) => ({
        value: item.code,
        label: item.name,
      }));
      setGenreList((prev) => [...prev, ...list]);
    });
  }, []);
  
  return <CustomSelectorBase optionArray={genreList} {...props} />;
};
GenreSelector.propTypes = {};

export default GenreSelector;
