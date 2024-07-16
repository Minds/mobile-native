import { observer } from 'mobx-react';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { transactionTypes } from '../../../v2/TransactionList/TransactionsListTypes';
import { TokensTransactionsListStoreType } from '../../../v2/TransactionList/createTokensTransactionsStore';
import {
  BottomSheetModal,
  BottomSheetButton,
  RadioButton,
  SectionTitle,
} from '~/common/components/bottom-sheet';
import { B3, Icon, Row } from '~ui';
import { TENANT } from '~/config/Config';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import sp from '~/services/serviceProvider';

type titleType =
  | 'allFilter'
  | 'rewardsFilter'
  | 'boostsFilter'
  | 'transferFilter';

const filters: Array<{ id: transactionTypes; title: titleType }> = [
  { id: 'all', title: 'allFilter' },
  { id: 'offchain:reward', title: 'rewardsFilter' },
  { id: 'offchain:boost', title: 'boostsFilter' },
  { id: 'offchain:wire', title: 'transferFilter' },
];

type PropsType = {
  store: TokensTransactionsListStoreType;
};

const Filter = observer((props: PropsType) => {
  const i18n = sp.i18n;
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
        title: i18n.t(`wallet.transactions.${f.title}`, { TENANT }),
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
    [close, props.store, transactionType, i18n],
  );

  return (
    <>
      <TouchableOpacity onPress={show} testID="FilterToggle">
        <Row align="centerBoth">
          <Icon name="filter" size="small" />
          <B3 left="XXS" color="secondary">
            {i18n.t('filter')}
          </B3>
        </Row>
      </TouchableOpacity>
      <BottomSheetModal
        ref={ref}
        title={
          i18n.t('filter') + ' ' + i18n.t('wallet.transactions.transactions')
        }>
        <BottomSheetScrollView style={{ flex: 1 }}>
          <SectionTitle>
            {i18n.t('wallet.transactions.filterTypes')}
          </SectionTitle>
          {options.map((b, i) => {
            return <RadioButton {...b} key={i} />;
          })}
        </BottomSheetScrollView>
        <BottomSheetButton text={i18n.t('close')} onPress={close} />
      </BottomSheetModal>
    </>
  );
});

export default Filter;
