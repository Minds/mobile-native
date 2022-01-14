import React from 'react';
import { B1 } from '~/common/ui';

export default function SectionSubtitle({ children }) {
  return (
    <B1 left="XL" top="L" bottom="L" color="secondary" font="medium">
      {children}
    </B1>
  );
}
