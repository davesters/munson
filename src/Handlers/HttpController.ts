import { injectable } from 'inversify';
import { Request, Response } from 'express';

import { IController } from './IController';

@injectable()
export abstract class HttpController implements IController {
	public request: Request;
	public response: Response;
}
