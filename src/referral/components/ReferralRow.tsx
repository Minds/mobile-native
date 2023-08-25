import moment from 'moment';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';

import UserModel from '~/channel/UserModel';
import MText from '~/common/components/MText';
import i18n from '~/common/services/i18n.service';
import ThemedStyles from '~/styles/ThemedStyles';
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

  const _onPress = useCallback(
    () => onPress(referral.prospect),
    [onPress, referral],
  );

  return (
    <View
      key={referral.guid}
      style={[theme.rowJustifySpaceBetween, theme.paddingVertical2x]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={_onPress}
        style={[styles.firstColumn, theme.rowJustifyStart, theme.alignCenter]}>
        <Image
          source={_getAvatarSource(referral)}
          style={[styles.avatar, theme.marginRight2x]}
        />
        <View>
          <MText style={[theme.colorLink, theme.fontL]}>
            {`@${referral.prospect.username}`}
          </MText>
          <MText style={[theme.colorTertiaryText, theme.fontS]}>
            {i18n.t('referrals.signedUpOn')}{' '}
            {moment(referral.register_timestamp).format('YYYY/MM/DD')}
          </MText>
        </View>
      </TouchableOpacity>
      <View style={[theme.flexColumnCentered]}>
        <MText style={[theme.colorTertiaryText]}>{referral.state}</MText>
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
