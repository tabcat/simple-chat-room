const getModalState = (state) => state.interface.modal;

const getSelectedContent = (state) => getModalState(state).selectedContent;

const navDrawerOpen = (state) => getModalState(state).drawerOpen;

const navListState = (state) => getModalState(state);

const SubnameSelectors = { getSelectedDrawer, navDrawerOpen, navListState };

export { SubnameSelectors };
