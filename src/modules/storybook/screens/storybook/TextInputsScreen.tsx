// @ts-nocheck TODO: fix TS errors of tamagui
import React from 'react';
import { Button, Layout, View, Icons, Text, TextInput } from '@minds/ui';
import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Stack } from '@tamagui/core';

export function TextInputsScreen(): JSX.Element {
  const { goBack, navigate } = useNavigation();
  return (
    <Layout f={1} p={'$4'}>
      <ScrollView>
        <Text size={'$h3'}>TextInputs</Text>
        <Stack f={1} fw={'wrap'} br={'$4'} mt="$2" space>
          <TextInput
            autoFocus
            autoCapitalize="none"
            placeholder="Enter email"
          />
          <TextInput
            autoComplete="password"
            placeholder="Enter password"
            secureTextEntry
          />
          <TextInput placeholder="Enter comment" />
        </Stack>
      </ScrollView>
      <View fd={'row'} mt="$1" space>
        <Button circular icon={Icons.Chevron} onPress={goBack} />
        <Button
          onPress={() => navigate('ListItems')}
          iconAfter={Icons.Send}
          f={1}>
          Next
        </Button>
      </View>
    </Layout>
  );
}
