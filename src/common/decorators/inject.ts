/** Inject decorator. */
export function Inject(type: ObjectType) {
    return function(target: any, propertyKey: string | symbol | undefined, index: number) {
        const meta = getInjectionMeta(target);

        if (type.name)
            meta.injections.push({ index, type });
    };
};

export type ObjectType<T = any> = new(...args: any[]) => T;

export interface IInjectionType {
    /** Arguments index. */
    index: number;

    /** Type for injection. */
    type: ObjectType;
}

/** Injection meta data. */
export interface IInjectionMetadata {
    /** Constructor arguments for dependency injection. */
    injections: IInjectionType[];
}

export function getInjectionMeta(target: any): IInjectionMetadata {
    if (!target.__altexpress_injection_meta) {
        target.__altexpress_injection_meta = {
            injections: [],
        } as IInjectionMetadata;
    }
    return target.__altexpress_injection_meta;
}
