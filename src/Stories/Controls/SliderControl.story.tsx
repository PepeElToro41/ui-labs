import Roact from "@rbxts/roact";
import { Number, Slider, __ControlBinder } from "@rbxts/ui-labs/out/ControlsUtil";
import { AddControlBinding } from "UI/Contexts/ActionsContext";
import ControlHolder from "UI/Controls/ControlHolder";
import ControlMap from "UI/Controls/ControlMap";
import SliderControl from "UI/Controls/ControlSet/SliderControl";
import { Div } from "UI/UIUtils/Styles/Div";
import Signal from "Utils/Signal";

export = function (target: ScreenGui) {
	const ControlApply = (value: unknown) => {
		//print(value);
	};
	const listener = new Signal<() => void>();
	const control = AddControlBinding(Slider(30, 10, 100, 5));
	const NewSliderControl = (
		<Div
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(31, 31, 31)}
			BackgroundTransparency={0}
		>
			<ControlHolder ControlName={"Slider Test"} LayoutOrder={0}>
				<ControlMap.Slider
					ResetListen={listener}
					ControlApply={ControlApply}
					Control={control}
					Min={10}
					Max={100}
					Step={5}
					Default={30}
				></ControlMap.Slider>
			</ControlHolder>
		</Div>
	);
	const Handler = Roact.mount(NewSliderControl, target, "SliderControl");
	return function () {
		listener.Destroy();
		Roact.unmount(Handler);
	};
};
