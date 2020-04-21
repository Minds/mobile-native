import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment-timezone';

import ThemedStyles from '../styles/ThemedStyles';
import TopBar from './TopBar';
import i18n from '../common/services/i18n.service';
import NavigationService from '../navigation/NavigationService';
import DateTimePicker from 'react-native-modal-datetime-picker';

/**
 * NSFW selector
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;
  const store = props.route.params.store;
  const localStore = useLocalStore(() => ({
    picker: false,
    showPicker() {
      this.picker = true;
    },
    hidePicker() {
      this.picker = false;
    },
    onSelect(data) {
      this.picker = false;

      // only asign if the date is gt than now
      if (moment(data).diff(moment()) > 0) {
        store.setTimeCreated(data);
      }
    },
  }));

  const onNow = useCallback(() => {
    store.setTimeCreated(null);
  }, [store]);

  const current = moment(store.time_created);

  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <TopBar
        leftText="Schedule"
        rightText={i18n.t('done')}
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
        store={store}
      />
      <Text
        style={[
          theme.paddingVertical6x,
          theme.colorSecondaryText,
          theme.fontL,
          theme.paddingHorizontal3x,
        ]}>
        {i18n.t('activity.scheduled')}
      </Text>
      <TouchableOpacity
        style={[styles.optsRow, theme.borderPrimary]}
        onPress={onNow}>
        <Text style={[theme.flexContainer, theme.fontL]}>{i18n.t('now')}</Text>
        {!store.time_created && (
          <MIcon name="check" size={23} style={theme.colorPrimaryText} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optsRow, theme.borderPrimary]}
        onPress={localStore.showPicker}>
        <Text style={[theme.flexContainer, theme.fontL]}>
          {i18n.t('capture.customTime')}
        </Text>
        {store.time_created && (
          <Text>{current.format('ddd MMM Do YYYY h.mma')}</Text>
        )}
      </TouchableOpacity>
      <DateTimePicker
        isVisible={localStore.picker}
        onConfirm={localStore.onSelect}
        date={store.time_created || new Date()}
        onCancel={localStore.hidePicker}
        mode="datetime"
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
