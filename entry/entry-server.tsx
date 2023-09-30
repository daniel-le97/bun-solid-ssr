// import { renderToString } from 'solid-js/web'


export async function render(path:string) {
    
    const App = await import(path)
    const html = renderToString(() => <App.default />)
    // console.log(html);
    
  return { html }
}
