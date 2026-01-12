import { composeBindings } from "@rbxts/pretty-react-hooks";
import React, { Binding } from "@rbxts/react";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";
import Rounder from "UI/Styles/Rounder";
import Text from "UI/Styles/Text";

import { useShapeInfo } from "../../Utils";

interface DistanceLabelProps {
	Distance: Binding<Vector2>;
	DistanceAxis: "X" | "Y";
	Color: Color3;
}

function DistanceLabel(props: DistanceLabelProps) {
	return (
		<Text
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={UDim2.fromOffset(0, 18)}
			AutomaticSize={Enum.AutomaticSize.X}
			TextSize={12}
			Text={props.Distance.map((d) => tostring(math.floor(d[props.DistanceAxis])))}
			BackgroundTransparency={0}
			BackgroundColor3={props.Color}
		>
			<Padding PaddingX={5} />
			<Rounder />
		</Text>
	);
}

interface EdgePointerProps {
	Color: Color3;
	ComponentPosition: Binding<Vector2>;
	ComponentSize: Binding<Vector2>;
	Parent: GuiObject;
}

const MIN_EDGE_DISTANCE = 10;

function EdgePointer(props: EdgePointerProps) {
	const [position, size] = useShapeInfo(props.Parent);
	const distance = composeBindings(position, props.ComponentPosition, (position, componentPosition) => {
		return componentPosition.sub(position);
	});

	return (
		<Div key={"EdgePointer"}>
			<frame
				key={"HeightPointer"}
				Position={UDim2.fromScale(0.5, 0)}
				AnchorPoint={new Vector2(0.5, 1)}
				Size={distance.map((d) => UDim2.fromOffset(2, d.Y))}
				BackgroundColor3={props.Color}
				BorderSizePixel={0}
				Visible={distance.map((d) => d.Y > MIN_EDGE_DISTANCE)}
			>
				<DistanceLabel Distance={distance} DistanceAxis="Y" Color={props.Color} />
			</frame>
			<frame
				key={"WidthPointer"}
				Position={UDim2.fromScale(0, 0.5)}
				AnchorPoint={new Vector2(1, 0.5)}
				Size={distance.map((d) => UDim2.fromOffset(d.X, 2))}
				BackgroundColor3={props.Color}
				BorderSizePixel={0}
				Visible={distance.map((d) => d.X > MIN_EDGE_DISTANCE)}
			>
				<DistanceLabel Distance={distance} DistanceAxis="X" Color={props.Color} />
			</frame>
		</Div>
	);
}

export default EdgePointer;
