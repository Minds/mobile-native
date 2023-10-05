// @ts-nocheck TODO: fix TS errors of tamagui
import React from 'react';
import { styled, Stack, GetProps, AnimationProp } from '@tamagui/core';
import { Pressable, ScrollView, ViewProps } from 'react-native';
import { Text } from './Text';

const TabBarFrame = styled(ScrollView, {
  name: 'TabBar',
  backgroundColor: '$background',
  horizontal: true,
  showsHorizontalScrollIndicator: false,
});

type TabBarFrameProps = GetProps<typeof TabBarFrame>;

type TabDef = {
  title: string;
};

type ExtraProps = {
  tabs: Array<TabDef>;
  initial?: number;
  onChange?: (number) => void;
  animation?: AnimationProp | null | undefined;
};

type TabBarItemsProps = {
  index: number;
  positions: Array<{ x: number; width: number }>;
  setIndex: (number) => void;
  setReady: (boolean) => void;
} & ExtraProps;

const TabBarItems = React.memo<TabBarItemsProps>(
  ({ index, onChange, initial, tabs, positions, setIndex, setReady }) => (
    <>
      {tabs.map((tab, i) => (
        <Item
          key={`${i}`}
          active={index === i}
          onLayout={event => {
            positions[i] = event.nativeEvent.layout;
            if (i === initial) {
              setReady(true);
            }
          }}
          onPress={() => {
            setIndex(i);
            onChange?.(i);
          }}>
          {tab.title}
        </Item>
      ))}
    </>
  ),
);

const defaultPosition = [{ x: 0, width: 0 }];

type AnimatedIndicatorProps = {
  x: number;
  width: number;
  animation?: AnimationProp | null | undefined;
};

const AnimatedIndicator = ({
  x = 0,
  width = 0,
  animation,
}: AnimatedIndicatorProps) => {
  return (
    <Stack
      animation={animation}
      backgroundColor="$action"
      height="$0.6"
      width={width}
      y={33}
      x={x}
      position="absolute"
    />
  );
};

const ItemContainer = styled(Stack, {
  name: 'ItemContainer',
  justifyContent: 'center',
  marginRight: '$5',
  paddingVertical: '$2',
  variants: {
    active: {
      true: {
        // Here we can add further style for the active tab
      },
    },
  },
});

const Item = ({
  children,
  active,
  onPress,
  onLayout,
}: {
  children: string;
  active?: boolean;
  onPress: () => void;
  onLayout?: ViewProps['onLayout'];
}) => {
  return (
    <ItemContainer active={active} onLayout={onLayout}>
      <Pressable onPress={onPress}>
        <Text
          size="$b1"
          weight="medium"
          textAlign="center"
          color={active ? '$colorTextPrimary' : '$colorTextSecondary'}>
          {children}
        </Text>
      </Pressable>
    </ItemContainer>
  );
};

export const TabBar = TabBarFrame.extractable(
  ({
    tabs,
    initial = 0,
    onChange,
    animation = 'bouncy',
    ...props
  }: TabBarFrameProps & ExtraProps) => {
    const [index, setIndex] = React.useState(initial);
    const [ready, setReady] = React.useState(false);

    const positions = React.useRef(defaultPosition).current;

    return (
      <TabBarFrame {...props}>
        <TabBarItems
          index={index}
          onChange={onChange}
          initial={initial}
          tabs={tabs}
          positions={positions}
          setIndex={setIndex}
          setReady={setReady}
        />
        {ready && (
          <AnimatedIndicator
            animation={animation}
            x={positions[index].x}
            width={positions[index].width}
          />
        )}
      </TabBarFrame>
    );
  },
);
