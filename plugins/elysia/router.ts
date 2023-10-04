import { FileSystemRouter, Server } from "bun";


const apiRouter = new FileSystemRouter({
    style: 'nextjs',
    dir: './routes',
    'assetPrefix': '/api'
    
})
console.log(apiRouter);

export const serveApiRoutes = async(route: Request, server?: Server) => {
    const hasRoute = apiRouter.match(route)
    if (hasRoute) {
        const response = await import(hasRoute.filePath)
        return response(route, server)
    }
}
