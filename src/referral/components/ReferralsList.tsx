import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import CenteredLoading from '../../common/components/CenteredLoading';
import useApiFetch from '../../common/hooks/useApiFetch';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { Prospect, Referral, ReferralsEntity } from '../ReferralTypes';
import ReferralRow from './ReferralRow';

interface ReferralsListProps {
  navigation: any;
}

const ReferralsList = observer(({ navigation }: ReferralsListProps) => {
  const theme = ThemedStyles.style;
  const _onUserPress = useCallback(
    (prospect: Prospect) => {
      navigation.push('Channel', { username: prospect.username });
    },
    [navigation],
  );
  const [offset, setOffset] = useState('');
  const opts = {
    limit: 2,
    offset,
  };
  const { result, loading, error, fetch } = useApiFetch<Referral>(
    'api/v2/referrals',
    opts,
    {
      updateState: (newData: Referral, oldData: Referral) =>
        ({
          ...newData,
          referrals: [
            ...(oldData ? oldData.referrals : []),
            ...newData.referrals,
          ],
        } as Referral),
    },
  );
  const _onFetchMore = useCallback(
    () => result && setOffset(result?.['load-next']),
    [result],
  );

  const _renderRow = useCallback(
    (referral: ReferralsEntity) => (
      <ReferralRow
        key={referral.guid}
        referral={referral}
        onPress={_onUserPress}
      />
    ),
    [_onUserPress],
  );

  return (
    <View style={theme.marginTop4x}>
      <Text style={theme.titleText}>{i18n.t('referrals.myReferrals')}</Text>

      {!loading && error && (
        <Text
          style={[
            theme.colorSecondaryText,
            theme.textCenter,
            theme.fontL,
            theme.marginVertical4x,
          ]}
          onPress={() => fetch()}>
          {i18n.t('error') + '\n'}
          <Text style={theme.colorLink}>{i18n.t('tryAgain')}</Text>
        </Text>
      )}
      {result && (
        <View>
          <View style={[theme.rowJustifySpaceBetween]}>
            <View style={[styles.firstColumn, theme.paddingVertical2x]}>
              <Text style={theme.bold}>{i18n.t('referrals.user')}</Text>
            </View>
            <View style={[theme.flexColumnCentered, theme.padding]}>
              <Text style={[theme.bold, theme.textCenter]}>
                {i18n.t('referrals.status')}
              </Text>
            </View>
            <View style={[theme.flexColumnCentered, theme.padding]}>
              <Text style={[theme.bold, theme.textCenter]}>
                {i18n.t('referrals.rewardsSignup')}
              </Text>
            </View>
          </View>

          {result?.referrals.length === 0 && (
            <Text style={theme.colorTertiaryText}>
              {i18n.t('referrals.noReferrals')}
            </Text>
          )}

          {result?.referrals.map(_renderRow)}
        </View>
      )}

      {loading ? (
        <CenteredLoading />
      ) : (
        !!result?.['load-next'] && (
          <Button
            onPress={_onFetchMore}
            title={i18n.t('loadMore')}
            containerStyle={theme.marginTop4x}
          />
        )
      )}
    </View>
  );
});

export default ReferralsList;

const styles = StyleSheet.create({
  firstColumn: {
    flex: 3,
  },
});
