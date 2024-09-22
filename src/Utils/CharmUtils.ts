import { useAtom } from "@rbxts/charm";

type Derived = (...args: defined[]) => any;
export function useAtomDeriver<T extends Derived>(derived: T, ...args: Parameters<T>): ReturnType<T> {
	const value = useAtom<ReturnType<T>>(() => derived(...args), [...args]);
	return value;
}
