import { inject as _inject } from 'inversify';

export default function inject(identifier: string) {
	return _inject.call(null, identifier);
}
