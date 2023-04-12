import React from 'react';
import { observer } from 'mobx-react';
import sessionService from '../../../common/services/session.service';
import LoggedUserItem from './LoggedUserItem';
import { View } from 'react-native';

type PropsType = {};

const LoggedUsers = observer(({}: PropsType) => {
  return (
    <View>
      {sessionService.getSessions().map((tokenData, index) => (
        <LoggedUserItem key={index} tokenData={tokenData} index={index} />
      ))}
    </View>
  );
});

export default LoggedUsers;
