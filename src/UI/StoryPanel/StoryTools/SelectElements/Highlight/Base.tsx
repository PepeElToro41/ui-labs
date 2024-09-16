import React, { Binding } from "@rbxts/react";
import Text from "UI/Styles/Text";
import Padding from "UI/Styles/Padding";
import Rounder from "UI/Styles/Rounder";
import Corner from "UI/Styles/Corner";
import EdgePointer from "./EdgePointer";
import { Div } from "UI/Styles/Div";
import FollowComponent from "../../Utils/FollowComponent";
import { useShapeInfo } from "../../Utils";
import { GetNonFullscreenParent } from "./Utils";
import TitleLabel from "./TitleLabel";

interface BaseProps {
	Color: Color3;
	UIComponent: GuiObject;
	Title: string;
	Inset: Binding<Vector2>;
	Holder: GuiObject;
}

function Base(props: BaseProps) {
	const [position, size] = useShapeInfo(props.UIComponent);
	const parent = GetNonFullscreenParent(props.UIComponent, props.Holder);

	return (
		<FollowComponent Component={props.UIComponent} Inset={props.Inset}>
			<frame
				key={"Selector"}
				Size={UDim2.fromScale(1, 1)}
				BackgroundColor3={props.Color}
				BackgroundTransparency={0.7}
				BorderSizePixel={0}
			>
				<uistroke Color={props.Color} Thickness={1} />
				<Corner Radius={3} />
			</frame>
			<Div key={"TopPart"}>
				<TitleLabel Color={props.Color} Size={size} Name={props.UIComponent.Name} />
			</Div>
			{parent && parent.IsA("GuiObject") ? (
				<EdgePointer Color={props.Color} ComponentPosition={position} ComponentSize={size} Parent={parent} />
			) : undefined}
			<Text
				key={"SizeLabel"}
				Position={new UDim2(1, 0, 1, 5)}
				AnchorPoint={new Vector2(1, 0)}
				Size={UDim2.fromOffset(0, 18)}
				AutomaticSize={Enum.AutomaticSize.X}
				Text={size.map((s) => `${math.floor(s.X)} x ${math.floor(s.Y)}`)}
				TextSize={12}
				BackgroundTransparency={0}
				BackgroundColor3={props.Color}
			>
				<Padding PaddingX={5} />
				<Rounder />
			</Text>
		</FollowComponent>
	);
}

export default Base;
