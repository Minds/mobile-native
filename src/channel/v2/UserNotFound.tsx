import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withErrorBoundary } from '../../common/components/ErrorBoundary';
import i18nService from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import ChannelTopBar from './ChannelTopBar';

const UserNotFound = props => {
  const theme = ThemedStyles.style;
  const params = props.route.params;
  return (
    <View>
      <ChannelTopBar navigation={props.navigation} />
      <View style={theme.centered}>
        <Icon
          name="alert-circle-outline"
          style={theme.paddingVertical4x}
          size={50}
          color={ThemedStyles.getColor('PrimaryText')}
        />
        <Text style={[theme.fontLM, theme.bold, theme.textCenter]}>
          {i18nService.t('channel.notExist') + '\n'}@
          {params.guid || params.username}
        </Text>
      </View>
    </View>
  );
};

export default withErrorBoundary(UserNotFound);
