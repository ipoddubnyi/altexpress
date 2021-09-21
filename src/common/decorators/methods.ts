import { getControllerMeta } from "./controller";

/** GET http method decorator. */
export function Get(path: string, ...middleware: any[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!descriptor || (typeof descriptor.value !== "function")) {
            throw new TypeError(`Only methods can be decorated with @Get. <${propertyKey}> is not a method!`);
        }

        const meta = getControllerMeta(target);
        meta.routes.push({
            method: "get",
            path: path,
            middleware: middleware,
            handler: descriptor.value
        });
    };
}

/** POST http method decorator. */
export function Post(path: string, ...middleware: any[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!descriptor || (typeof descriptor.value !== "function")) {
            throw new TypeError(`Only methods can be decorated with @Post. <${propertyKey}> is not a method!`);
        }

        const meta = getControllerMeta(target);
        meta.routes.push({
            method: "post",
            path: path,
            middleware: middleware,
            handler: descriptor.value
        });
    };
}

/** PUT http method decorator. */
export function Put(path: string, ...middleware: any[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!descriptor || (typeof descriptor.value !== "function")) {
            throw new TypeError(`Only methods can be decorated with @Put. <${propertyKey}> is not a method!`);
        }

        const meta = getControllerMeta(target);
        meta.routes.push({
            method: "put",
            path: path,
            middleware: middleware,
            handler: descriptor.value
        });
    };
}

/** PATCH http method decorator. */
export function Patch(path: string, ...middleware: any[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!descriptor || (typeof descriptor.value !== "function")) {
            throw new TypeError(`Only methods can be decorated with @Patch. <${propertyKey}> is not a method!`);
        }

        const meta = getControllerMeta(target);
        meta.routes.push({
            method: "patch",
            path: path,
            middleware: middleware,
            handler: descriptor.value
        });
    };
}

/** DELETE http method decorator. */
export function Delete(path: string, ...middleware: any[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!descriptor || (typeof descriptor.value !== "function")) {
            throw new TypeError(`Only methods can be decorated with @Delete. <${propertyKey}> is not a method!`);
        }

        const meta = getControllerMeta(target);
        meta.routes.push({
            method: "delete",
            path: path,
            middleware: middleware,
            handler: descriptor.value
        });
    };
}
