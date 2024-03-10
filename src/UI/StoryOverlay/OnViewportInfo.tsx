import React from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import TopList from "UI/Styles/List/TopList";
import Text from "UI/Styles/Text";
import Sprite from "UI/Utils/Sprite";

interface OnViewportInfoProps {}

function setProps(props: OnViewportInfoProps) {
	return props;
}

function OnViewportInfo(setprops: OnViewportInfoProps) {
	const props = setProps(setprops);
	const theme = useTheme();

	return (
		<frame BackgroundColor3={new Color3(0, 0, 0)} BackgroundTransparency={0.5} Size={UDim2.fromScale(1, 1)}>
			<TopList VerticalAlignment={Enum.VerticalAlignment.Center} HorizontalAlignment={Enum.HorizontalAlignment.Center} />
			<Text Text={"On Viewport"} TextSize={20} Weight="Bold" Size={new UDim2(1, 0, 0, 35)} />
			<Sprite
				Sprite="ViewOnViewport"
				ImageProps={{
					ImageColor3: theme.Icon.Color,
					Size: UDim2.fromOffset(70, 70),
				}}
			/>
		</frame>
	);
}

export default OnViewportInfo;
