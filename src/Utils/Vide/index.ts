import Vide, { source, Source } from "@rbxts/vide";

export function Ref<T>(source: Source<T>) {
	return Vide.action(source);
}

export type SourceInit<T> = T | Source<T>;

export function constant<T>(val: T): () => T {
	return () => val;
}

export function InitSource<T extends defined>(init: SourceInit<T> | undefined, def: T): Source<T>;
export function InitSource<T extends defined>(init: SourceInit<T>, def?: T): Source<T>;
export function InitSource<T extends defined>(init: SourceInit<T>, def: T): Source<T> {
	if (!init) return source(def);

	if (typeIs(init, "function")) return init;

	return source(init);
}
