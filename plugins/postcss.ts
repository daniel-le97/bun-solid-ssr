import postcss from  'postcss'
import autoprefixer from 'autoprefixer'
import { BunPlugin } from 'bun';
import postcssNested from  'postcss-nested';
import tailwindcss from 'tailwindcss'
import { transpileTS } from './html.ts';
// @ts-ignore
import tailwindcssNested from  'tailwindcss/nesting';

// @ts-ignore
import postcss_import from 'postcss-import'
// import { from } from 'solid-js';

export let generateCSS: string;


export const postcssAPI = async(path: string, out: string) => {
    const contents = await Bun.file(path).text()
    const results = await postcss([postcss_import,autoprefixer, tailwindcssNested, tailwindcss]).process(contents, {from: path, to: './assets/output.css'})
    await Bun.write(out, results.css)
}

export const postcssPlugin: BunPlugin = {
    name: 'postcss',
    setup(build) {
        build.onLoad({filter: /\.css$/ }, async(args) =>{
            // build.module(specifier, callback)
            const contents = await Bun.file(args.path).text()
            const results = await postcss([postcss_import,autoprefixer, tailwindcssNested, tailwindcss]).process(contents, {from: args.path, to: './build/main.css'})
            // console.log(results.css);
            
            const cssCode = `
            const styleElement = document.createElement("style");
            styleElement.appendChild(document.createTextNode(${JSON.stringify(results.css)}));
            document.head.appendChild(styleElement)`;
             

                generateCSS = results.css

                // does not matter what we return the generateCSS will be used to inline css into the html
            return {
                contents: transpileTS('export default { h: \"ahoj\" }', 'js'),
                loader: 'js'
            }
        })
    },
}