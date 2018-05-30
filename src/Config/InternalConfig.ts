
export class ApplicationConfig {
	port?: number;
	hostname?: string;
	staticDir?: string;
	controllerDir?: string;
}

export class InternalConfig {
	public static port: number;
	public static hostname: string;
	public static staticDir: string;
	public static controllerDir: string;

	public static applyConfig(conf: ApplicationConfig) {
		this.port = conf.port;
		this.hostname = conf.hostname;
		this.staticDir = conf.staticDir;
		this.controllerDir = conf.controllerDir;
	}
}
