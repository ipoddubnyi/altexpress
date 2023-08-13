import { Request, Response, NextFunction } from "express";
import { getControllerMeta, IParameterMeta, ParameterType, IProcessor } from "./controller";

function paramDecoratorFactory(type: ParameterType): any {
    return function(property?: string, ...processors: IProcessor[]) {
        return function(target: any, propertyKey: string | symbol, index: number) {
            const meta = getControllerMeta((target as any).constructor);
            const methodName = propertyKey as string;

            if (!meta.params[methodName])
                meta.params[methodName] = [];

            meta.params[methodName].push({ index, type, property, processors });
        };
    };
}

export function extractParameters(
    req: Request,
    res: Response,
    next: NextFunction,
    params?: IParameterMeta[]
): any[] {
    if (!params || !params.length) {
        return [ req, res, next ];
    }
  
    const args = [];
    for (const param of params) {
        let value = extractParameter(req, res, next, param);
        for (const processor of param.processors) {
            value = processor(value);
        }
        args[param.index] = value;
    }
    return args;
}

function extractParameter(
    req: Request,
    res: Response,
    next: NextFunction,
    param: IParameterMeta
): any {
    switch (param.type) {
        case ParameterType.Request:
            return getParam(req, null, param.property);
        case ParameterType.Response:
            return res;
        case ParameterType.Next:
            return next;
        case ParameterType.Params:
            return getParam(req, "params", param.property);
        case ParameterType.Query:
            return getParam(req, "query", param.property);
        case ParameterType.Body:
            return getParam(req, "body", param.property);
        case ParameterType.Headers:
            return getParam(req, "headers", param.property);
        case ParameterType.Cookies:
            return getParam(req, "cookies", param.property);
    }

    return null;
}

function getParam(source: any, paramType: string | null, property: string | undefined): any {
    const param = (paramType ? source[paramType] : null) ?? source;
    return property ? param[property] : param;
}

/** Request object. */
export const Req = paramDecoratorFactory(ParameterType.Request);

/** Response object. */
export const Res = paramDecoratorFactory(ParameterType.Response);

/** Next function. */
export const Next = paramDecoratorFactory(ParameterType.Next);

/** Single param by name or req.params object. */
export const Params = paramDecoratorFactory(ParameterType.Params);

/** Single query by name or req.query object. */
export const Query = paramDecoratorFactory(ParameterType.Query);

/** Single body by name or req.body object. */
export const Body = paramDecoratorFactory(ParameterType.Body);

/** Single headers by name or req.headers object. */
export const Headers = paramDecoratorFactory(ParameterType.Headers);

/** Single cookies by name or req.cookies object. */
export const Cookies = paramDecoratorFactory(ParameterType.Cookies);
