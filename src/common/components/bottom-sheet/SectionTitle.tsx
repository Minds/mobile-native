import React from 'react';
import { B1 } from '~/common/ui/typography';

export default function SectionTitle({ children }) {
  return (
    <B1 left="XL" top="L" bottom="L" font="medium">
      {children}
    </B1>
  );
}
