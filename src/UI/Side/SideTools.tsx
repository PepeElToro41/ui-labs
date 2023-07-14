import Roact from "@rbxts/roact";
import { useContext, useState, withHooks } from "@rbxts/roact-hooked";
import ThemeContext from "UI/Contexts/ThemeContext";
import IconButton from "UI/UIUtils/IconButton";
import { Text } from "UI/UIUtils/Styles/Text";

interface SideToolsProps {
	LayoutOrder: number;
}

function setProps(props: SideToolsProps) {
	return props;
}

function SideToolsCreate(setprops: SideToolsProps) {
	const props = identity<Required<SideToolsProps>>(setProps(setprops) as Required<SideToolsProps>);
	const [folderHovered, setFolderHovered] = useState(false);
	const theme = useContext(ThemeContext).Theme;
	return (
		<frame
			Key="ToolsFrame"
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundTransparency={1}
			LayoutOrder={props.LayoutOrder}
			Size={new UDim2(1, -10, 0, 20)}
		>
			<Text
				Key="Label"
				AutomaticSize={Enum.AutomaticSize.X}
				BackgroundTransparency={1}
				Size={new UDim2(0, 0, 0.9, 0)}
				Text="Story Explorer"
				TextColor3={theme.TextColor}
				TextSize={14}
			/>
			<frame
				Key="Divisor"
				AnchorPoint={new Vector2(0.5, 1)}
				BackgroundColor3={theme.Divisor}
				BackgroundTransparency={0.7}
				BorderSizePixel={0}
				Position={new UDim2(0.5, 0, 1, 5)}
				Size={new UDim2(1, 0, 0, 1)}
			/>
			{/*<IconButton
				ButtonName="AddFolder"
				Position={UDim2.fromScale(1, 0.5)}
				Size={new UDim2(0, 24, 0, 24)}
				Icon={{
					Pos: UDim2.fromScale(0.5, 0.5),
					Size: new UDim2(0.95, 0, 0.87, 0),
					RectOffset: new Vector2(256, 256),
					RectSize: new Vector2(64, 64),
				}}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				CornerRadius={new UDim(0, 5)}
				AnchorPoint={new Vector2(1, 0.5)}
				Description="New Folder"
				OnClick={() => {}}
			></IconButton>*/}
		</frame>
	);
}
const SideTools = withHooks(SideToolsCreate);

export = SideTools;
