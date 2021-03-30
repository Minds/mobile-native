import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import i18nService from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import ChannelHeader from './ChannelHeader';
import ChannelTopBar from './ChannelTopBar';

const UserNotFound = (props) => {
  const theme = ThemedStyles.style;
  const params = props.route.params;
  return (
    <View>
      <ChannelTopBar navigation={props.navigation} />
      <ChannelHeader
        navigation={props.navigation}
        route={props.route}
        channelName={params.guid || params.username}
      />
      <View style={[theme.centered]}>
        <Icon
          name="alert-circle-outline"
          size={28}
          color={ThemedStyles.getColor('primary_text')}
        />
        <Text style={[theme.fontLM, theme.bold]}>
          {i18nService.t('channel.notExist')}
        </Text>
      </View>
    </View>
  );
};

export default UserNotFound;
