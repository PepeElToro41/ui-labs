import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { Div } from "UI/Styles/Div";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";

interface EmptyFillerProps {
	LayoutOrder?: number;
}

function EmptyFiller(props: EmptyFillerProps) {
	const theme = useTheme();

	return (
		<Div
			Size={UDim2.fromScale(1, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			LayoutOrder={props.LayoutOrder}
		>
			<imagelabel
				Image={"rbxassetid://18544640276"}
				ImageColor3={theme.Text.Disabled}
				BackgroundTransparency={1}
				ImageTransparency={0.5}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={UDim2.fromOffset(18, 18 * 1.8)}
			/>
			<Padding PaddingY={12} />
		</Div>
	);
}

export default EmptyFiller;
