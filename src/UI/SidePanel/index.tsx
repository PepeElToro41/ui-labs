import React, { useCallback } from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import ResizableFrame from "UI/Holders/ResizableFrame";
import List from "UI/Styles/List";
import Padding from "UI/Styles/Padding";
import PanelTools from "./PanelTools";
import StoryTree from "./StoryTree";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { selectOverlay } from "Reflex/Overlay";
import InputBase from "UI/Utils/InputBase";

interface SidePanelProps {}

function SidePanel(props: SidePanelProps) {
	const theme = useTheme();

	const { setFilter } = useProducer<RootProducer>();

	const OnTextChanged = useCallback((textbox: TextBox) => {
		setFilter(textbox.Text);
	}, []);

	return (
		<ResizableFrame
			key="SidePanel"
			BaseSize={new UDim2(0, 250, 1, 0)}
			ResizeRange={new NumberRange(-130, 300)}
			MaxBeforeCollapse={-200}
			HolderProps={{
				AnchorPoint: new Vector2(0, 1),
				Position: new UDim2(0, 0, 1, 0),
				ZIndex: 2,
			}}
			FrameProps={{
				BackgroundColor3: theme.SidePanel,
				BackgroundTransparency: 0,
				BorderSizePixel: 0,
			}}
		>
			<Padding Padding={12} />
			<List HorizontalAlignment={"Center"} Padding={new UDim(0, 10)} />
			<InputBase
				key="SearchInput"
				HolderProps={{
					LayoutOrder: 1,
					Size: new UDim2(1, 0, 0, 27),
				}}
				TextboxProps={{
					PlaceholderText: "Search Story",
				}}
				Sprite={"Search"}
				OnTextChanged={OnTextChanged}
			></InputBase>
			<PanelTools />
			<StoryTree />
		</ResizableFrame>
	);
}

export default SidePanel;
