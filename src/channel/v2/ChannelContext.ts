import React from 'react';

/**
 * context of the channel page
 **/
export const ChannelContext = React.createContext({});

export const useChannelContext = () => {
  return React.useContext(ChannelContext);
};
