import Roact from "@rbxts/roact";
import { Choose } from "@rbxts/ui-labs/out/ControlsUtil";
import { AddControlBinding } from "UI/Contexts/ActionsContext";
import ControlHolder from "UI/Controls/ControlHolder";
import ControlMap from "UI/Controls/ControlMap";
import { Div } from "UI/UIUtils/Styles/Div";
import Signal from "Utils/Signal";

export = function (target: ScreenGui) {
	const ControlApply = (value: unknown) => {
		print(value);
	};
	const listener = new Signal();
	const chooseList = Choose(["Test1", "Test2", "Test3"], 0);
	const control = AddControlBinding(chooseList);
	const NewBoolControl = (
		<Div
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(31, 31, 31)}
			BackgroundTransparency={0}
		>
			<ControlHolder ControlName={"Color Test"} LayoutOrder={0} ResetSignal={listener}>
				<ControlMap.Choose
					DefaultIndex={0}
					ChooseList={chooseList.Props.ChooseList}
					Control={control}
					ResetSignal={listener}
					ControlApply={ControlApply}
					Default={Color3.fromRGB(255, 100, 100)}
				></ControlMap.Choose>
			</ControlHolder>
		</Div>
	);
	const Handler = Roact.mount(NewBoolControl, target, "SliderControl");
	return function () {
		listener.Destroy();
		Roact.unmount(Handler);
	};
};
