---
to: "<%= `${absPath}/.hygen/widget/new/widget.tsx.ejs.t` %>"
---
---
to: "widgets/<%%= camelName%>.widget.tsx"
---
import React from 'react';
import { useNavigation } from 'services/hooks/navigation';
import { useTranslation } from 'utils/locales';
import { Widget, ListItemWithAction } from 'components/.';
import { <%%= CamelName%>, use<%%= PluralName%> } from './<%%= camelName%>.logic';
import { globalStyles } from 'styles/.';

export function <%%= CamelName%>Widget(): JSX.Element {
  const navigation = useNavigation();
  const { t } = useTranslation('<%=camelName%>Module');

  const viewAll = () => navigation.navigate('<%%= CamelName%>');

  return (
    <Widget title={t('<%%=CamelName%>')} onViewAll={viewAll}>
      <<%%= CamelName%>Component />
    </Widget>
  );
}

function <%%= CamelName%>Component(): JSX.Element {
  const navigation = useNavigation();
  const { t } = useTranslation('<%= camelName%>Module');
  const <%%= pluralName%> = use<%%= PluralName%>();

  const onPress = (<%%= camelName%>: <%%= CamelName%>) => () =>
    navigation.navigate('<%%= CamelName%>', { screen: '<%%= CamelName%>Details%>', params: <%%= camelName%> });

  return (
    <ListItemWithAction
      iconLeft='help'
      title={t('Welcome to 10x Banking')}
      description={t('<%%= CamelName%> will appear here')}
      showIconRight={false}
      onPress={onPress(<%%=pluralName%>[0])}
    />
  );
}
