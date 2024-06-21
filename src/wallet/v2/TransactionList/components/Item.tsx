import React, { ReactNode } from 'react';
import {
  ItemPropsType,
  ExtendedEntity,
  currencyType,
} from '../TransactionsListTypes';
import { AvatarIcon, DeltaIcon } from './Icons';
import i18n from '../../../../common/services/i18n.service';
import capitalize from '../../../../common/helpers/capitalize';
import { B1, B2, B3, Row, Column, Avatar } from '~ui';
import { TENANT } from '~/config/Config';

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
    'offchain:wire': i18n.t('wallet.transactions.offchainWire'),
    wire: i18n.t('wallet.transactions.onchainWire'),
    reward: i18n.t('blockchain.receiver'),
    token: i18n.t('purchase'),
    withdraw: i18n.t('wallet.withdraw.title'),
    'offchain:boost': i18n.t('wallet.transactions.offchainBoost'),
    boost: i18n.t('wallet.transactions.onchainBoost'),
    pro_earning: i18n.t('wallet.transactions.proEarningsFilter'),
    payout: i18n.t('wallet.transactions.payoutsFilter'),
    'onchain:supermind': i18n.t('wallet.transactions.supermindOffer'),
    'offchain:supermind': i18n.t('wallet.transactions.supermindOffer'),
    supermind: i18n.t('wallet.transactions.supermindOffer'),
  };

  if (type === 'wire' && currency !== 'tokens') {
    return 'Wire';
  }

  return typeLabels[type];
};

const getTypeStringAndIcon = (
  entity: ExtendedEntity,
  currency: currencyType,
  navigation: any,
) => {
  let typeString: ReactNode, avatar: ReactNode | null;
  switch (entity.superType) {
    case 'reward':
      avatar = <AvatarIcon name="star-outline" />;
      typeString = (
        <B2>
          {entity.reward_type
            ? `${capitalize(entity.reward_type)} Reward`
            : i18n.t('wallet.transactions.mindsReward', { TENANT })}
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
