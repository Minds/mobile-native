import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import OffsetList from '../../../../../common/components/OffsetList';
import WithdrawalEntry from './WithdrawalEntry';
import ThemedStyles from '../../../../../styles/ThemedStyles';
import { View } from 'react-native';
import MText from '~/common/components/MText';

/**
 * Transactions list for a users  withdrawals.
 */
const TransactionsListWithdrawals = observer(() => {
  /**
   * Renders a withdrawal item, for consumption by OffsetList.
   */
  const renderWithdrawalItem = useCallback(
    (row: { item: any; index: number }) => (
      <WithdrawalEntry withdrawal={row.item} />
    ),
    [],
  );

  /**
   * Renders list header, for consumption by OffsetList.
   */
  const header = (
    <View style={headerContainerStyle}>
      <MText style={headerTextStyle}>TXID</MText>
      <MText style={headerTextStyle}>Amount</MText>
      <MText style={headerTextStyle}>Status</MText>
    </View>
  );

  return (
    <View style={containerStyle}>
      <OffsetList
        renderItem={renderWithdrawalItem}
        fetchEndpoint={'api/v3/rewards/withdrawals'}
        endpointData={'withdrawals'}
        header={header}
      />
    </View>
  );
});

export default TransactionsListWithdrawals;

const containerStyle = ThemedStyles.combine(
  'height75',
  'bgPrimaryBackground',
  'padding3x',
  'borderRadius5x',
);

const headerContainerStyle = ThemedStyles.combine(
  'flexContainer',
  'fullWidth',
  'rowJustifySpaceBetween',
  'borderBottom1x',
  'bcolorPrimaryBorder',
);

const headerTextStyle = ThemedStyles.combine(
  'colorSecondaryText',
  'flexContainer',
  'padding3x',
  'alignCenter',
  'justifyCenter',
  'textLeft',
);
