import React from 'react';
import PubSub from 'pubsub-js';
import { PUB_SUB_KEY } from './const';

const socket = React.createRef();
let shopHashIdSelected = null;

const closeCurrentSocket = () => {
  if (socket?.current) {
    shopHashIdSelected = null;
    socket?.current?.close();
  }
};

export {
  closeCurrentSocket,
};
