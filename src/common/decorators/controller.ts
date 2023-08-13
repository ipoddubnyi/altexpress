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
    property: string | undefined;
    processors: IProcessor[];
}

export interface IProcessor<T = any, R = any> {
    (value: T): R;
}

/** Controller meta data. */
export interface IControllerMetadata {
    // @Get, @Post и другие декораторы записывают в поле `meta.routes` свои маршруты

    /** The path of the controller's base route. */
    path: string;

    /** Routes of the controller's methods. */
    routes: IControllerRouteMeta[];

    /** The ratio of methods to parameters. */
    params: { [methodName: string]: IParameterMeta[] };
}

/** Controller decorator. */
export function Controller(path: string) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        const target = (constructor as any);
        const meta = getControllerMeta(target);
        meta.path = path;
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
