import Roact from "@rbxts/roact";
import { useCallback, withHooks } from "@rbxts/roact-hooked";
import { useProducer, useSelector } from "@rbxts/roact-reflex";
import { useMousePos } from "Hooks/Context/UserInput";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { usePosition } from "Hooks/Utils/ContainerPos";
import { useToggler } from "Hooks/Utils/Toggler";
import { RootUID } from "Plugin/Configs";
import { selectNodeFromModule } from "Reflex/Explorer/Nodes";
import { selectStorySelected } from "Reflex/StorySelection";
import PreviewDropdown from "UI/Overlays/Dropdown/PreviewDropdown";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Rounder from "UI/Styles/Rounder";
import { Text } from "UI/Styles/Text";

interface MountEntryProps {
	PreviewEntry: PreviewEntry;
}

function MountEntryCreate(props: MountEntryProps) {
	const [hovered, hoverApi] = useToggler(false);
	const [closeHovered, closeHoverApi] = useToggler(false);

	const node = useSelector(selectNodeFromModule(props.PreviewEntry.Module));
	const selectedEntry = useSelector(selectStorySelected);
	const { selectStory, setOverlay, unmountStory } = useProducer<RootProducer>();

	const theme = useTheme();
	const getPosition = usePosition();
	const mousePosition = useMousePos();

	const selected = selectedEntry === props.PreviewEntry.UID;
	const isMain = props.PreviewEntry.UID === RootUID;

	const OnEntryClicked = useCallback(() => {
		selectStory(props.PreviewEntry.UID);
	}, [props.PreviewEntry]);

	const OnEntryClosed = useCallback(() => {
		unmountStory(props.PreviewEntry.UID);
	}, [props.PreviewEntry]);

	const OnEntryDropdown = useCallback(() => {
		const mousePos = getPosition(mousePosition.getValue());
		const position = UDim2.fromOffset(mousePos.X, mousePos.Y);
		setOverlay("PreviewDropdown", <PreviewDropdown Position={position} PreviewEntry={props.PreviewEntry} />);
	}, [getPosition, props.PreviewEntry]);

	return (
		<Detector
			Key={"Entry"}
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundColor3={selected ? theme.StoryPreview.Selected : theme.StoryPreview.Color}
			BackgroundTransparency={0}
			BorderSizePixel={0}
			Size={UDim2.fromScale(0, 1)}
			Event={{
				MouseEnter: hoverApi.enable,
				MouseLeave: hoverApi.disable,
				MouseButton1Click: OnEntryClicked,
				MouseButton2Click: OnEntryDropdown,
			}}
		>
			<Corner Radius={6} />
			<Padding PaddingX={8} />
			<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 7)} />
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={Color3.fromRGB(180, 180, 180)}
				Transparency={hovered ? 0.5 : 1}
			/>
			<Text
				Key={"TextLabel"}
				Text={(isMain ? "• " : "") + (node ? node.Name : "---")}
				TextSize={14}
				TextColor3={selected ? theme.StoryPreview.TextSelected : theme.Text.Color}
				TextXAlignment={Enum.TextXAlignment.Left}
				AutomaticSize={Enum.AutomaticSize.X}
				Size={UDim2.fromScale(0, 1)}
			/>
			<frame
				Key={"CloseFrame"}
				LayoutOrder={2}
				Size={UDim2.fromOffset(16, 16)}
				BackgroundTransparency={closeHovered ? 0 : 1}
				BackgroundColor3={Color3.fromRGB(184, 71, 71)}
			>
				<Rounder />
				<imagelabel
					Key={"CloseIcon"}
					Image={"rbxassetid://14105481154"}
					ImageRectOffset={new Vector2(192, 192)}
					ImageRectSize={new Vector2(64, 64)}
					ImageColor3={selected ? theme.StoryPreview.TextSelected : theme.Text.Color}
					ScaleType={Enum.ScaleType.Fit}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Size={UDim2.fromScale(0.85, 0.85)}
				/>
				<Detector
					Event={{
						MouseEnter: closeHoverApi.enable,
						MouseLeave: closeHoverApi.disable,
						MouseButton1Click: OnEntryClosed,
					}}
				/>
			</frame>
		</Detector>
	);
}
const MountEntry = withHooks(MountEntryCreate);

export = MountEntry;
