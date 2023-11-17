// @ts-nocheck TODO: fix TS errors of tamagui
import React from 'react';
import { Button, Layout, View, Icons, Text, icons } from '@minds/ui';
import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Stack } from '@tamagui/core';

export function IconsScreen(): JSX.Element {
  const { goBack, navigate } = useNavigation();
  return (
    <Layout f={1} p={'$4'}>
      <ScrollView>
        <Text size={'$h3'}>Default size</Text>
        <Stack f={1} fw={'wrap'} br={'$4'} mt="$2" fd="row">
          {Object.keys(icons).map(key =>
            React.createElement(icons[key], { key }),
          )}
        </Stack>
        <Text mt={'$5'} size={'$h3'}>
          Size 48
        </Text>
        <Stack f={1} fw={'wrap'} br={'$4'} mt="$2" fd="row">
          {Object.keys(icons).map(key =>
            React.createElement(icons[key], { size: 48, key }),
          )}
        </Stack>
      </ScrollView>
      <View fd={'row'} mt="$1" space>
        <Button circular icon={Icons.Chevron} onPress={goBack} />
        <Button
          onPress={() => navigate('IconButtons')}
          iconAfter={Icons.Send}
          f={1}>
          Next
        </Button>
      </View>
    </Layout>
  );
}
