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

/**
 * Nsfw Option
 * @param {Object} props
 */
const NsfwOption = props => {
  const onSelect = useCallback(() => {
    props.store.toggleNsfw(props.option.value);
  }, [props.store, props.option.value]);

  return (
    <TouchableOpacity
      style={[styles.optsRow, ThemedStyles.style.borderPrimary]}
      onPress={onSelect}>
      <Text
        style={[ThemedStyles.style.flexContainer, ThemedStyles.style.fontL]}>
        {props.option.label}
      </Text>
      {props.option.selected && (
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
 * NSFW selector
 */
export default observer(function(props) {
  const theme = ThemedStyles.style;
  const store = props.route.params.store;

  const options = _.times(7, i => ({
    value: i,
    selected: i === 0 ? store.nsfw.length === 0 : store.nsfw.some(o => i === o),
    label: i18n.t(`nsfw.${i}`),
  }));

  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <TopBar
        leftText="NSFW"
        rightText={i18n.t('done')}
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
        store={store}
      />
      <Text
        style={[
          theme.paddingVertical3x,
          theme.colorSecondaryText,
          theme.fontL,
          theme.paddingHorizontal3x,
        ]}>
        {i18n.t('nsfw.description1') + '\n\n' + i18n.t('nsfw.description2')}
      </Text>

      <ScrollView style={styles.body}>
        <Text
          style={[
            theme.paddingVertical4x,
            theme.colorTertiaryText,
            theme.fontM,
            theme.paddingHorizontal3x,
          ]}>
          {i18n.t('nsfw.safe').toUpperCase()}
        </Text>
        <View style={styles.optsContainer}>
          <NsfwOption option={options[0]} store={store} />
        </View>
        <Text
          style={[
            theme.paddingVertical4x,
            theme.colorTertiaryText,
            theme.fontM,
            theme.paddingHorizontal3x,
          ]}>
          {i18n.t('nsfw.categories').toUpperCase()}
        </Text>
        <View style={styles.optsContainer}>
          {options.slice(1).map(o => (
            <NsfwOption option={o} store={store} />
          ))}
        </View>
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
