import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import type CommentsStore from './CommentsStore';
import ActivityIndicator from '../../common/components/ActivityIndicator';
import i18n from '../../common/services/i18n.service';
import { observer } from 'mobx-react';
import MText from '../../common/components/MText';

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

  const showIndicator = next ? store.loadingNext : store.loadingPrevious;

  return (
    <View>
      {show ? (
        <TouchableOpacity
          onPress={() => {
            store.loadComments(!next);
          }}
          style={[theme.rowJustifyCenter, theme.padding2x, theme.paddingTop4x]}>
          <MText style={[theme.fontM, theme.colorSecondaryText]}>
            <IconMC name="update" size={16} />{' '}
            {i18n.t(next ? 'activity.loadLater' : 'activity.loadEarlier')}{' '}
          </MText>
        </TouchableOpacity>
      ) : null}
      {showIndicator && (
        <ActivityIndicator size="small" style={theme.paddingTop2x} />
      )}
    </View>
  );
});
