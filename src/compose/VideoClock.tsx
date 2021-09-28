import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { TextStyle } from 'react-native';
import MText from '../common/components/MText';

type PropsType = {
  style?: TextStyle | Array<TextStyle>;
  timer?: number;
  onTimer?: () => void;
};

/**
 * Video clock component
 */
const VideoClock = ({ style, timer, onTimer }: PropsType) => {
  const [time, setTime] = useState('00:00');

  useEffect(() => {
    let counter = 0;
    const interval = setInterval(() => {
      if (timer && onTimer && counter + 1 === timer) {
        onTimer();
      }
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

  return <MText style={style}>{time}</MText>;
};

export default VideoClock;
