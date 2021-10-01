import React from 'react';
import {
  ItemPropsType,
  ExtendedEntity,
  currencyType,
} from '../TransactionsListTypes';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { View } from 'react-native';
import { AvatarIcon, DeltaIcon } from './Icons';
import { Avatar } from 'react-native-elements';
import i18n from '../../../../common/services/i18n.service';
import capitalize from '../../../../common/helpers/capitalize';
import MText from '../../../../common/components/MText';

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
        <MText style={[...secondaryText, theme.marginTop]}>
          {i18n.date(entity.timestamp, 'time')}
        </MText>
      </View>
      <View style={theme.flexColumn}>
        <View style={[theme.rowJustifyEnd, theme.alignCenter]}>
          <DeltaIcon delta={entity.delta} />
          <MText style={theme.colorPrimaryText}>{entity.amount}</MText>
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
        <MText style={textColor}>
          {entity.reward_type
            ? `${capitalize(entity.reward_type)} Reward`
            : i18n.t('wallet.transactions.mindsReward')}
        </MText>
      );
      break;
    case 'boost':
      avatar = <AvatarIcon name="trending-up" />;
      typeString = (
        <MText style={textColor}>{`${getTypeLabel(
          entity.contract,
          currency,
        )}ed Content`}</MText>
      );
      break;
    case 'purchase':
      avatar = <AvatarIcon name="cart" />;
      typeString = <MText style={textColor}>{i18n.t('purchase')}</MText>;
      break;
    case 'withdraw':
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = (
        <MText style={textColor}>
          {getTypeLabel(entity.contract, currency)}
        </MText>
      );
      break;
    case 'payout':
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = (
        <MText style={textColor}>
          {i18n.t('wallet.transactions.payoutsFilter')}
        </MText>
      );
      break;
    case 'pro_earning':
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = (
        <MText style={textColor}>
          {i18n.t('wallet.transactions.payoutsFilter')}
        </MText>
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
        <MText>
          <MText style={textColor}>{`${getTypeLabel(
            entity.contract,
            currency,
          )} ${otherUser.isSender ? 'from ' : 'to '}`}</MText>
          <MText
            style={theme.colorLink}
            onPress={() =>
              navigation.push('Channel', { username: otherUser.username })
            }>
            {'@' + otherUser.username}
          </MText>
        </MText>
      );
      break;
    default:
      avatar = <AvatarIcon name="arrow-right" />;
      typeString = (
        <MText style={textColor}>
          {i18n.t('wallet.transactions.transaction')}
        </MText>
      );
      break;
  }
  return { typeString, avatar };
};

export default React.memo(Item);
