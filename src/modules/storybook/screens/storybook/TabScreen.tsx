import React from 'react';
import { Button, Layout, View, Icons, Text, TabBar } from '@minds/ui';
import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';

const tabs = [
  { key: 'first', title: 'First' },
  { key: 'second', title: 'Second' },
  { key: 'third', title: 'Third' },
];

export function TabScreen(): JSX.Element {
  const { goBack } = useNavigation();
  return (
    <Layout f={1} p={'$4'}>
      <ScrollView>
        <Text size={'$h3'}>Default</Text>
        <TabBar tabs={tabs} />
        <Text size={'$h3'} mt="$6">
          Lazy animation
        </Text>
        <TabBar tabs={tabs} animation={'lazy'} />
        <Text size={'$h3'} mt="$6">
          Initial index 1
        </Text>
        <TabBar tabs={tabs} initial={1} />
        <Text size={'$h3'} mt="$6">
          Hardcoded theme
        </Text>
        <TabBar tabs={tabs} theme="dark" />
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
