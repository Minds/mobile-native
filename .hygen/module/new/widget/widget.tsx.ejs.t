---
to: "<%=widget ? `${absPath}/widgets/${camelName}.widget.tsx` : null %>"
---
import React from 'react';
import { Button, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Widget } from 'components';
import { <%= SingularName%>, use<%= PluralName%> } from './<%= camelName%>.logic';

export function <%= CamelName%>Widget(): JSX.Element {
  const navigation = useNavigation();
  const { t } = useTranslation('<%=camelName%>Module');

  const viewAll = () => navigation.navigate('<%= CamelName%>');

  return (
    <Widget title={t('<%=CamelName%>')} onViewAll={viewAll}>
      <<%= CamelName%>Component />
    </Widget>
  );
}

function <%= CamelName%>Component(): JSX.Element {
  const navigation = useNavigation();
  const { t } = useTranslation('<%= camelName%>Module');

  const <%= pluralName%> = use<%= PluralName%>();

  const onPress = (<%= camelName%>: <%= CamelName%>) => () =>
    navigation.navigate('<%= CamelName%>', {
      screen: '<%= CamelName%>Details%>',
      params: <%= camelName%>,
    });

  return (
    <View>
      <Text>{t('<%= PluralName%> will appear here')}</Text>
      <Button title={t('Welcome to Minds')} onPress={onPress(<%= pluralName%>[0])} />
    </View>
  );
}
