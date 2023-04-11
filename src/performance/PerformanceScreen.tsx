import React, {
  useState,
  Profiler,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { StyleSheet, ScrollView, View, Text, Button } from 'react-native';
import ActivityIndicator from '~/common/components/ActivityIndicator';
import { frameThrower } from '~/common/ui/helpers';
import experiments from './experiments/icons';

const PerformanceScreen = () => {
  const [loading, setLoading]: any = useState(false);
  const [components, setComponents]: any = useState(null);
  const [experiment, setExperiment]: any = useState(null);
  const [results, setResults] = useState([]);
  const res = useRef({});
  const stages: any = useRef({});

  const runNextStage = useCallback(() => {
    if (!stages.current?.stages?.length) {
      return;
    }

    const next = stages.current.stages[stages.current.nextStage];
    if (next) {
      stages.current.nextStage += 1;
      frameThrower(20, next);
      return;
    }

    handleUpdateResults();
    setComponents(null);
    setLoading(false);
  }, [stages]);

  const onRenderCallback = useCallback(
    (id, phase, actualDuration) => {
      if (!res.current[stages.current.id]) {
        res.current[stages.current.id] = [];
      }

      res.current[stages.current.id].push([
        `${phase}`,
        `${actualDuration.toFixed(1)}`,
      ]);

      runNextStage();
    },
    [runNextStage, res],
  );

  useEffect(() => {
    stages.current = experiment;
    runNextStage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiment]);

  const handleDestroyResults = () => {
    setComponents(null);
    handleClearResults();
  };

  const handleClearResults = () => {
    res.current = [];
    setResults([]);
  };

  const handleUpdateResults = () => {
    setResults(JSON.parse(JSON.stringify(res.current)));
  };

  const renderComponents = useMemo(() => {
    if (!components) {
      return null;
    }

    const Component = experiment.component;

    return (
      <Profiler id={experiment.id} onRender={onRenderCallback}>
        {components.length
          ? components.map((item, index) => {
              return <Component key={`component-${index}`} {...item} />;
            })
          : null}
      </Profiler>
    );
  }, [components, onRenderCallback, experiment]);

  const renderExperiments = () => {
    if (!experiments?.length) {
      return null;
    }

    return experiments.map(({ id, name, component, mount, update }) => {
      return (
        <Experiment
          key={id}
          name={name}
          results={results[id]}
          onRun={() => {
            setLoading(true);

            setExperiment({
              id,
              name,
              component,
              nextStage: 0,
              stages: [
                () => {
                  setComponents(mount());
                },
                () => {
                  setComponents(update());
                },
                () => {
                  setComponents(update());
                },
                () => {
                  setComponents(update());
                },
                () => {
                  setComponents([]);
                },
              ],
            });
          }}
        />
      );
    });
  };

  return (
    <ScrollView>
      {renderExperiments()}
      <Controls
        onClear={handleClearResults}
        onUpdate={handleUpdateResults}
        onDestroy={handleDestroyResults}
      />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : null}
      <View style={styles.experimentWrapper}>{renderComponents}</View>
    </ScrollView>
  );
};

const Controls = ({ onClear, onUpdate, onDestroy }) => {
  return (
    <View style={styles.experimentControl}>
      <Text style={styles.text}>General Controls</Text>
      <View style={styles.controls}>
        <Button onPress={onClear} title="Clear" />
        <Button onPress={onUpdate} title="Update" />
        <Button onPress={onDestroy} title="Destroy" />
      </View>
    </View>
  );
};

const Experiment = ({ name, results, onRun }) => {
  return (
    <View style={styles.experiment}>
      <View style={styles.experimentControl}>
        <Text style={styles.text}>{name}</Text>
        <Button onPress={onRun} title="Run" />
      </View>
      <View style={styles.experimentResults}>
        {results?.length
          ? results.map((result: any) => {
              return (
                <View style={styles.experimentRow}>
                  {result.map(text => (
                    <View key={text}>
                      <Text>{text}</Text>
                    </View>
                  ))}
                </View>
              );
            })
          : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: { flexDirection: 'row' },
  experiment: { backgroundColor: 'rgba(0,0,0,0.1)' },
  experimentWrapper: { flexDirection: 'row', flexWrap: 'wrap' },
  experimentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  experimentControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#FAFAFA',
  },
  experimentResults: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  general: {
    marginTop: 16,
    padding: 16,
    marginBottom: 24,
  },
  loader: {
    backgroundColor: '#FAFAFA',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PerformanceScreen;
