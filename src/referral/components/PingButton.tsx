import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MIcon from '@expo/vector-icons/MaterialIcons';
import { showNotification } from '~/../AppMessages';
import ActivityIndicator from '~/common/components/ActivityIndicator';
import { useApiCall } from '~/common/hooks/useApiFetch';

import sp from '~/services/serviceProvider';

interface PingButtonProps {
  prospectId: string;
  pingable?: boolean;
  username: string;
}

const PingButton = observer(
  ({ prospectId, pingable, username }: PingButtonProps) => {
    const theme = sp.styles.style;

    const { post, result, loading } = useApiCall(
      `api/v2/referrals/${prospectId}`,
      'put',
    );
    const _onPing = useCallback(
      () =>
        post().then(data => {
          if (data?.done) {
            showNotification(
              sp.i18n.t('referrals.pinged', { username }),
              'success',
              3000,
            );
          }
        }),
      [post, username],
    );

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={!loading && pingable ? _onPing : undefined}
        style={
          result || !pingable
            ? null
            : [
                theme.borderHair,
                theme.bcolorLink,
                styles.iconContainer,
                theme.padding,
              ]
        }>
        {loading ? (
          <ActivityIndicator
            size={'small'}
            color={sp.styles.getColor('Link')}
          />
        ) : (
          <MIcon
            name={'notifications'}
            size={25}
            style={
              result || !pingable
                ? theme.colorTertiaryBackground
                : theme.colorLink
            }
          />
        )}
      </TouchableOpacity>
    );
  },
);

export default PingButton;
const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 50,
  },
});
