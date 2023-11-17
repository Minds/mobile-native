// @ts-nocheck TODO: fix TS errors of tamagui
import React from 'react';
import { Button, Layout, View, Icons, Text, IconButton } from '@minds/ui';
import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Stack } from '@tamagui/core';
import { IconNames, icons } from '@minds/ui/icons';

export function IconButtonsScreen(): JSX.Element {
  const { goBack, navigate } = useNavigation();
  return (
    <Layout f={1} p={'$4'}>
      <ScrollView>
        <Text size={'$h3'}>IconButtons</Text>
        <Stack f={1} fw={'wrap'} br={'$4'} mt="$2" fd="row">
          {Object.keys(icons).map(key => (
            <IconButton key={key} name={key as IconNames} />
          ))}
        </Stack>
      </ScrollView>
      <View fd={'row'} mt="$1" space>
        <Button circular icon={Icons.Chevron} onPress={goBack} />
        <Button onPress={() => navigate('Tab')} iconAfter={Icons.Send} f={1}>
          Next
        </Button>
      </View>
    </Layout>
  );
}
