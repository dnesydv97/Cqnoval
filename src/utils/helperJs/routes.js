export const checkRouteHistory = (routesHistory = [], route) =>
  routesHistory.find(({name}) => name == route);
