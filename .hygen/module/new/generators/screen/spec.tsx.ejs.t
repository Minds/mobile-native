---
to: "<%= `${absPath}/.hygen/screen/new/spec.tsx.ejs.t` %>"
---
---
to: <%%= relPath %>/<%%= camelName%>.spec.tsx
---
import React from 'react'
import { render, cleanup, waitFor, RenderAPI } from '@testing-library/react-native'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { <%%=CamelName%>Screen } from './<%%=camelName%>.screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as eva from '@eva-design/eva'
import { useTranslation } from 'modules/locales'
import { renderHook } from '@testing-library/react-hooks'
import { AppIconsPack } from 'modules/theme'

<%% if (api) { -%>
/**
 * Mock the hook in .logic file
 * Update here if the payload returned changed
 */
jest.mock('./<%%=camelName%>.logic', () => ({
  use<%%=PluralName%>: function () {
    return {
      <%%=pluralName%>: undefined,
      wrapperHandle: {
        current: {
          loadingStart: jest.fn(),
          loadingStop: jest.fn(),
        },
      },
    }
  },
}))
<%% } -%>

describe('<%%=CamelName%>Screen tests', () => {
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
            <<%%=CamelName%>Screen />
          </SafeAreaProvider>
        </ApplicationProvider>,
      ),
    )
  })
  afterEach(() => {
    cleanup()
  })
  it('<%%=CamelName%>Screen snapshot', async () => {
    expect(component.toJSON).toMatchSnapshot()
  })

  it('renders the main title correctly ', async () => {
    const heading = component.getByText(t('Hello <%%=CamelName%>'))
    expect(heading).toBeTruthy()
  })
})
