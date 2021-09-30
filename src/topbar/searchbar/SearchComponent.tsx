import React from 'react';
import { observer } from 'mobx-react';

import { View, TouchableHighlight } from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import MText from '../../common/components/MText';
interface Props {
  navigation: any;
}

const SearchComponent = observer((props: Props) => {
  const theme = ThemedStyles.style;

  return (
    <TouchableHighlight
      style={theme.flexContainer}
      onPress={() => props.navigation.navigate('SearchScreen')}
      underlayColor="transparent"
    >
      <View>
        <MText
          style={[
            theme.fontL,
            theme.colorSecondaryText,
            theme.paddingLeft3x,
            theme.fullWidth,
            theme.paddingVertical2x,
          ]}
        >
          {i18n.t('searchBar.title')}
        </MText>
      </View>
    </TouchableHighlight>
  );
});

export default SearchComponent;
