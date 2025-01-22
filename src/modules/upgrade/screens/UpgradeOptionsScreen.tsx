import React from 'react';
import { ColorValue } from 'react-native';

import {
  B1,
  B2,
  Button,
  H1,
  H2,
  IIcon,
  Icon,
  IconCircled,
  PressableLine,
  Row,
  Screen,
  Spacer,
} from '~/common/ui';
import GradientBorderView from '~/common/components/GradientBorderView';

import { GOOGLE_PLAY_STORE } from '~/config/Config';
import CenteredLoading from '~/common/components/CenteredLoading';
import { useUpgradeData } from '../hooks/useUpgradeData';
import { Bullets, UpgradeCardsMap } from '../types';
import iconMap from '../util/iconMap';
import sp from '~/services/serviceProvider';
import { openLinkInInAppBrowser } from '~/common/services/inapp-browser.service';

export default function UpgradeOptionsScreen() {
  const { isLoading, options } = useUpgradeData();
  return (
    <Screen scroll>
      {isLoading ? (
        <CenteredLoading />
      ) : (
        <Spacer bottom="XXXL">
          <UpgradeHero data={options.hero} />
          <MindsPlusSection data={options.plus} />
          <MindsProSection data={options.pro} />
          <ServerSection data={options.networks} />
        </Spacer>
      )}
    </Screen>
  );
}

const UpgradeHero = ({ data }: { data: UpgradeCardsMap['hero'] }) => (
  <Spacer horizontal="L" top="L">
    <GradientBorderView
      colors={SupermindGradient}
      borderWidth={4}
      borderRadius={25}
      start={start}
      end={end}
      innerStyle={styles.upgradeContainer}>
      <H1 align="center" font="bold">
        {data.title}
      </H1>
      <Starting priceArray={data.priceTextArray} />

      {!GOOGLE_PLAY_STORE && (
        <PressableLine
          onPress={() =>
            openLinkInInAppBrowser('https://www.minds.com/about/upgrades')
          }>
          <Row align="centerBoth" top="L">
            <B1 align="center" style={styles.fontStyle} right="S">
              {data.linkText}
            </B1>
            <Icon name="arrow-right" size="medium" />
          </Row>
        </PressableLine>
      )}
    </GradientBorderView>
  </Spacer>
);

const Starting = ({ priceArray }) =>
  priceArray ? (
    <B2 top="L">
      {priceArray[0]}
      <B1 font="bold">${priceArray[1]}</B1>
      {priceArray[2]}
    </B2>
  ) : null;

const BulletsList = ({
  bullets,
  iconBackground,
}: {
  bullets: Bullets;
  iconBackground?: ColorValue;
}) =>
  bullets ? (
    <Spacer top="XL" containerStyle={styles.gap}>
      {bullets.map((bullet, index) => (
        <IconRow
          key={index}
          name={iconMap(bullet.iconId || undefined)}
          text={bullet.displayText}
          iconBackground={iconBackground}
        />
      ))}
    </Spacer>
  ) : null;

/**
 * Section components
 */

const MindsPlusSection = ({ data }: { data: UpgradeCardsMap['plus'] }) => (
  <GradientContainer colors={['#424448', '#111113', '#000000']}>
    <IconTitle name={iconMap(data.titleIconId)} text={data.title} />
    <Starting priceArray={data.priceTextArray} />
    <BulletsList bullets={data.bullets} />
    <Button
      size="large"
      top="XL2"
      align="center"
      onPress={() => {
        sp.navigation.navigate('UpgradeScreen', {
          onComplete: () => sp.navigation.goBack(),
        });
      }}>
      Get Minds+
    </Button>
  </GradientContainer>
);

const MindsProSection = ({ data }: { data: UpgradeCardsMap['pro'] }) => (
  <GradientContainer colors={['#7A6323', '#0F0F10', '#000000']}>
    <IconTitle name={iconMap(data.titleIconId)} text={data.title} />
    <Starting priceArray={data.priceTextArray} />
    <BulletsList bullets={data.bullets} iconBackground="#54420E" />

    <Button
      size="large"
      top="XL2"
      align="center"
      type="action"
      onPress={() => {
        sp.navigation.navigate('UpgradeScreen', {
          pro: true,
          onComplete: () => sp.navigation.goBack(),
        });
      }}>
      Get Minds Pro
    </Button>
  </GradientContainer>
);

const ServerSection = ({ data }: { data: UpgradeCardsMap['networks'] }) => (
  <GradientContainer colors={['#4E1556', '#0F0F10', '#000000']}>
    <IconTitle name={iconMap(data.titleIconId)} text={data.title} />
    <Starting priceArray={data.priceTextArray} />
    <BulletsList bullets={data.bullets} iconBackground="#4C1555" />

    {!GOOGLE_PLAY_STORE && (
      <PressableLine
        onPress={() =>
          openLinkInInAppBrowser('https://www.minds.com/about/networks')
        }>
        <Button
          size="large"
          top="XL2"
          align="center"
          mode="outline"
          overlayStyle={{ borderColor: '#A02BB3' }}>
          Learn more
        </Button>
      </PressableLine>
    )}
  </GradientContainer>
);

/**
 * Utility components
 */

const IconRow = ({
  name,
  text,
  iconBackground,
}: {
  name: IIcon['name'];
  text: string;
  iconBackground?: ColorValue;
}) => (
  <Row align="centerStart">
    <IconCircled
      name={name}
      size="tiny"
      color="PrimaryText"
      backgroundColor={iconBackground}
      style={styles.icons}
    />
    <B1 style={styles.bulletText}>{text}</B1>
  </Row>
);

const IconTitle = ({ name, text }) => (
  <Row align="centerBetween">
    <H2 font="bold" flat>
      {text}
    </H2>
    <Icon name={name} size="medium" color="PrimaryText" />
  </Row>
);

const GradientContainer = ({ children, colors }) => (
  <Spacer horizontal="L" top="L">
    <GradientBorderView
      colors={colors}
      borderWidth={0}
      borderRadius={25}
      start={startVertical}
      end={endVertical}
      style={styles.gradientBorderView}
      innerStyle={styles.innerContainer}>
      {children}
    </GradientBorderView>
  </Spacer>
);

const SupermindGradient = ['#83E4D4', '#FFD048'] as readonly [string, string];
const start = { x: 0, y: 0 };
const end = { x: 1, y: 0 };
const startVertical = { x: 0, y: 0 };
const endVertical = { x: 0, y: 1 };

const styles = sp.styles.create({
  gradientBorderView: ['border', 'bcolorPrimaryBorder'],
  icons: ['marginRight3x'],
  bulletText: { flexShrink: 1 },
  innerContainer: {
    padding: 26,
    gap: 16,
  },
  upgradeContainer: ['padding6x', 'bgPrimaryBackground'],
  fontStyle: {
    textDecorationLine: 'underline',
  },
  gap: {
    gap: 16,
  },
});
