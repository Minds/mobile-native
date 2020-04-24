import React, { useEffect } from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { autorun } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import { View } from 'react-native';

import SmartImage from './SmartImage';
import connectivityService from '../services/connectivity.service';
import ThemedStyles from '../../styles/ThemedStyles';

/**
 * Fast-image wrapper with retry and connectivity awareness
 * @param {Object} props
 */
export default observer(function (props) {
  const { onError, ...otherProps } = props;

  const store = useLocalStore(() => ({
    error: false,
    retries: 0,
    setError(error) {
      store.error = true;

      if (props.onError) {
        props.onError(error);
      }
    },
    clearError() {
      store.error = false;
    },
    retry() {
      store.error = false;
      store.retries++;
    },
  }));

  useEffect(
    () =>
      autorun(() => {
        if (connectivityService.isConnected && store.error) {
          store.retry();
        }
      }),
    [store],
  );

  if (store.error) {
    return (
      <View style={[props.style, ThemedStyles.style.centered]}>
        <Icon
          name="wifi-off"
          size={props.size || 24}
          style={ThemedStyles.style.colorTertiaryText}
        />
      </View>
    );
  }

  return (
    <SmartImage
      key={store.retries}
      onError={store.setError}
      {...otherProps}
      retry={2}
    />
  );
});
