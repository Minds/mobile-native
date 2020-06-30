import React from 'react';
import {
  ItemPropsType,
  ExtendedEntity,
  currencyType,
} from '../TransactionsListTypes';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { View, Text } from 'react-native';
import formatDate from '../../../../common/helpers/date';
import { AvatarIcon, DeltaIcon } from './Icons';
import { Avatar } from 'react-native-elements';
import i18n from '../../../../common/services/i18n.service';

const Item = ({ entity, navigation, currency }: ItemPropsType) => {
  const theme = ThemedStyles.style;
  const { typeString, avatar } = getTypeStringAndIcon(
    entity,
    currency,
    navigation,
  );

  const secondaryText = [theme.colorSecondaryText, theme.fontS];

  return (
    <View style={[theme.rowJustifySpaceEvenly, theme.marginBottom2x]}>
      {avatar}
      <View style={theme.flexColumn}>
        {typeString}
        <Text style={[...secondaryText, theme.marginTop]}>
          {formatDate(entity.timestamp, 'time')}
        </Text>
      </View>
      <View style={theme.flexColumn}>
        <View style={[theme.rowJustifyEnd, theme.alignCenter]}>
          <DeltaIcon delta={entity.delta} />
          <Text style={theme.colorPrimaryText}>{entity.amount}</Text>
        </View>
        <View style={theme.rowJustifyEnd}>
          {!!entity.runningTotal && (
            <Text style={secondaryText}>{`${entity.runningTotal.int}${
              entity.runningTotal.frac ? '.' + entity.runningTotal.frac : ''
            }`}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const getTypeLabel = (type: string, currency: currencyType) => {
  const typeLabels = {
    'offchain:wire': i18n.t('wallet.transactions.offchainWire'),
    wire: i18n.t('wallet.transactions.onchainWire'),
    reward: i18n.t('blockchain.receiver'),
    token: i18n.t('purchase'),
    withdraw: i18n.t('withdraw.title'),
    'offchain:boost': i18n.t('wallet.transactions.offchainBoost'),
    boost: i18n.t('wallet.transactions.onchainBoost'),
    pro_earning: i18n.t('wallet.transactions.proEarningsFilter'),
    payout: i18n.t('wallet.transactions.payoutsFilter'),
  };

  return currency !== 'tokens' && type === 'wire' ? 'Wire' : typeLabels[type];
};

const getTypeStringAndIcon = (
  entity: ExtendedEntity,
  currency: currencyType,
  navigation: any,
) => {
  const theme = ThemedStyles.style;

  const textColor = theme.colorPrimaryText;

  let typeString: JSX.Element, avatar: JSX.Element;
  switch (entity.superType) {
    case 'reward':
      avatar = <AvatarIcon name="star-outline" />;
      typeString = (
        <Text style={textColor}>
          {i18n.t('wallet.transactions.mindsReward')}
        </Text>
      );
      break;
    case 'boost':
      avatar = <AvatarIcon name="trending-up" />;
      typeString = (
        <Text style={textColor}>{`${getTypeLabel(
          entity.superType,
          currency,
        )}ed Content`}</Text>
      );
      break;
    case 'purchase':
      avatar = <AvatarIcon name="cart" />;
      typeString = <Text style={textColor}>{i18n.t('purchase')}</Text>;
      break;
    case 'withdraw':
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = (
        <Text style={textColor}>
          {getTypeLabel(entity.superType, currency)}
        </Text>
      );
      break;
    case 'payout':
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = (
        <Text style={textColor}>
          {i18n.t('wallet.transactions.payoutsFilter')}
        </Text>
      );
      break;
    case 'pro_earning':
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = (
        <Text style={textColor}>
          {i18n.t('wallet.transactions.payoutsFilter')}
        </Text>
      );
      break;
    case 'wire':
      const otherUser = entity.otherUser || {
        avatar: undefined as any,
        username: '',
        isSender: false,
      };
      avatar = (
        <Avatar
          size={36}
          rounded={true}
          source={otherUser.avatar}
          containerStyle={[theme.padding, theme.marginRight3x]}
        />
      );
      typeString = (
        <Text>
          <Text style={textColor}>{`${getTypeLabel(
            entity.superType,
            currency,
          )} ${otherUser.isSender ? 'from ' : 'to '}`}</Text>
          <Text
            style={theme.colorLink}
            onPress={() =>
              navigation.push('Channel', { username: otherUser.username })
            }>
            {'@' + otherUser.username}
          </Text>
        </Text>
      );
      break;
    default:
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = (
        <Text style={textColor}>
          {i18n.t('wallet.transaction.transaction')}
        </Text>
      );
      break;
  }
  return { typeString, avatar };
};

export default Item;
