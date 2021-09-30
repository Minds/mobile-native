import React, {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity as RNTouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useKeyboard } from '@react-native-community/hooks';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import moment from 'moment';

import ThemedStyles from '../styles/ThemedStyles';
import NavigationService from '../navigation/NavigationService';
import i18n from '../common/services/i18n.service';
import {
  getLicenseText,
  getAccessText,
} from '../common/services/list-options.service';
import featuresService from '../common/services/features.service';
import MText from '../common/components/MText';

const Touchable = Platform.select({
  ios: RNTouchableOpacity,
  android: TouchableOpacity,
});

const height = 83;

/**
 * Header
 */
const Header = props => (
  <View
    style={[styles.headerContainer, ThemedStyles.style.bcolorPrimaryBorder]}
  >
    <View
      style={[
        styles.header,
        ThemedStyles.style.bgSecondaryBackground,
        ThemedStyles.style.bcolorPrimaryBorder,
      ]}
    >
      <MText
        style={[
          ThemedStyles.style.fontXL,
          ThemedStyles.style.colorPrimaryText,
          ThemedStyles.style.textCenter,
          ThemedStyles.style.flexContainer,
          ThemedStyles.style.bold,
        ]}
      >
        {i18n.t('capture.postOptions')}
      </MText>
      <MText
        onPress={props.onPress}
        style={[
          ThemedStyles.style.fontL,
          ThemedStyles.style.colorSecondaryText,
          styles.close,
        ]}
      >
        {i18n.t('close')}
      </MText>
    </View>
  </View>
);

/**
 * Item
 */
const Item = props => {
  return (
    <Touchable
      style={[styles.row, ThemedStyles.style.bcolorPrimaryBorder]}
      onPress={props.onPress}
      testID={props.testID}
    >
      <MText
        style={[styles.optionTitle, ThemedStyles.style.colorSecondaryText]}
      >
        {props.title}
      </MText>
      <MText style={styles.optionDescription} numberOfLines={1}>
        {props.description}
      </MText>
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

const windowHeight = Dimensions.get('window').height;
const snapPoints = [550];

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
    const onPermawebPress = useNavCallback('PermawebSelector', store);
    const onMonetizePress = useNavCallback('MonetizeSelector', store);
    const onLicensePress = useNavCallback('LicenseSelector', store);
    const onPressVisibility = useNavCallback('AccessSelector', store);

    const onHeaderPress = useCallback(() => {
      if (!sheetRef.current) return;
      sheetRef.current.close();
    }, []);

    useEffect(() => {
      if (keyboard.keyboardShown && sheetRef.current) {
        sheetRef.current.close();
      }
    }, [keyboard.keyboardShown]);

    useImperativeHandle(ref, () => ({
      show: () => {
        sheetRef.current.expand();
      },
    }));

    const showSchedule =
      (props.store.isEdit ? time_created > Date.now() : true) &&
      !props.store.portraitMode;

    const monetizeDesc = store.wire_threshold.support_tier?.urn
      ? store.wire_threshold.support_tier?.name || 'Plus'
      : '';

    const showMonetize = !props.store.portraitMode && !props.store.isRemind;

    const showPermaweb =
      !store.isEdit &&
      !store.group &&
      !store.isRemind &&
      featuresService.has('permaweb');

    const permawebDesc = store.postToPermaweb
      ? i18n.t('permaweb.description')
      : null;

    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="close"
          opacity={0.5}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        backdropComponent={renderBackdrop}
        topInset={StatusBar.currentHeight || 0}
        enablePanDownToClose={true}
        snapPoints={snapPoints}
        backgroundComponent={null}
        handleComponent={() => <Header onPress={onHeaderPress} />}
      >
        <View
          style={[
            theme.bgSecondaryBackground,
            theme.fullHeight,
            { elevation: 13 },
          ]}
        >
          <Item
            title="Tag"
            description={tags.slice(0, 4).map(t => `#${t} `)}
            onPress={onTagPress}
          />
          <Item
            title={i18n.t('nsfw.button')}
            description={
              nsfw.length !== 0 ? i18n.t('nsfw.notSafe') : i18n.t('nsfw.safe')
            }
            onPress={onNsfwPress}
            testID="nsfwButton"
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
          {showMonetize && (
            <Item
              title={i18n.t('monetize.title')}
              description={monetizeDesc}
              onPress={onMonetizePress}
              testID="monetizeButton"
            />
          )}
          {showPermaweb && (
            <Item
              title={i18n.t('permaweb.title')}
              description={permawebDesc}
              onPress={onPermawebPress}
              testID="permawebButton"
            />
          )}
          <Item
            title="License"
            description={getLicenseText(license)}
            onPress={onLicensePress}
          />
          {!store.group && (
            <Item
              title="Visibility"
              description={getAccessText(accessId)}
              onPress={onPressVisibility}
            />
          )}
        </View>
      </BottomSheet>
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
    shadowColor: '#121414',
    shadowOffset: {
      width: 0,
      height: -5,
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
