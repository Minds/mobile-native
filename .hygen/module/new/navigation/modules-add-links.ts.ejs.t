---
to: "<%=deeplink ? 'src/modules/main/modules.tsx' : null %>"
inject: true
before: "end-of-config-links"
skip_if: "<%= CamelName%>: modules.<%= CamelName%>,"
---
        <%= CamelName%>: modules.<%= CamelName%>,