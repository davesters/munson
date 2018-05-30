import { Container as Kernel } from 'inversify';

export class Container {
	private static _kernel: Kernel = new Kernel();

	public static TRANSIENT = 0;
	public static SINGLETON = 1;

	public static bind<T>(type: string, impl: new (...args: any[]) => T, scope?: number): void {
		switch (scope) {
		case this.SINGLETON:
			this._kernel.bind<T>(type).to(impl).inSingletonScope();
			break;
		default:
			this._kernel.bind<T>(type).to(impl);
			break;
		}
	}

	public static bindInstance<T>(type: string, impl: T): void {
		this._kernel.bind<T>(type).toConstantValue(impl);
	}

	public static isBound(type: string) : boolean {
		return this._kernel.isBound(type);
	}

	public static resolve<T>(type: string): T {
		try {
			return this._kernel.get<T>(type);
		} catch (err) {
			console.log(err);
			return null;
		}
	}
}
