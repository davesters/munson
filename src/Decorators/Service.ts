import { injectable } from 'inversify';

/**
 * The Service decorator denotes a class as an injectable service.
 */
export function Service(target: new (...args: any[]) => any) {
	injectable().call(null, target);
}
