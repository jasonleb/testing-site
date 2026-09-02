/**
 * URLs et chemins d'API du site, centralisés ici pour que les tests
 * qui appellent directement `request.get(...)` (sans passer par un
 * Page Object) n'aient qu'un seul endroit à modifier si une route change.
 */
const routes = {
  home: '/',
  dropdown: '/dropdown',
  iframe: '/iframe',
  alerts: '/alerts',
  dynamicLoading: '/dynamic-loading',
  dragAndDrop: '/drag-and-drop',
  fileUpload: '/file-upload',
  hiddenElements: '/hidden-elements',
  infiniteScroll: '/infinite-scroll',
  login: '/login',
  secure: '/secure',
  logout: '/logout',
  tables: '/tables',
  shadowDom: '/shadow-dom',
  slowResource: '/slow-resource',
  brokenImages: '/broken-images',
  multipleWindows: '/multiple-windows',
  multipleWindowsNew: '/multiple-windows/new',
  basicAuth: '/basic-auth',
  checkboxes: '/checkboxes',
  statusCodes: {
    base: '/status-codes',
    ok: '/status-codes/200',
    permanentRedirect: '/status-codes/301',
    permanentRedirectTarget: '/status-codes/301-target',
    notFound: '/status-codes/404',
    serverError: '/status-codes/500',
  },
  redirect: {
    base: '/redirect',
    go: '/redirect/go',
    target: '/redirect/target',
  },
};

module.exports = { routes };
