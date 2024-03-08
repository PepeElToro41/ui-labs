import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Rounder from "UI/Styles/Rounder";

interface MarkProps {
	Amount: number;
	Position: number;
	Percent: React.Binding<number>;
}

function Mark(props: MarkProps) {
	const theme = useTheme();
	const size = (1 / props.Amount) * props.Position;
	return (
		<frame
			key={"Mark" + props.Position}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={props.Percent.map((percent) => {
				return percent >= size ? theme.Nodes.StorySelected.Color : theme.Search.Color;
			})}
			BorderSizePixel={0}
			Position={new UDim2(size, 0, 0.5, 0)}
			Size={new UDim2(0, 7, 0, 7)}
		>
			<Rounder />
		</frame>
	);
}

export default Mark;
