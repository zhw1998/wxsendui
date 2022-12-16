const getters = {
  baseApi: state => state.api.baseApi,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  menuLoaded: state => state.permission.menuLoaded,
  cachedViews: state => state.tabbar.cachedViews
}
export default getters
