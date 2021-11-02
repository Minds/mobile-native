import React from 'react';
import { Spacer, B3 } from '~ui';

type PropsType = {
  children: React.ReactNode;
};

const MenuSubtitle = ({ children }: PropsType) => {
  return (
    <Spacer top="L" bottom="S">
      <B3 font="medium" color="secondary" horizontal="L">
        {children}
      </B3>
    </Spacer>
  );
};

export default MenuSubtitle;
