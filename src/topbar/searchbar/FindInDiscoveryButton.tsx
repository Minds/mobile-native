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
      onPress={() => localStore.searchDiscovery()}
      style={[theme.flexColumnStretch, theme.padding3x, ...borders]}
    >
      <MText
        style={theme.colorSecondaryText}
      >{`SEARCH MINDS: ${localStore.search}`}</MText>
    </TouchableOpacity>
  );
};

export default FindInDiscoveryButton;
