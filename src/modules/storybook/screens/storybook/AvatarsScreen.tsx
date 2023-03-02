import React from 'react';
import { Button, Layout, View, Icons, Text, Avatar } from '@minds/ui';
import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Stack } from '@tamagui/core';

export function AvatarsScreen(): JSX.Element {
  const { goBack, navigate } = useNavigation();
  return (
    <Layout f={1} p={'$4'}>
      <ScrollView>
        <Text size={'$h3'}>Avatars</Text>
        <Stack f={1} fw={'wrap'} br={'$4'} mt="$2" fd="row">
          <Avatar circular size="$6">
            <Avatar.Image src="http://placekitten.com/200/300" />
            <Avatar.Fallback bc="red" />
          </Avatar>
          <Text>aaa</Text>
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
