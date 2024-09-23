import React from "@rbxts/react";
import Corner from "UI/Styles/Corner";
import TopList from "UI/Styles/List/TopList";
import { useButtonElements } from "../Utils";
import Padding from "UI/Styles/Padding";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToolbarHovered } from "Context/StoryPanelContext";
import { useUnmountEffect } from "@rbxts/pretty-react-hooks";

interface RenderToolButtonsProps {
	PreviewEntry: PreviewEntry;
	HoverAlpha: React.Binding<UDim2> | UDim2;
}

function RenderToolButtons(props: RenderToolButtonsProps) {
	const theme = useTheme();
	const buttonElements = useButtonElements(props.PreviewEntry);
	const [hovered, setToolbarHovered] = useToolbarHovered();

	useUnmountEffect(() => {
		setToolbarHovered(false);
	});

	return (
		<frame
			key={"ButtonsHolder"}
			Position={props.HoverAlpha}
			BackgroundTransparency={0.2}
			Size={UDim2.fromScale(1, 1)}
			BackgroundColor3={theme.Toolbar}
			BorderSizePixel={0}
			Event={{
				MouseEnter: () => setToolbarHovered(true),
				MouseLeave: () => setToolbarHovered(false),
			}}
		>
			<Corner Radius={6} />
			<Padding Padding={2} />
			<TopList HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 2)} />
			{buttonElements}
		</frame>
	);
}

export default RenderToolButtons;
