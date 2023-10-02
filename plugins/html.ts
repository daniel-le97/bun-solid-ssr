import { BunPlugin } from "bun";
export const transpileTS = ( code: string, loader: 'ts' | 'js' = 'ts' ) => {
    const transpiler = new Bun.Transpiler( { loader } );
    const content = transpiler.transformSync( code );
    return content;
  };
  

export const html: BunPlugin = {
    name: 'bun-vue',
    async setup ( build ) {
        build.onLoad( { filter: /\.html$/ }, async ( args ) => { 
            // console.log('building');
            
            const content = await Bun.file(args.path).text()

            const exporter = `const html = \`${ content }\`\nexport default html`
            return {
                'contents': transpileTS(exporter),
                loader: 'js'
            }
         } );
    }
};

// Bun.escapeHTML(input)