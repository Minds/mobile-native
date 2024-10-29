import React from 'react';
import { observer } from 'mobx-react';
import LoggedUserItem from './LoggedUserItem';
import { View } from 'react-native';
import serviceProvider from '~/services/serviceProvider';

type PropsType = {};

const LoggedUsers = observer(({}: PropsType) => {
  return (
    <View>
      {serviceProvider.session.getSessions().map((tokenData, index) => (
        <LoggedUserItem key={index} tokenData={tokenData} index={index} />
      ))}
    </View>
  );
});

export default LoggedUsers;
