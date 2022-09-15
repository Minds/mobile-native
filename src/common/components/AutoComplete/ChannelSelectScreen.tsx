import { RouteProp } from '@react-navigation/core';
import React, { useCallback, useState } from 'react';
import UserModel from '../../../channel/UserModel';
import NavigationService from '../../../navigation/NavigationService';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import i18nService from '../../services/i18n.service';
import { ModalFullScreen } from '../../ui';
import InputContainer from '../InputContainer';
import AutoComplete from './AutoComplete';

type ChannelSelectScreenRoute = RouteProp<
  RootStackParamList,
  'ChannelSelectScreen'
>;

interface ChannelSelectScreenProps {
  route?: ChannelSelectScreenRoute;
}

export default function ChannelSelectScreen({
  route,
}: ChannelSelectScreenProps) {
  const [username, setUsername] = useState(route?.params?.username || '');

  const onSelect = useCallback(
    (channel: UserModel) => {
      NavigationService.goBack();
      route?.params?.onSelect(channel);
    },
    [route],
  );

  return (
    <ModalFullScreen back title={i18nService.t('channelSelect.title')}>
      <InputContainer
        placeholder={i18nService.t('auth.username')}
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
