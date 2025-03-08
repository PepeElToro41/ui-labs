import React, { PropsWithChildren } from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import Divisor from "UI/Utils/Divisor";
import Sprite from "UI/Utils/Sprite";

interface ControlGroupRenderProps extends PropsWithChildren {
	GroupName: string;
	LayoutOrder?: number;
}

function ControlGroupRender(props: ControlGroupRenderProps) {
	const [hovered, hoverApi] = useToggler(false);
	const [expanded, expandedApi] = useToggler(false);
	const theme = useTheme();

	return (
		<Div
			Size={UDim2.fromScale(1, 0)}
			LayoutOrder={props.LayoutOrder}
			AutomaticSize={Enum.AutomaticSize.Y}
		>
			<frame
				key={"HoverOverlay"}
				BackgroundColor3={new Color3(0, 0, 0)}
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={0.9}
				Visible={hovered}
			/>
			<Div key={"Holder"}>
				<TopList Padding={new UDim(0, 1)} />
				<Div key={"GroupTitle"} Size={new UDim2(1, 0, 0, 35)}>
					<Div key={"GroupContents"}>
						<Padding PaddingX={8} />
						<Div key={"TitleLabel"}>
							<LeftList
								Padding={new UDim(0, 5)}
								VerticalAlignment={Enum.VerticalAlignment.Center}
							/>
							<Sprite
								key="ExpandIcon"
								Sprite={expanded ? "Collapse" : "Expand"}
								ImageProps={{
									ImageColor3: theme.Icon.Color,
									Size: new UDim2(0, 16, 0, 16)
								}}
							/>
							<Text
								LayoutOrder={2}
								key={"ControlName"}
								Text={props.GroupName}
								TextXAlignment={Enum.TextXAlignment.Left}
								Size={new UDim2(0, 185, 1, 0)}
								Position={UDim2.fromOffset(20, 0)}
								TextSize={13}
								TextTruncate={Enum.TextTruncate.AtEnd}
							/>
						</Div>
					</Div>
					<Detector
						ZIndex={5}
						Event={{
							MouseEnter: hoverApi.enable,
							MouseLeave: hoverApi.disable,
							MouseButton1Click: expandedApi.toggle
						}}
					/>
				</Div>
				<Div
					key={"Controls"}
					Size={UDim2.fromScale(1, 0)}
					AutomaticSize={Enum.AutomaticSize.Y}
					Visible={expanded}
					LayoutOrder={2}
				>
					<Padding Left={25} Bottom={1} />
					<Div key={"ControlContents"}>
						<TopList Padding={new UDim(0, 3)} />
						{props["children"] ?? []}
					</Div>
					<Divisor
						Direction="Y"
						Position={UDim2.fromScale(0, 0.5)}
						Anchor={0.5}
					/>
				</Div>
			</Div>
		</Div>
	);
}

export default ControlGroupRender;
