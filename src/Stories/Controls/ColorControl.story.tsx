import Roact from "@rbxts/roact";
import { Boolean } from "@rbxts/ui-labs/out/ControlsUtil";
import { AddControlBinding } from "UI/Contexts/ActionsContext";
import ControlHolder from "UI/Controls/ControlHolder";
import ControlMap from "UI/Controls/ControlMap";
import StringControl from "UI/Controls/ControlSet/StringControl";
import { Div } from "UI/UIUtils/Styles/Div";
import Signal from "Utils/Signal";

export = function (target: ScreenGui) {
	const ControlApply = (value: unknown) => {
		print(value);
	};
	const listener = new Signal<() => void>();
	const control = AddControlBinding(Boolean(false));
	const NewBoolControl = (
		<Div
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(31, 31, 31)}
			BackgroundTransparency={0}
		>
			<ControlHolder ControlName={"Color Test"} LayoutOrder={0}>
				<ControlMap.Color3
					Control={control}
					ResetListen={listener}
					ControlApply={ControlApply}
					Default={Color3.fromRGB(255, 100, 100)}
				></ControlMap.Color3>
			</ControlHolder>
		</Div>
	);
	const Handler = Roact.mount(NewBoolControl, target, "SliderControl");
	return function () {
		listener.Destroy();
		Roact.unmount(Handler);
	};
};
