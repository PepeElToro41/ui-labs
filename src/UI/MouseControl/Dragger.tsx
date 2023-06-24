import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import Configs from "Plugin/Configs";

interface DraggerProps {}

function setProps(props: DraggerProps) {
	return props;
}

function DraggerCreate(setprops: DraggerProps) {
	const props = identity<Required<DraggerProps>>(setProps(setprops) as Required<DraggerProps>);
	return (
		<frame
			Key="Dragger"
			AutomaticSize={Enum.AutomaticSize.XY}
			BackgroundTransparency={1}
			Position={new UDim2(0, -10, 0, 15)}
			Size={new UDim2(0, 0, 0, 20)}
			Visible={false}
		>
			<frame
				AutomaticSize={Enum.AutomaticSize.X}
				BackgroundColor3={Color3.fromRGB(47, 47, 47)}
				BackgroundTransparency={0.3}
				BorderSizePixel={0}
				LayoutOrder={1}
				Size={new UDim2(0, 0, 1, 0)}
			>
				<uistroke Color={Color3.fromRGB(42, 169, 189)} Transparency={0.3} />
				<uicorner />
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					Padding={new UDim(0, 5)}
					SortOrder={Enum.SortOrder.LayoutOrder}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
				<uipadding
					PaddingBottom={new UDim(0, 2)}
					PaddingLeft={new UDim(0, 5)}
					PaddingRight={new UDim(0, 5)}
					PaddingTop={new UDim(0, 2)}
				/>
				<imagelabel
					BackgroundTransparency={1}
					Image={Configs.IconsSprite}
					ImageColor3={Color3.fromRGB(117, 223, 255)}
					ImageRectOffset={new Vector2(192, 0)}
					ImageRectSize={new Vector2(64, 64)}
					ImageTransparency={0.3}
					Size={new UDim2(0, 16, 0, 15)}
				/>
				<textlabel
					Key="ActionText"
					AnchorPoint={new Vector2(0, 0.5)}
					AutomaticSize={Enum.AutomaticSize.XY}
					BackgroundTransparency={1}
					Font={Enum.Font.Gotham}
					FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Light)}
					LayoutOrder={1}
					Position={new UDim2(0, 0, 0.5, 0)}
					TextColor3={Color3.fromRGB(222, 222, 222)}
					TextSize={12}
					TextTransparency={0.3}
				/>
			</frame>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				Padding={new UDim(0, 4)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<imagelabel
				BackgroundTransparency={1}
				Image="rbxassetid://13786115580"
				ImageColor3={Color3.fromRGB(255, 119, 121)}
				ImageRectOffset={new Vector2(256, 192)}
				ImageRectSize={new Vector2(64, 64)}
				ImageTransparency={0.3}
				LayoutOrder={2}
				Size={new UDim2(0, 18, 0, 18)}
			/>
		</frame>
	);
}
const Dragger = withHooks(DraggerCreate);

export = Dragger;
