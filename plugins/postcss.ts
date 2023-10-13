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

// export let generateCSS: string;


export const postcssAPI = async(path: string, out: string) => {
    const contents = await Bun.file(path).text()
    const results = await postcss([postcss_import,autoprefixer, tailwindcssNested, tailwindcss]).process(contents, {from: path, to: out})
    await Bun.write(out, results.css)
}

