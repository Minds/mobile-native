import React from 'react';
import ThemedStyles from '../../styles/ThemedStyles';
import { TouchableOpacity, Text } from 'react-native';
import { SearchResultStoreType } from './createSearchResultStore';

type PropsType = {
  showBorder?: boolean;
  localStore: SearchResultStoreType;
};

const FindInDiscoveryButton = ({ showBorder, localStore }: PropsType) => {
  const theme = ThemedStyles.style;
  const borders = showBorder ? [theme.borderTopHair, theme.borderPrimary] : [];
  return (
    <TouchableOpacity
      onPress={() => localStore.searchDiscovery()}
      style={[theme.flexColumnStretch, theme.padding3x, ...borders]}>
      <Text
        style={
          theme.colorSecondaryText
        }>{`SEARCH MINDS: ${localStore.search}`}</Text>
    </TouchableOpacity>
  );
};

export default FindInDiscoveryButton;
