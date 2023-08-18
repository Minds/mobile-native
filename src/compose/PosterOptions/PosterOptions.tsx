import React, { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import {
  getAccessText,
  getLicenseText,
} from '~/common/services/list-options.service';
import TopBar from '../TopBar';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useComposeContext } from '~/compose/useComposeStore';
import { observer } from 'mobx-react';
import MenuItem from '../../common/components/menus/MenuItem';
import { useIsFeatureOn, useIsIOSFeatureOn } from 'ExperimentsProvider';
import { IS_IOS } from '~/config/Config';
import { PosterStackScreenProps } from './PosterStackNavigator';

const height = 83;

export function useNavCallback(screen, store, navigation) {
  return useCallback(() => {
    navigation.navigate(screen, { store });
  }, [store, screen, navigation]);
}

type PropsType = PosterStackScreenProps<'PosterOptions'>;

const PosterOptions: FC<PropsType> = props => {
  const store = useComposeContext();
  // dereference observables to listen to his changes
  const nsfw = store.nsfw.slice();
  const tags = store.tags.slice();
  const time_created = store.time_created!;
  const license = store.attachments.license;
  const accessId = store.accessId;
  const bottomSheet = useBottomSheet();
  const isCreateModalOn = useIsFeatureOn('mob-4596-create-modal');
  const isIosMindsHidden = useIsIOSFeatureOn(
    'mob-4637-ios-hide-minds-superminds',
  );

  const onTagPress = useNavCallback('TagSelector', store, props.navigation);
  const onNsfwPress = useNavCallback('NsfwSelector', store, props.navigation);
  const onSchedulePress = useNavCallback(
    'ScheduleSelector',
    store,
    props.navigation,
  );
  // const onPermawebPress = useNavCallback(
  //   'PermawebSelector',
  //   store,
  //   props.navigation,
  // );
  const onMonetizePress = useNavCallback(
    'MonetizeSelector',
    store,
    props.navigation,
  );
  const onLicensePress = useNavCallback(
    'LicenseSelector',
    store,
    props.navigation,
  );
  const onPressVisibility = useNavCallback(
    'AccessSelector',
    store,
    props.navigation,
  );
  const closeSheet = useCallback(() => bottomSheet.close(), [bottomSheet]);

  const showSchedule =
    (store.isEdit ? time_created > Date.now() : true) && !store.portraitMode;

  const monetizeDesc = store.wire_threshold.support_tier?.urn
    ? store.wire_threshold.support_tier?.name || 'Plus'
    : '';

  const showMonetize =
    !store.portraitMode &&
    !store.isRemind &&
    !store.supermindRequest &&
    !store.isEdit;

  // const showPermaweb = !store.isEdit && !store.group && !store.isRemind;

  // const permawebDesc = store.postToPermaweb
  //   ? i18n.t('permaweb.description')
  //   : null;

  return (
    <View style={styles.container}>
      <TopBar
        leftText={i18n.t('capture.postOptions')}
        rightText={i18n.t('close')}
        onPressRight={closeSheet}
        onPressBack={closeSheet}
        backIconName="close"
        backIconSize="large"
        store={store}
      />
      <MenuItem
        title="Tag"
        label={tags
          .slice(0, 4)
          .map(t => `#${t}`)
          .join(', ')}
        onPress={onTagPress}
      />
      {IS_IOS ? null : (
        <MenuItem
          title={i18n.t('nsfw.button')}
          label={
            nsfw.length !== 0 ? i18n.t('nsfw.notSafe') : i18n.t('nsfw.safe')
          }
          onPress={onNsfwPress}
          testID="nsfwButton"
          noBorderTop
        />
      )}
      {showSchedule && (
        <MenuItem
          title={i18n.t('capture.schedule')}
          label={time_created ? moment(time_created).calendar() : i18n.t('now')}
          onPress={onSchedulePress}
          noBorderTop
        />
      )}
      {showMonetize && !isIosMindsHidden && !isCreateModalOn && (
        <MenuItem
          title={i18n.t('monetize.title')}
          label={monetizeDesc}
          onPress={onMonetizePress}
          testID="monetizeButton"
          noBorderTop
        />
      )}
      {/* {showPermaweb && (
        <MenuItem
          title={i18n.t('permaweb.title')}
          label={permawebDesc || ''}
          onPress={onPermawebPress}
          testID="permawebButton"
          noBorderTop
        />
      )} */}
      <MenuItem
        title="License"
        label={getLicenseText(license)}
        onPress={onLicensePress}
        noBorderTop
      />
      {!store.group && (
        <MenuItem
          title="Visibility"
          label={getAccessText(accessId)}
          onPress={onPressVisibility}
          noBorderTop
        />
      )}
    </View>
  );
};

export default observer(PosterOptions);

const styles = ThemedStyles.create({
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
  optionTitle: [
    'colorSecondaryText',
    {
      width: '40%',
      fontSize: 16,
    },
  ],
  optionDescription: {
    flex: 1,
    fontSize: 16,
  },
  row: [
    'bcolorPrimaryBorder',
    {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      height: 55,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  ],
  container: ['flexContainer', 'bgPrimaryBackground', 'fullHeight'],
});
