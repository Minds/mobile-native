import React from 'react';
import { Button, Screen, ScreenSection } from '~/common/ui';
import Header from '../components/Header';
import { ChannelRecommendationItem } from '~/common/components/ChannelRecommendation/ChannelRecommendationBody';
import sessionService from '~/common/services/session.service';
import { ScrollView } from 'react-native-gesture-handler';
import UserModel from '~/channel/UserModel';

export default function ChannelsScreen({ navigation }) {
  return (
    <Screen safe>
      <Header
        title="Subscribe"
        description="You’ll see posts from people you subscribe to on your newsfeed."
        skip
        onSkip={() => navigation.navigate('OnboardingGroups')}
      />
      <Body />
      <ScreenSection bottom="L">
        <Button
          type="action"
          size="large"
          onPress={() => navigation.navigate('OnboardingGroups')}>
          Continue
        </Button>
      </ScreenSection>
    </Screen>
  );
}

const Body = () => {
  const channels = useSuggestedChannels();
  return (
    <ScrollView>
      {channels &&
        channels.map(channel => (
          <ChannelRecommendationItem
            channel={channel}
            key={channel.guid}
            disableNavigation
          />
        ))}
    </ScrollView>
  );
};

const useSuggestedChannels = (): null | UserModel[] => {
  const [channels, setChannels] = React.useState(null);
  React.useEffect(() => {
    setTimeout(() => {
      setChannels([sessionService.getUser()]);
    }, 2000);
  }, []);
  return channels;
};
