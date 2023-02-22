import React from 'react';
import { Button, Layout, View, Icons, Text } from '@minds/ui';
import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Stack } from '@tamagui/core';

export function IconsScreen(): JSX.Element {
  const { goBack } = useNavigation();
  return (
    <Layout f={1} p={'$4'}>
      <ScrollView>
        <Text size={'$h3'}>Default size</Text>
        <Stack f={1} fw={'wrap'} br={'$4'} mt="$2" fd="row">
          {Object.keys(icons).map(k => React.createElement(icons[k]))}
        </Stack>
        <Text mt={'$5'} size={'$h3'}>
          Size 48
        </Text>
        <Stack f={1} fw={'wrap'} br={'$4'} mt="$2" fd="row">
          {Object.keys(icons).map(k =>
            React.createElement(icons[k], { size: 48 }),
          )}
        </Stack>
      </ScrollView>
      <View fd={'row'} mt="$1" space>
        <Button icon={Icons.Chevron} circular onPress={goBack} />
        <Button iconAfter={Icons.Send} f={1}>
          Next
        </Button>
      </View>
    </Layout>
  );
}

const icons = {
  Adjust: Icons.Adjust,
  Boost: Icons.Boost,
  Camera: Icons.Camera,
  Chat: Icons.Chat,
  Chevron: Icons.Chevron,
  Clear: Icons.Clear,
  Downvote: Icons.Downvote,
  EllipsisH: Icons.EllipsisH,
  EllipsisV: Icons.EllipsisV,
  Emoji: Icons.Emoji,
  Explicit: Icons.Explicit,
  Gallery: Icons.Gallery,
  Group: Icons.Group,
  Hashtag: Icons.Hashtag,
  Help: Icons.Help,
  Info: Icons.Info,
  Launch: Icons.Launch,
  Lightmode: Icons.Lightmode,
  List: Icons.List,
  Location: Icons.Location,
  Menu: Icons.Menu,
  MindsPlus: Icons.MindsPlus,
  MindsPlusBadge: Icons.MindsPlusBadge,
  Notifications: Icons.Notifications,
  Remind: Icons.Remind,
  Search: Icons.Search,
  Send: Icons.Send,
  Settings: Icons.Settings,
  Supermind: Icons.Supermind,
  SwitchAccount: Icons.SwitchAccount,
  Tags: Icons.Tags,
  Tip: Icons.Tip,
  Upvote: Icons.Upvote,
  VerifiedBadge: Icons.VerifiedBadge,
  Wallet: Icons.Wallet,
};
