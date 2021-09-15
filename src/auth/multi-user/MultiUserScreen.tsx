import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import MenuItem from '../../common/components/menus/MenuItem';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import LoggedUsersList from './logged-users/LoggedUsersList';

type PropsType = {};

const MultiUserScreen = ({}: PropsType) => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();

  const options = React.useMemo(
    () => ({
      create: {
        title: i18n.t('multiUser.create'),
        onPress: () => navigation.navigate('MultiUserRegister'),
      },
      login: {
        title: i18n.t('multiUser.login'),
        onPress: () => navigation.navigate('MultiUserLogin'),
      },
    }),
    [navigation],
  );

  return (
    <View style={theme.flexContainer}>
      <LoggedUsersList />
      <View style={theme.marginTop10x}>
        <MenuItem
          item={options.create}
          containerItemStyle={theme.bgPrimaryBackgroundHighlight}
        />
        <MenuItem
          item={options.login}
          containerItemStyle={theme.bgPrimaryBackgroundHighlight}
          testID="multiUserLogin"
        />
      </View>
    </View>
  );
};

export default MultiUserScreen;
