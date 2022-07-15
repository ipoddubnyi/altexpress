export class DIContainer {
    private readonly registry: any = {};
    
    public register<TKey, TConcrete>(type: new() => TKey, concreteType: new() => TConcrete): void {
        this.registry[typeof type] = concreteType;
    }

    public resolve<TKey>(type: new() => TKey): any {
        const concreteType = this.registry[typeof type];
        //type params = ConstructorParameters<typeof concreteType>;
        return new concreteType();
    }
}