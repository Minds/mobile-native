import React, { Component } from 'react';
import MenuItem from '../../../../common/components/menus/MenuItem';
import MenuSubtitle from '../../../../common/components/menus/MenuSubtitle';
import i18n from '../../../../common/services/i18n.service';
import { View } from 'react-native';
import { ListFiltersType, transactionTypes } from '../types';
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomOptionsStoreType } from '../../../../common/components/BottomOptionPopup';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { ScrollView } from 'react-native-gesture-handler';

type PropsType = {
  store: any;
  bottomStore: BottomOptionsStoreType;
};

class Filter extends Component<PropsType> {
  state = {
    dateNone: false,
    from: new Date(),
    to: new Date(),
    transactionType: 'all' as transactionTypes,
    showDatePicker: false,
    confirmDatePicker: () => true,
    maxDate: undefined,
    minDate: undefined,
  };

  constructor(props: PropsType) {
    super(props);

    const { dateRange, transactionType } = this.props.store.listFilters;
    this.setState({
      dateNone: dateRange.none,
      from: dateRange.from,
      to: dateRange.to,
      transactionType: transactionType,
      confirmDatePicker: this.confirmFromDate,
    });
  }

  /**
   * Icon used to check the selected filter
   */
  checkIcon = (<Icon size={30} name="md-checkmark" />);

  componentDidMount() {
    this.props.bottomStore.setOnPressDone(() => {
      this.props.store.setFilters(this.getListFilter());
      this.props.bottomStore.hide();
    });
  }

  setTransactionType = (transactionType: string) =>
    this.setState({ transactionType });

  getIcon = (transactionType: transactionTypes) =>
    this.state.transactionType === transactionType ? this.checkIcon : undefined;

  getListFilter = () => {
    const listFilter: ListFiltersType = {
      transactionType: this.state.transactionType,
      dateRange: {
        none: this.state.dateNone,
        from: this.state.from,
        to: this.state.to,
      },
    };
    return listFilter;
  };

  /**
   * Show date picker
   */
  showDatePicker = (dateToSet: 'from' | 'to') => {
    this.setState({
      showDatePicker: true,
      confirmDatePicker:
        dateToSet === 'from' ? this.confirmFromDate : this.confirmToDate,
    });
  };

  /**
   * Dismiss date picker
   */
  dismissDatePicker = () => {
    this.setState({ showDatePicker: false });
  };

  /**
   * Confirm From date
   */
  confirmFromDate = (from) => {
    this.dismissDatePicker();
    this.setState({ from, minDate: from, dateNone: false });
  };

  /**
   * Confirm to date
   */
  confirmToDate = (to) => {
    this.dismissDatePicker();
    this.setState({ to, maxDate: to, dateNone: false });
  };

  render() {
    const datesFilter = [
      {
        onPress: () => this.setState({ dateNone: true }),
        title: i18n.t('wallet.transactions.noneFilter'),
        icon: this.state.dateNone ? this.checkIcon : undefined,
        noIcon: !this.state.dateNone,
      },
      {
        onPress: () => this.showDatePicker('from'),
        title: `${i18n.t(
          'wallet.transactions.fromFilter',
        )}: ${this.state.from.toDateString()}`,
      },
      {
        onPress: () => this.showDatePicker('to'),
        title: `${i18n.t(
          'wallet.transactions.toFilter',
        )}: ${this.state.to.toDateString()}`,
      },
    ];

    const transactionsFilter = [
      {
        onPress: () => this.setTransactionType('all'),
        title: i18n.t('wallet.transactions.allFilter'),
        icon: this.getIcon('all'),
        noIcon: this.state.transactionType !== 'all',
      },
      {
        onPress: () => this.setTransactionType('offchain:reward'),
        title: i18n.t('wallet.transactions.rewardsFilter'),
        icon: this.getIcon('offchain:reward'),
        noIcon: this.state.transactionType !== 'offchain:reward',
      },
      {
        onPress: () => this.setTransactionType('offchain:boost'),
        title: i18n.t('wallet.transactions.boostsFilter'),
        icon: this.getIcon('offchain:boost'),
        noIcon: this.state.transactionType !== 'offchain:boost',
      },
      {
        onPress: () => this.setTransactionType('offchain:wire'),
        title: i18n.t('wallet.transactions.transferFilter'),
        icon: this.getIcon('offchain:wire'),
        noIcon: this.state.transactionType !== 'offchain:wire',
      },
    ];

    return (
      <ScrollView>
        <MenuSubtitle>{i18n.t('wallet.transactions.filterTypes')}</MenuSubtitle>
        {transactionsFilter.map((v) => (
          <MenuItem item={v} component="Touchable" />
        ))}

        <MenuSubtitle>{i18n.t('wallet.transactions.dateRange')}</MenuSubtitle>
        {datesFilter.map((v) => (
          <MenuItem item={v} component="Touchable" />
        ))}

        <DateTimePicker
          isVisible={this.state.showDatePicker}
          onConfirm={this.state.confirmDatePicker}
          date={new Date()}
          maximumDate={this.state.maxDate}
          minimumDate={this.state.minDate}
          onCancel={this.dismissDatePicker}
          mode="date"
          display="calendar"
        />
      </ScrollView>
    );
  }
}

export default Filter;
