import { Router } from "express";

/** Controller meta data. */
export interface IControllerMetadata {
    // @Get, @Post и другие декораторы записывают в поле `meta.routes` свои маршруты

    /** Путь базового маршрута контроллера. */
    path: string;

    /** Маршруты методов контроллера. */
    routes: Router;
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
            routes: Router({ mergeParams: true }),
        };
    }
    return target.__altexpress_controller_meta;
}
