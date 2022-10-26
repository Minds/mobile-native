---
to: "src/modules/main/modules.tsx"
inject: true
before: "end-of-modules-import"
skip_if: <%= CamelName%>Components from
---
import * as <%= CamelName%>Components from 'modules/<%= dashName%>';
