/** Module meta data. */
export interface IModuleMetadata {
    /** Submodules. */
    modules?: any[];

    /** Controllers to process routes. */
    controllers?: any[];

    /** Services for dependency injection. */
    services?: (IModuleServiceMetadata | any)[];

    /** Api prefix for all module routes. */
    prefix?: string;
}

export interface IModuleServiceMetadata {
    /** Service type to inject. */
    type: new() => any;
    
    /** Concrete service implementation to inject. */
    concrete?: new() => any;

    /** Service instance lifetime. */
    lifetime?: ServiceLifetime;
}

/** Service lifetime. */
export enum ServiceLifetime {
    /** Service is instantiated once for every call. */
    Transient,

    /** Default. Service is instantiated once for every request. */
    Scoped,

    /** Service is instantiated once for the entire module lifetime. */
    Singleton,
}

/** Module decorator. */
export function Module(meta: IModuleMetadata = {}) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            __altexpress_module_meta = meta;
        }
    }
}
