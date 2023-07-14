import Roact from "@rbxts/roact";

//Overlay is anything that is on top of the main UI floating with an absolute position
export type OverlayContextType = {
	OverlayBind: Roact.Binding<[Vector2, Vector2]>;
	PickColor: (startColor: Color3, applierCallback: (setColor: Color3) => void) => void;
};
export const OverlayContext = Roact.createContext<OverlayContextType>(undefined as unknown as OverlayContextType);
