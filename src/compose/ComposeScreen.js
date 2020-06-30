import React, { useCallback } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { useSafeArea } from 'react-native-safe-area-context';

import ThemedStyles from '../styles/ThemedStyles';
import Camera from './Camera';
import Poster from './Poster';
import useComposeStore from './useComposeStore';
import MediaConfirm from './MediaConfirm';
import i18nService from '../common/services/i18n.service';
import {
  CommonActions,
  useIsFocused,
  useFocusEffect,
} from '@react-navigation/native';
import { useLegacyStores } from '../common/hooks/use-stores';
import FloatingBackButton from '../common/components/FloatingBackButton';

/**
 * Compose Screen
 * @param {Object} props
 */
export default observer(function (props) {
  const store = useComposeStore(props);
  const insets = useSafeArea();
  const stores = useLegacyStores();
  const focused = useIsFocused();

  // on focus
  useFocusEffect(store.onScreenFocused);

  /**
   * On post
   */
  const onPost = useCallback(
    (entity, isEdit) => {
      const { goBack, dispatch } = props.navigation;
      const { params } = props.route;

      if (!isEdit) {
        stores.newsfeed.prepend(entity);
      }

      if (params && params.parentKey) {
        const routeParams = {
          prepend: isEdit ? undefined : entity,
        };

        if (params.group) {
          routeParams.group = params.group;
        }

        dispatch({
          ...CommonActions.setParams(routeParams),
          source: params.parentKey, // passed from index
        });
      }
      goBack(null);
      store.clear(false);
    },
    [props, stores, store],
  );

  const tabStyle = { paddingBottom: insets.bottom || 25 };

  const theme = ThemedStyles.style;
  const showCamera = store.mode === 'photo' || store.mode === 'video';

  return (
    <View style={theme.flexContainer}>
      {focused && <StatusBar animated={true} hidden={true} />}
      {showCamera ? (
        <>
          {focused ? (
            <Camera
              onMedia={store.onMedia}
              mode={store.mode}
              onForceVideo={store.setModeVideo}
              onMediaFromGallery={store.onMediaFromGallery}
            />
          ) : (
            <View style={theme.flexContainer} />
          )}
          <View
            style={[styles.tabContainer, theme.paddingVertical5x, tabStyle]}>
            <View style={styles.tabs}>
              <Text
                style={[
                  theme.fontXL,
                  theme.flexContainer,
                  theme.textCenter,
                  styles.tabText,
                  store.mode === 'photo' ? theme.colorIconActive : null,
                ]}
                onPress={store.setModePhoto}>
                {i18nService.t('capture.photo').toUpperCase()}
              </Text>
              <Text
                style={[
                  theme.fontXL,
                  theme.flexContainer,
                  theme.textCenter,
                  styles.tabText,
                  store.mode === 'video' ? theme.colorIconActive : null,
                ]}
                onPress={store.setModeVideo}>
                {i18nService.t('capture.video').toUpperCase()}
              </Text>
              <Text
                style={[
                  theme.fontXL,
                  theme.flexContainer,
                  theme.textCenter,
                  styles.tabText,
                  store.mode === 'text' ? theme.colorIconActive : null,
                ]}
                onPress={store.setModeText}>
                {i18nService.t('capture.text').toUpperCase()}
              </Text>
            </View>
          </View>
          <FloatingBackButton
            onPress={props.navigation.goBack}
            style={theme.colorWhite}
          />
        </>
      ) : store.mode === 'confirm' ? (
        <MediaConfirm store={store} />
      ) : (
        <Poster store={store} onPost={onPost} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingHorizontal: 50,
  },
  tabText: {
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
