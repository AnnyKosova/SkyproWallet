export const locationNow = (currentLocation) => {
  const windowLocation = window.location.pathname;
  return windowLocation === currentLocation
};
