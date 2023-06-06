import { FeatureResult, useGrowthBook } from '@growthbook/growthbook-react';
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
import { FeatureID, featureList } from 'ExperimentsProvider';

/**
 * Growthbook DevTools
 */
const GrowthbookDev = () => {
  const [forcedFeatureValues, setForcedFeatureValues] = useState<
    Record<string, any>
  >({});
  const [forcedVars, setForcedVars] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState('');

  const gb = useGrowthBook();

  if (!gb) {
    return null;
  }
  const experiments = {};

  gb.getAllResults().forEach((v, k) => {
    if (featureList.includes(k as FeatureID)) {
      experiments[k] = v;
    }
  });

  const features = gb.getFeatures();
  const attr = gb.getAttributes();

  const allFeatures: Record<string, { result?: FeatureResult; feature: any }> =
    {};
  Object.entries(features).forEach(([name, feature]) => {
    if (!experiments[name] && featureList.includes(name as FeatureID)) {
      allFeatures[name] = {
        feature,
        result: gb?.evalFeature(name),
      };
    }
  });

  const selectExperimentValue = (name, value) => {
    console.log('Experiment', name, value);
    if (value !== undefined) {
      const newForced = { ...forcedVars, [name]: value };
      gb?.setForcedVariations(newForced);
      setForcedVars(newForced);
    } else {
      const newForced = { ...forcedVars };
      delete newForced[name];
      gb?.setForcedVariations(newForced);
      setForcedVars(newForced);
    }
  };

  const selectFeatureValue = (name, value) => {
    console.log('selectFeatureValue', name, value);
    if (value !== undefined) {
      const newForced = { ...forcedFeatureValues, [name]: value };
      gb?.setForcedFeatures(new Map(Object.entries(newForced)));
      setForcedFeatureValues(newForced);
    } else {
      const newForced = { ...forcedFeatureValues };
      delete newForced[name];
      gb?.setForcedFeatures(new Map(Object.entries(newForced)));
      setForcedFeatureValues(newForced);
    }
  };
  return (
    <>
      <ScreenSection>
        <Row vertical="L">
          <H3>Experiments</H3>
        </Row>
      </ScreenSection>
      {Object.entries(experiments)
        .reverse() // reverse so the more recent experiments are on top
        .map(([name, experiment]) => {
          return (
            <ExperimentItem
              key={`${name}-exp`}
              titleColor="secondary"
              name={name}
              experiment={experiment}
              isForced={forcedVars[name] !== undefined}
              result={experiments[name].result}
              onSelectValue={v => selectExperimentValue(name, v.value)}
            />
          );
        })}

      <ScreenSection vertical="L">
        <H3>Feature Flags</H3>
        <Input onChangeText={setFilter} />
      </ScreenSection>

      {Object.entries(allFeatures)
        .filter(([name]) => name.includes(filter))
        .reverse() // reverse so the more recent features are on top
        .map(([name, feature]) => {
          return (
            <FeatureItem
              key={`${name}-ff`}
              titleColor="secondary"
              name={name}
              feature={feature.feature}
              result={feature.result}
              isForced={forcedFeatureValues[name] !== undefined}
              onSelectValue={v => selectFeatureValue(name, v.value)}
            />
          );
        }) || null}
      <Attributes attr={attr} />
    </>
  );
};

export default GrowthbookDev;

/**
 * Growthbook Attributes
 */
const Attributes = ({ attr }) => {
  const [showDetail, setShowDetail] = useState(true);
  return (
    <Column space="L">
      <H3 onPress={() => setShowDetail(!showDetail)}>Attributes</H3>
      {showDetail && (
        <B3 color="tertiary" top="S" bottom="L">
          {JSON.stringify(attr, null, 4)}
        </B3>
      )}
    </Column>
  );
};

/**
 * Experiment List Item
 */
const ExperimentItem = ({
  name,
  experiment,
  isForced,
  result,
  onSelectValue,
  titleColor,
}) => {
  const theme = ThemedStyles.style;
  const [showDetail, setShowDetail] = useState(false);

  const selectData = React.useMemo(() => {
    const exp = experiment.experiment.variations.map((v, k) => ({
      label: JSON.stringify(v),
      value: k,
    }));
    exp.push({ label: 'None (Experiment)', value: undefined });
    return exp;
  }, [experiment]);
  return (
    <Column containerStyle={theme.bgSecondaryBackground} bottom="S">
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
            <B1 flat color={titleColor}>
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
                  flat
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
              Source: {isForced ? 'Forced' : 'Experiment'}
            </B2>
            <B3 color="tertiary" top="S" bottom="L">
              {JSON.stringify(experiment, null, 4)}
            </B3>
          </Column>
        )}
      </Spacer>
    </Column>
  );
};

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
