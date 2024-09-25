import Vide, { source } from "@rbxts/vide";
import { Images } from "Constants/Images";
import { useTheme } from "Contexts/ThemeProvider";
import Divisor from "UI/Elements/Divisor";
import Corner from "UI/Styles/Corner";
import Detector from "UI/Styles/Detector";
import Div from "UI/Styles/Div";
import Frame from "UI/Styles/Frame";
import Image from "UI/Styles/Image";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import { Derived } from "Utils/Vide";

interface StoryProps {
	Node: Derived<StoryNode>;
	IsChild?: boolean;
	Index?: Derived<number>;
}

function Story(props: StoryProps) {
	const theme = useTheme();
	const hovered = source(false);
	const name = () => props.Node().Name;

	return (
		<Div Name={name} LayoutOrder={props.Index} Size={new UDim2(1, 0, 0, 25)}>
			<Div Name={"Display"}>
				<Padding Left={14} Right={5} />
				<Frame BackgroundColor3={theme("Background3")} BackgroundTransparency={() => (hovered() ? 0 : 1)}>
					<Padding PaddingX={6} />
					<Corner Radius={6} />
					<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Gap={6} />
					<Image Image={Images.Story} ImageColor3={theme("Story")} LayoutOrder={-1} Size={UDim2.fromOffset(13, 13)} />
					<Text
						Size={new UDim2(1, -19, 1, 0)}
						TextXAlignment={Enum.TextXAlignment.Left}
						Text={name}
						AutomaticSize={Enum.AutomaticSize.X}
					/>
				</Frame>
			</Div>
			<Divisor
				Visible={!!props.IsChild}
				Anchor={0}
				Position={new UDim2(0, -6, 0.5, 0)}
				Size={new UDim(0, 8)}
				Direction="X"
				Transparency={0.8}
			/>
			<Image
				Image={Images.Dot}
				ImageColor3={theme("Text")}
				Size={UDim2.fromOffset(6, 6)}
				Position={new UDim2(0, 8, 0.5, 0)}
				ImageTransparency={0.8}
				AnchorPoint={new Vector2(0, 0.5)}
			/>
			<Detector Hovered={hovered} />
		</Div>
	);
}

export default Story;
