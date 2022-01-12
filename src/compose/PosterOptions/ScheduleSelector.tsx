import React, { useCallback, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment-timezone';

import ThemedStyles from '../../styles/ThemedStyles';
import TopBar from '../TopBar';
import i18n from '../../common/services/i18n.service';
import NavigationService from '../../navigation/NavigationService';
import MText from '../../common/components/MText';
import DateTimePicker from '~/common/components/DateTimePicker';
import { showNotification } from 'AppMessages';

/**
 * NSFW selector
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;
  const store = props.route.params.store;
  const dateTimePickerRef = useRef<any>(null); // todo: don't use any
  const localStore = useLocalStore(() => ({
    showPicker() {
      dateTimePickerRef.current.show();
    },
    onSelect(data) {
      // only assign if the date is gt than now
      if (moment(data).diff(moment()) > 0) {
        store.setTimeCreated(data);
      } else {
        showNotification(
          i18n.t('capture.scheduleError'),
          'warning',
          3000,
          'top',
        );
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
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
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
      <TouchableOpacity
        style={[styles.optsRow, theme.bcolorPrimaryBorder]}
        onPress={onNow}>
        <MText style={[theme.flexContainer, theme.fontL]}>
          {i18n.t('now')}
        </MText>
        {!store.time_created && (
          <MIcon name="check" size={23} style={theme.colorPrimaryText} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optsRow, theme.bcolorPrimaryBorder]}
        onPress={localStore.showPicker}>
        <MText style={[theme.flexContainer, theme.fontL]}>
          {i18n.t('capture.customTime')}
        </MText>
        {store.time_created && (
          <MText>{current.format('ddd MMM Do YYYY h.mma')}</MText>
        )}
      </TouchableOpacity>
      <DateTimePicker
        ref={dateTimePickerRef}
        date={store.time_created}
        minimumDate={new Date()}
        onDateSelected={localStore.onSelect}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  optsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    height: 55,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
