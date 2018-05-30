import { Request, Response, NextFunction, Router as ExpressRouter } from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as glob from 'glob';

import { IController } from './Handlers/IController';
import { Auth } from './Auth/Auth';
import { IAuthorizer } from './Auth/IAuthorizer';
import { Container } from './Container';
import { InternalConfig } from './Config/InternalConfig';

export interface RouteParams {
	method: string;
	url: string;
	controller: string;
	action: string;
	arguments: string[];
	middleware: ((req: Request, res: Response, next: NextFunction) => void)[];
}

export interface BoundArgParams {
	controller: string;
	method: string;
	index: number;
}

export class Router {
	private static _router: ExpressRouter;
	private static _boundArgs: Map<string, number> = new Map<string, number>();
	private static _errorHandlerParams: RouteParams;
	private static _notFoundHandlerParams: RouteParams;

	public static init(router: ExpressRouter, rootPath: string) {
		this._router = router;

		if (Container.isBound('IAuthorizer')) {
			Auth.setAuthorizer(Container.resolve<IAuthorizer>('IAuthorizer'));
		}

		let normalizedPath = InternalConfig.controllerDir;
		if (!InternalConfig.controllerDir) {
			normalizedPath = path.join(rootPath, 'Controllers');
		}

		glob.sync('*Controller.js', {
			matchBase: true,
			cwd: normalizedPath,
			ignore: [ '*.js.map' ],
		}).forEach(file => require(normalizedPath + '/' + file));

		this._router.use(this.notFoundHandler.bind(this));
		this._router.use(this.errorHandler.bind(this));
	}

	public static addRoute(params: RouteParams) {
		if (!params.middleware) {
			params.middleware = [];
		}

		params.middleware.unshift(Auth.authorize());

		if (Auth.hasAuthorizer()) {
			params.middleware.unshift(Auth.populateUser());
		}

		params.middleware.unshift(this.populateAction(params.controller, params.action, params.arguments));

		switch (params.method) {
		case 'get':
			this._router.get(params.url, ...params.middleware, this.routeHandler.bind(this));
			break;
		case 'post':
			this._router.post(
				params.url,
				bodyParser.urlencoded({ extended: true }),
				bodyParser.json(),
				...params.middleware,
				this.routeHandler.bind(this));
			break;
		case 'put':
			this._router.put(
				params.url,
				bodyParser.urlencoded({ extended: true }),
				bodyParser.json(),
				...params.middleware,
				this.routeHandler.bind(this));
			break;
		case 'delete':
			this._router.delete(params.url, ...params.middleware, this.routeHandler.bind(this));
			break;
		}
	}

	public static addErrorHandler(params: RouteParams) {
		this._errorHandlerParams = params;
	}

	public static addNotFoundHandler(params: RouteParams) {
		this._notFoundHandlerParams = params;
	}

	public static addBoundArgument(params: BoundArgParams) {
		this._boundArgs.set(`${params.controller}_${params.method}`, params.index);
	}

	private static notFoundHandler(req: Request, res: Response, next: NextFunction) {
		if (this._notFoundHandlerParams) {
			req.params.__controller = this._notFoundHandlerParams.controller;
			req.params.__action = this._notFoundHandlerParams.action;
			const [ controller, action ] = this.getController(req, res, next);
			return action.apply(controller);
		}

		res.status(404).end(`Page not found: ${req.path}`);
	}

	private static errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
		if (this._errorHandlerParams) {
			req.params.__controller = this._errorHandlerParams.controller;
			req.params.__action = this._errorHandlerParams.action;
			const [ controller, action ] = this.getController(req, res, next);
			return action.apply(controller, [ err ]);
		}

		let response = 'Internal Server Error';
		if (process.env.NODE_ENV === 'development') {
			response += `<br /><br />${err.message}<br />${err.stack.replace(/\r?\n/, '<br />')}`;
		}

		res.status(500).contentType('text/html').end(response);
	}

	private static routeHandler(req: Request, res: Response, next: NextFunction): void {
		const [ controller, action ] = this.getController(req, res, next);

		const boundArgsIndex = this._boundArgs.get(`${req.params.__controller}_${req.params.__action}`);

		const actionArgs = req.params.__actionArgs.map((arg, idx) => {
			if (boundArgsIndex === idx) {
				return req.body || {};
			}

			return req.params[arg] || req.query[arg] || (req.body ? req.body[arg] : undefined);
		});

		action.apply(controller, actionArgs);
	}

	private static getController(req: Request, res: Response, next: NextFunction): [IController, any] {
		const controller = Container.resolve<IController>(req.params.__controller);
		if (!controller) {
			next(new Error('Controller "' + req.params.__controller + '" not found'));
		}

		const action = (controller as any)[req.params.__action];
		if (!action) {
			next(new Error('Action "' + req.params.__action + '" not found on Controller "' + req.params.__controller + '"'));
		}

		controller.request = req;
		controller.response = res;

		return [ controller, action ];
	}

	private static populateAction(controller: string, action: string, args: string[]):
		(req: Request, res: Response, next: NextFunction) => void {
		return (req: Request, res: Response, next: NextFunction) => {
			req.params.__controller = controller;
			req.params.__action = action;
			req.params.__actionArgs = args;
			next();
		};
	}
}
