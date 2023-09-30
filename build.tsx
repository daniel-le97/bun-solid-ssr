import { FileSystemRouter, Target } from "bun";
import { generateTypes, solidPlugin } from "./solid.ts";
import * as path from 'path';
import { existsSync, rmSync } from "fs";

const isProd = process.env.NODE_ENV === 'production';
const PROJECT_ROOT = import.meta.dir;;
const BUILD_DIR = path.resolve( PROJECT_ROOT, "build" );

export const build = async () => {
    const router = new FileSystemRouter( {
        style: 'nextjs',
        dir: './pages'
    } );

    if ( existsSync( BUILD_DIR ) )
    {
        rmSync( BUILD_DIR, { recursive: true, force: true } );
    }


    const clientBuild = await Bun.build( {
        'entrypoints': [ import.meta.dir + '/entry/entry-client.tsx', ...Object.values( router.routes ) ],
        'splitting': true,
        target: 'browser',
        outdir: './build/client',
        plugins: [ solidPlugin ],
    } );
    const serverBuild = await Bun.build( {
        'entrypoints': [import.meta.dir + '/entry/entry-server.tsx',...Object.values( router.routes ) ],
        'splitting': true,
        target: 'bun',
        outdir: './build/ssr',
        plugins: [ solidPlugin ],
    } );

};
await build();
await Bun.write('./build/imports.d.ts', generateTypes)
