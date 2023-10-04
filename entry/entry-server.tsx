import { generateHydrationScript , renderToString} from "solid-js/web";
// this is used to run postcss plugin on the server, which whill extract all needed css for inlining into the final html
import '../assets/main.css'
export async function render(path:string) {
    const App = await import(path)
    const html = renderToString(() => <App.default />)
    const head = generateHydrationScript()
  return { html, head }
}
