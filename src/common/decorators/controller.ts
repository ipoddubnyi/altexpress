import { Router } from "express";

/** Controller meta data. */
export interface IControllerMetadata {
    // @Get, @Post и другие декораторы записывают в поле `meta.routes` свои маршруты
    // Поле `meta.router` оборачивает `meta.routes` в маршрут `path`

    /** Путь базового маршрута контроллера. */
    path: string;

    /** Базовый маршрут всех методов контроллера. */
    router: Router;

    /** Маршруты методов контроллера. */
    routes: Router;
}

/** Controller decorator. */
export function Controller(path: string) {
    function updateMeta(target: any): IControllerMetadata {
        const meta = getControllerMeta(target);
        meta.path = path;
        meta.router = Router().use(path, target.__altexpress_controller_meta.router);
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
            router: Router(),
            routes: Router({ mergeParams: true }),
        };
    }
    return target.__altexpress_controller_meta;
}
