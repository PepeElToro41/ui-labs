import Roact from "@rbxts/roact";
import { IsOverlayMap } from "UI/Overlay/OverlayMap";
import Signal from "Utils/Signal";

//Overlay is anything that is on top of the main UI floating with an absolute position
export type OverlayContextType = {
	OverlayBind: Roact.Binding<[Vector2, Vector2]>;
	OverlayInput: Signal<(input: InputObject) => void>;
	CloseOverlay: (overlayName: keyof IsOverlayMap) => void;
	PickColor: (
		startColor: Color3,
		posBind: Roact.Binding<Vector2>,
		applierCallback: (setColor: Color3) => void,
		onClose: () => void,
		startAlpha?: number,
		alphaCallback?: (setAlpha: number) => void,
	) => void;
};
export const OverlayContext = Roact.createContext<OverlayContextType>({
	OverlayInput: new Signal<() => void>(),
} as OverlayContextType);
