import React, { ReactNode } from 'react';
import {
  ItemPropsType,
  ExtendedEntity,
  currencyType,
} from '../TransactionsListTypes';
import { AvatarIcon, DeltaIcon } from './Icons';
import capitalize from '~/common/helpers/capitalize';
import { B1, B2, B3, Row, Column, Avatar } from '~ui';
import { TENANT } from '~/config/Config';
import sp from '~/services/serviceProvider';

const Item = ({ entity, navigation, currency }: ItemPropsType) => {
  const { typeString, avatar } = getTypeStringAndIcon(
    entity,
    currency,
    navigation,
  );

  return (
    <Row bottom="M">
      {avatar}
      <Column flex>
        {typeString}
        <B3 color="secondary" top="XS">
          {entity.displayTime}
        </B3>
      </Column>
      <Column left="S">
        <Row align="centerStart">
          <DeltaIcon delta={entity.delta} />
          <B1 font="bold">{entity.amount}</B1>
        </Row>
      </Column>
    </Row>
  );
};

const getTypeLabel = (type: string, currency: currencyType) => {
  const typeLabels = {
    'offchain:wire': 'wallet.transactions.offchainWire',
    wire: 'wallet.transactions.onchainWire',
    reward: 'blockchain.receiver',
    token: 'purchase',
    withdraw: 'wallet.withdraw.title',
    'offchain:boost': 'wallet.transactions.offchainBoost',
    boost: 'wallet.transactions.onchainBoost',
    pro_earning: 'wallet.transactions.proEarningsFilter',
    payout: 'wallet.transactions.payoutsFilter',
    'onchain:supermind': 'wallet.transactions.supermindOffer',
    'offchain:supermind': 'wallet.transactions.supermindOffer',
    supermind: 'wallet.transactions.supermindOffer',
  };

  if (type === 'wire' && currency !== 'tokens') {
    return 'Wire';
  }

  return typeLabels[type] ? sp.i18n.t(typeLabels[type]) : capitalize(type);
};

const getTypeStringAndIcon = (
  entity: ExtendedEntity,
  currency: currencyType,
  navigation: any,
) => {
  const i18n = sp.i18n;
  let typeString: ReactNode, avatar: ReactNode | null;
  switch (entity.superType) {
    case 'reward':
      avatar = <AvatarIcon name="star-outline" />;
      typeString = (
        <B2>
          {entity.reward_type
            ? `${capitalize(entity.reward_type)} Reward`
            : sp.i18n.t('wallet.transactions.mindsReward', { TENANT })}
        </B2>
      );
      break;
    case 'boost':
      avatar = <AvatarIcon name="trending-up" />;
      typeString = (
        <B2>{`${getTypeLabel(
          entity.contract || entity.superType,
          currency,
        )}ed Content`}</B2>
      );
      break;
    case 'purchase':
      avatar = <AvatarIcon name="cart" />;
      typeString = <B2>{i18n.t('purchase')}</B2>;
      break;
    case 'withdraw':
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = (
        <B2>{getTypeLabel(entity.contract || entity.superType, currency)}</B2>
      );
      break;
    case 'payout':
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = <B2>{i18n.t('wallet.transactions.payoutsFilter')}</B2>;
      break;
    case 'pro_earning':
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = <B2>{i18n.t('wallet.transactions.payoutsFilter')}</B2>;
      break;
    case 'supermind':
    case 'wire':
      const otherUser = entity.otherUser;
      if (otherUser) {
        avatar = <Avatar size="tiny" source={otherUser.avatar} right="M" />;
      }
      typeString = (
        <Row flexWrap>
          <B2>{`${getTypeLabel(
            entity.contract || entity.superType,
            currency,
          )} ${otherUser ? (otherUser.isSender ? 'from ' : 'to ') : ''}`}</B2>
          {Boolean(otherUser) && (
            <B2
              color="link"
              onPress={() =>
                navigation.push('Channel', { username: otherUser!.username })
              }>
              {'@' + otherUser!.username}
            </B2>
          )}
        </Row>
      );
      break;
    default:
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = <B2>{i18n.t('wallet.transactions.transaction')}</B2>;
      break;
  }
  return { typeString, avatar };
};

export default React.memo(Item);
