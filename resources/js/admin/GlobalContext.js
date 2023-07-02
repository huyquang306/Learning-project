import { createContext } from 'react';

const globalDataDefault = {
  isAuthenticated: true,
  toast: {
    isShow: false,
    message: '',
    status: 'success',
  },
};

const pageReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'UPDATE_TOAST': {
      const {isShow = false, message = '', status = 'warning'} = payload;

      return {
        ...state,
        toast: {isShow, message, status},
      };
    }

    default: return {...state};
  }
};

const GlobalContext = createContext(globalDataDefault);

export {globalDataDefault, pageReducer};
export default GlobalContext;
