import Roact from "@rbxts/roact";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";

interface ColorPointerProps {
	Color: Color3;
	Wrapped?: boolean;
	Order: number;
}

function ColorPointer(props: ColorPointerProps) {
	return (
		<Div Key={"ColorPointer"} Size={new UDim2(1, 2, 0, 8)} LayoutOrder={props.Order}>
			<frame Key={"Holder"} BackgroundColor3={props.Color} Position={UDim2.fromOffset(0, 1)} Size={UDim2.fromScale(1, 1)}>
				<Corner Radius={6} />
				<frame
					Key={"Squared"}
					Position={props.Wrapped ? UDim2.fromScale(0, 1) : UDim2.fromScale(0, 0)}
					AnchorPoint={props.Wrapped ? new Vector2(0, 1) : new Vector2(0, 0)}
					BackgroundColor3={props.Color}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 0.5)}
				/>
				<imagelabel
					Key={"PointArrow"}
					Image={props.Wrapped ? "rbxassetid://14015191273" : "rbxassetid://14010784349"}
					ImageColor3={props.Color}
					BackgroundTransparency={1}
					AnchorPoint={props.Wrapped ? new Vector2(0, 1) : new Vector2(0, 0)}
					Position={props.Wrapped ? new UDim2(0, 15, 0, 0) : new UDim2(0, 15, 1, 0)}
					Size={UDim2.fromOffset(18, 7)}
				/>
			</frame>
		</Div>
	);
}

export default ColorPointer;
