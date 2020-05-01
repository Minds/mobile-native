import React from 'react';

import TopbarTabBarStore from './TopbarTabbarStore';

export const createStore = function () {
  return new TopbarTabBarStore();
};

export const storesContext = React.createContext(createStore());

export const useTopbarBarStore = () => {
  return React.useContext(storesContext);
};
