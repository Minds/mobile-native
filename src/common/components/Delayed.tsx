import React from 'react';

type PropsType = {
  children: any;
  delay: number;
};

/**
 * Delays the rendering of a component
 */
export default function Delayed({ children, delay = 200 }: PropsType) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const time = setTimeout(() => {
      setShow(true);
    }, delay);
    return () => clearTimeout(time);
  }, []);

  return show ? children : null;
}
