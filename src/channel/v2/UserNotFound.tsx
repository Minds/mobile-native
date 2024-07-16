import React from 'react';
import { View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { withErrorBoundary } from '../../common/components/ErrorBoundary';
import MText from '../../common/components/MText';

import ChannelTopBar from './ChannelTopBar';
import sp from '~/services/serviceProvider';

const UserNotFound = props => {
  const theme = sp.styles.style;
  const params = props.route.params;
  return (
    <View>
      <ChannelTopBar navigation={props.navigation} store={props.store} />
      <View style={theme.centered}>
        <Icon
          name="alert-circle-outline"
          style={theme.paddingVertical4x}
          size={50}
          color={sp.styles.getColor('PrimaryText')}
        />
        <MText style={[theme.fontLM, theme.bold, theme.textCenter]}>
          {sp.i18n.t('channel.notExist') + '\n'}@
          {params.guid || params.username}
        </MText>
      </View>
    </View>
  );
};

export default withErrorBoundary(UserNotFound);
