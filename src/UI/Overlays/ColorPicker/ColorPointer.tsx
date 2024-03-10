import React from "@rbxts/react";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";

interface ColorPointerProps {
	Color: Color3;
	Wrapped?: boolean;
	Order: number;
}

function ColorPointer(props: ColorPointerProps) {
	return (
		<Div key={"ColorPointer"} Size={new UDim2(1, 2, 0, 8)} LayoutOrder={props.Order}>
			<frame key={"Holder"} BackgroundColor3={props.Color} Position={UDim2.fromOffset(0, 1)} Size={UDim2.fromScale(1, 1)}>
				<Corner Radius={6} />
				<frame
					key={"Squared"}
					Position={props.Wrapped ? UDim2.fromScale(0, 1) : UDim2.fromScale(0, 0)}
					AnchorPoint={props.Wrapped ? new Vector2(0, 1) : new Vector2(0, 0)}
					BackgroundColor3={props.Color}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 0.5)}
				/>
				<imagelabel
					key={"PointArrow"}
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
