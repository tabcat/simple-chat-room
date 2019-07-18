
const getAppbarState = (state) => state.appbar;

const appbarSelectors = {
  getAppbarTitle: (state) => getAppbarState(state).title,
};

export { appbarSelectors };
