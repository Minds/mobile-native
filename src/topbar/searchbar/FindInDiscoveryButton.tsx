import React from 'react';
import ThemedStyles from '../../styles/ThemedStyles';
import { TouchableOpacity } from 'react-native';
import { SearchResultStoreType } from './createSearchResultStore';
import MText from '../../common/components/MText';

type PropsType = {
  showBorder?: boolean;
  localStore: SearchResultStoreType;
};

const FindInDiscoveryButton = ({ showBorder, localStore }: PropsType) => {
  const theme = ThemedStyles.style;
  const borders = showBorder
    ? [theme.borderTopHair, theme.bcolorPrimaryBorder]
    : [];
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => localStore.searchDiscovery()}
      style={[
        theme.flexColumnStretch,
        theme.paddingHorizontal4x,
        theme.paddingVertical2x,
        theme.marginBottom1x,
        ...borders,
      ]}>
      <MText style={theme.colorLink}>
        See results for{' '}
        <MText style={[theme.bold, theme.colorLink]}>{localStore.search}</MText>
      </MText>
    </TouchableOpacity>
  );
};

export default FindInDiscoveryButton;
