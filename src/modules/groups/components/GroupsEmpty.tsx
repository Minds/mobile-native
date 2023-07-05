import { useNavigation } from '@react-navigation/native';
import BaseNotice from '~/common/components/in-feed-notices/notices/BaseNotice';

export function GroupsEmpty() {
  const navigation = useNavigation();
  const navigateToDiscovery = () => navigation.navigate('GroupsDiscovery');

  return (
    <BaseNotice
      dismissable={false}
      iconName="group"
      btnText="Discover"
      description="Don't miss out on the discourse. Discover your community"
      title="You are not in any groups at the moment"
      onPress={navigateToDiscovery}
    />
  );
}
