import { Request, Response } from 'express';

export interface IController {
	request: Request;
	response: Response;
}
