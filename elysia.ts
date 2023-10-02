// import './build.ts';
import { FileSystemRouter } from "bun";
import Elysia from "elysia";
import { readdirSync } from 'fs';
import * as path from 'path';
import  htmlContent from './index.html'
// import { html } from "@elysiajs/html";

const clientRouter = new FileSystemRouter( {
    style: 'nextjs',
    dir: './build/client/pages'
} );
const serverRouter = new FileSystemRouter( {
    style: 'nextjs',
    dir: './build/ssr/pages'
} );

const PROJECT_ROOT = process.cwd()
const PUBLIC_DIR = path.resolve( PROJECT_ROOT, "public" );
const BUILD_DIR = path.resolve( PROJECT_ROOT, "build" );
const ASSETS_DIR = path.resolve( PROJECT_ROOT, 'assets' );

function getAllFiles(directories: string[]): string[] {
    let files: string[] = [];

    function traverseDirectory(dir: string, baseDir: string) {
        const entries = readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(baseDir, fullPath);

            if (entry.isDirectory()) {
                traverseDirectory(fullPath, baseDir);
            } else {
                files.push(relativePath);
            }
        }
    }

    for (const directory of directories) {
        traverseDirectory(directory, directory);
    }

    return files;
}





const app = new Elysia()
// this does not play well when trying to bundle atm
// just return a w responde with headers set instead
    // .use( html() )

    .get( '*', async ( ctx ) => {
        // console.log(ctx.request);
        
        const serverMatch = serverRouter.match(ctx.request)
        const clientMatch = clientRouter.match(ctx.request)
        if ( !clientMatch?.src || !serverMatch?.filePath )
        {
            return 'unable to find a matched route'
        }
        // @ts-ignore
        const page = ( await ( await import(Bun.resolveSync('./build/ssr/entry/entry-server.js', process.cwd()) ) ).render( serverMatch.filePath ) )
        let content = htmlContent
        .replace( '{{ dynamicPath }}', '/pages/' + clientMatch.src )
                    // add solids hydration script to the head
                    .replace('<!--html-head-->', page.head)
                    // add the server side html to the html markup
                   .replace( '<!--html-body-->', page.html )

            return new Response( content, {
                headers: { "Content-Type": "text/html;charset=utf-8" },
              } );

    } )

// serve our built client pages/modules
for (const file of getAllFiles(['./build/client'])) {
    app.get(file, (ctx) => Bun.file(path.resolve(BUILD_DIR + '/client', file)))
}


app.listen(3003)
console.log(`http://localhost:3003`);

export type ElysiaApp = typeof app