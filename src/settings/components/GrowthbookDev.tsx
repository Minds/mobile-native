import React, { useState } from 'react';
import {
  B1,
  B2,
  B3,
  Column,
  H3,
  Row,
  ScreenSection,
  Spacer,
} from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import Selector from '~/common/components/SelectorV2';
import PressableScale from '~/common/components/PressableScale';
import Input from '~/common/components/Input';
import mindsConfigService from '~/common/services/minds-config.service';

type FeatureFlagObj = { [key: string]: boolean | string };

/**
 * PostHog (previously growthbook) DevTools
 * These are broken and do not do anything at the moment
 */
const GrowthbookDev = () => {
  const [forcedFeatureValues, setForcedFeatureValues] = useState<
    Record<string, any>
  >({});
  const [filter, setFilter] = useState('');

  const featureFlags = mindsConfigService.getSettings().posthog
    .feature_flags as FeatureFlagObj;

  const selectFeatureValue = (name, value) => {
    console.log('selectFeatureValue', name, value);
    if (value !== undefined) {
      const newForced = { ...forcedFeatureValues, [name]: value };
      // gb?.setForcedFeatures(new Map(Object.entries(newForced)));
      setForcedFeatureValues(newForced);
    } else {
      const newForced = { ...forcedFeatureValues };
      delete newForced[name];
      // gb?.setForcedFeatures(new Map(Object.entries(newForced)));
      setForcedFeatureValues(newForced);
    }
  };
  return (
    <>
      <ScreenSection vertical="L">
        <H3>Feature Flags</H3>
        <Input onChangeText={setFilter} />
      </ScreenSection>

      {Object.entries(featureFlags)
        .filter(([name]) => name.includes(filter))
        .reverse() // reverse so the more recent features are on top
        .map(([key, value]) => {
          return (
            <FeatureItem
              key={`${key}-ff`}
              titleColor="secondary"
              name={key}
              feature={key}
              result={{ value }}
              isForced={forcedFeatureValues[key] !== undefined}
              onSelectValue={v => selectFeatureValue(key, v.value)}
            />
          );
        }) || null}
    </>
  );
};

export default GrowthbookDev;

/**
 * Feature List Item
 */
const FeatureItem = ({
  name,
  feature,
  isForced,
  onSelectValue,
  result,
  titleColor,
}) => {
  const [showDetail, setShowDetail] = useState(false);
  const theme = ThemedStyles.style;
  return (
    <Column
      containerStyle={ThemedStyles.style.bgSecondaryBackground}
      bottom="S">
      <Spacer space="L">
        <Row align="centerBetween">
          <PressableScale
            onPress={() => setShowDetail(!showDetail)}
            style={[
              theme.bgTertiaryBackground,
              theme.borderRadius3x,
              theme.padding,
              theme.paddingHorizontal2x,
            ]}>
            <B1 color={titleColor} onPress={() => setShowDetail(!showDetail)}>
              {name}
            </B1>
          </PressableScale>

          {result && (
            <Selector
              onItemSelect={onSelectValue}
              data={selectData}
              valueExtractor={v => v.label}
              keyExtractor={d => d.value}>
              {show => (
                <B1
                  testID={`${name}:select`}
                  color={isForced ? 'link' : 'secondary'}
                  onPress={() => show(name)}>
                  {JSON.stringify(result.value)}
                </B1>
              )}
            </Selector>
          )}
        </Row>

        {showDetail && (
          <Column>
            <B2 color="tertiary" top="S">
              Source: {result.source}
            </B2>
            <B3 color="tertiary" top="S">
              {JSON.stringify(feature, null, 4)}
            </B3>
          </Column>
        )}
      </Spacer>
    </Column>
  );
};

const selectData = [
  { label: 'On', value: true },
  { label: 'Off', value: false },
  { label: 'None (Feature)', value: undefined },
];
