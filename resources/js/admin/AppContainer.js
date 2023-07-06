import React, {useReducer} from 'react';
import GlobalContext, {globalDataDefault, pageReducer} from 'js/admin/GlobalContext';

// style
import 'css/admin-style.css';

// Page Components
import Routers from 'js/admin/Routers';
import FlashMessage from 'js/shared-order/components/FlashMessage';

const AppContainer = () => {
  // Store
  const [state, dispatch] = useReducer(pageReducer, globalDataDefault);

  return (
    <GlobalContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <Routers/>
      <FlashMessage
        isOpen={state.toast.isShow}
        onClose={
          () => {
            dispatch({
              type: 'UPDATE_TOAST',
              payload: {
                ...state.toast,
                isShow: false,
              },
            })
          }
        }
        status={state.toast.status}
        message={state.toast.message}
      />
    </GlobalContext.Provider>
  )
};

export default AppContainer;
