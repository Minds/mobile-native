import React, { useEffect } from 'react';
import MenuItem from '../../../../common/components/menus/MenuItem';
import MenuSubtitle from '../../../../common/components/menus/MenuSubtitle';
import i18n from '../../../../common/services/i18n.service';
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomOptionsStoreType } from '../../../../common/components/BottomOptionPopup';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { Platform } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import { TransactionsListStoreType } from '../createListStore';
import { ScrollView } from 'react-native-gesture-handler';

type PropsType = {
  store: TransactionsListStoreType;
  bottomStore: BottomOptionsStoreType;
  filters: Array<[string, string]>;
};

const Filter = observer((props: PropsType) => {
  const localStore = useLocalStore(
    (p) => ({
      showDatePicker: false,
      dateTo: true,
      setDate(value) {
        if (localStore.dateTo) {
          p.store.filters.dateRange.to = value;
        } else {
          p.store.filters.dateRange.from = value;
        }
        localStore.hidePicker();
        p.store.filters.dateRange.none = false;
      },
      setType(value) {
        p.store.filters.transactionType = value;
        p.store.refresh();
      },
      setFrom(value) {
        p.store.filters.dateRange.from = value;
        p.store.refresh();
      },
      setTo(value) {
        p.store.filters.dateRange.to = value;
        p.store.refresh();
      },
      toggleNone() {
        p.store.filters.dateRange.none = !p.store.filters.dateRange.none;
        p.store.refresh();
      },
      showPicker(dateTo: boolean) {
        localStore.showDatePicker = true;
        localStore.dateTo = dateTo;
      },
      hidePicker() {
        localStore.showDatePicker = false;
      },
    }),
    props,
  );

  /**
   * Icon used to check the selected filter
   */
  const checkIcon = (
    <Icon size={30} name="md-checkmark" style={ThemedStyles.style.colorIcon} />
  );

  useEffect(() => {
    props.bottomStore.setOnPressDone(() => {
      props.bottomStore.hide();
    });
  }, [props.bottomStore]);

  const getIcon = (transactionType) =>
    props.store.filters.transactionType === transactionType
      ? checkIcon
      : undefined;

  const datesFilter = [
    {
      onPress: localStore.toggleNone,
      title: i18n.t('wallet.transactions.noneFilter'),
      icon: props.store.filters.dateRange.none ? checkIcon : undefined,
      noIcon: !props.store.filters.dateRange.none,
    },
    {
      onPress: () => localStore.showPicker(false),
      title: `${i18n.t(
        'wallet.transactions.fromFilter',
      )}: ${props.store.filters.dateRange.from.toDateString()}`,
    },
    {
      onPress: () => localStore.showPicker(true),
      title: `${i18n.t(
        'wallet.transactions.toFilter',
      )}: ${props.store.filters.dateRange.to.toDateString()}`,
    },
  ];

  const transactionsFilter = props.filters.map((r) => ({
    onPress: () => localStore.setType(r[0]),
    title: r[1],
    icon: getIcon(r[0]),
    noIcon: props.store.filters.transactionType !== r[0],
  }));

  return (
    <ScrollView>
      <MenuSubtitle>{i18n.t('wallet.transactions.filterTypes')}</MenuSubtitle>
      {transactionsFilter.map((v) => (
        <MenuItem
          item={v}
          component={Platform.OS === 'android' ? TouchableOpacity : undefined}
        />
      ))}

      <MenuSubtitle>{i18n.t('wallet.transactions.dateRange')}</MenuSubtitle>
      {datesFilter.map((v) => (
        <MenuItem
          item={v}
          component={Platform.OS === 'android' ? TouchableOpacity : undefined}
        />
      ))}

      <DateTimePicker
        isVisible={localStore.showDatePicker}
        onConfirm={localStore.setDate}
        date={
          localStore.dateTo
            ? props.store.filters.dateRange.to
            : props.store.filters.dateRange.from
        }
        maximumDate={
          !localStore.dateTo ? props.store.filters.dateRange.to : undefined
        }
        minimumDate={
          localStore.dateTo ? props.store.filters.dateRange.from : undefined
        }
        onCancel={localStore.hidePicker}
        mode="date"
        display="calendar"
      />
    </ScrollView>
  );
});

export default Filter;
