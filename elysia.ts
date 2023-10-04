// import './build.ts';

import Elysia from "elysia";
// import  htmlContent from './index.html'

import { port, serveDirectories, serveFromDir, serveFromRouter } from "./lib.ts";


const app = new Elysia()
// this does not play well when trying to bundle atm
// just return a w responde with headers set instead
    // .use( html() )

    .get( '*', async ( ctx ) => {
        // console.log(ctx.request);
        const routerRes = await serveFromRouter(ctx.request)
        if (routerRes) { 
            return routerRes
        }

        let reqPath = new URL( ctx.request.url ).pathname;
              if ( reqPath === "/" )
              {
                reqPath = "/index.html";
              }
        const serveDirectory = serveFromDir( serveDirectories, reqPath );
      if ( serveDirectory )
      {
        return serveDirectory;
      }
    } ).listen(port)
console.log(`http://localhost:${port}`);

export type ElysiaApp = typeof app