---
to: "<%= `${absPath}/.hygen/screen/new/api-add.ts.ejs.t` %>"
---
---
to: "<%%=api ? 'api/index.ts' : null %>"
inject: true
before: "end-of-api-methods"
skip_if: get<%%= PluralName%>
---

export async function get<%%= PluralName%>(param: string): Promise<unknown> {
  const { response } = await to(
    ApiConnector.getInstance()
      .get(`/v1/<%%= pluralName%>/${param}`)
      .then((result) => result?.data),
  );
  return response;
}
