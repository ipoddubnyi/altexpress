import { IInjectionMetadata, IModuleServiceMetadata, ServiceLifetime, ObjectType } from "./decorators";

export class DIContainer {
    private readonly registry: { [typeName: string]: IModuleServiceMetadata } = {};
    
    private singletonCache: { [typeName: string]: any } = {};
    private scopedCache: { [typeName: string]: any } = {};
    
    public register<TType, TConcrete>(
        type: ObjectType<TType>,
        concreteType: ObjectType<TConcrete>,
        lifetime = ServiceLifetime.Scoped
    ): void {
        this.registry[type.name] = {
            type: type,
            concrete: concreteType,
            lifetime: lifetime,
        };
    }

    public resolve<TType, TConcrete>(type: ObjectType<TType>): TConcrete {
        const data = this.registry[type.name];

        if (!data?.concrete)
            throw new Error(`Unregistered type ${type.name}`);
        
        if (data.lifetime === ServiceLifetime.Scoped) {
            return this.resolveScoped(type, data.concrete);
        } else if (data.lifetime === ServiceLifetime.Singleton) {
            return this.resolveSingleton(type, data.concrete);
        }

        return this.resolveTransient(type, data.concrete);
    }

    private resolveScoped<TType, TConcrete>(type: ObjectType<TType>, concrete: ObjectType<TConcrete>): TConcrete {
        if (!this.scopedCache[type.name]) {
            const params = this.resolveParameters(type);
            this.scopedCache[type.name] = new concrete(...params);
        }

        return this.scopedCache[type.name];
    }

    private resolveSingleton<TType, TConcrete>(type: ObjectType<TType>, concrete: ObjectType<TConcrete>): TConcrete {
        if (!this.singletonCache[type.name]) {
            const params = this.resolveParameters(type);
            this.singletonCache[type.name] = new concrete(...params);
        }

        return this.singletonCache[type.name];
    }

    private resolveTransient<TType, TConcrete>(type: ObjectType<TType>, concrete: ObjectType<TConcrete>): TConcrete {
        const params = this.resolveParameters(type);
        return new concrete(...params);
    }

    public resolveParameters(type: any): any[] {
        const aruments: any[] = [];

        const meta = type.__altexpress_injection_meta as IInjectionMetadata;
        
        if (!meta?.injections)
            return aruments;

        const maxIndex = meta.injections.reduce((prev, current) => (prev.index > current.index) ? prev : current).index;

        for (let i = 0; i <= maxIndex; ++i) {
            const injection = meta.injections.find(el => el.index === i);

            const arg = injection ? this.resolve(injection.type) : undefined;
            aruments.push(arg);
        }

        return aruments;
    }

    public clearScoped(): void {
        this.scopedCache = {};
    }
}