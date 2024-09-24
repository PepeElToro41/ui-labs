import Vide, { Derivable, source } from "@rbxts/vide";
import { Images } from "Constants/Images";
import { useTheme } from "Contexts/ThemeProvider";
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
	Story: Derived<StoryNode>;
	IsChild?: boolean;
	LayoutOrder?: Derivable<number>;
}

function Story(props: StoryProps) {
	const theme = useTheme();
	const hovered = source(false);
	const name = () => props.Story().Name;

	return (
		<Frame
			BackgroundColor3={theme("Background3")}
			BackgroundTransparency={() => (hovered() ? 0 : 1)}
			LayoutOrder={props.LayoutOrder}
			Size={new UDim2(1, 0, 0, 25)}
		>
			<Corner Radius={6} />
			<Div Name={"Display"}>
				<Padding Left={20} Right={5} />
				<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Gap={6} />
				<Image Image={Images.Story} ImageColor3={theme("Story")} LayoutOrder={-1} Size={UDim2.fromOffset(13, 13)} />
				<Text
					Size={new UDim2(1, -19, 1, 0)}
					TextXAlignment={Enum.TextXAlignment.Left}
					Text={name}
					AutomaticSize={Enum.AutomaticSize.X}
				/>
			</Div>
			<Detector Hovered={hovered} />
		</Frame>
	);
}

export default Story;
