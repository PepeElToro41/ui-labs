import Roact from "@rbxts/roact";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { useSelector } from "@rbxts/roact-reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { selectStoryDisplay } from "Reflex/StorySelect/StoryDisplay";
import Detector from "UI/Styles/Detector";
import Text from "UI/Styles/Text";
import { GetStringPath } from "./Utils";
import Padding from "UI/Styles/Padding";
import { useTween } from "Hooks/Utils/Tween";

interface StoryPathProps {}

const HOVER_INFO = new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);

function StoryPathCreate(props: StoryPathProps) {
	const { selected } = useSelector(selectStoryDisplay);
	const [hovered, setHover] = useState(false);
	const theme = useTheme();
	const [size, tweenSize] = useTween(HOVER_INFO, 0);
	useEffect(() => {
		tweenSize(hovered ? 1 : 0);
	}, [hovered]);

	return (
		<Detector
			Key="StoryPath"
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundTransparency={hovered ? 0.8 : 1}
			BackgroundColor3={theme.StoryTitle.Path.ButtonColor}
			BorderSizePixel={0}
			LayoutOrder={2}
			Size={new UDim2(0, 0, 0, 20)}
			Visible={selected !== undefined}
			Event={{
				MouseEnter: () => setHover(true),
				MouseLeave: () => setHover(false),
				MouseButton1Click: () => {},
			}}
		>
			<Text
				Key="PathLabel"
				AnchorPoint={new Vector2(0, 0.5)}
				Size={new UDim2(0, 0, 0, 12)}
				AutomaticSize={Enum.AutomaticSize.X}
				Position={new UDim2(0, 0, 0.5, 0)}
				Text={(selected && GetStringPath(selected.Module)) ?? "---"}
				TextTransparency={0.3}
				TextColor3={theme.StoryTitle.Path.PathText}
				TextSize={12}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<Padding PaddingX={6} />
			</Text>
			<frame
				Key="Underline"
				AnchorPoint={new Vector2(0, 1)}
				BackgroundColor3={theme.StoryTitle.Path.Underline}
				BackgroundTransparency={0.5}
				BorderSizePixel={0}
				Visible={true}
				Position={UDim2.fromScale(0, 1)}
				Size={size.map((value) => new UDim2(value, 0, 0, 1))}
			/>
		</Detector>
	);
}
const StoryPath = withHooks(StoryPathCreate);

export = StoryPath;
