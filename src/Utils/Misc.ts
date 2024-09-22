export function tuple<T extends any[]>(...args: T): T {
	return args;
}
export function cast<T>(value: unknown): T {
	return value as T;
}

