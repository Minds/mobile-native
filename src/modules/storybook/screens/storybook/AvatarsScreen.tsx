// @ts-nocheck TODO: fix TS errors of tamagui
import React from 'react';
import {
  Button,
  Layout,
  View,
  Icons,
  Text,
  Avatar,
  AvatarProps,
} from '@minds/ui';
import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Stack } from '@tamagui/core';

export function AvatarsScreen(): JSX.Element {
  const { goBack, navigate } = useNavigation();
  return (
    <Layout f={1} p="$4">
      <ScrollView>
        <Text size="$h3">Avatars</Text>
        <Stack f={1} fw="wrap" br="$4" mt="$2" fd="row" jc="space-evenly">
          {urls.map((props, index) => (
            <Avatar
              key={index}
              {...props}
              onPress={() => navigate('IconButtons')}
            />
          ))}
        </Stack>
      </ScrollView>
      <View fd="row" mt="$1" space>
        <Button circular icon={Icons.Chevron} onPress={goBack} />
        <Button
          onPress={() => navigate('Controls')}
          iconAfter={Icons.Send}
          f={1}>
          Next
        </Button>
      </View>
    </Layout>
  );
}

const urls: AvatarProps[] = [
  {
    sSize: 'm',
    bordered: true,
    url: 'https://cdn.mindsr.com/icon/100000000000000341/medium/1676052229',
  },
  {
    sSize: 'm',
    bordered: true,
    url: 'https://cdn.minds.com/icon/1408746572459544588/medium/1676459060',
  },
  {
    sSize: 'm',
    bordered: true,
    url: 'https://cdn.minds.com/icon/626772382194872329/medium/1611595285',
  },
  {
    sSize: 'm',
    bordered: true,
    url: 'https://cdn.minds.com/icon/1420561986541850644/medium/1674609683',
  },
  {
    sSize: 'l',
    bordered: true,
    url: 'https://cdn.minds.com/icon/1184968020204724236/medium/1674730259',
  },
  {
    sSize: 'l',
    url: 'https://cdn.minds.com/icon/619002093448998913/medium/1630629652',
  },
  {
    sSize: 'l',
    url: 'https://cdn.minds.com/icon/1290765754609700877/medium/1674156417',
  },
  {
    sSize: 'l',
    url: 'https://cdn.mindsr.com/icon/100000000000000341/medium/1676052229',
  },
  {
    sSize: 'xl',
    url: 'https://cdn.minds.com/icon/1196157469932396557/medium/1672989810',
    bordered: true,
  },
  {
    sSize: 'xl',
    url: 'https://cdn.minds.com/icon/1290765754609700877/medium/1674156417',
  },
  {
    sSize: 'xl',
    url: 'https://cdn.mindsr.com/icon/100000000000000341/medium/1676052229',
    bordered: true,
  },
];
