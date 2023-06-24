import Roact from "@rbxts/roact";

declare global {
	type MappedSet<T> = (oldVal: T | undefined) => T | undefined;
}

export const MouseContext = Roact.createContext({
	mouseFrameRef: identity<Roact.Ref<Frame> | undefined>(undefined),
	getMousePos: (pos: Vector2) => {},
});
