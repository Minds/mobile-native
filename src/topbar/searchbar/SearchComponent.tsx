import React from 'react';
import { observer } from 'mobx-react';

import { View, TouchableHighlight, Text } from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
interface Props {
  navigation: any;
}

const SearchComponent = observer((props: Props) => {
  const theme = ThemedStyles.style;

  return (
    <TouchableHighlight
      style={theme.flexContainer}
      onPress={() => props.navigation.navigate('SearchScreen')}
      underlayColor="transparent">
      <View>
        <Text
          style={[
            theme.fontL,
            theme.colorSecondaryText,
            theme.paddingLeft3x,
            theme.fullWidth,
            theme.paddingVertical2x,
          ]}>
          {i18n.t('searchBar.title')}
        </Text>
      </View>
    </TouchableHighlight>
  );
});

export default SearchComponent;
