import React, { useCallback } from 'react';
import { View } from 'react-native';

import TextInput from '~/common/components/TextInput';
import i18n from '~/common/services/i18n.service';
import {
  B1,
  B2,
  B3,
  Button,
  Column,
  H3,
  IconCircled,
  Row,
  Screen,
  ScreenSection,
} from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import {
  GetRssFeedsQuery,
  useCreateRssFeedMutation,
  useGetRssFeedsQuery,
  useRefreshRssFeedMutation,
  useRemoveRssFeedMutation,
} from '~/graphql/api';
import { UseQueryResult } from '@tanstack/react-query';
import { showNotification } from 'AppMessages';
import PressableScale from '~/common/components/PressableScale';

export default function RssScreen() {
  const rssFeed = useGetRssFeedsQuery();

  return (
    <Screen scroll>
      <ScreenSection>
        <ScreenSection>
          <B1 color="secondary" align="center" horizontal="S">
            {i18n.t('settings.rssScreen.description')}
          </B1>
        </ScreenSection>
        <ScreenSection>
          <H3 font="medium" vertical="M">
            {i18n.t('settings.rssScreen.addFeedTitle')}
          </H3>
          <AddRssFeed rssFeed={rssFeed} />
        </ScreenSection>
        <ScreenSection>
          <H3 font="medium" top="M">
            {i18n.t('settings.rssScreen.activeFeedsTitle')}
          </H3>
          <B1 color="secondary" vertical="S">
            {i18n.t('settings.rssScreen.activeDescription')}
          </B1>
          <RssFeedsList rssFeed={rssFeed} />
        </ScreenSection>
      </ScreenSection>
    </Screen>
  );
}

const AddRssFeed = ({
  rssFeed,
}: {
  rssFeed: UseQueryResult<GetRssFeedsQuery, unknown>;
}) => {
  const mutation = useCreateRssFeedMutation<{ message?: string }>();
  const [text, setText] = React.useState('');

  /**
   * Create feed
   */
  const create = useCallback(() => {
    if (!text) {
      showNotification('Please enter a valid URL');
      return;
    }
    mutation.mutate(
      { url: text },
      {
        onSuccess() {
          setText('');
          rssFeed.refetch();
        },
        onError(error) {
          console.log('[RssScreen] add feed error', error);
          showNotification(error?.message || 'Error adding feed');
        },
      },
    );
  }, [mutation, rssFeed, text]);

  return (
    <>
      <TextInput style={styles.input} value={text} onChangeText={setText} />
      <Button
        type="action"
        mode="outline"
        align="start"
        vertical="L"
        onPress={create}
        disabled={mutation.isLoading}>
        {i18n.t('settings.rssScreen.addFeed')}
      </Button>
    </>
  );
};

const RssFeedsList = ({
  rssFeed,
}: {
  rssFeed: UseQueryResult<GetRssFeedsQuery, unknown>;
}) => {
  return (
    <View>
      {rssFeed.data?.rssFeeds.map(item => (
        <Item rssFeed={rssFeed} item={item} key={item.feedId} />
      ))}
    </View>
  );
};

const Item = ({ rssFeed, item }) => {
  const removeMutation = useRemoveRssFeedMutation();
  const refreshMutation = useRefreshRssFeedMutation();

  /**
   * Refresh feed
   */
  const refresh = useCallback(() => {
    refreshMutation.mutate(
      { feedId: item.feedId },
      {
        onSuccess: () => {
          showNotification(i18n.t('settings.rssScreen.feedRefreshed'));
          rssFeed.refetch();
        },
        onError: error => {
          console.log('[RssScreen] refresh feed error', error);
        },
      },
    );
  }, [refreshMutation, rssFeed, item]);
  /**
   * Remove feed
   */
  const remove = useCallback(() => {
    removeMutation.mutate(
      { feedId: item.feedId },
      {
        onSuccess: () => {
          showNotification(i18n.t('settings.rssScreen.feedRemoved'));
          rssFeed.refetch();
        },
        onError: error => {
          showNotification('Error deleting feed. Please try again');
          console.log('[RssScreen] delete feed error', error);
        },
      },
    );
  }, [removeMutation, rssFeed, item]);

  return (
    <Column vertical="S">
      <B1>{item.title}</B1>
      <B2 color="secondary" top="XXS">
        {item.url}
      </B2>
      <B3 color="secondary" top="XS">
        {item.lastFetchAtTimestamp
          ? i18n.t('settings.rssScreen.updated', {
              date: i18n.date(
                item.lastFetchAtTimestamp * 1000,
                'friendly',
                '',
                true,
              ),
            })
          : i18n.t('settings.rssScreen.notSynced')}
      </B3>
      <Row top="M" containerStyle={styles.iconBar}>
        <PressableScale onPress={refresh}>
          <IconCircled name="refresh" size="tiny" />
        </PressableScale>
        <PressableScale onPress={remove}>
          <IconCircled name="close" size="tiny" />
        </PressableScale>
      </Row>
    </Column>
  );
};

const styles = ThemedStyles.create({
  input: [
    'colorPrimaryText',
    'border',
    'borderRadius3x',
    'bcolorPrimaryBorder',
    'paddingHorizontal3x',
    'paddingVertical2x',
    'marginVertical3x',
    { height: 40 },
  ],
  iconBar: {
    gap: 12,
  },
});
