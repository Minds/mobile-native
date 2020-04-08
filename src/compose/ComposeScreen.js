import React, { useCallback } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { useSafeArea } from 'react-native-safe-area-context';

import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';
import Camera from './Camera';
import Poster from './Poster';
import useComposeStore from './useComposeStore';
import MediaConfirm from './MediaConfirm';
import i18nService from '../common/services/i18n.service';
import { CommonActions } from '@react-navigation/native';
import { useStores } from '../../AppStores';
import { useBackHandler } from '@react-native-community/hooks';

/**
 * Compose Screen
 * @param {Object} props
 */
export default observer(function(props) {
  const store = useComposeStore(props);
  const insets = useSafeArea();
  const stores = useStores();

  const goBackHandler = useCallback(() => {
    const { goBack, reset } = props.navigation;

    // go back if there is history
    if (props.navigation.dangerouslyGetState().index > 0) {
      goBack();
    } else {
      // reset navigation to tabs otherway
      reset({
        index: 0,
        routes: [{ name: 'Tabs' }],
      });
    }
  }, [props.navigation]);

  useBackHandler(() => {
    goBackHandler();
    return true;
  });

  /**
   * On post
   */
  const onPost = useCallback(
    entity => {
      const { goBack, dispatch } = props.navigation;
      const { params } = props.route;

      stores.newsfeed.prepend(entity);

      if (params && params.parentKey) {
        const routeParams = {
          prepend: entity,
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
    },
    [props, stores],
  );

  const tabStyle = { paddingBottom: insets.bottom || 25 };
  const inconStyle = { top: insets.top || 5 };

  const theme = ThemedStyles.style;
  const showCamera = store.mode === 'photo' || store.mode === 'video';

  return (
    <View style={theme.flexContainer}>
      <StatusBar animated={true} hidden={true} />
      {showCamera ? (
        <>
          <Camera
            onMedia={store.onMedia}
            mode={store.mode}
            onMediaFromGallery={store.onMediaFromGallery}
          />
          <View
            style={[
              styles.tabContainer,
              theme.backgroundSecondary,
              theme.paddingVertical5x,
              tabStyle,
            ]}>
            <View style={styles.tabs}>
              <Text
                style={[
                  theme.fontXL,
                  theme.flexContainer,
                  theme.textCenter,
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
                  store.mode === 'text' ? theme.colorIconActive : null,
                ]}
                onPress={store.setModeText}>
                {i18nService.t('capture.text').toUpperCase()}
              </Text>
            </View>
          </View>
          <MIcon
            size={45}
            name="chevron-left"
            style={[styles.backIcon, inconStyle]}
            onPress={goBackHandler}
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
    paddingHorizontal: 50,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backIcon: {
    position: 'absolute',
    color: 'white',
    left: 0,
    shadowOpacity: 0.4,
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});
