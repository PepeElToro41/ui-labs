import Vide, { cleanup, effect, source, Source } from "@rbxts/vide";

export function Ref<T>(source: Source<T>) {
	return Vide.action(source);
}

export type Derived<T> = () => T;

export type SourceInit<T> = T | Source<T>;

export function constant<T>(val: T): () => T {
	return () => val;
}

export interface DerivedChildren {
	children: Derived<Vide.Node>;
}

interface ConnectionLike {
	Disconnect(): void;
}

interface EventLike<T extends Callback = Callback> {
	Connect(listener: T): ConnectionLike;
}

export function connect<T extends EventLike>(event: T, listener: T extends EventLike<infer U> ? U : never) {
	cleanup(event.Connect(listener));
}
export function testSource<T>(source: Derived<T>, prefix?: string, ...args: unknown[]) {
	effect(() => print(prefix, source(), ...args));
}

export function MapArrayIndexes<T extends Record<string, any>, K extends keyof T>(array: T[], index: K): Map<T[K], T> {
	const map = new Map<T[K], T>();
	array.forEach((item, order) => {
		map.set(item[index], item);
	});
	return map;
}

export function ExtractProp<T extends Record<string, any>, K extends keyof T>(props: T, key: K): T[K] {
	const prop = props[key];
	delete props[key];
	return prop;
}

export function InitSource<T extends defined>(init: SourceInit<T> | undefined, def: T): Source<T>;
export function InitSource<T extends defined>(init: SourceInit<T>, def?: T): Source<T>;
export function InitSource<T extends defined>(init: SourceInit<T>, def: T): Source<T> {
	if (init === undefined) return source(def);

	if (typeIs(init, "function")) return init;

	return source(init);
}
