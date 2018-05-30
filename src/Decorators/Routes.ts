import hashcode from 'hash-it';

import { Request, Response, NextFunction } from '../../index';
import { Router } from '../Router';

/**
 * The Get decorator marks a public class function as a route that handles GET requests.
 *
 * @param url The route URL that this function will handle.
 * @param middleware Any number of Express compatible middleware can be added to this route.
 */
export function Get(url: string, ...middleware: ((req: Request, res: Response, next: NextFunction) => void)[]) {
	return function (target: any, propertyKey: string) {
		Router.addRoute({
			url,
			middleware,
			method: 'get',
			controller: hashcode(target.constructor).toString(),
			action: propertyKey,
			arguments: getArgNames(target[propertyKey]),
		});
	};
}

/**
 * The Get decorator marks a public class function as a route that handles POST requests.
 *
 * @param url The route URL that this function will handle.
 * @param middleware Any number of Express compatible middleware can be added to this route.
 */
export function Post(url: string, ...middleware: ((req: Request, res: Response, next: NextFunction) => void)[]) {
	return function (target: any, propertyKey: string) {
		Router.addRoute({
			url,
			middleware,
			method: 'post',
			controller: hashcode(target.constructor).toString(),
			action: propertyKey,
			arguments: getArgNames(target[propertyKey]),
		});
	};
}

/**
 * The Get decorator marks a public class function as a route that handles PUT requests.
 *
 * @param url The route URL that this function will handle.
 * @param middleware Any number of Express compatible middleware can be added to this route.
 */
export function Put(url: string, ...middleware: ((req: Request, res: Response, next: NextFunction) => void)[]) {
	return function (target: any, propertyKey: string) {
		Router.addRoute({
			url,
			middleware,
			method: 'put',
			controller: hashcode(target.constructor).toString(),
			action: propertyKey,
			arguments: getArgNames(target[propertyKey]),
		});
	};
}

/**
 * The Get decorator marks a public class function as a route that handles DELETE requests.
 *
 * @param url The route URL that this function will handle.
 * @param middleware Any number of Express compatible middleware can be added to this route.
 */
export function Delete(url: string, ...middleware: ((req: Request, res: Response, next: NextFunction) => void)[]) {
	return function (target: any, propertyKey: string) {
		Router.addRoute({
			url,
			middleware,
			method: 'delete',
			controller: hashcode(target.constructor).toString(),
			action: propertyKey,
			arguments: getArgNames(target[propertyKey]),
		});
	};
}

/**
 * The ErrorHandler decorator marks a public class function as the default handler for any
 * errors that occur during request handling.
 */
export function ErrorHandler(target: any, propertyKey: string) {
	Router.addErrorHandler({
		method: '',
		url: '',
		controller: hashcode(target.constructor).toString(),
		action: propertyKey,
		arguments: null,
		middleware: null,
	});
}

/**
 * The NotFoundHandler decorator marks a public class function as the fallback route when
 * no other matching route was found for a request.
 */
export function NotFoundHandler(target: any, propertyKey: string) {
	Router.addNotFoundHandler({
		method: '',
		url: '',
		controller: hashcode(target.constructor).toString(),
		action: propertyKey,
		arguments: null,
		middleware: null,
	});
}

function getArgNames(func) {
	// First match everything inside the function argument parens.
	const matches = func.toString().match(/[a-zA-Z0-9_]+\s?\(([^)]*)\)/);

	const args = matches[1];

	// Split the arguments string into an array comma delimited.
	return args.split(',').map(arg => {
		// Ensure no inline comments are parsed and trim the whitespace.
		return arg.replace(/\/\*.*\*\//, '').trim();
	}).filter(arg => {
		// Ensure no undefined values are added.
		return arg;
	});
}
