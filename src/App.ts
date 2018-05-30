import * as Express from 'express';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as merge from 'merge';

import { Router } from './Router';
import { ApplicationConfig, InternalConfig } from './Config/InternalConfig';
import { ConfigurationBuilder } from './Config/ConfigurationBuilder';

/**
 * Muson App. This is where it all begins.
 *
 * ```
 * import { App } from 'munson';
 *
 * const app = new App();
 * app.start()
 *   .then(() => {
 *     console.log('App listening');
 *   });
 * ```
 */
export class App {
	private readonly _app: Express.Application;
	private readonly _router: Express.Router;
	private _config: ApplicationConfig;

	/**
	 * Create a new Munson {@link App} object.
	 *
	 * @param config App and custom configuration object
	 */
	constructor(config?: ApplicationConfig) {
		this._config = merge.recursive(true, ConfigurationBuilder.default(), config);

		this._app = Express();
		this._router = Express.Router();

		this._app.use(Express.static(this._config.staticDir));
		this._app.use(cookieParser());
	}

	/**
	 * Inject an Express compatible middleware into the request pipeline
	 *
	 * @param middleware Express compatible middleware
	 */
	public use(middleware): App {
		this._app.use(middleware);

		return this;
	}

	/**
	 * Start the Munson app. This will start the Munson app and begin listening on the port specified in the config.
	 */
	public start(): Promise<boolean> {
		InternalConfig.applyConfig(this._config);
		this._app.use(this._router);
		Router.init(this._router, path.dirname(module.parent.parent.filename));

		const port = process.env.PORT ? parseInt(process.env.PORT, 10) : InternalConfig.port;

		return new Promise<boolean>((resolve, reject) => {
			this._app.listen(port, InternalConfig.hostname, () => {
				resolve(true);
			});
		});
	}

	/**
	 * Returns the raw Express application object. Useful for things that need the express app to do stuff.
	 */
	public express(): Express.Application {
		return this._app;
	}
}
