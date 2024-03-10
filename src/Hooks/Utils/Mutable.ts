import { useMemo } from "@rbxts/react";

export function useMutable<T>(): { current: T | undefined };
export function useMutable<T>(value: T): { current: T };

export function useMutable<T>(value?: T) {
	const mutable = useMemo(() => {
		return { current: value };
	}, []);
	return mutable;
}
