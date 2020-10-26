import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Text, TextStyle } from 'react-native';

type PropsType = {
  style?: TextStyle | Array<TextStyle>;
};

/**
 * Video clock component
 */
const VideoClock = (props: PropsType) => {
  const [time, setTime] = useState('00:00');

  useEffect(() => {
    let counter = 0;
    const interval = setInterval(() => {
      setTime(
        moment()
          .hour(0)
          .minute(0)
          .second(counter++)
          .format('mm:ss'),
      );
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <Text style={props.style}>{time}</Text>;
};

export default VideoClock;
