import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { TextStyle } from 'react-native';
import MText from '../common/components/MText';

type PropsType = {
  style?: TextStyle | Array<TextStyle>;
  timer?: number;
  paused?: boolean;
  onTimer?: () => void;
};

/**
 * Video clock component
 */
const VideoClock = ({ style, timer, onTimer, paused }: PropsType) => {
  const [time, setTime] = useState('00:00');

  let counter = React.useRef({ count: 0 }).current;

  useEffect(() => {
    if (paused) {
      const interval = setInterval(() => {
        if (timer && onTimer && (counter.count + 1) / 10 === timer) {
          onTimer();
        }
        counter.count++;
        if (counter.count % 10) {
          setTime(
            moment()
              .hour(0)
              .minute(0)
              .second(counter.count / 10)
              .format('mm:ss'),
          );
        }
      }, 100);
      return () => {
        clearInterval(interval);
      };
    }
  }, [onTimer, paused, timer]);

  return <MText style={style}>{time}</MText>;
};

export default VideoClock;
