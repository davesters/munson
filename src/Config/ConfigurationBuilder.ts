import * as fs from 'fs';
import * as merge from 'merge';

import { ApplicationConfig } from './InternalConfig';

interface ConfigItem {
	type: 'env' | 'file' | 'obj';
	value: any;
}

const defaultConfig: any = {
	port: process.env.PORT || 3001,
	hostname: 'localhost',
	staticDir: 'wwwroot',
};

export class ConfigurationBuilder<T extends ApplicationConfig> {

	private _items: ConfigItem[] = [];
	private _envPrefix = 'APP';

	private _config: T;

	public static default(): any {
		return defaultConfig;
	}

	public withFile(filename: string): ConfigurationBuilder<T> {
		this._items.push({
			type: 'file',
			value: filename.toString(),
		});

		return this;
	}

	public withObject(object: T): ConfigurationBuilder<T> {
		this._items.push({
			type: 'obj',
			value: object,
		});

		return this;
	}

	public withEnvironmentVariables(prefix: string): ConfigurationBuilder<T> {
		this._items.push({
			type: 'env',
			value: prefix,
		});

		return this;
	}

	public build(): T {
		this._config = ConfigurationBuilder.default();

		if (!this._items) {
			return this._config;
		}

		this._items.forEach(item => {
			switch (item.type) {
			case 'env':
				this._config = this.merge(this._config, this.loadEnvironment(item.value));
				break;
			case 'file':
				this._config = this.merge(this._config, this.loadConfigFile(item.value));
				break;
			case 'obj':
				this._config = this.merge(this._config, item.value);
				break;
			}
		});

		return this._config;
	}

	private loadEnvironment(prefix: string): object {
		const pfx = prefix.toUpperCase();
		const env = process.env;
		const config = {};

		Object.keys(env)
			.map(key => key.toUpperCase())
			.filter(key => key.startsWith(pfx))
			.map(key => key.replace(`${pfx}_`, ''))
			.forEach(key => {
				const segments = key.split('_');
				const value = env[key];

				const setObject = (object: object, keys: string[], value: string) => {
					const key = keys.shift();
					object[key] = object[key] || {};

					if (keys.length === 0) {
						if (value.toLowerCase && value.toLowerCase() === 'false') {
							object[key] = false;
							return;
						}
						if (value.toLowerCase && value.toLowerCase() === 'true') {
							object[key] = true;
							return;
						}

						const num  = this.parseFloat(value);
						if (!isNaN(num)) {
							object[key] = num;
						} else {
							object[key] = value;
						}
						return;
					}

					return setObject(object[key], keys, value);
				};

				setObject(config, segments, value);
			});

		return config;
	}

	private loadConfigFile(filename: string): object {
		if (!filename.endsWith('.json')) {
			throw new Error(`Configuration file '${filename}' is not a JSON file`);
		}
		if (!fs.existsSync(filename)) {
			throw new Error(`Failed to load configuration file '${filename}'`);
		}

		return require(filename);
	}

	private parseFloat(num: string): number {
		if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(num)) {
			return Number(num);
		}

		return NaN;
	}

	private merge(targetObject: object, sourceObject: object): T {
		return merge.recursive(true, targetObject, sourceObject);
	}
}
