import { inject, injectable } from 'inversify';
import hashcode from 'hash-it';

import { IController } from '../Handlers/IController';
import { Container } from '../Container';

/**
 * The Controller decorator marks a class as a Constructor. Controllers should live in the Controllers
 * folder. They will be automatically loaded at startup.
 */
export function Controller(target: new (...args: any[]) => any) {
	injectable().call(null, target);

	const dependencies: any[] = Reflect.getMetadata('inversify:paramtypes', target);
	if (dependencies) {
		dependencies.forEach((dep, idx) => {
			if (dep.name === 'Object') {
				return;
			}

			inject(dep.name).call(null, target, undefined, idx);
		});
	}

	Container.bind<IController>(hashcode(target).toString(), target);
}
