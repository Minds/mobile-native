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

type WithChannel = {
  channel?: UserModel;
};

export function withChannelContext<T extends WithChannel>(
  WrappedComponent: React.ComponentType<T>,
) {
  return React.forwardRef<any, Omit<T, keyof WithChannel>>((props, ref) => (
    <ChannelContext.Consumer>
      {({ channel }) => (
        <WrappedComponent {...(props as any)} channel={channel} ref={ref} />
      )}
    </ChannelContext.Consumer>
  ));
}
