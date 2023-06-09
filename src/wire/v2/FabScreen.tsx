import React from 'react';
import { observer } from 'mobx-react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderComponent from '../../common/components/HeaderComponent';
import UserNamesComponent from '../../common/components/UserNamesComponent';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from '../../common/services/i18n.service';
import MText from '../../common/components/MText';
import DismissKeyboard from '~/common/components/DismissKeyboard';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

const isIos = Platform.OS === 'ios';

const FabScreen = observer(({ route, navigation }) => {
  const tabList = [
    {
      name: 'tokens',
      label: 'Tokens',
    },
  ];

  if (!isIos) {
    tabList.push({
      name: 'usd',
      label: 'USD',
    });
  }

  const { owner } = route.params ?? {};

  const theme = ThemedStyles.style;

  const insets = useSafeAreaInsets();
  const cleanTop = insets.top ? { marginTop: insets.top } : null;

  return (
    <DismissKeyboard style={theme.flexContainer}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={cleanTop}>
        <View style={theme.rowJustifySpaceBetween}>
          <View style={theme.rowJustifyStart}>
            <MIcon
              size={45}
              name="chevron-left"
              style={[styles.backIcon, theme.colorIcon]}
              onPress={navigation.goBack}
            />
            <MText style={[theme.centered, theme.fontXXL, theme.bold]}>
              {i18n.t('channel.fabPay')}
            </MText>
          </View>
          <MText style={[theme.centered, theme.bold, theme.paddingRight4x]}>
            {i18n.t('channel.fabSend')}
          </MText>
        </View>
        <View style={styles.container}>
          <HeaderComponent user={owner} />
          <UserNamesComponent user={owner} pay={true} />
        </View>
      </ScrollView>
    </DismissKeyboard>
  );
});

const styles = StyleSheet.create({
  backIcon: {
    shadowOpacity: 0.4,
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  container: {
    marginBottom: 10,
  },
});

export default withErrorBoundaryScreen(FabScreen, 'FabScreen');
