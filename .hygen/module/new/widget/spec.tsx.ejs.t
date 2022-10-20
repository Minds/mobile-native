---
to: "<%=widget ? `${absPath}/widgets/${camelName}.widget.spec.tsx` : null %>"
---

import React from 'react'
import { render, cleanup, waitFor, RenderAPI } from '@testing-library/react-native'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { <%=CamelName%>Widget } from './<%=camelName%>.widget'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as eva from '@eva-design/eva'
import { useTranslation } from 'modules/locales'
import { renderHook } from '@testing-library/react-hooks'
import { AppIconsPack } from 'modules/theme'

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
      wrapperHandle: {
        current: {
          loadingStart: jest.fn(),
          loadingStop: jest.fn(),
        },
      },
    }
  },
}))
<% } -%>

describe('<%=CamelName%>Widget tests', () => {
  let component: RenderAPI
  let t: (key: string) => string
  beforeEach(async () => {
    const { result } = renderHook(() => useTranslation('<%=camelName%>Module'))
    t = result.current.t
    component = await waitFor(() =>
      render(
        <ApplicationProvider {...eva} theme={eva.light}>
          <IconRegistry icons={AppIconsPack} />
          <SafeAreaProvider
            initialSafeAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}>
            <<%=CamelName%>Widget />
          </SafeAreaProvider>
        </ApplicationProvider>,
      ),
    )
  })
  afterEach(() => {
    cleanup()
  })
  it('<%=CamelName%>Widget snapshot', async () => {
    expect(component.toJSON).toMatchSnapshot()
  })

  it('renders the main title correctly ', async () => {
    const heading = component.getByText(t('<%=CamelName%>'))
    expect(heading).toBeTruthy()
  })
})
