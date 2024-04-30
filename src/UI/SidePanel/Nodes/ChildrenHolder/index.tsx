import React, { PropsWithChildren, useCallback, useEffect, useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { selectFilter } from "Reflex/Explorer/Filter";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import List from "UI/Styles/List";
import Corner from "UI/Styles/Corner";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import Sprite from "UI/Utils/Sprite";
import TopList from "UI/Styles/List/TopList";
import { selectOverlay } from "Reflex/Overlay";
import { useIsOverlayBlocked } from "Hooks/Reflex/Use/OverlayBlock";
import { useToggler } from "Hooks/Utils/Toggler";

interface ChildrenHolderProps extends PropsWithChildren {
	Name: string | Instance;
	Order: number;
	Sprite: SpriteName;
	SpriteColor: Color3;
	Children: React.Element[];
}

const EXPAND_INFO = new TweenInfo(0.1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);

function setProps(props: ChildrenHolderProps) {
	return props as Required<ChildrenHolderProps>;
}

function GetName(name: string | Instance) {
	if (typeIs(name, "string")) return name;
	else return name.Name;
}

function ChildrenHolder(setprops: ChildrenHolderProps) {
	const props = setProps(setprops);
	const theme = useTheme();

	const [hovered, hoverApi] = useToggler(false);
	const [expanded, expand] = useState(false);
	const [name, setName] = useState<string>(GetName(props.Name));
	const isBlocked = useIsOverlayBlocked();

	const filter = useSelector(selectFilter).search;
	const OnExpand = useCallback(() => {
		expand((isExpanded) => !isExpanded);
	}, []);

	useEffect(() => {
		if (typeIs(props.Name, "string")) {
			setName(props.Name);
			return;
		}
		setName(props.Name.Name);
		const connection = props.Name.GetPropertyChangedSignal("Name").Connect(() => {
			setName((props.Name as Instance).Name);
		});
		return () => connection.Disconnect();
	}, [props.Name]);
	useEffect(() => {
		if (hovered && isBlocked) {
			hoverApi.disable();
		}
	}, [hovered, isBlocked]);

	useEffect(() => {
		if (filter !== undefined) expand(true);
	}, [filter]);

	return (
		<Div key={name} AutomaticSize={Enum.AutomaticSize.Y} Size={new UDim2(1, 0, 0, 25)} LayoutOrder={props.Order}>
			<List />
			<frame
				key="EntryLabel"
				BackgroundColor3={theme.Normal.Color}
				LayoutOrder={0}
				BackgroundTransparency={hovered ? 0.6 : 1}
				Size={new UDim2(1, 0, 0, 25)}
			>
				{props["children"] ?? []}
				<Corner Radius={6} />
				<Detector
					ZIndex={4}
					Event={{
						MouseEnter: hoverApi.enable,
						MouseLeave: hoverApi.disable,
						MouseButton1Click: OnExpand,
					}}
				/>
				<Div key={"Title"}>
					<LeftList Padding={new UDim(0, 5)} />
					<Padding Padding={4} Bottom={5} />
					<Sprite
						key="Icon"
						Sprite={props.Sprite}
						ImageProps={{
							LayoutOrder: 1,
							ImageColor3: props.SpriteColor,
							Size: new UDim2(0, 16, 0, 16),
						}}
					/>
					<Text
						key="TitleLabel"
						Text={name}
						LayoutOrder={2}
						Size={new UDim2(1, -46, 1, 0)}
						TextTruncate={Enum.TextTruncate.AtEnd}
						TextColor3={theme.Text.Color}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
					<Sprite
						key="ExpandIcon"
						Sprite={expanded ? "Collapse" : "Expand"}
						ImageProps={{
							LayoutOrder: 3,
							ImageColor3: theme.Icon.Color,
							Size: new UDim2(0, 16, 0, 16),
						}}
					/>
				</Div>
			</frame>
			<Div
				key="ChildrenFrame"
				ClipsDescendants={true}
				LayoutOrder={1}
				AutomaticSize={Enum.AutomaticSize.Y}
				Size={UDim2.fromScale(1, 0)}
			>
				<frame
					key="ChildrenDivisor"
					BackgroundColor3={theme.Divisor.Color}
					BackgroundTransparency={0.5}
					BorderSizePixel={0}
					Position={new UDim2(0, 8, 0, 0)}
					Size={new UDim2(0, 1, 1, -9)}
				/>
				<Div key="Children" AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={2} Size={new UDim2(1, 0, 0, 0)}>
					<TopList Padding={new UDim(0, 1)} />
					<uipadding PaddingLeft={new UDim(0, 13)} />
					{expanded ? props.Children : []}
				</Div>
			</Div>
		</Div>
	);
}

export default ChildrenHolder;
