import React from 'react';
import PubSub from 'pubsub-js';
import { PUB_SUB_KEY } from './const';

const socket = React.createRef();
let shopHashIdSelected = null;

const onConnectWebSocket = (shopHashId) => {
  shopHashIdSelected = shopHashId;
  
  if (socket?.current?.readyState !== WebSocket.OPEN && shopHashIdSelected) {
    socket.current = new WebSocket(process.env.MIX_AWS_WEBSOCKET_URL);
    socket.current.addEventListener('open', onSocketOpen);
    socket.current.addEventListener('close', onSocketClose);
    socket.current.addEventListener('message', (event) => {
      onSocketMessage(event.data);
    });
  }
};

const onSocketOpen = () => {
  socket?.current?.send(
    JSON.stringify({
      action: 'setShopOrder',
      shopHashId: shopHashIdSelected,
    })
  );
};

const onSocketClose = () => {
  socket?.current?.close();
  // Socket is closed. Reconnect will be attempted in 1 second
  setTimeout(() => {
    onConnectWebSocket(shopHashIdSelected);
  }, 1000);
};

const closeCurrentSocket = () => {
  if (socket?.current) {
    shopHashIdSelected = null;
    socket?.current?.close();
  }
};

const onSendNotifyHasNewOrder = (to) => {
  const message = 'This shop has new order';
  socket?.current?.send(
    JSON.stringify({
      action: 'updateNewOrder',
      message,
      to,
    })
  );
};

const onSendNotifyCustomerRequestCheckout = (to) => {
  const message = 'Customer request checkout';
  socket?.current?.send(
    JSON.stringify({
      action: 'customerRequestCheckout',
      message,
      to,
    })
  );
};

const onSocketMessage = (dataMessage) => {
  const data = JSON.parse(dataMessage);
  if (data?.updateNewOrderNotifyMessage) {
    PubSub.publish(PUB_SUB_KEY.KEY_FRESH_NEW_ORDER, data);
  } else if (data?.customerRequestCheckout) {
    PubSub.publish(PUB_SUB_KEY.KEY_FRESH_UPDATE_ORDER, data);
    PubSub.publish(PUB_SUB_KEY.RING_ALARM, data);
  }
};

export {
  onConnectWebSocket,
  onSendNotifyHasNewOrder,
  onSendNotifyCustomerRequestCheckout,
  closeCurrentSocket,
}

