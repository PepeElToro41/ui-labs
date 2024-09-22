import { Molecule, subscribe } from "@rbxts/charm";
import { cleanup, source } from "@rbxts/vide";

export function useAtom<T>(callback: Molecule<T>) {
	const state = source(callback());
	const disconnect = subscribe(callback, state);

	cleanup(disconnect);

	return state;
}
