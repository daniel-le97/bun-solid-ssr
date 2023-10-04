// import '../assets/main.css'
// import { install } from '@twind/core'
// import config from '../tailwind.config'
// install(config)
// @ts-ignore
const App = await import(globalThis.PATH_TO_PAGE)

hydrate(() => <App.default/> , document.getElementById('root') as HTMLElement)
