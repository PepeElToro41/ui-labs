import Fusion from "@rbxts/fusion";

declare global {
	interface Fusion3 {
		Value<T>(val: T): Fusion.Value<T>;
		Hydrate(
			object: Instance
		): (hidration: Record<defined, defined>) => Instance;

		Children: string;
		scoped: (fusion: Fusion3, ...scoped: object[]) => Fusion3;
		doCleanup: (cleanup: unknown) => void;
	}
	type Fusion = typeof Fusion;
}
