/** Module meta data. */
export interface IModuleMetadata {
    /** Submodules. */
    modules?: any[];

    /** Controllers to process routes. */
    controllers?: any[];

    /** Api prefix for all module routes. */
    prefix?: string;
}

/** Module decorator. */
export function Module(meta: IModuleMetadata = {}) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            __altexpress_module_meta = meta;
        }
    }
}
