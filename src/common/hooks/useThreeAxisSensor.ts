import { useEffect, useRef, useState } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import ThreeAxisSensor from 'expo-sensors/build/ThreeAxisSensor';

type SensorParams = {
  sensor: ThreeAxisSensor;
  collection: string[];
  loading?: (isLoading: boolean) => void;
};

const SAMPLING_INTERVAL = 500; // milliseconds
const STOP_AFTER = 4000; // milliseconds

let sensorTimeout;
const setSensor = ({ sensor, collection, loading }: SensorParams) =>
  sensor.isAvailableAsync().then(found => {
    if (!found) {
      return;
    }
    loading?.(true);
    sensor.setUpdateInterval(SAMPLING_INTERVAL);
    sensor.addListener(sensorData => {
      collection.push(JSON.stringify(sensorData));
      if (collection.length === 1) {
        sensorTimeout = setTimeout(() => {
          sensor.removeAllListeners();
          loading?.(false);
        }, STOP_AFTER);
      }
    });
  });

/**
 * The sensors data collection is triggered by the mounting of the component using the hook.
 * When isLoading becomes false, the sensorsData is ready to be used.
 * USAGE:
 *      const { isLoading, sensorsData } = useThreeAxisSensor();
 * @returns { isLoading: boolean, sensorsData: string[] }
 */
export const useThreeAxisSensor = () => {
  const [isLoading, setIsLoading] = useState(false);

  const acceleratorData = useRef<string[]>([]);
  const gyroscopeData = useRef<string[]>([]);

  useEffect(() => {
    setSensor({
      sensor: Accelerometer,
      collection: acceleratorData.current,
      loading: setIsLoading,
    });
    setSensor({
      sensor: Gyroscope,
      collection: gyroscopeData.current,
      loading: setIsLoading,
    });
    return () => {
      [Accelerometer, Gyroscope].forEach(sensor => sensor.removeAllListeners());
      if (sensorTimeout) {
        clearTimeout(sensorTimeout);
      }
    };
  }, []);
  return {
    isLoading,
    sensorsData: [...acceleratorData.current, ...gyroscopeData.current],
  };
};
