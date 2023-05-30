import React from 'react';
import UserModel from '~/channel/UserModel';

export type ChannelContextType = {
  channel?: UserModel;
};
/**
 * context of the channel page
 **/
export const ChannelContext = React.createContext<ChannelContextType>({});

export const useChannelContext = () => {
  return React.useContext(ChannelContext);
};

export function withChannelContext<T>(
  WrappedComponent: React.ComponentType<T>,
) {
  return React.forwardRef((props: T, ref: React.Ref<T>) => (
    <ChannelContext.Consumer>
      {({ channel }) => (
        <WrappedComponent {...props} channel={channel} ref={ref} />
      )}
    </ChannelContext.Consumer>
  ));
}
