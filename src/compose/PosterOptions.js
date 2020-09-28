import React, {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
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
import {
  getLicenseText,
  getAccessText,
} from '../common/services/list-options.service';

const Touchable = Platform.select({
  ios: RNTouchableOpacity,
  android: TouchableOpacity,
});

const height = 83;

/**
 * Header
 */
const Header = (props) => (
  <View style={[styles.headerContainer, ThemedStyles.style.borderPrimary]}>
    <View
      style={[
        styles.header,
        ThemedStyles.style.backgroundSecondary,
        ThemedStyles.style.borderPrimary,
      ]}>
      <Text
        style={[
          ThemedStyles.style.fontXL,
          ThemedStyles.style.colorPrimaryText,
          ThemedStyles.style.textCenter,
          ThemedStyles.style.flexContainer,
          ThemedStyles.style.bold,
        ]}>
        {i18n.t('capture.postOptions')}
      </Text>
      <Text
        onPress={props.onPress}
        style={[
          ThemedStyles.style.fontL,
          ThemedStyles.style.colorSecondaryText,
          styles.close,
        ]}>
        {i18n.t('close')}
      </Text>
    </View>
  </View>
);

/**
 * Item
 */
const Item = (props) => {
  return (
    <Touchable
      style={[styles.row, ThemedStyles.style.borderPrimary]}
      onPress={props.onPress}
      testID={props.testID}>
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

export function useNavCallback(screen, store) {
  return useCallback(() => {
    NavigationService.navigate(screen, { store });
  }, [store, screen]);
}

/**
 * Options
 * @param {Object} props
 */
export default observer(
  forwardRef((props, ref) => {
    const theme = ThemedStyles.style;
    const store = props.store;
    // dereference observables to listen to his changes
    const nsfw = store.nsfw.slice();
    const tags = store.tags.slice();
    const time_created = store.time_created;
    const tokens = store.wire_threshold.min;
    const license = store.attachment.license;
    const hasAttachment = store.attachment.hasAttachment;
    const accessId = store.accessId;

    const keyboard = useKeyboard();
    const sheetRef = useRef();

    const onTagPress = useNavCallback('TagSelector', store);
    const onNsfwPress = useNavCallback('NsfwSelector', store);
    const onSchedulePress = useNavCallback('ScheduleSelector', store);
    const onMonetizePress = useNavCallback('MonetizeSelector', store);
    const onLicensePress = useNavCallback('LicenseSelector', store);
    const onPressVisibility = useNavCallback('AccessSelector', store);

    const localStore = useLocalStore(() => ({
      opened: false,
      setOpened(value) {
        localStore.opened = value;
      },
    }));

    const onHeaderPress = useCallback(() => {
      if (!sheetRef.current) return;
      if (localStore.opened) {
        // called twice as a workaround
        sheetRef.current.snapTo(0);
        sheetRef.current.snapTo(0);
      } else {
        sheetRef.current.snapTo(1);
        sheetRef.current.snapTo(1);
      }
    }, [localStore.opened]);

    const onOpenEnd = useCallback(() => {
      localStore.setOpened(true);
    }, [localStore]);

    const onCloseEnd = useCallback(() => {
      localStore.setOpened(false);
    }, [localStore]);

    useEffect(() => {
      if (keyboard.keyboardShown && sheetRef.current) {
        sheetRef.current.snapTo(0);
      }
    }, [keyboard.keyboardShown]);

    useImperativeHandle(ref, () => ({
      show: () => {
        sheetRef.current.snapTo(1);
        sheetRef.current.snapTo(1);
      },
    }));

    const showSchedule = props.store.isEdit ? time_created > Date.now() : true;

    const monetizeDesc = store.wire_threshold.support_tier?.urn
      ? store.wire_threshold.support_tier?.name || 'Plus'
      : '';

    const renderInner = () => (
      <View style={[theme.backgroundSecondary, theme.fullHeight]}>
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
        {showSchedule && (
          <Item
            title={i18n.t('capture.schedule')}
            description={
              time_created ? moment(time_created).calendar() : i18n.t('now')
            }
            onPress={onSchedulePress}
          />
        )}
        <Item
          title={i18n.t('monetize.title')}
          description={monetizeDesc}
          onPress={onMonetizePress}
          testID="monetizeButton"
        />
        {hasAttachment && (
          <Item
            title="License"
            description={getLicenseText(license)}
            onPress={onLicensePress}
          />
        )}
        {!store.group && (
          <Item
            title="Visibility"
            description={getAccessText(accessId)}
            onPress={onPressVisibility}
          />
        )}
      </View>
    );

    return (
      <BottomSheet
        ref={sheetRef}
        snapPoints={[0, 500]}
        renderContent={renderInner}
        enabledInnerScrolling={true}
        enabledContentTapInteraction={true}
        renderHeader={() => (
          <Header onPress={onHeaderPress} opened={localStore.opened} />
        )}
        style={[
          ThemedStyles.style.backgroundSecondary,
          // keyboard.keyboardShown
          //   ? { bottom: keyboard.keyboardHeight }
          //   : null,
        ]}
        onOpenEnd={onOpenEnd}
        onCloseEnd={onCloseEnd}
      />
    );
  }),
);

const styles = StyleSheet.create({
  headerContainer: {
    overflow: 'hidden',
    paddingTop: 20,
  },
  header: {
    height,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.0,
    elevation: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  close: {
    position: 'absolute',
    right: 20,
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
    height: 55,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
