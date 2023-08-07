import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import ResizableFrame from "UI/Holders/ResizableFrame";
import List from "UI/Styles/List";
import Padding from "UI/Styles/Padding";
import SearchInput from "./SearchInput";
import PanelTools from "./PanelTools";
import StoryTree from "./StoryTree";

interface SidePanelProps {}

function setProps(props: SidePanelProps) {
	return props as Required<SidePanelProps>;
}

function SidePanelCreate(setprops: SidePanelProps) {
	const props = setProps(setprops as Required<SidePanelProps>);
	const theme = useTheme();
	return (
		<ResizableFrame
			Key="SidePanel"
			BaseSize={new UDim2(0, 250, 1, 0)}
			ResizeRange={new NumberRange(-100, 300)}
			MaxBeforeCollapse={-180}
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
			<SearchInput
				Key="SearchInput"
				OnSearchChanged={() => {}}
				LayoutOrder={1}
				Size={new UDim2(1, 0, 0, 27)}
				Placeholder="Search Story"
			></SearchInput>
			<PanelTools></PanelTools>
			<StoryTree></StoryTree>
		</ResizableFrame>
	);
}
const SidePanel = withHooks(SidePanelCreate);

export = SidePanel;
