---
to: "<%=absPath%>/widgets/Hub<%=CamelName%>Widget.tsx"
---
import React from 'react';
import { Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export function Hub<%= CamelName%>Widget({ icon }: { icon: string }): JSX.Element {
  const { navigate } = useNavigation();
  const { t } = useTranslation('<%= camelName%>Module');
  console.log(icon);

  return (
    <Button title={t('<%= CamelName%>')} onPress={() => navigate('<%= CamelName%>')} />
  );
}
