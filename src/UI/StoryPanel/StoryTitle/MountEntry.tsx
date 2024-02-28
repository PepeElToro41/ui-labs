import Roact, { useCallback, useEffect } from "@rbxts/roact";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { useMouseOffset, useMousePos, useRelativeMousePos } from "Hooks/Context/UserInput";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { usePosition } from "Hooks/Utils/AppHolder";
import { useToggler } from "Hooks/Utils/Toggler";
import Config from "Plugin/Configs";
import { selectNodeFromModule } from "Reflex/Explorer/Nodes";
import { selectStorySelected } from "Reflex/StorySelection";
import PreviewDropdown from "UI/Overlays/Dropdown/PreviewDropdown";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Rounder from "UI/Styles/Rounder";
import Text from "UI/Styles/Text";
import DescriptiveImage from "./DescriptiveImage";
import Sprite from "UI/Utils/Sprite";
import { useDescriptionDisplay } from "Context/DescriptionContext";
import { Counter } from "Utils/NumberUtils";

interface MountEntryProps {
	PreviewEntry: PreviewEntry;
}

function MountEntry(props: MountEntryProps) {
	const [hovered, hoverApi] = useToggler(false);
	const [closeHovered, closeHoverApi] = useToggler(false);
	const count = Counter();

	const entry = props.PreviewEntry;
	const { DisplayDescription, RemoveDescription } = useDescriptionDisplay("MountCloseButton");
	const node = useSelector(selectNodeFromModule(entry.Module));
	const selectedEntry = useSelector(selectStorySelected);
	const { selectStory, setOverlay, unmountStory } = useProducer<RootProducer>();

	const theme = useTheme();
	const mouseOffset = useMouseOffset();

	const selected = selectedEntry === entry.Key;
	const isMain = entry.Key === Config.RootPreviewKey;

	const OnEntryClicked = useCallback(() => {
		selectStory(entry.Key);
	}, [entry]);

	const OnEntryClosed = useCallback(() => {
		unmountStory(entry.Key);
	}, [entry]);

	const OnEntryDropdown = useCallback(() => {
		const offset = mouseOffset.getValue();
		setOverlay("PreviewDropdown", <PreviewDropdown Position={offset} PreviewEntry={entry} />);
	}, [mouseOffset, entry]);

	useEffect(() => {
		if (closeHovered) {
			DisplayDescription("Unmount Story");
		} else {
			RemoveDescription();
		}
	}, [closeHovered]);

	return (
		<Detector
			Key={"Entry"}
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundColor3={selected ? theme.StoryPreview.Selected : theme.StoryPreview.Color}
			BackgroundTransparency={0}
			LayoutOrder={entry.Order}
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
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={Color3.fromRGB(180, 180, 180)}
				Transparency={hovered ? 0.5 : 1}
			/>
			<frame
				Key={"HiddenCover"}
				ZIndex={5}
				Size={UDim2.fromScale(1, 1)}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BackgroundTransparency={0.8}
				Visible={!entry.Visible}
				Active={false}
			>
				<Corner Radius={6} />
			</frame>
			<Div Key={"Holder"}>
				<Padding PaddingX={8} />
				<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 5)} />
				<Text
					Key={"TextLabel"}
					Text={(isMain ? "• " : "") + (node ? node.Name : "---")}
					TextSize={14}
					LayoutOrder={count()}
					TextColor3={selected ? theme.StoryPreview.TextSelected : theme.Text.Color}
					TextXAlignment={Enum.TextXAlignment.Left}
					AutomaticSize={Enum.AutomaticSize.X}
					Size={UDim2.fromScale(0, 1)}
				>
					<Padding Right={3} />
				</Text>
				{entry.OnWidget && (
					<Div key={"OnWidget"} Size={UDim2.fromOffset(12, 12)} LayoutOrder={count()}>
						<DescriptiveImage
							ImageName="WidgetIcon"
							Description={"In Widget"}
							Image={"rbxassetid://16442161953"}
							ImageColor3={selected ? theme.StoryPreview.TextSelected : theme.Text.Color}
							ScaleType={Enum.ScaleType.Fit}
							BackgroundTransparency={1}
							ImageTransparency={0.4}
							Position={UDim2.fromScale(0.5, 0.5)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={UDim2.fromOffset(15, 15)}
						/>
					</Div>
				)}
				{!entry.Visible && (
					<Div key={"Hidden"} Size={UDim2.fromOffset(14, 14)} LayoutOrder={count()}>
						<DescriptiveImage
							ImageName="HiddenIcon"
							Description={"Hidden"}
							Image={"rbxassetid://16158493311"}
							ImageColor3={selected ? theme.StoryPreview.TextSelected : theme.Text.Color}
							ScaleType={Enum.ScaleType.Fit}
							BackgroundTransparency={1}
							ImageTransparency={0.3}
							Position={UDim2.fromScale(0.5, 0.5)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={UDim2.fromOffset(14, 14)}
						/>
					</Div>
				)}

				<frame
					Key={"CloseFrame"}
					LayoutOrder={count()}
					Size={UDim2.fromOffset(17, 17)}
					BackgroundTransparency={closeHovered ? (selected ? 0.4 : 0.65) : 1}
					BackgroundColor3={theme.StoryPreview.CloseButton}
				>
					<Corner Radius={6} />
					<Sprite
						Key={"CloseIcon"}
						Sprite="Close"
						ImageProps={{
							ImageColor3: selected ? theme.StoryPreview.TextSelected : theme.Text.Color,
							ScaleType: Enum.ScaleType.Fit,
							Position: UDim2.fromScale(0.5, 0.5),
							AnchorPoint: new Vector2(0.5, 0.5),
							Size: UDim2.fromOffset(13, 13),
						}}
					/>
					<Detector
						Event={{
							MouseEnter: closeHoverApi.enable,
							MouseLeave: closeHoverApi.disable,
							MouseButton1Click: OnEntryClosed,
						}}
					/>
				</frame>
			</Div>
		</Detector>
	);
}

export default MountEntry;
