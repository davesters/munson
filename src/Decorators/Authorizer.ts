import { inject, injectable } from 'inversify';

import { IAuthorizer } from '../Auth/IAuthorizer';
import { Container } from '../Container';

export function authorizer(target: new (...args: any[]) => any) {
	injectable().call(null, target);

	const dependencies: any[] = Reflect.getMetadata('inversify:paramtypes', target);
	if (dependencies) {
		dependencies.forEach((dep, idx) => {
			inject(dep.name).call(null, target, undefined, idx);
		});
	}

	Container.bind<IAuthorizer>('IAuthorizer', target);
}
