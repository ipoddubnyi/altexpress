import express from "express";
import { IControllerMetadata, IModuleMetadata } from "./decorators";

type ApplyRouteFunction = (router: express.Router, prefix?: string) => void;

export class Reflector {
    private applyRoute!: ApplyRouteFunction;

    public static applyModuleRoutes(module: any, applyRoute: ApplyRouteFunction): void {
        const reflector = new Reflector();
        reflector.applyRoute = applyRoute;
        reflector.applyModuleRoutes(module);
    }

    private applyModuleRoutes(module: any, parentModuleMeta?: IModuleMetadata): void {
        if (!module.__altexpress_module_meta)
            throw new Error(`${module} does not seem to be a valid module.`);

        const meta = module.__altexpress_module_meta as IModuleMetadata;
        
        // если у модуля нет префикса - наследуем у родительского модуля
        if (!meta.prefix && parentModuleMeta?.prefix)
            meta.prefix = parentModuleMeta.prefix;

        // применяем маршруты контроллеров текущего модуля
        this.applyModuleControllersRoutes(meta);

        // применяем маршруты подмодулей
        this.applyModuleSubmodulesRoutes(meta);
    }

    private applyModuleControllersRoutes(moduleMeta: IModuleMetadata): void {
        if (!moduleMeta.controllers)
            return;

        for (const type of moduleMeta.controllers) {
            const controller = new type();
            this.applyModuleControllerRoutes(controller, moduleMeta);
        }
    }

    private applyModuleControllerRoutes(controller: any, moduleMeta: IModuleMetadata): void {
        if (!controller.__altexpress_controller_meta)
            throw new Error(`${controller} does not seem to be a valid controller.`);

        const meta = controller.__altexpress_controller_meta as IControllerMetadata;
        if (meta.router) {
            this.applyRoute(meta.router, moduleMeta.prefix);
        }
    }

    private applyModuleSubmodulesRoutes(moduleMeta: IModuleMetadata): void {
        if (!moduleMeta.modules)
            return;

        for (const type of moduleMeta.modules) {
            const module = new type();
            this.applyModuleRoutes(module, moduleMeta);
        }
    }
}
