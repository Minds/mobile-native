// @ts-nocheck TODO: fix TS errors of tamagui
import { Button, Icons, Layout, ListItem, Text, View } from '@minds/ui';
import { useNavigation } from '@react-navigation/native';
import { Stack } from '@tamagui/core';
import React, { useReducer } from 'react';
import { ScrollView } from 'react-native';
import ErrorBoundary from '~/common/components/ErrorBoundary';
import SettingInput from '~/common/components/SettingInput';
import MenuItemOption from '~/common/components/menus/MenuItemOption';

export function ListItemsScreen(): JSX.Element {
  const { goBack, navigate } = useNavigation();
  return (
    <Layout f={1} p={'$4'} bg="$backgroundTertiary">
      <ScrollView>
        <Stack f={1} br={'$4'} mt="$2" fd="row">
          <ListItems />
        </Stack>
      </ScrollView>
      <View fd={'row'} mt="$1" space>
        <Button icon={Icons.Chevron} circular onPress={goBack} />
        <Button iconAfter={Icons.Send} f={1} onPress={() => navigate('Icons')}>
          Next
        </Button>
      </View>
    </Layout>
  );
}

function ListItems(): JSX.Element {
  const [
    { title, subtitle, leftIcon, avatar, rightIcon, pressable },
    setState,
  ] = useReducer((prevState, nextState) => ({ ...prevState, ...nextState }), {
    title: 'Example title',
    subtitle: 'Example subtitle',
    leftIcon: true,
    rightIcon: false,
    avatar: false,
    pressable: true,
  });

  return (
    <View f={1}>
      <ErrorBoundary>
        <Text my="$4" size="$h3">
          Options
        </Text>
        <View bc="$background" br="$2" ov="hidden">
          <SettingInput
            placeholder={'Title'}
            onChangeText={t => setState({ title: t })}
            value={title}
          />
          <SettingInput
            placeholder={'Subtitle'}
            onChangeText={t => setState({ subtitle: t })}
            value={subtitle}
          />
          <MenuItemOption
            title="Avatar"
            onPress={() => setState({ avatar: !avatar })}
            mode="checkbox"
            selected={avatar}
          />
          <MenuItemOption
            title="Left Icon"
            onPress={() => setState({ leftIcon: !leftIcon })}
            mode="checkbox"
            selected={leftIcon}
          />
          <MenuItemOption
            title="Right Icon"
            onPress={() => setState({ rightIcon: !rightIcon })}
            mode="checkbox"
            selected={rightIcon}
          />
          <MenuItemOption
            title="Pressable"
            onPress={() => setState({ pressable: !pressable })}
            mode="checkbox"
            selected={pressable}
          />
        </View>

        <Text my="$4" size="$h3">
          ListItem
        </Text>
        <View bc="$background" br="$2" ov="hidden">
          <ListItem
            title={title}
            subtitle={subtitle}
            avatarUrl={avatar ? AVATAR_URL : undefined}
            leftIcon={leftIcon && 'boost'}
            rightIcon={rightIcon && 'boost'}
            onPress={pressable ? () => null : undefined}
          />
        </View>
      </ErrorBoundary>
    </View>
  );
}

const AVATAR_URL =
  'https://cdn.mindsr.com/icon/100000000000000341/medium/1676052229';
