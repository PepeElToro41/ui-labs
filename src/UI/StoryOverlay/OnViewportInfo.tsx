import React, { useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import Sprite from "UI/Utils/Sprite";

interface OnViewportInfoProps {
	PreviewEntry: PreviewEntry;
}

function OnViewportInfo(props: OnViewportInfoProps) {
	const theme = useTheme();
	const [hovered, hoverApi] = useToggler(false);
	const { updateMountData } = useProducer<RootProducer>();

	const OnBrickBack = useCallback(() => {
		updateMountData(props.PreviewEntry.Key, (oldEntry) => {
			return {
				...oldEntry,
				OnViewport: false
			};
		});
	}, [props.PreviewEntry]);

	return (
		<Detector
			BackgroundColor3={new Color3(0, 0, 0)}
			BackgroundTransparency={0.4}
			Size={UDim2.fromScale(1, 1)}
		>
			<TopList
				VerticalAlignment={Enum.VerticalAlignment.Center}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				Padding={new UDim(0, 10)}
			/>
			<Text
				Text={"On Viewport"}
				TextSize={20}
				Weight="Bold"
				Size={new UDim2(1, 0, 0, 25)}
			/>
			<Sprite
				Sprite="ViewOnViewport"
				ImageProps={{
					ImageColor3: theme.Icon.Color,
					Size: UDim2.fromOffset(70, 70)
				}}
			/>
			<frame
				key={"BringBackButton"}
				BackgroundColor3={
					hovered ? theme.StoryPreview.Selected : theme.StoryPreview.Color
				}
				Size={UDim2.fromOffset(0, 30)}
				AutomaticSize={Enum.AutomaticSize.X}
			>
				<Corner />
				<Padding PaddingX={10} />
				<Text
					key={"Label"}
					Text={"Bring back to Editor"}
					Size={UDim2.fromScale(0, 1)}
					AutomaticSize={Enum.AutomaticSize.X}
					TextSize={16}
					TextColor3={
						hovered ? theme.StoryPreview.TextSelected : theme.Text.Color
					}
				/>
				<Detector
					Event={{
						MouseEnter: hoverApi.enable,
						MouseLeave: hoverApi.disable,
						MouseButton1Click: OnBrickBack
					}}
				/>
			</frame>
		</Detector>
	);
}

export default OnViewportInfo;
