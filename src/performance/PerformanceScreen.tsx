import React, { useState, Profiler, useRef, useMemo } from 'react';

import { StyleSheet, ScrollView, View, Text, Button } from 'react-native';
import experiments from './experiments/icons';

const PerformanceScreen = () => {
  const [components, setComponents] = useState(null);
  const [results, setResults] = useState([]);
  const res = useRef({});
  const stages: any = useRef({});

  const experiment = experiments[0];

  function onRenderCallback(
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions, // the Set of interactions belonging to this update
  ) {
    console.log(id);
    console.log(`startTime: ${startTime}`);
    console.log(`commitTime: ${commitTime}`);
    console.log(`actualDuration: ${actualDuration}`);
    console.log(`baseDuration: ${baseDuration}`);
    console.log(`interactions: ${interactions}`);
    console.log(interactions);

    if (!res.current[stages.current.id]) {
      console.log('CR3ATING CURR#NT ID');

      res.current[stages.current.id] = [];
    }

    res.current[stages.current.id].push([
      `${phase}`,
      `${actualDuration.toFixed()}`,
    ]);
    console.log(res);
    console.log(stages.current.id);

    runNextStage();
  }

  const runNextStage = () => {
    if (!stages.current?.stages?.length) {
      return;
    }

    const next = stages.current.stages[stages.current.nextStage];
    if (next) {
      stages.current.nextStage += 1;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            next();
          });
        });
      });
      return;
    }
    handleUpdateResults();
  };

  const handleDestroyResults = () => {
    setComponents(null);
    handleClearResults();
  };

  const handleClearResults = () => {
    res.current = [];
    setResults([]);
  };

  const handleUpdateResults = () => {
    console.log('HANDLE UPDATE RESULTS');

    console.log(res.current);

    setResults(JSON.parse(JSON.stringify(res.current)));
  };

  const renderComponents = useMemo(() => {
    if (!components) {
      return null;
    }

    const Component = experiment.component();

    return (
      <Profiler id="experiment" onRender={onRenderCallback}>
        {components.length
          ? components.map(item => {
              return <Component {...item} />;
            })
          : null}
      </Profiler>
    );
  }, [components]);

  const renderExperiments = () => {
    if (!experiments?.length) {
      return null;
    }

    return experiments.map(({ id, name, mount, update }) => {
      return (
        <Experiment
          key={id}
          name={name}
          results={results[id]}
          onRun={() => {
            stages.current = {
              id,
              nextStage: 0,
              name,
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
            };
            runNextStage();
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

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {renderComponents}
      </View>
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

const styles = StyleSheet.create({
  controls: { flexDirection: 'row' },
  experiment: { backgroundColor: 'rgba(0,0,0,0.1)' },
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
    // backgroundColor: 'red',
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
});

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
                    <View>
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

export default PerformanceScreen;
