import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { View, Text } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import type CommentsStore from './CommentsStore';
import ActivityIndicator from '../../common/components/ActivityIndicator';
import i18n from '../../common/services/i18n.service';
import { observer } from 'mobx-react';

/**
 * Load next/early comments
 */
export default observer(function LoadMore({
  store,
  next,
}: {
  store: CommentsStore;
  next?: boolean;
}) {
  const theme = ThemedStyles.style;

  const show = next
    ? store.loadNext && !store.loadingNext
    : store.loadPrevious && !store.loadingPrevious;

  const showIndicator = next
    ? store.loadingNext && store.loaded
    : store.loadingPrevious && store.loaded;

  return (
    <View>
      {show ? (
        <TouchableOpacity
          onPress={() => {
            store.loadComments(!next);
          }}
          style={[theme.rowJustifyCenter, theme.padding2x, theme.paddingTop4x]}>
          <Text style={[theme.fontM, theme.colorSecondaryText]}>
            <IconMC name="update" size={16} />{' '}
            {i18n.t(next ? 'activity.loadLater' : 'activity.loadEarlier')}{' '}
          </Text>
        </TouchableOpacity>
      ) : null}
      {showIndicator && (
        <ActivityIndicator size="small" style={theme.paddingTop2x} />
      )}
    </View>
  );
});
