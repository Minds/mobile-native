import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsListScreen from '~/groups/GroupsListScreen';
import { GroupScreen } from '~/modules/groups';

export type GroupStackParamList = {
  Groups: {};
  GroupView: {};
};

const GroupStackNav = createNativeStackNavigator<GroupStackParamList>();
export default function () {
  return (
    <GroupStackNav.Navigator screenOptions={{ headerShown: false }}>
      <GroupStackNav.Screen name="Groups" component={GroupsListScreen} />
      <GroupStackNav.Screen name="GroupView" component={GroupScreen} />
    </GroupStackNav.Navigator>
  );
}
