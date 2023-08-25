import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';

import { Button, Screen, ScreenSection } from '~/common/ui';
import Header from '../components/Header';
import UserModel from '~/channel/UserModel';
import useApiQuery from '~/services/hooks/useApiQuery';
import CenteredLoading from '~/common/components/CenteredLoading';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { ChannelRecommendationItem } from '~/modules/recommendation';

function ChannelsScreen({ navigation }) {
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

export default withErrorBoundaryScreen(ChannelsScreen);

const Body = () => {
  const { channels, isLoading } = useSuggestedChannels();
  return (
    <ScrollView>
      {isLoading && <CenteredLoading />}
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

type ApiResponse = {
  entities: Array<{ entity: UserModel }>;
};

const useSuggestedChannels = () => {
  const query = useApiQuery<ApiResponse>(
    ['suggestedchannels'],
    'api/v3/recommendations',
    {
      limit: 12,
      location: 'newsfeed',
    },
  );
  const channels = React.useMemo(
    () =>
      query.data?.entities
        ? UserModel.createMany(query.data.entities.map(item => item.entity))
        : null,
    [query.data],
  );

  return { ...query, channels };
};
