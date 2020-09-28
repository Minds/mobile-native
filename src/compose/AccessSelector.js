import React, { useCallback } from 'react';
import _ from 'lodash';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { observer } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';
import TopBar from './TopBar';
import i18n from '../common/services/i18n.service';
import NavigationService from '../navigation/NavigationService';
import { ACCESS } from '../common/services/list-options.service';

/**
 * Option
 * @param {Object} props
 */
const Option = (props) => {
  const onSelect = useCallback(() => {
    props.store.setAccessId(props.option.value);
  }, [props.store, props.option.value]);

  return (
    <TouchableOpacity
      style={[styles.optsRow, ThemedStyles.style.borderPrimary]}
      onPress={onSelect}>
      <Text
        style={[ThemedStyles.style.flexContainer, ThemedStyles.style.fontL]}>
        {props.option.text}
      </Text>
      {props.selected && (
        <MIcon
          name="check"
          size={23}
          style={ThemedStyles.style.colorPrimaryText}
        />
      )}
    </TouchableOpacity>
  );
};

/**
 * License selector
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;
  const store = props.route.params.store;

  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <TopBar
        leftText={i18n.t('visibility')}
        rightText={i18n.t('done')}
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
        store={store}
      />
      <ScrollView style={styles.body}>
        {ACCESS.map((o) => (
          <Option
            option={o}
            store={store}
            selected={store.accessId === o.value}
          />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  optsContainer: {
    marginBottom: 10,
  },
  optsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
