import { Request, Response, NextFunction } from 'express';

export interface IAuthorizer {
	getUser(req: Request): Promise<any>;
	unauthorized(req: Request, res: Response, next: NextFunction);
}
