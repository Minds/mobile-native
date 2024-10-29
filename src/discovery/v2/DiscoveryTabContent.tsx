import React from 'react';
import { Dimensions } from 'react-native';
import { MotiView } from 'moti';

import { observer } from 'mobx-react';
import { useDiscoveryV2Store } from './useDiscoveryV2Store';
import sp from '~/services/serviceProvider';

const { width } = Dimensions.get('window');

const transition: any = { type: 'timing', duration: 160 };
const animate = {
  opacity: 1,
  translateX: 0,
};

/**
 * Animated tab content
 * TODO: create a generic component to reuse in all the tabs
 */
const DiscoveryTabContent = observer(
  ({ children }: { children: React.ReactNode }) => {
    const store = useDiscoveryV2Store();
    const from = React.useMemo(
      () => ({
        opacity: 0.5,
        translateX:
          store.direction === -1 ? 0 : store.direction ? width : -width,
      }),
      [store.direction],
    );
    const exit = React.useMemo(
      () => ({
        opacity: 0,
        translateX: store.direction ? -width : width,
      }),
      [store.direction],
    );
    return (
      <MotiView
        from={from}
        animate={animate}
        exit={exit}
        transition={transition}
        style={sp.styles.style.positionAbsolute}>
        {children}
      </MotiView>
    );
  },
);

export default DiscoveryTabContent;
