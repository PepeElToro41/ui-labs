import React, { useCallback } from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import ResizableFrame from "UI/Holders/ResizableFrame";
import Padding from "UI/Styles/Padding";
import PanelTools from "./PanelTools";
import StoryTree from "./StoryTree";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import InputBase from "UI/Utils/InputBase";
import TopList from "UI/Styles/List/TopList";
import Branding from "./Branding";
import { selectFullscreen } from "Reflex/Interface";

interface SidePanelProps {}

function SidePanel(props: SidePanelProps) {
	const theme = useTheme();
	const fullscreen = useSelector(selectFullscreen);

	const { setFilter } = useProducer<RootProducer>();

	const OnTextChanged = useCallback((textbox: TextBox) => {
		setFilter(textbox.Text);
	}, []);

	return (
		<ResizableFrame
			key="SidePanel"
			BaseSize={new UDim2(0, 250, 1, 0)}
			ResizeRange={new NumberRange(-130, 300)}
			DragColor={theme.ResizePanelDrag}
			MaxBeforeCollapse={-200}
			HolderProps={{
				AnchorPoint: new Vector2(0, 1),
				Position: new UDim2(0, 0, 1, 0),
				ZIndex: 2,
				Visible: !fullscreen
			}}
			FrameProps={{
				BackgroundColor3: theme.SidePanel,
				BackgroundTransparency: 0,
				BorderSizePixel: 0
			}}
		>
			<Padding Padding={12} Top={8} />
			<TopList HorizontalAlignment={"Center"} Padding={new UDim(0, 10)} />
			<Branding />
			<InputBase
				key="SearchInput"
				HolderProps={{
					LayoutOrder: 1,
					Size: new UDim2(1, 0, 0, 27)
				}}
				TextboxProps={{
					PlaceholderText: "Search Story"
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
