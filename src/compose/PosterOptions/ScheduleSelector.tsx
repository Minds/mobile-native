import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import moment from 'moment-timezone';

import TopBar from '../TopBar';
import MText from '../../common/components/MText';
import { showNotification } from 'AppMessages';
import DateTimePicker from '~/common/components/controls/DateTimePicker';
import { useComposeContext } from '~/compose/useComposeStore';
import MenuItemOption from '../../common/components/menus/MenuItemOption';
import sp from '~/services/serviceProvider';

/**
 * NSFW selector
 */
export default observer(function () {
  const theme = sp.styles.style;
  const i18n = sp.i18n;
  const navigation = sp.navigation;
  const store = useComposeContext();
  const dateTimePickerRef = useRef<any>(null); // todo: don't use any
  const localStore = useLocalStore(() => ({
    showPicker() {
      dateTimePickerRef.current.show();
    },
    onSelect(data?: Date) {
      // only assign if the date is gt than now
      if (data?.getTime && moment(data).diff(moment()) > 0) {
        store.setTimeCreated(data.getTime());
      } else {
        showNotification(i18n.t('capture.scheduleError'), 'warning', 3000);
      }
    },
  }));

  const onNow = useCallback(() => {
    store.setTimeCreated(null);
  }, [store]);

  const current = moment(store.time_created);
  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      <TopBar
        leftText="Schedule"
        rightText={i18n.t('done')}
        onPressRight={navigation.goBack}
        onPressBack={navigation.goBack}
        backIconName="chevron-left"
        backIconSize="large"
        store={store}
      />
      <MText
        style={[
          theme.paddingVertical6x,
          theme.colorSecondaryText,
          theme.fontL,
          theme.paddingHorizontal3x,
        ]}>
        {i18n.t('activity.scheduled')}
      </MText>
      <MenuItemOption
        title={i18n.t('now')}
        onPress={onNow}
        selected={!store.time_created}
      />
      <MenuItemOption
        title={i18n.t('capture.customTime')}
        onPress={localStore.showPicker}
        label={
          store.time_created ? moment(store.time_created).calendar() : undefined
        }
        selected={Boolean(store.time_created)}
      />
      <DateTimePicker
        ref={dateTimePickerRef}
        date={current.toDate()}
        minimumDate={new Date()}
        onDateSelected={localStore.onSelect}
      />
    </View>
  );
});
