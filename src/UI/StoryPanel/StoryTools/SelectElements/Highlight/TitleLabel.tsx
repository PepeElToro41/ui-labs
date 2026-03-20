import React, { Binding, useMemo } from "@rbxts/react";
import { TextService } from "@rbxts/services";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";

interface TitleLabelProps {
	Color: Color3;
	Size: Binding<Vector2>;
	Name: string;
}

const PADDING = 6;

function TitleLabel(props: TitleLabelProps) {
	const titleSize = useMemo(() => {
		const textSize = TextService.GetTextSize(props.Name, 12, Enum.Font.Gotham, new Vector2(math.huge, math.huge));
		return textSize.X;
	}, [props.Name]);

	const isSmall = props.Size.map((size) => {
		const isSmallX = size.X < titleSize + 2 + PADDING * 2;
		const isSmallY = size.Y < 26;
		return isSmallX || isSmallY;
	});

	return (
		<Div
			key={"TitleHolder"}
			Position={isSmall.map((isSmall) => (isSmall ? new UDim2(0, 0, 0, -4) : new UDim2(0, 0, 0, 0)))}
			AnchorPoint={isSmall.map((isSmall) => (isSmall ? new Vector2(0, 1) : new Vector2(0, 0)))}
			Size={UDim2.fromOffset(titleSize + 2 + PADDING * 2, 20)}
		>
			<frame key={"Title"} BackgroundColor3={props.Color} Size={UDim2.fromScale(1, 1)}>
				<Padding PaddingX={PADDING} />
				<Corner Radius={6} />
				<Text
					Size={UDim2.fromScale(0, 1)}
					TextSize={12}
					Text={props.Name}
					AutomaticSize={Enum.AutomaticSize.X}
					TextXAlignment={Enum.TextXAlignment.Center}
				/>
			</frame>
			<frame key={"Separator1"} Size={new UDim2(0, 6, 1, 0)} BorderSizePixel={0} BackgroundColor3={props.Color} />
			<frame
				key={"Separator2"}
				Size={new UDim2(0, 6, 0.5, 0)}
				Position={UDim2.fromScale(1, 0)}
				AnchorPoint={new Vector2(1, 0)}
				BorderSizePixel={0}
				BackgroundColor3={props.Color}
			/>
		</Div>
	);
}

export default TitleLabel;
