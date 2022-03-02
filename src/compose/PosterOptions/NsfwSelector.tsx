import React, { FC, useCallback, useMemo } from 'react';
import _ from 'lodash';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../../styles/ThemedStyles';
import TopBar from '../TopBar';
import i18n from '../../common/services/i18n.service';
import NavigationService from '../../navigation/NavigationService';
import MText from '../../common/components/MText';
import { StackScreenProps } from '@react-navigation/stack';
import { PosterStackParamList } from '~/compose/PosterOptions/PosterStackNavigator';
import { useComposeContext } from '~/compose/useComposeStore';

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
      style={[styles.optsRow, ThemedStyles.style.bcolorPrimaryBorder]}
      onPress={onSelect}>
      <MText
        style={[ThemedStyles.style.flexContainer, ThemedStyles.style.fontL]}>
        {props.option.label}
      </MText>
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

interface NsfwProps
  extends FC,
    StackScreenProps<PosterStackParamList, 'NsfwSelector'> {}

/**
 * NSFW selector
 */
export default observer(function ({}: NsfwProps) {
  const store = useComposeContext();
  const length = store.nsfw.length;
  const options = useMemo(
    () =>
      _.times(7, i => ({
        value: i,
        selected: i === 0 ? length === 0 : store.nsfw.some(o => i === o),
        label: i18n.t(`nsfw.${i}`),
      })),
    [store.nsfw, length],
  );

  return (
    <View style={styles.container}>
      <TopBar
        leftText="NSFW"
        rightText={i18n.t('done')}
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
        backIconName="chevron-left"
        backIconSize="large"
        store={store}
      />
      <ScrollView>
        <MText style={styles.descStyle}>
          {i18n.t('nsfw.description1') + '\n\n' + i18n.t('nsfw.description2')}
        </MText>

        <MText style={styles.textStyle}>
          {i18n.t('nsfw.safe').toUpperCase()}
        </MText>
        <View style={styles.optsContainer}>
          <NsfwOption option={options[0]} store={store} />
        </View>
        <MText style={styles.textStyle}>
          {i18n.t('nsfw.categories').toUpperCase()}
        </MText>
        <View style={styles.optsContainer}>
          {options.slice(1).map(o => (
            <NsfwOption option={o} store={store} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
});

const styles = ThemedStyles.create({
  container: ['flexContainer', 'bgPrimaryBackground'],
  optsContainer: {
    marginBottom: 10,
  },
  optsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    minHeight: 55,
  },
  descStyle: [
    'paddingVertical3x',
    'colorTertiaryText',
    'fontL',
    'paddingHorizontal3x',
  ],
  textStyle: [
    'paddingVertical4x',
    'colorTertiaryText',
    'fontM',
    'paddingHorizontal3x',
  ],
});
