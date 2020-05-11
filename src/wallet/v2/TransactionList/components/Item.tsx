import React from 'react';
import { ItemPropsType, ExtendedEntity, currencyType } from '../types';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { View, Text } from 'react-native';
import formatDate from '../../../../common/helpers/date';
import { AvatarIcon, DeltaIcon } from './Icons';
import { Avatar } from 'react-native-elements';

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
          <Text style={secondaryText}>{`${entity.runningTotal.int}${
            entity.runningTotal.frac ? '.' + entity.runningTotal.frac : ''
          }`}</Text>
        </View>
      </View>
    </View>
  );
};

const getTypeLabel = (type: string, currency: currencyType) => {
  const typeLabels = {
    'offchain:wire': 'Off-Chain Wire',
    wire: 'On-Chain Wire',
    reward: 'Reward',
    token: 'Purchase',
    withdraw: 'On-Chain Transfer',
    'offchain:boost': 'Off-Chain Boost',
    boost: 'On-Chain Boost',
    pro_earning: 'Pro Earnings',
    payout: 'Payouts',
  };

  return currency !== 'tokens' && type === 'wire' ? 'Wire' : typeLabels[type];
};

const getTypeStringAndIcon = (
  entity: ExtendedEntity,
  currency: currencyType,
  navigation: any,
) => {
  const theme = ThemedStyles.style;
  const superType =
    entity.contract.indexOf('offchain:') === -1
      ? entity.contract
      : entity.contract.substr(9);

  const textColor = theme.colorPrimaryText;

  let typeString: JSX.Element, avatar: JSX.Element;
  switch (superType) {
    case 'reward':
      avatar = <AvatarIcon name="star-outline" />;
      typeString = <Text style={textColor}>{'Minds Reward'}</Text>;
      break;
    case 'boost':
      avatar = <AvatarIcon name="trending-up" />;
      typeString = (
        <Text style={textColor}>{`${getTypeLabel(
          superType,
          currency,
        )}ed Content`}</Text>
      );
      break;
    case 'purchase':
      avatar = <AvatarIcon name="cart" />;
      typeString = <Text style={textColor}>{'Purchase'}</Text>;
      break;
    case 'withdraw':
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = (
        <Text style={textColor}>{getTypeLabel(superType, currency)}</Text>
      );
      break;
    case 'payout':
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = <Text style={textColor}>{'Payout'}</Text>;
      break;
    case 'pro_earning':
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = <Text style={textColor}>{'Pro Earnings'}</Text>;
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
          <Text style={textColor}>{`${getTypeLabel(superType, currency)} ${
            otherUser.isSender ? 'from ' : 'to '
          }`}</Text>
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
      typeString = <Text style={textColor}>{'Transaction'}</Text>;
      break;
  }
  return { typeString, avatar };
};

export default Item;
