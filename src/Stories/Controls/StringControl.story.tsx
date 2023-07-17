import Roact from "@rbxts/roact";
import Signal from "@rbxts/ui-labs/out/Typings/Signal";
import ControlHolder from "UI/Controls/ControlHolder";
import ControlMap from "UI/Controls/ControlMap";
import StringControl from "UI/Controls/ControlSet/StringControl";
import { Div } from "UI/UIUtils/Styles/Div";

export = function (target: ScreenGui) {
	const ControlApply = (value: unknown) => {
		print(value);
	};
	const listener = new Signal<() => void>();
	const NewBoolControl = (
		<Div
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(31, 31, 31)}
			BackgroundTransparency={0}
		>
			<ControlHolder ControlName={"String Test"} LayoutOrder={0}>
				<ControlMap.string ResetListen={listener} ControlApply={ControlApply} Default={"Hello"}></ControlMap.string>
			</ControlHolder>
		</Div>
	);
	const Handler = Roact.mount(NewBoolControl, target, "SliderControl");
	return function () {
		listener.Destroy();
		Roact.unmount(Handler);
	};
};
