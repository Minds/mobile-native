import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
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
import { PosterStackScreenProps } from './PosterStackNavigator';

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

  const onTagPress = useNavCallback('TagSelector', store, props.navigation);
  const onNsfwPress = useNavCallback('NsfwSelector', store, props.navigation);
  const onSchedulePress = useNavCallback(
    'ScheduleSelector',
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
      <MenuItem
        title={i18n.t('nsfw.button')}
        label={nsfw.length !== 0 ? i18n.t('nsfw.notSafe') : i18n.t('nsfw.safe')}
        onPress={onNsfwPress}
        testID="nsfwButton"
        noBorderTop
      />
      {showSchedule && (
        <MenuItem
          title={i18n.t('capture.schedule')}
          label={time_created ? moment(time_created).calendar() : i18n.t('now')}
          onPress={onSchedulePress}
          noBorderTop
        />
      )}
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
  container: ['flexContainer', 'bgPrimaryBackground', 'fullHeight'],
});
