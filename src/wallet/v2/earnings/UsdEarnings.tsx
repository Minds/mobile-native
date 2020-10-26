import React, { useEffect, useRef } from 'react';
import {
  WalletScreenNavigationProp,
  WalletScreenRouteProp,
} from '../WalletScreen';
import { View, Text, StyleSheet } from 'react-native';
import { WalletStoreType } from '../createWalletStore';
import ThemedStyles from '../../../styles/ThemedStyles';
import CenteredLoading from '../../../common/components/CenteredLoading';
import moment from 'moment';
import { Filter, Option } from '../../../types/Common';
import Selector from '../../../common/components/Selector';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native-gesture-handler';
import currency from '../../../common/helpers/currency';
import { Earnings } from '../WalletTypes';
import capitalize from '../../../common/helpers/capitalize';
import { useLocalStore, observer } from 'mobx-react';

type PropsType = {
  navigation: WalletScreenNavigationProp;
  walletStore: WalletStoreType;
  route: WalletScreenRouteProp;
};

const createLocalStore = ({
  walletStore,
}: {
  walletStore: WalletStoreType;
}) => {
  const store = {
    loading: true,
    from: moment().utc().startOf('month').unix(),
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setFrom(from: number) {
      this.loading = true;
      this.from = from;
    },
    async loadEarnings() {
      const to = moment.unix(this.from).utc().add(1, 'month').unix();
      await walletStore.loadEarnings(this.from, to);
      this.loading = false;
    },
  };
  return store;
};

const buildMonthOptions = (numberOfMonths: number = 6): Option[] => {
  const months: Array<any> = [];
  const dateStart = moment().utc().subtract(numberOfMonths, 'month');
  const dateEnd = moment().utc().startOf('month');
  while (dateEnd.diff(dateStart, 'months') >= 0) {
    months.push({
      id: dateEnd.unix(),
      label: dateEnd.format('MMMM YYYY'),
    });
    dateEnd.subtract(1, 'month');
  }
  return months;
};

const getFriendlyLabel = (id: string): string => {
  switch (id) {
    case 'wire':
      return 'Minds Pay';
    case 'wire-all':
      return 'Memberships & Tips';
    case 'partner':
      return 'Minds Pro';
    case 'plus':
      return 'Minds+ Content';
  }

  return capitalize(id);
};

const filter: Filter = {
  id: 'month',
  label: '',
  options: buildMonthOptions(6),
};

type EarningDetailsPropsType = {
  title: string;
  totals: number;
  details: Earnings[];
};

type EarningsComponentPropsType = {
  walletStore: WalletStoreType;
  localStore: ReturnType<typeof createLocalStore>;
};

const EarningDetails = ({
  title,
  totals,
  details,
}: EarningDetailsPropsType) => {
  const theme = ThemedStyles.style;

  const mainTextStyle = [styles.mainText, theme.colorPrimaryText];
  const rowContainerStyle = [
    theme.paddingBottom2x,
    theme.rowJustifySpaceBetween,
  ];
  return (
    <View style={theme.marginBottom7x}>
      <View style={rowContainerStyle}>
        <Text style={mainTextStyle}>{title}</Text>
        <Text style={mainTextStyle}>
          {`${currency(totals / 100, 'usd', 'prefix')}`}
        </Text>
      </View>
      <View>
        {details.map((detail) => {
          return (
            <View style={[theme.paddingTop, theme.marginBottom3x]}>
              <View
                style={[
                  rowContainerStyle,
                  theme.borderBottom,
                  theme.borderPrimary,
                  theme.marginBottom6x,
                ]}>
                <Text style={[styles.secondaryText, theme.colorPrimaryText]}>
                  {getFriendlyLabel(detail.id)}
                </Text>
                <Text
                  style={[
                    styles.secondaryText,
                    theme.colorSecondaryText,
                  ]}>{`${currency(
                  detail.amount_cents / 100,
                  'usd',
                  'prefix',
                )}`}</Text>
              </View>
              {detail.items.map((item) => {
                return (
                  <View
                    style={[
                      theme.rowJustifySpaceBetween,
                      theme.paddingBottom2x,
                    ]}>
                    <Text style={theme.colorPrimaryText}>
                      {getFriendlyLabel(item.id)}
                    </Text>
                    <Text style={theme.colorSecondaryText}>{`${currency(
                      item.amount_cents / 100,
                      'usd',
                      'prefix',
                    )}`}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const EarningsComponent = observer(
  ({ walletStore, localStore }: EarningsComponentPropsType) => {
    useEffect(() => {
      if (localStore.loading) {
        localStore.loadEarnings();
      }
    }, [localStore, localStore.loading]);

    if (localStore.loading) {
      return <CenteredLoading />;
    }
    return (
      <>
        <EarningDetails
          title={'Bank Transfer'}
          totals={walletStore.usdPayoutsTotals}
          details={walletStore.usdPayouts}
        />
        <EarningDetails
          title={'Earnings'}
          totals={walletStore.usdEarningsTotal}
          details={walletStore.usdEarnings}
        />
      </>
    );
  },
);

const UsdEarnings = observer(({ walletStore, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const selectorRef = useRef<Selector>(null);
  const localStore = useLocalStore(createLocalStore, { walletStore });

  const filterSelected = (option: Option): void => {
    localStore.setFrom(parseInt(option.id));
  };

  const selectedMonth =
    filter.options.find((option) => parseInt(option.id) === localStore.from)
      ?.label || '';

  return (
    <ScrollView
      contentContainerStyle={[theme.paddingTop4x, theme.paddingHorizontal3x]}>
      <TouchableWithoutFeedback
        onPress={() => selectorRef.current?.show(localStore.from)}
        style={theme.marginBottom6x}>
        <View
          style={[
            theme.border,
            theme.borderPrimary,
            theme.padding,
            theme.rowJustifySpaceBetween,
          ]}>
          <Text style={[theme.colorPrimaryText, theme.fontLM]}>
            {selectedMonth}
          </Text>
          <Icon
            name="chevron-down"
            style={[theme.colorIcon, theme.fontXXL, theme.centered]}
          />
        </View>
      </TouchableWithoutFeedback>
      <Selector
        ref={selectorRef}
        onItemSelect={filterSelected}
        title={''}
        data={filter.options}
        valueExtractor={(item) => item.label}
        keyExtractor={(item) => item.id}
      />
      <EarningsComponent walletStore={walletStore} localStore={localStore} />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  mainText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 22,
  },
  secondaryText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
  },
});

export default UsdEarnings;
