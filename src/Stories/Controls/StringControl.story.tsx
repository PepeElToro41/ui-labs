import Roact from "@rbxts/roact";
import { Number, String, __ControlBinder } from "@rbxts/ui-labs/out/ControlsUtil";
import { AddControlBinding } from "UI/Contexts/ActionsContext";
import ControlHolder from "UI/Controls/ControlHolder";
import ControlMap from "UI/Controls/ControlMap";
import StringControl from "UI/Controls/ControlSet/StringControl";
import { Div } from "UI/UIUtils/Styles/Div";
import Signal from "Utils/Signal";

export = function (target: ScreenGui) {
	const listener = new Signal<() => void>();

	const ControlApply = (value: unknown) => {
		print(value);
	};
	const control = AddControlBinding(String("Hello"));
	const NewBoolControl = (
		<Div
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(31, 31, 31)}
			BackgroundTransparency={0}
		>
			<ControlHolder ControlName={"String Test"} LayoutOrder={0} ResetSignal={listener}>
				<ControlMap.string
					Control={control}
					ResetSignal={listener}
					ControlApply={ControlApply}
					Default={"Hello"}
				></ControlMap.string>
			</ControlHolder>
		</Div>
	);
	const Handler = Roact.mount(NewBoolControl, target, "SliderControl");
	return function () {
		listener.Destroy();
		Roact.unmount(Handler);
	};
};
