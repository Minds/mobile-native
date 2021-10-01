import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { transactionTypes } from '../../../v2/TransactionList/TransactionsListTypes';
import MdIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from '../../../../common/services/i18n.service';
import { TokensTransactionsListStoreType } from '../../../v2/TransactionList/createTokensTransactionsStore';
import {
  BottomSheet,
  BottomSheetButton,
  RadioButton,
  SectionTitle,
} from '../../../../common/components/bottom-sheet';
import MText from '../../../../common/components/MText';

const filters: Array<{ id: transactionTypes; title: string }> = [
  { id: 'all', title: 'allFilter' },
  { id: 'offchain:reward', title: 'rewardsFilter' },
  { id: 'offchain:boost', title: 'boostsFilter' },
  { id: 'offchain:wire', title: 'transferFilter' },
];

type PropsType = {
  store: TokensTransactionsListStoreType;
};

const Filter = observer((props: PropsType) => {
  const ref = React.useRef<any>();
  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);
  const show = React.useCallback(() => {
    ref.current?.present();
  }, [ref]);

  const transactionType = props.store.filters.transactionType;
  const options = React.useMemo(
    () =>
      filters.map(f => ({
        title: i18n.t(`wallet.transactions.${f.title}`),
        onPress: () => {
          close();
          setTimeout(() => {
            if (props.store) {
              props.store.setTransactionType(f.id);
            }
          }, 200);
        },
        selected: transactionType === f.id,
      })),
    [close, props.store, transactionType],
  );

  return (
    <>
      <TouchableOpacity
        style={ThemedStyles.style.rowJustifyEnd}
        onPress={show}
        testID="FilterToggle">
        <MdIcon name="filter" size={18} style={ThemedStyles.style.colorIcon} />
        <MText style={itemStyle}>{i18n.t('filter')}</MText>
      </TouchableOpacity>
      <BottomSheet
        ref={ref}
        title={
          i18n.t('filter') + ' ' + i18n.t('wallet.transactions.transactions')
        }>
        <ScrollView>
          <SectionTitle>
            {i18n.t('wallet.transactions.filterTypes')}
          </SectionTitle>
          {options.map((b, i) => {
            return <RadioButton {...b} key={i} />;
          })}
        </ScrollView>
        <BottomSheetButton text={i18n.t('close')} onPress={close} />
      </BottomSheet>
    </>
  );
});

const itemStyle = ThemedStyles.combine('fontL', 'paddingLeft');

export default Filter;
