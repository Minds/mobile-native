import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import UserModel from '../../../channel/UserModel';
import CenteredLoading from '../../../common/components/CenteredLoading';
import useApiFetch from '../../../common/hooks/useApiFetch';
import i18n from '../../../common/services/i18n.service';
import DiscoveryUser from '../../../discovery/DiscoveryUserNew';
import NavigationService from '../../../navigation/NavigationService';
import ThemedStyles from '../../../styles/ThemedStyles';
import ModalContainer from './ModalContainer';

/**
 * Subscribe channels Modal Screen
 */
export default observer(function SuggestedChannelsScreen() {
  const theme = ThemedStyles.style;
  const suggestions = useApiFetch<Array<UserModel>>('api/v2/suggestions/user', {
    updateState: (newData) =>
      UserModel.createMany(newData.suggestions.map((e) => e.entity)),
    params: {
      limit: 12,
      offset: 0,
    },
  });

  return (
    <ModalContainer
      title={i18n.t('onboarding.subscribeToChannel')}
      onPressBack={NavigationService.goBack}>
      <View style={[theme.flexContainer, theme.paddingHorizontal2x]}>
        <Text
          style={[
            theme.subTitleText,
            theme.colorPrimaryText,
            theme.paddingHorizontal2x,
          ]}>
          {i18n.t('onboarding.suggestedChannelsDescription')}
        </Text>
        <ScrollView style={theme.flexContainer}>
          {suggestions.loading && <CenteredLoading />}
          {suggestions.result?.slice().map((user, index) => (
            <DiscoveryUser row={{ item: user, index }} key={user.guid} />
          ))}
        </ScrollView>
      </View>
    </ModalContainer>
  );
});
