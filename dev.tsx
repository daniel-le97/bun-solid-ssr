import * as path from "path";
import { statSync } from "fs";
import type { ServeOptions } from "bun";
import { FileSystemRouter } from "bun";
import  htmlContent from './index.html'

const PROJECT_ROOT = process.cwd()
const PUBLIC_DIR = path.resolve( PROJECT_ROOT, "public" );
const BUILD_DIR = path.resolve( PROJECT_ROOT, "build" );
const ASSETS_DIR = path.resolve( PROJECT_ROOT, 'assets' );

// add other directories you would like to serve statically here
const serveDirectories = [ BUILD_DIR + '/client'];

const srcRouter = new FileSystemRouter( {
    style: 'nextjs',
    dir: './pages'
} );

const clientRouter = new FileSystemRouter( {
    style: 'nextjs',
    dir: './build/client/pages'
} );
const serverRouter = new FileSystemRouter( {
    style: 'nextjs',
    dir: './build/ssr/pages'
} );


function serveFromDir (
    serveDirectories: string[],
    reqPath: string
  ): Response | null {
    for ( const dir of serveDirectories )
    {
      try
      {
        let pathWithSuffix = path.join( dir, reqPath );
        const stat = statSync( pathWithSuffix );
  
        if ( stat && stat.isFile() )
        {
  
          return new Response( Bun.file( pathWithSuffix ) );
        }
        continue;
      } catch ( error )
      {
        //do something here if the file should have been found from the directory
      }
    }
    return null;
  }
  
  // helper function to update our html and send it
  async function serveFromRouter ( request: Request ) {
    try
    {
      const match = serverRouter.match( request);
      
    //   console.log({match, req: request.url});
      
  
      if ( match )
      {
        const builtMatch = clientRouter.match( request );
        // console.log(builtMatch);
        
        if ( !builtMatch )
        {
          return new Response( "builtMatch not found", { status: 500 } );
        }
        
        // import index.html for use as the html shell
        let html = htmlContent
        // console.log(html);
        
        // await Bun.file( './index.html' ).text();
        
        // @ts-ignore rebuilt every build
        const page = (await (await import(Bun.resolveSync('./build/ssr/entry/entry-server.js', process.cwd()))).render(match.filePath))
  
                    // set the page javascript we want to fetch for client
        html = html.replace( '{{ dynamicPath }}', '/pages/' + builtMatch.src )
                    // add solids hydration script to the head
                    .replace('<!--html-head-->', page.head)
                    // add the server side html to the html markup
                   .replace( '<!--html-body-->', page.html )
  
  
        // send the finalized html  
        return new Response( html, {
          headers: { "Content-Type": "text/html;charset=utf-8" },
        } );
      }
    } catch ( error )
    {
      // do something here if the request should have been processed
    }
  
  }
  
  
  // basic Bun native server to serve our app
  export default {
    port:3030,
    async fetch ( request, server ) {
//   console.log(request.url);
  
      const routerResponse = await serveFromRouter( request );
      if ( routerResponse )
      {
        return routerResponse;
      }
      let reqPath = new URL( request.url ).pathname;
      if ( reqPath === "/" )
      {
        reqPath = "/index.html";
      }
  
      const serveDirectory = serveFromDir( serveDirectories, reqPath );
      if ( serveDirectory )
      {
        return serveDirectory;
      }
  
      return new Response( "File not found", {
        status: 404,
      } );
    },
  } satisfies ServeOptions;
  
//   const end = Bun.nanoseconds()
console.log(`http://localhost:3030`);

//   logger.box( `http://localhost:${port}` , '\nready in', (end - timer) / 1e9);