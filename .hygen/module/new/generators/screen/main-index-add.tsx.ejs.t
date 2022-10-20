---
to: "<%= `${absPath}/.hygen/screen/new/main-index-add.tsx.ejs.t` %>"
---
---
to: <%%= `${absPath}/index.tsx`%>
inject: true
before: "end-of-navigator"
skip_if: component\=\{<%%= CamelName%>Screen\}
---
        <Screen name='<%%= CamelName%>' component={<%%= CamelName%>Screen} />