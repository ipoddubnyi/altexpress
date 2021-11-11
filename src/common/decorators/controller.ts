export enum MethodType {
    Get = "get",
    Post = "post",
    Put = "put",
    Patch = "patch",
    Delete = "delete",
    Options = "options",
    All = "all",
}

export enum ParameterType {
    Request = "request",
    Response = "response",
    Next = "next",
    Params = "params",
    Query = "query",
    Body = "body",
    Headers = "headers",
    Cookies = "cookies",
}

export interface IControllerRouteMeta {
    property: string;
    method: MethodType;
    path: string;
    middleware: any[];
    handler: any;
}

export interface IParameterMeta {
    index: number;
    type: ParameterType;
    name: string | undefined;
}

/** Controller meta data. */
export interface IControllerMetadata {
    // @Get, @Post и другие декораторы записывают в поле `meta.routes` свои маршруты

    /** Путь базового маршрута контроллера. */
    path: string;

    /** Маршруты методов контроллера. */
    routes: IControllerRouteMeta[];

    /** Соотношение методов с параметрами. */
    params: { [methodName: string]: IParameterMeta[] };
}

/** Controller decorator. */
export function Controller(path: string) {
    function updateMeta(target: any): IControllerMetadata {
        const meta = getControllerMeta(target);
        meta.path = path;
        return meta;
    }

    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            __altexpress_controller_meta = updateMeta(this);
        }
    }
}

// see: https://github.com/serhiisol/node-decorators/blob/master/express/src/meta.ts

export function getControllerMeta(target: any): IControllerMetadata {
    if (!target.__altexpress_controller_meta) {
        target.__altexpress_controller_meta = {
            path: "/",
            routes: [],
            params: {},
        } as IControllerMetadata;
    }
    return target.__altexpress_controller_meta;
}
