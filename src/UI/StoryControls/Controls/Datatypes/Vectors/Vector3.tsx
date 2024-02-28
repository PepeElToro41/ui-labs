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
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Corner from "UI/Styles/Corner";
import { Counter } from "Utils/NumberUtils";

type Axis = "X" | "Y" | "Z";
function Vector3Control(props: ControlElementProps<DatatypeControl<"Vector3">>) {
	const theme = useTheme();
	const count = Counter();

	const OnAxisApply = useCallback(
		(axis: Axis) => {
			return (value: number) => {
				const current = props.Current;
				const vector: Record<Axis, number> = { X: current.X, Y: current.Y, Z: current.Z };
				vector[axis] = value;
				props.Apply(new Vector3(vector.X, vector.Y, vector.Z));
			};
		},
		[props.Apply, props.Current],
	);
	const OnSetX = useMemo(() => OnAxisApply("X"), [OnAxisApply]);
	const OnSetY = useMemo(() => OnAxisApply("Y"), [OnAxisApply]);
	const OnSetZ = useMemo(() => OnAxisApply("Z"), [OnAxisApply]);

	return (
		<Div>
			<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 4)} />
			<Padding PaddingY={4} />
			<AxisEntry Name="X" Value={props.Current.X} SetValue={OnSetX} Order={count()} />
			<AxisEntry Name="Y" Value={props.Current.Y} SetValue={OnSetY} Order={count()} />
			<AxisEntry Name="Z" Value={props.Current.Z} SetValue={OnSetZ} Order={count()} />
			<Div Size={new UDim2(0, 5, 1, 0)} LayoutOrder={count()} />
			<frame
				Size={new UDim2(0, 0, 1, -2)}
				LayoutOrder={count()}
				AutomaticSize={Enum.AutomaticSize.X}
				BackgroundColor3={theme.Nodes.StorySelected.Color}
			>
				<Padding PaddingX={10} />
				<Corner Radius={6} />
				<Text
					Text={"Update"}
					TextSize={12}
					TextColor3={theme.Nodes.StorySelected.Text.Color}
					Size={UDim2.fromScale(0, 1)}
					AutomaticSize={Enum.AutomaticSize.X}
				/>
			</frame>
		</Div>
	);
}

export default Vector3Control;
