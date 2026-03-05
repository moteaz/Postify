type Factory<T> = () => T;

export class Container {
    private static services = new Map<string, Factory<any>>();

    static register<T>(key: string, factory: Factory<T>): void {
        this.services.set(key, factory);
    }

    static resolve<T>(key: string): T {
        const factory = this.services.get(key);
        if (!factory) {
            throw new Error(`Service ${key} not registered`);
        }
        return factory();
    }

    static clear(): void {
        this.services.clear();
    }
}
