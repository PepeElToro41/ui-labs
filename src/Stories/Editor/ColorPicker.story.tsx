import Roact from "@rbxts/roact";
import { ReflexProvider } from "@rbxts/react-reflex";
import { RootProducer } from "Reflex";
import ColorPicker from "UI/Overlays/ColorPicker";

export = function (target: ScreenGui) {
	const NewColorPicker = (
		<ReflexProvider producer={RootProducer}>
			<ColorPicker StartColor={new Color3(1, 0, 0)} ApplyColor={() => {}} Position={UDim2.fromScale(0.5, 0.5)} />
		</ReflexProvider>
	);
	const Handler = Roact.mount(NewColorPicker, target, "ColorPicker");
	return function () {
		Roact.unmount(Handler);
	};
};
