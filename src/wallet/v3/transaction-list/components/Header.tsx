import React from 'react';
import Filter from './Filter';
import i18n from '../../../../common/services/i18n.service';
import { TokensTransactionsListStoreType } from '../../../v2/TransactionList/createTokensTransactionsStore';
import { AvatarIcon } from '../../../v2/TransactionList/components/Icons';
import { B2, B3, Row, Spacer } from '~ui';
import capitalize from '~/common/helpers/capitalize';

type PropsType = {
  store?: TokensTransactionsListStoreType;
};

const Header = ({ store }: PropsType) => {
  return (
    <Spacer>
      <Row bottom="S" align="centerBetween">
        <B2 color="secondary">
          {capitalize(i18n.t('wallet.transactions.pending').toLowerCase())}
        </B2>
        {!!store && <Filter store={store} />}
      </Row>
      <Row align="centerStart">
        <AvatarIcon name="trending-up" />
        <B2>{i18n.t('wallet.transactions.reward')}</B2>
      </Row>
    </Spacer>
  );
};

export default Header;
