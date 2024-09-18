import { RouteProp } from '@react-navigation/core';
import React, { useCallback, useState } from 'react';
import UserModel from '~/channel/UserModel';
import { RootStackParamList } from '~/navigation/NavigationTypes';
import { ModalFullScreen } from '../../ui';
import InputContainer from '../InputContainer';
import AutoComplete from './AutoComplete';
import { withErrorBoundaryScreen } from '../ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

type ChannelSelectScreenRoute = RouteProp<
  RootStackParamList,
  'ChannelSelectScreen'
>;

interface ChannelSelectScreenProps {
  route?: ChannelSelectScreenRoute;
}

function ChannelSelectScreen({ route }: ChannelSelectScreenProps) {
  const [username, setUsername] = useState(route?.params?.username || '');
  const i18n = sp.i18n;
  const onSelect = useCallback(
    (channel: UserModel) => {
      sp.navigation.goBack();
      route?.params?.onSelect(channel);
    },
    [route],
  );

  return (
    <ModalFullScreen back title={i18n.t('channelSelect.title')}>
      <InputContainer
        placeholder={i18n.t('auth.username')}
        onChangeText={setUsername}
        value={username}
        autofocus
        autoCorrect={false}
        returnKeyType="next"
        keyboardType="default"
        autoComplete="username-new"
        textContentType="username"
      />
      <AutoComplete
        text={username ? (username[0] === '@' ? username : `@${username}`) : ''}
        onTextChange={setUsername}
        onChannelSelect={onSelect}
        onSelectionChange={() => null}
      />
    </ModalFullScreen>
  );
}

export default withErrorBoundaryScreen(
  ChannelSelectScreen,
  'ChannelSelectScreen',
);
