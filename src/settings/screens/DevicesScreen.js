import React from 'react';
import { ScrollView, View } from 'react-native';
import { observer } from 'mobx-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import CenteredLoading from '../../common/components/CenteredLoading';
import Button from '../../common/components/Button';
import useApiFetch from '../../common/hooks/useApiFetch';
import apiService from '../../common/services/api.service';
import MText from '../../common/components/MText';

const options = {
  retry: 0,
};

export default observer(function DeviceScreen() {
  const theme = ThemedStyles.style;
  const inset = useSafeAreaInsets();

  const { result, loading, error, fetch } = useApiFetch(
    'api/v3/sessions/common-sessions/all',
    options,
  );
  const revokeSession = React.useCallback(
    session => {
      apiService
        .delete(
          `api/v3/sessions/common-sessions/session?id=${session.id}&platform=${session.platform}`,
        )
        .then(() => fetch());
    },
    [fetch],
  );

  const padding = {
    paddingBottom: inset.bottom + 20,
  };

  return (
    <ScrollView
      style={[
        theme.flexContainer,
        theme.bgPrimaryBackground,
        theme.paddingTop4x,
        padding,
      ]}
    >
      {error && (
        <MText style={[theme.fontL, theme.centered, theme.colorSecondaryText]}>
          {i18n.t('sorry')} {i18n.t('cantLoad')}
        </MText>
      )}
      {loading ? (
        <CenteredLoading />
      ) : (
        <>
          <MText
            style={[
              theme.colorSecondaryText,
              theme.fontL,
              theme.paddingHorizontal4x,
              theme.marginBottom4x,
            ]}
          >
            {i18n.t('settings.sessionsOpened')}
          </MText>
          {result?.sessions.map((s, i) => (
            <View
              style={[
                theme.bgSecondaryBackground,
                theme.paddingHorizontal4x,
                theme.paddingVertical2x,
                theme.borderTop,
                theme.bcolorPrimaryBorder,
                i === result.sessions.length - 1 ? theme.borderBottom : null,
              ]}
            >
              <Button
                onPress={() => revokeSession(s)}
                text={i18n.t('revoke')}
                xSmall={true}
                containerStyle={styles.button}
                color={ThemedStyles.getColor('Alert')}
                inverted
              />
              <MText style={[theme.fontL, theme.fontSemibold, styles.text]}>
                {s.platform}
              </MText>
              <MText style={styles.text}>{s.ip}</MText>
              <MText style={styles.text}>
                Last accessed on{' '}
                <MText style={[theme.fontSemibold, styles.text]}>
                  {i18n.date('friendly')}
                </MText>
              </MText>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
});

const styles = {
  button: {
    position: 'absolute',
    zIndex: 1000,
    right: 20,
    top: 15,
  },
  text: {
    paddingVertical: 3,
  },
};
