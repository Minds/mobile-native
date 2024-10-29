import React from 'react';
import { observer } from 'mobx-react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderComponent from '../../../common/components/HeaderComponent';
import UserNamesComponent from '../../../common/components/UserNamesComponent';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import type { SupportTiersType } from '../../../wire/WireTypes';
import JoinMembership from './JoinMembership';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';
import { useStyle } from '~/styles/hooks';

const isIos = Platform.OS === 'ios';

type JoinMembershipScreenRouteProp = RouteProp<
  RootStackParamList,
  'JoinMembershipScreen'
>;
type JoinMembershipScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'JoinMembershipScreen'
>;

type PropsType = {
  route: JoinMembershipScreenRouteProp;
  navigation: JoinMembershipScreenNavigationProp;
  tiers?: Array<SupportTiersType>;
};

const JoinMembershipScreen = observer(({ route, navigation }: PropsType) => {
  const { entity, user: paramUser } = route.params;
  const user = entity?.ownerObj || paramUser;
  const insets = useSafeAreaInsets();
  const cleanTop = { marginTop: insets.top + (isIos ? 60 : 50) };

  return (
    <View style={useStyle(cleanTop, styles.contentContainer)}>
      {!!user && (
        <>
          <HeaderComponent user={user} />
          <UserNamesComponent user={user} />
        </>
      )}

      <JoinMembership route={route} navigation={navigation} />
    </View>
  );
});

const styles = sp.styles.create({
  contentContainer: [
    'bgSecondaryBackground',
    {
      flex: 1,
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      overflow: 'hidden',
    },
  ],
});

export default withErrorBoundaryScreen(
  JoinMembershipScreen,
  'JoinMembershipScreen',
);
