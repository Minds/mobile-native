import React, { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import {
  getAccessText,
  getLicenseText,
} from '~/common/services/list-options.service';
import MText from '../../common/components/MText';
import MPressable from '~/common/components/MPressable';
import TopBar from '../TopBar';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { StackScreenProps } from '@react-navigation/stack';
import { PosterStackParamList } from './PosterStackNavigator';
import { useComposeContext } from '~/compose/useComposeStore';
import { observer } from 'mobx-react';

const height = 83;

/**
 * Item
 */
const Item = props => {
  return (
    <MPressable
      style={styles.row}
      onPress={props.onPress}
      testID={props.testID}>
      <MText style={styles.optionTitle}>{props.title}</MText>
      <MText style={styles.optionDescription} numberOfLines={1}>
        {props.description}
      </MText>
      <MIcon
        size={20}
        name="chevron-right"
        style={ThemedStyles.style.colorIcon}
      />
    </MPressable>
  );
};

export function useNavCallback(screen, store, navigation) {
  return useCallback(() => {
    navigation.navigate(screen, { store });
  }, [store, screen, navigation]);
}

interface PosterOptionsType
  extends FC,
    StackScreenProps<PosterStackParamList, 'PosterOptions'> {}

function PosterOptions(props: PosterOptionsType) {
  const store = useComposeContext();
  // dereference observables to listen to his changes
  const nsfw = store.nsfw.slice();
  const tags = store.tags.slice();
  const time_created = store.time_created!;
  const license = store.attachment.license;
  const accessId = store.accessId;
  const bottomSheet = useBottomSheet();

  const onTagPress = useNavCallback('TagSelector', store, props.navigation);
  const onNsfwPress = useNavCallback('NsfwSelector', store, props.navigation);
  const onSchedulePress = useNavCallback(
    'ScheduleSelector',
    store,
    props.navigation,
  );
  const onPermawebPress = useNavCallback(
    'PermawebSelector',
    store,
    props.navigation,
  );
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

  const showMonetize = !store.portraitMode && !store.isRemind;

  const showPermaweb = !store.isEdit && !store.group && !store.isRemind;

  const permawebDesc = store.postToPermaweb
    ? i18n.t('permaweb.description')
    : null;

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
  );
}

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
