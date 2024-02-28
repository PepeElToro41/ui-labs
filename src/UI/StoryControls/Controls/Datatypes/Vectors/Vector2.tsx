import { lerp } from "@rbxts/pretty-react-hooks";
import Roact, { useCallback, useMemo } from "@rbxts/roact";
import { DatatypeControl } from "@rbxts/ui-labs/src/ControlTypings/Datatypes";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Rounder from "UI/Styles/Rounder";
import Text from "UI/Styles/Text";
import InputEntry from "UI/Utils/InputEntry";
import { Decoders } from "UI/Utils/InputEntry/Decoders";
import { Filters } from "UI/Utils/InputEntry/Filters";
import Sprite from "UI/Utils/Sprite";
import AxisEntry from "./AxisEntry";

type Axis = "X" | "Y";
function Vector2Control(props: ControlElementProps<DatatypeControl<"Vector2">>) {
	const OnAxisApply = useCallback(
		(axis: Axis) => {
			return (value: number) => {
				const current = props.Current;
				const vector: Record<Axis, number> = { X: current.X, Y: current.Y };
				vector[axis] = value;
				props.Apply(new Vector2(vector.X, vector.Y));
			};
		},
		[props.Apply, props.Current],
	);
	const OnSetX = useMemo(() => OnAxisApply("X"), [OnAxisApply]);
	const OnSetY = useMemo(() => OnAxisApply("Y"), [OnAxisApply]);

	return (
		<Div>
			<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 4)} />
			<Padding PaddingY={4} />
			<AxisEntry Name="X" Value={props.Current.X} SetValue={OnSetX} />
			<AxisEntry Name="Y" Value={props.Current.Y} SetValue={OnSetY} />
		</Div>
	);
}

export default Vector2Control;
