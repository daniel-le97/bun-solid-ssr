import { ElysiaApp } from "../elysia.tsx";


export default (app: ElysiaApp) => app.get('/', () => 'hello world')