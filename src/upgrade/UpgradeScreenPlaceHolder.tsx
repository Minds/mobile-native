import React from 'react';
import Placeholder from '~/common/components/Placeholder';
import { ScreenSection } from '~/common/ui';

export default function UpgradeScreenPlaceHolder() {
  return (
    <ScreenSection vertical="XL">
      <Placeholder width="25%" height={16} bottom="M" />
      <Placeholder width="100%" height={35} bottom="M" />
      <Placeholder width="25%" height={16} bottom="M" />
      <Placeholder width="100%" height={35} bottom="M" />
    </ScreenSection>
  );
}
