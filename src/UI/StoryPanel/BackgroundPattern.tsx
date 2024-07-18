import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";

interface BackgroundPatternProps {}

function BackgroundPattern(props: BackgroundPatternProps) {
	const theme = useTheme();

	return (
		<React.Fragment>
			<imagelabel
				key={"Background"}
				Image={"rbxassetid://13745469099"}
				ScaleType={"Tile"}
				TileSize={UDim2.fromOffset(90, 90)}
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				ImageColor3={theme.StoryPanel.PatternColor}
				ImageTransparency={theme.StoryPanel.PatternTransparency}
				ZIndex={-2}
			></imagelabel>
			<frame
				key={"Fader1"}
				BackgroundColor3={theme.StoryPanel.Color}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Size={new UDim2(0, 40, 1, 0)}
				ZIndex={-1}
			>
				<uigradient
					Transparency={
						new NumberSequence([
							new NumberSequenceKeypoint(0, 0),
							new NumberSequenceKeypoint(0.228, 0.444),
							new NumberSequenceKeypoint(1, 1),
						])
					}
				/>
			</frame>
			<frame
				key={"Fader2"}
				AnchorPoint={new Vector2(1, 0)}
				BackgroundColor3={theme.StoryPanel.Color}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(1, 0)}
				Size={new UDim2(0, 40, 1, 0)}
				ZIndex={-1}
			>
				<uigradient
					Transparency={
						new NumberSequence([
							new NumberSequenceKeypoint(0, 1),
							new NumberSequenceKeypoint(0.771, 0.444),
							new NumberSequenceKeypoint(1, 0),
						])
					}
				/>
			</frame>
		</React.Fragment>
	);
}

export default BackgroundPattern;
