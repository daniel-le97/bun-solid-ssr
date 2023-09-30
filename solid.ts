// @ts-ignore
import { transformAsync, TransformOptions } from '@babel/core';
// @ts-ignore
import ts from '@babel/preset-typescript';
// @ts-ignore
import solid from 'babel-preset-solid';
import type { BunPlugin } from 'bun';
import { UnimportOptions } from "unimport";

export let generateTypes: string;
export const solidPlugin: BunPlugin = {
    name: 'solid loader',
    async setup ( build ) {

        const { createUnimport } = await import( "unimport" );
        const { injectImports, generateTypeDeclarations, scanImportsFromDir } = createUnimport( {
            'presets': [ 'solid-js' ],
            // you can add additional import statements youd like to auto import here
            imports: [ { name: 'Component', from: 'solid-js', 'type': true } ]
        } as UnimportOptions );

        // register the components|utils directory for auto importing
        await scanImportsFromDir( [ './components/**', './utils/**' ], {
            'filePatterns': [ '*.{tsx,jsx,ts,js,mjs,cjs,mts,cts}' ]
        } );

        // we dont want to write here because this plugin gets registered twice
        // assign the output to a global variable and write to disk after build step has finished
        generateTypes = await generateTypeDeclarations();

        // this is the only magic that makes it differ from a browser plugin to a bun plugin
        const target = build.config.target === 'browser' ? 'dom' : 'ssr';

        const babel_opt: TransformOptions = {
            babelrc: false,
            configFile: false,
            root: process.cwd(),
            presets: [
                [ ts, {} ],
                [ solid, { generate: target, hydratable: true } ],
            ],
        };

        // css loader
        build.onLoad( { filter: /\.css$/ }, async( args ) => {
            const fileContents = await Bun.file(args.path).text()
            const cssCode = `
                let head = document.head;
                let style = document.createElement("style");
                head.appendChild(style);
                style.type = "text/css";
                style.appendChild(document.createTextNode(\`${ fileContents }\`));`;

                return{
                    contents: cssCode,
                    loader: 'js'
                }
        } );

        // tsx loader
        build.onLoad( { filter: /\.tsx$/ }, async ( { path } ) => {
            let data = await Bun.file( path ).text();
            let res = await transformAsync( data, { ...babel_opt, filename: path } );

            if ( !res || !res.code )
            {
                return { contents: '' };
            }
            const transformedFileContent = await injectImports( res.code );
            return { contents: transformedFileContent.code, loader: 'js' };
        } );
    },
};


