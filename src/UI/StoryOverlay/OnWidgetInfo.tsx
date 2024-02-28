import Roact from "@rbxts/roact";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import TopList from "UI/Styles/List/TopList";
import Text from "UI/Styles/Text";

interface OnWidgetInfoProps {}

function OnWidgetInfo(props: OnWidgetInfoProps) {
	const theme = useTheme();

	return (
		<frame BackgroundColor3={new Color3(0, 0, 0)} BackgroundTransparency={0.5} Size={UDim2.fromScale(1, 1)}>
			<TopList VerticalAlignment={Enum.VerticalAlignment.Center} HorizontalAlignment={Enum.HorizontalAlignment.Center} />
			<Text Text={"On Widget"} TextSize={20} Weight="Bold" Size={new UDim2(1, 0, 0, 35)} />
			<imagelabel
				Image={"rbxassetid://16442031219"}
				Size={UDim2.fromOffset(70, 70)}
				BackgroundTransparency={1}
				ImageColor3={theme.Icon.Color}
			/>
		</frame>
	);
}

export default OnWidgetInfo;
