export default function componentOrWrappedComponent(component) {
  return function findWhereFn(shallowWrapper) {
    const swType = shallowWrapper.type(),
      type = swType.wrappedComponent || swType
    component = component.wrappedComponent || component;

    return type === component || type instanceof component;
  }
}
