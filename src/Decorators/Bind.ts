import hashcode from 'hash-it';

import { Router } from '../Router';

/**
 * The Bind decorator marks a route function argument as a bound model.
 * When this route is hit, this argument will be populated with the request body.
 */
export function Bind(target: Object, methodName: string, parameterIndex: number) {
	Router.addBoundArgument({
		controller: hashcode(target.constructor),
		method: methodName,
		index: parameterIndex,
	});
}
