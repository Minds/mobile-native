import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import CenteredLoading from '~/common/components/CenteredLoading';
import MText from '~/common/components/MText';
import useApiFetch from '~/common/hooks/useApiFetch';

import { Prospect, Referral, ReferralsEntity } from '../ReferralTypes';
import ReferralRow from './ReferralRow';
import sp from '~/services/serviceProvider';

interface ReferralsListProps {
  navigation: any;
}

const ReferralsList = observer(({ navigation }: ReferralsListProps) => {
  const theme = sp.styles.style;
  const _onUserPress = useCallback(
    (prospect: Prospect) => {
      navigation.push('Channel', { username: prospect.username });
    },
    [navigation],
  );
  const i18n = sp.i18n;
  const [offset, setOffset] = useState('');
  const opts = {
    limit: 20,
    offset,
  };
  const { result, loading, error, fetch } = useApiFetch<Referral>(
    'api/v2/referrals',
    {
      params: opts,
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
      <MText style={theme.titleText}>{i18n.t('referrals.myReferrals')}</MText>

      {!loading && error && (
        <MText
          style={[
            theme.colorSecondaryText,
            theme.textCenter,
            theme.fontL,
            theme.marginVertical4x,
          ]}
          onPress={() => fetch()}>
          {i18n.t('error') + '\n'}
          <MText style={theme.colorLink}>{i18n.t('tryAgain')}</MText>
        </MText>
      )}
      {result && (
        <View>
          <View style={[theme.rowJustifySpaceBetween]}>
            <View style={[styles.firstColumn, theme.paddingVertical2x]}>
              <MText style={theme.bold}>{i18n.t('referrals.user')}</MText>
            </View>
            <View style={[theme.flexColumnCentered, theme.padding]}>
              <MText style={[theme.bold, theme.textCenter]}>
                {i18n.t('referrals.status')}
              </MText>
            </View>
            <View style={[theme.flexColumnCentered, theme.padding]}>
              <MText style={[theme.bold, theme.textCenter]}>
                {i18n.t('referrals.rewardsSignup')}
              </MText>
            </View>
          </View>

          {result?.referrals.length === 0 && (
            <MText style={theme.colorTertiaryText}>
              {i18n.t('referrals.noReferrals')}
            </MText>
          )}

          {result?.referrals.filter(r => r.prospect).map(_renderRow)}
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
