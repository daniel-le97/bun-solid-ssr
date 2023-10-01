import './build.tsx';
import { html } from "@elysiajs/html";
import { FileSystemRouter } from "bun";
import Elysia from "elysia";
import { readdirSync } from 'fs';
import * as path from 'path';
import { generateHydrationScript } from "solid-js/web";

const clientRouter = new FileSystemRouter( {
    style: 'nextjs',
    dir: './build/client/pages'
} );
const serverRouter = new FileSystemRouter( {
    style: 'nextjs',
    dir: './build/ssr/pages'
} );

const PROJECT_ROOT = import.meta.dir;
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

const htmlContent = await Bun.file('./index.html').text()

const app = new Elysia().use(html())

for await (const [route, module] of Object.entries(serverRouter.routes)) {
    app.get(route, async(ctx) =>{
        
        const clientMatch = clientRouter.match(route)
        if (!clientMatch) {
            return 'unable to find a matched route'
        }
        const page = (await (await import('./build/ssr/entry/entry-server.js')).render(module)).html
        let content = htmlContent
        .replace( '{{ dynamicPath }}', '/pages/' + clientMatch.src )
                    // add solids hydration script to the head
                    .replace('<!--html-head-->', generateHydrationScript() + '')
                    // add the server side html to the html markup
                   .replace( '<!--html-body-->', page )

                   return ctx.html(content)
    })
}

// serve our built client pages/modules
for (const file of getAllFiles(['./build/client'])) {
    app.get(file, (ctx) => Bun.file(path.resolve(BUILD_DIR + '/client', file)))
}


app.listen(3003)
console.log(`http://localhost:3003`);