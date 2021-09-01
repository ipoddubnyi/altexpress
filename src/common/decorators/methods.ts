import { getControllerMeta } from "./controller";

/** GET http method decorator. */
export function Get(path: string, ...middleware: any[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!descriptor || (typeof descriptor.value !== "function")) {
            throw new TypeError(`Only methods can be decorated with @Get. <${propertyKey}> is not a method!`);
        }

        const meta = getControllerMeta(target);
        meta.routes.get(path, ...middleware, descriptor.value);
    };
}

/** POST http method decorator. */
export function Post(path: string, ...middleware: any[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!descriptor || (typeof descriptor.value !== "function")) {
            throw new TypeError(`Only methods can be decorated with @Post. <${propertyKey}> is not a method!`);
        }

        const meta = getControllerMeta(target);
        meta.routes.post(path, ...middleware, descriptor.value);
    };
}

/** PUT http method decorator. */
export function Put(path: string, ...middleware: any[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!descriptor || (typeof descriptor.value !== "function")) {
            throw new TypeError(`Only methods can be decorated with @Put. <${propertyKey}> is not a method!`);
        }

        const meta = getControllerMeta(target);
        meta.routes.put(path, ...middleware, descriptor.value);
    };
}

/** PATCH http method decorator. */
export function Patch(path: string, ...middleware: any[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!descriptor || (typeof descriptor.value !== "function")) {
            throw new TypeError(`Only methods can be decorated with @Patch. <${propertyKey}> is not a method!`);
        }

        const meta = getControllerMeta(target);
        meta.routes.patch(path, ...middleware, descriptor.value);
    };
}

/** DELETE http method decorator. */
export function Delete(path: string, ...middleware: any[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!descriptor || (typeof descriptor.value !== "function")) {
            throw new TypeError(`Only methods can be decorated with @Delete. <${propertyKey}> is not a method!`);
        }

        const meta = getControllerMeta(target);
        meta.routes.delete(path, ...middleware, descriptor.value);
    };
}
