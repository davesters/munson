import hashcode from 'hash-it';

import { Auth } from '../Auth/Auth';

export function authorize() {
	return function (target: any, propertyKey: string) {
		Auth.addRoute(hashcode(target.constructor), propertyKey);
	};
}
