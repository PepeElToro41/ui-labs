import Roact, { Children, PropsWithChildren } from "@rbxts/roact";
import { useBinding, withHooks } from "@rbxts/roact-hooked";
import ColorPicker from "UI/Overlay/ColorPicker";
import { Div } from "UI/UIUtils/Styles/Div";
import PositionBinder from "UI/UIUtils/Styles/PositionBinder";

function PickerHolderCreate(props: {}) {
	const [sizeBind, setSizeBind] = useBinding<[Vector2, Vector2]>([new Vector2(0, 0), new Vector2(0, 0)]);
	const [position] = useBinding(UDim2.fromScale(0.5, 0.5));
	return (
		<PositionBinder
			BackgroundTransparency={1}
			BindSet={setSizeBind}
			Size={UDim2.fromScale(1, 1)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
		>
			<ColorPicker CanvasBind={sizeBind} Position={position} StartColor={Color3.fromRGB(255, 100, 100)}></ColorPicker>
		</PositionBinder>
	);
}
const PickerHolder = withHooks(PickerHolderCreate);

export = function (target: ScreenGui) {
	const NewColorPicker = <PickerHolder></PickerHolder>;
	const Handler = Roact.mount(NewColorPicker, target, "ColorPicker");
	return function () {
		Roact.unmount(Handler);
	};
};
