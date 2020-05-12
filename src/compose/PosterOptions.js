import React, { useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity as RNTouchableOpacity,
  Platform,
} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useKeyboard } from '@react-native-community/hooks';
import BottomSheet from 'reanimated-bottom-sheet';
import { observer, useLocalStore } from 'mobx-react';
import moment from 'moment';

import ThemedStyles from '../styles/ThemedStyles';
import NavigationService from '../navigation/NavigationService';
import i18n from '../common/services/i18n.service';
import { getLicenseText } from '../common/services/list-options.service';

const Touchable = Platform.select({
  ios: RNTouchableOpacity,
  android: TouchableOpacity,
});

const height = Platform.select({ android: 80, ios: 90 });

/**
 * Header
 */
const Header = (props) => (
  <Touchable
    onPress={props.onPress}
    style={[
      styles.header,
      ThemedStyles.style.backgroundPrimary,
      ThemedStyles.style.borderPrimary,
    ]}>
    <Text
      style={[ThemedStyles.style.fontL, ThemedStyles.style.colorSecondaryText]}>
      POST OPTIONS
    </Text>
    <MIcon
      size={24}
      name={props.opened ? 'chevron-down' : 'chevron-right'}
      style={ThemedStyles.style.colorSecondaryText}
    />
  </Touchable>
);

/**
 * Item
 */
const Item = (props) => {
  return (
    <Touchable
      style={[styles.row, ThemedStyles.style.borderPrimary]}
      onPress={props.onPress}>
      <Text style={[styles.optionTitle, ThemedStyles.style.colorSecondaryText]}>
        {props.title}
      </Text>
      <Text style={styles.optionDescription} numberOfLines={1}>
        {props.description}
      </Text>
      <MIcon
        size={20}
        name="chevron-right"
        style={ThemedStyles.style.colorIcon}
      />
    </Touchable>
  );
};

function useNavCallback(screen, props) {
  return useCallback(() => {
    NavigationService.navigate(screen, { store: props.store });
  }, [props.store, screen]);
}

/**
 * Options
 * @param {Object} props
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;
  // dereference observables to listen to his changes
  const nsfw = props.store.nsfw.slice();
  const tags = props.store.tags;
  const time_created = props.store.time_created;
  const tokens = props.store.wire_threshold.min;
  const license = props.store.attachment.license;
  const hasAttachment = props.store.attachment.hasAttachment;

  const keyboard = useKeyboard();
  const ref = useRef();

  const onTagPress = useNavCallback('TagSelector', props);
  const onNsfwPress = useNavCallback('NsfwSelector', props);
  const onSchedulePress = useNavCallback('ScheduleSelector', props);
  const onMonetizePress = useNavCallback('MonetizeSelector', props);
  const onLicensePress = useNavCallback('LicenseSelector', props);

  const localStore = useLocalStore(() => ({
    opened: false,
    setOpened(value) {
      localStore.opened = value;
    },
  }));

  const onHeaderPress = useCallback(() => {
    if (localStore.opened) {
      // called twice as a workaround
      ref.current.snapTo(0);
      ref.current.snapTo(0);
    } else {
      ref.current.snapTo(1);
      ref.current.snapTo(1);
    }
  }, [localStore.opened]);

  const onOpenEnd = useCallback(() => {
    localStore.setOpened(true);
  }, [localStore]);

  const onCloseEnd = useCallback(() => {
    localStore.setOpened(false);
  }, [localStore]);

  useEffect(() => {
    if (keyboard.keyboardShown) {
      ref.current.snapTo(0);
    }
  }, [keyboard.keyboardShown]);

  const renderInner = () => (
    <View style={[theme.backgroundPrimary, theme.fullHeight]}>
      <Item
        title="Tag"
        description={tags.slice(0, 4).map((t) => `#${t} `)}
        onPress={onTagPress}
      />
      <Item
        title={i18n.t('nsfw.button')}
        description={
          nsfw.length !== 0 ? i18n.t('nsfw.notSafe') : i18n.t('nsfw.safe')
        }
        onPress={onNsfwPress}
      />
      <Item
        title={i18n.t('capture.schedule')}
        description={
          time_created ? moment(time_created).calendar() : i18n.t('now')
        }
        onPress={onSchedulePress}
      />
      <Item
        title={i18n.t('monetize')}
        description={
          tokens ? `${tokens} ${i18n.t('tokens').toLowerCase()} +` : ''
        }
        onPress={onMonetizePress}
      />
      {hasAttachment && (
        <Item
          title="License"
          description={getLicenseText(license)}
          onPress={onLicensePress}
        />
      )}
      {/* <Item
          title="Visibility"
          description="Public"
          onPress={onMonetizePress}
        /> */}
    </View>
  );

  return (
    <BottomSheet
      ref={ref}
      snapPoints={[height, 450]}
      renderContent={renderInner}
      renderHeader={() => (
        <Header onPress={onHeaderPress} opened={localStore.opened} />
      )}
      enabledInnerScrolling={true}
      enabledContentTapInteraction={true}
      style={ThemedStyles.style.backgroundPrimary}
      onOpenEnd={onOpenEnd}
      onCloseEnd={onCloseEnd}
    />
  );
});

const styles = StyleSheet.create({
  header: {
    height,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 10,
    paddingBottom: Platform.select({ ios: 30, android: 20 }),
  },
  optionTitle: {
    width: '40%',
    fontSize: 16,
  },
  optionDescription: {
    flex: 1,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
