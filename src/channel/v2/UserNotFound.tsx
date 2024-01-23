import React from 'react';
import { View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { withErrorBoundary } from '../../common/components/ErrorBoundary';
import MText from '../../common/components/MText';
import i18nService from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import ChannelTopBar from './ChannelTopBar';

const UserNotFound = props => {
  const theme = ThemedStyles.style;
  const params = props.route.params;
  return (
    <View>
      <ChannelTopBar navigation={props.navigation} store={props.store} />
      <View style={theme.centered}>
        <Icon
          name="alert-circle-outline"
          style={theme.paddingVertical4x}
          size={50}
          color={ThemedStyles.getColor('PrimaryText')}
        />
        <MText style={[theme.fontLM, theme.bold, theme.textCenter]}>
          {i18nService.t('channel.notExist') + '\n'}@
          {params.guid || params.username}
        </MText>
      </View>
    </View>
  );
};

export default withErrorBoundary(UserNotFound);
