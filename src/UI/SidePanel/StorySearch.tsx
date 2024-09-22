import { useSpring } from "@rbxts/pretty-vide-utils";
import Vide, { source } from "@rbxts/vide";
import { Images } from "Constants/Images";
import { useTheme } from "Contexts/ThemeProvider";
import Div from "UI/Styles/Div";
import Frame from "UI/Styles/Frame";
import Image from "UI/Styles/Image";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Rounder from "UI/Styles/Rounder";
import TextInput from "UI/Styles/TextInput";
import { Lerp } from "Utils/NumberUtils";

interface StorySearchProps {
	OnInputChanged: (value: string) => void;
}

function StorySearch(props: StorySearchProps) {
	const theme = useTheme();
	const focused = source(false);
	const focusAlpha = useSpring(() => (focused() ? 1 : 0), {});

	return (
		<Div Name={"StorySearch"} Size={new UDim2(1, 0, 0, 25)}>
			<Padding PaddingX={2} />
			<Frame Name={"SearchInput"} BackgroundColor3={theme("Background2")} ZIndex={2}>
				<Padding PaddingX={8} />
				<Rounder />
				<uistroke
					Thickness={1}
					Color={() => {
						return theme().Border.Lerp(theme().Emphasis, focusAlpha());
					}}
					Transparency={0.5}
				/>
				<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Gap={4} />
				<Image
					Image={Images.Search}
					Size={UDim2.fromOffset(14, 14)}
					ImageColor3={() => {
						return theme().TextDisabled.Lerp(theme().Text, focusAlpha());
					}}
				/>
				<TextInput
					LayoutOrder={2}
					TextSize={13}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextColor3={theme("Text")}
					ClipsDescendants={true}
					PlaceholderText={"Search Story..."}
					PlaceholderColor3={theme("TextDisabled")}
					GetFocused={focused}
					TextChanged={props.OnInputChanged}
				>
					<uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
				</TextInput>
			</Frame>
			<Image
				Name={"Aura"}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Image={"rbxassetid://12052609860"}
				ImageColor3={theme("Emphasis")}
				ImageTransparency={() => Lerp(1, 0.5, focusAlpha())}
				Position={UDim2.fromScale(0.5, 0.5)}
				ScaleType={Enum.ScaleType.Slice}
				Size={new UDim2(1, 12, 1, 12)}
				SliceCenter={new Rect(300, 300, 300, 300)}
			/>
		</Div>
	);
}

export default StorySearch;
