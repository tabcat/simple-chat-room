
const appbarActionTypes = {
  SET_APPBAR_TITLE: 'SET_APPBAR_TITLE',

}
const { SET_APPBAR_TITLE } = appbarActionTypes

const appbarActionCreators = {
  setAppbarTitle: (title) => ({ type: SET_APPBAR_TITLE, payload:{title} })
}

export { appbarActionTypes, appbarActionCreators }
