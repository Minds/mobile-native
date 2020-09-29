import moment from 'moment';
import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import UserModel from '../../channel/UserModel';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { Prospect, ReferralsEntity } from '../ReferralTypes';
import PingButton from './PingButton';

interface ReferralRowProps {
  referral: ReferralsEntity;
  onPress: (prospect: Prospect) => any;
}

const ReferralRow = ({ referral, onPress }: ReferralRowProps) => {
  const theme = ThemedStyles.style;

  const _getAvatarSource = useCallback((referral: ReferralsEntity) => {
    const user = UserModel.checkOrCreate(referral.prospect);
    return user.getAvatarSource('small');
  }, []);

  const _onPress = useCallback(() => onPress(referral.prospect), [
    onPress,
    referral,
  ]);

  return (
    <View
      key={referral.guid}
      style={[theme.rowJustifySpaceBetween, theme.paddingVertical2x]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={_onPress}
        style={[styles.firstColumn, theme.rowJustifyStart, theme.alignCenter]}>
        <FastImage
          source={_getAvatarSource(referral)}
          style={[styles.avatar, theme.marginRight2x]}
        />
        <View>
          <Text style={[theme.colorLink, theme.fontL]}>
            {`@${referral.prospect.username}`}
          </Text>
          <Text style={[theme.colorTertiaryText, theme.fontS]}>
            {i18n.t('referrals.signedUpOn')}{' '}
            {moment(referral.register_timestamp).format('YYYY/MM/DD')}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={[theme.flexColumnCentered]}>
        <Text style={[theme.colorTertiaryText]}>{referral.state}</Text>
      </View>
      <View style={[theme.flexColumnCentered]}>
        <PingButton
          prospectId={referral.prospect.guid}
          pingable={referral.pingable}
          username={referral.prospect.username}
        />
      </View>
    </View>
  );
};

export default ReferralRow;

const styles = StyleSheet.create({
  firstColumn: {
    flex: 3,
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },
});
