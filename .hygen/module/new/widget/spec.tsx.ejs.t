---
to: "<%=widget ? `${absPath}/widgets/${camelName}.widget.spec.tsx` : null %>"
---
import React from 'react';
import {
  render,
  cleanup,
  waitFor,
  RenderAPI,
} from '@testing-library/react-native';
import { <%=CamelName%>Widget } from './<%=camelName%>.widget';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { renderHook } from '@testing-library/react-hooks';

<% if (api) { -%>
/**
 * Mock the hook in .logic file
 * Update here if the payload returned changed
 */
jest.mock('./<%=camelName%>.logic', () => ({
  use<%=PluralName%>: function () {
    return {
      title: 'test title',
      subtitle: 'test subtitle',
      loadingRef: {
        current: {
          loadingStart: jest.fn(),
          loadingStop: jest.fn(),
        },
      },
    };
  },
}));
<% } -%>

describe('<%=CamelName%>Widget tests', () => {
  let component: RenderAPI;
  let t: (key: string) => string;
  beforeEach(async () => {
    const { result } = renderHook(() => useTranslation('<%=camelName%>Module'));
    t = result.current.t;
    component = await waitFor(() =>
      render(
        <SafeAreaProvider
          initialSafeAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          <<%=CamelName%>Widget />
        </SafeAreaProvider>,
      ),
    );
  });
  afterEach(() => {
    cleanup();
  });
  it('<%=CamelName%>Widget snapshot', async () => {
    expect(component.toJSON).toMatchSnapshot();
  });

  it('renders the main title correctly ', async () => {
    const heading = component.getByText(t('<%=PluralName%> will appear here'));
    expect(heading).toBeTruthy();
  });
});
