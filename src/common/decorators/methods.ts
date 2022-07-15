import { getControllerMeta, MethodType } from "./controller";

function methodDecoratorFactory(method: MethodType): any {
    return function (path: string, ...middleware: any[]): MethodDecorator {
        return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
            const methodName = propertyKey as string;

            if (!descriptor || (typeof descriptor.value !== "function")) {
                throw new TypeError(`Only methods can be decorated. <${methodName}> is not a method!`);
            }

            const meta = getControllerMeta((target as any).constructor);
            meta.routes.push({
                property: methodName,
                method: method,
                path: path,
                middleware: middleware,
                handler: descriptor.value,
            });
        };
    }
}

/** GET http method decorator. */
export const Get = methodDecoratorFactory(MethodType.Get);

/** POST http method decorator. */
export const Post = methodDecoratorFactory(MethodType.Post);

/** PUT http method decorator. */
export const Put = methodDecoratorFactory(MethodType.Put);

/** PATCH http method decorator. */
export const Patch = methodDecoratorFactory(MethodType.Patch);

/** DELETE http method decorator. */
export const Delete = methodDecoratorFactory(MethodType.Delete);

/** OPTIONS http method decorator. */
export const Options = methodDecoratorFactory(MethodType.Options);

/** ALL http method decorator. */
export const All = methodDecoratorFactory(MethodType.All);
