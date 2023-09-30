import '../assets/main.css'
// @ts-ignore
const App = await import(globalThis.PATH_TO_PAGE)

hydrate(() => <App.default/> , document.getElementById('root') as HTMLElement)
