// @ts-nocheck TODO: fix TS errors of tamagui
import React from 'react';
import {
  Button,
  Icons,
  Layout,
  Progress,
  RadioGroup,
  Slider,
  Switch,
  Text,
  View,
} from '@minds/ui';
import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { XStack, YStack } from '@tamagui/stacks';

export function ControlsScreen(): JSX.Element {
  const { goBack, navigate } = useNavigation();
  const [progress, setProgress] = React.useState(70);
  return (
    <Layout f={1} p={'$4'}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text size="$h1" textAlign="center">
          Switch
        </Text>

        <Switches />

        <Text size="$h1" textAlign="center" mt="$5">
          Radio
        </Text>
        <Text size="$h4" mt="$5" mb="$2">
          Horizontal
        </Text>
        <RadioGroup onValueChange={v => console.log(v)} initialValue="a">
          <XStack space="$4">
            <RadioGroup.Item label="Select" value="a" />
            <RadioGroup.Item label="One" value="b" />
            <RadioGroup.Item label="Value" value="c" />
          </XStack>
        </RadioGroup>
        <Text size="$h4" mt="$5" mb="$2">
          Vertical
        </Text>
        <RadioGroup onValueChange={v => console.log(v)} initialValue="a">
          <YStack space="$4">
            <RadioGroup.Item label="Select" value="a" />
            <RadioGroup.Item label="One" value="b" />
          </YStack>
        </RadioGroup>

        <YStack space="$4">
          <Text size="$h1" textAlign="center" mt="$5">
            Progress
          </Text>
          <Progress value={progress} />
          <Button
            sSize="s"
            mode="outline"
            onPress={() => setProgress(Math.random() * 100)}>
            Random
          </Button>
        </YStack>
        <YStack space="$4">
          <Text size="$h1" textAlign="center" mt="$5">
            Slider
          </Text>
          <Slider width={301} defaultValue={[50]} max={100} step={1} />
        </YStack>
      </ScrollView>
      <View fd={'row'} mt="$1" space>
        <Button icon={Icons.Chevron} circular onPress={goBack} />
        <Button
          iconAfter={Icons.Send}
          f={1}
          onPress={() => navigate('TextInputs')}>
          Next
        </Button>
      </View>
    </Layout>
  );
}

function Switches() {
  const [active, setActive] = React.useState(Boolean(false));
  return (
    <View f={1} p="$3" space="$3" flexDirection="row">
      <Text size="$h4">controled</Text>
      <Switch checked={active} onPress={() => setActive(v => !v)} />
      <Text size="$h4">un-controled</Text>
      <Switch />
    </View>
  );
}
