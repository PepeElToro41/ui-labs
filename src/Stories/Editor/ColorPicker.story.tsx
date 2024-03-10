import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import ReactRoblox from "@rbxts/react-roblox";
import { RootProducer } from "Reflex";
import ColorPicker from "UI/Overlays/ColorPicker";

export = function (target: ScreenGui) {
	const NewColorPicker = (
		<ReflexProvider producer={RootProducer}>
			<ColorPicker StartColor={new Color3(3, 0, 0)} ApplyColor={() => {}} Position={UDim2.fromScale(0.5, 0.5)} />
		</ReflexProvider>
	);
	const root = ReactRoblox.createRoot(target);
	root.render(NewColorPicker);
	return function () {
		root.unmount();
	};
};
