import { Router, Request, Response, NextFunction } from 'express'
import { OpenAPIV3 } from 'openapi-types'

import { OpenAPIGenerator } from './generator'
import { OpenAPIOptions } from './types'

export function ExpressOpenAPI(opts: OpenAPIOptions) {
    const generator = new OpenAPIGenerator(opts.baseDoc)
    const router = Router()

    let isFirstRequest = true
    const middleware = (req: Request, res: Response, next: NextFunction) => {
        if (isFirstRequest) {
            middleware.document = generator.initializeDoc(req.app.router)
            isFirstRequest = false
        }
        return router(req, res, next)
    }

    // Publicly accessible properties
    middleware.document = generator.getDocument()

    // Register a router with the OpenAPI generator
    middleware.asRouterArgs = function (path: string, router: Router) {
        generator.registerRouter(router, path)
        return [path, router] as const
    }
    // Register a schema with the OpenAPI generator
    middleware.path = function (schema: OpenAPIV3.OperationObject) {
        function schemaMiddleware(_req: Request, _res: Response, next: NextFunction) {
            next()
        }
        generator.addSchema(schemaMiddleware, schema)
        return schemaMiddleware
    }

    return middleware
}
