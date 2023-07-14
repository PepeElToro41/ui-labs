import Roact from "@rbxts/roact";
import { useCallback, useContext, useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { DescriptorContext } from "UI/Contexts/Mouse/DescriptorContext";
import { Detector } from "UI/UIUtils/Styles/Detector";
import { Text } from "UI/UIUtils/Styles/Text";

interface StoryNameProps {
	StoryName?: string;
	StoryPath: string | undefined;
	OpenStoryModule: () => void;
	Theme: Theme;
}
function setProps(props: StoryNameProps) {
	return props;
}

function StoryNameCreate(setprops: StoryNameProps) {
	const props = identity<Required<StoryNameProps>>(setProps(setprops) as Required<StoryNameProps>);
	const [hover, setHover] = useState(false);
	const descriptorContext = useContext(DescriptorContext);
	useEffect(() => {
		if (hover && props.StoryPath) {
			descriptorContext.setMouseDesc("StoryPath", "Open Story Module . . . ");
		} else {
			descriptorContext.removeMouseDesc("StoryPath");
		}
	}, [hover, props.StoryPath]);

	return (
		<frame Key="StoryName" BackgroundColor3={props.Theme.StoryName} BorderSizePixel={0} Size={new UDim2(1, 0, 0, 35)}>
			<frame
				Key="Divisor"
				AnchorPoint={new Vector2(0, 1)}
				BackgroundColor3={props.Theme.Divisor}
				BackgroundTransparency={0.5}
				BorderSizePixel={0}
				Position={new UDim2(0, 0, 1, 0)}
				Size={new UDim2(1, 0, 0, 1)}
				ZIndex={2}
			/>
			<frame
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={new UDim2(1, -30, 1, 0)}
				BackgroundTransparency={1}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					SortOrder={Enum.SortOrder.LayoutOrder}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, 15)}
				/>
				<Text
					Key="StoryName"
					FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Bold)}
					Size={new UDim2(0, 0, 0, 20)}
					AutomaticSize={Enum.AutomaticSize.X}
					Text={props.StoryName ?? "---"}
					TextColor3={props.Theme.TextColor}
					TextSize={20}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
				<frame
					Key="Divisor"
					Size={new UDim2(0, 1, 0.5, 0)}
					BackgroundTransparency={0.7}
					LayoutOrder={1}
					BorderSizePixel={0}
					Visible={props.StoryPath !== undefined}
				/>
				<Detector
					Key="StoryPath"
					AutomaticSize={Enum.AutomaticSize.X}
					BackgroundTransparency={hover ? 0.8 : 1}
					BackgroundColor3={props.Theme.ButtonColor}
					BorderSizePixel={0}
					LayoutOrder={2}
					Size={new UDim2(0, 0, 0, 21)}
					Visible={props.StoryPath !== undefined}
					Event={{
						MouseEnter: () => setHover(true),
						MouseLeave: () => setHover(false),
						MouseButton1Click: props.OpenStoryModule,
					}}
				>
					<Text
						Key="PathLabel"
						AnchorPoint={new Vector2(0, 0.5)}
						Size={new UDim2(0, 0, 0, 12)}
						AutomaticSize={Enum.AutomaticSize.X}
						Position={new UDim2(0, 0, 0.5, 0)}
						Text={props.StoryPath ?? "---"}
						TextTransparency={0.3}
						TextColor3={props.Theme.StoryPathText}
						TextSize={12}
						TextXAlignment={Enum.TextXAlignment.Left}
					>
						<uipadding PaddingLeft={new UDim(0, 4)} PaddingRight={new UDim(0, 4)} />
					</Text>
					<frame
						Key="Underlying"
						AnchorPoint={new Vector2(0.5, 1)}
						BackgroundColor3={props.Theme.StoryPathText}
						BackgroundTransparency={0.5}
						BorderSizePixel={0}
						Visible={hover}
						Position={UDim2.fromScale(0.5, 0.9)}
						Size={new UDim2(1, 0, 0, 1)}
					/>
				</Detector>
			</frame>
		</frame>
	);
}
const StoryName = withHooks(StoryNameCreate);

export = StoryName;
