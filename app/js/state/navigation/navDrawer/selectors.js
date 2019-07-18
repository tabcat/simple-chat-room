
const getNavDrawerState = (state) => state.navigation.navDrawer;

const navDrawerSelectors = {
  getSelectedNavItem: (state) => getNavDrawerState(state).selectedNavItem,

  getNavDrawerOpenness: (state) => getNavDrawerState(state).drawerOpen,
};

export { navDrawerSelectors };
