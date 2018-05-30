import 'reflect-metadata';

import { InternalConfig } from './src/Config/InternalConfig';

// Export decorators
export { Service } from './src/Decorators/Service';
export { Controller } from './src/Decorators/Controller';
export { Get, Post, Put, Delete, ErrorHandler, NotFoundHandler } from './src/Decorators/Routes';
export { Bind } from './src/Decorators/Bind';

// Export Handlers
export { HttpController } from './src/Handlers/HttpController';
export { Request, Response, NextFunction } from 'express';

// Export App level classes
export { App } from './src/App';
export { Container } from './src/Container';
export { ConfigurationBuilder } from './src/Config/ConfigurationBuilder';
export { ApplicationConfig as AppConfiguration } from './src/Config/InternalConfig';
