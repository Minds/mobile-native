import React, { useCallback, useMemo } from 'react';
import times from 'lodash/times';
import { ScrollView, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import ThemedStyles from '../../styles/ThemedStyles';
import TopBar from '../TopBar';
import i18n from '../../common/services/i18n.service';
import NavigationService from '../../navigation/NavigationService';
import MText from '../../common/components/MText';
import { useComposeContext } from '~/compose/useComposeStore';
import MenuItemOption from '../../common/components/menus/MenuItemOption';
import { showNotification } from 'AppMessages';
import { IS_FROM_STORE } from '~/config/Config';

/**
 * Nsfw Option
 * @param {Object} props
 */
const NsfwOption = props => {
  const onSelect = useCallback(() => {
    if (IS_FROM_STORE && props.option.value > 0) {
      return showNotification(
        'Posting and viewing NSFW content on this version of the app is not supported',
        'danger',
      );
    }
    props.store.toggleNsfw(props.option.value);
  }, [props.store, props.option.value]);

  return (
    <MenuItemOption
      title={props.option.label}
      selected={props.option.selected}
      onPress={onSelect}
    />
  );
};

/**
 * NSFW selector
 */
export default observer(function () {
  const store = useComposeContext();
  const length = store.nsfw.length;
  const options = useMemo(
    () =>
      times(7, ((i: 0 | 1 | 2 | 3 | 4 | 5 | 6) => ({
        value: i,
        selected: i === 0 ? length === 0 : store.nsfw.some(o => i === o),
        label: i18n.t(`nsfw.${i}`),
      })) as any),
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
          {options.slice(1).map((o, index) => (
            <NsfwOption key={index} option={o} store={store} />
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
