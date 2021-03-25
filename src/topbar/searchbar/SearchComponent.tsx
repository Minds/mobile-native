import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  TextInput,
  TouchableHighlight,
  Text,
} from 'react-native';
import i18n from '../../common/services/i18n.service';
// import TextInput from '../common/components/TextInput';
import SearchResult from './SearchResultComponent';

import Modal from 'react-native-modal';
import ThemedStyles from '../../styles/ThemedStyles';
import { useLegacyStores, useStores } from '../../common/hooks/use-stores';
import { GOOGLE_PLAY_STORE } from '../../config/Config';
import DisabledStoreFeature from '../../common/components/DisabledStoreFeature';

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
