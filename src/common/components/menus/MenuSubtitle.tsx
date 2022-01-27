import React from 'react';
import { B3 } from '~ui';

type PropsType = {
  children: React.ReactNode;
};

const MenuSubtitle = ({ children }: PropsType) => {
  return (
    <B3 font="medium" color="secondary" horizontal="L" top="L" bottom="S">
      {children}
    </B3>
  );
};

export default MenuSubtitle;
