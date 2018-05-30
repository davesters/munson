import { Request, Response, NextFunction } from '../../index';
import { InternalConfig } from '../Config/InternalConfig';
import { IAuthorizer } from './IAuthorizer';

export class Auth {
	private static _routes: Set<string> = new Set();
	private static _authorizer: IAuthorizer;

	public static setAuthorizer(authorizer: IAuthorizer) {
		this._authorizer = authorizer;
	}

	public static addRoute(controller: string, action: string) {
		this._routes.add(controller + '_' + action);
	}

	public static populateUser() {
		return (req: Request, res: Response, next: NextFunction) => {
			this._authorizer.getUser(req)
				.then(user => {
					// req.user = user;
					next();
				})
				.catch(err => {
					next(err);
				});
		};
	}

	public static authorize(): (req: Request, res: Response, next: NextFunction) => void {
		return ((req: Request, res: Response, next: NextFunction) => {
			// if (this._routes.has(req.params.__controller + '_' + req.params.__action) && !req.user) {
			// 	if (this.hasAuthorizer()) {
			// 		return this._authorizer.unauthorized(req, res, next);
			// 	}

			// 	return res.status(401).json({
			// 		status: 401,
			// 		error: 'Not authorized',
			// 	});
			// }

			next();
		}).bind(this);
	}

	public static hasAuthorizer(): boolean {
		return typeof this._authorizer === 'object';
	}
}
