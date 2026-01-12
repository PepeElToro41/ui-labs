import React, { PropsWithChildren, useCallback, useEffect, useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { useIsOverlayBlocked } from "Hooks/Reflex/Use/OverlayBlock";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import { selectFilter } from "Reflex/Explorer/Filter";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import TopList from "UI/Styles/List/TopList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import Divisor from "UI/Utils/Divisor";
import Sprite from "UI/Utils/Sprite";

interface ChildrenHolderProps extends PropsWithChildren {
	Name: string | Instance;
	Order: number;
	IsChild?: boolean;
	Sprite: SpriteName;
	SpriteColor: Color3;
	Children: React.Element[];
}

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
		<Div key={name} Size={UDim2.fromScale(1, 0)} AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={props.Order}>
			<TopList Padding={new UDim(0, 1)} />
			<frame
				key={"Title"}
				BackgroundColor3={theme.Normal.Color}
				LayoutOrder={0}
				BackgroundTransparency={hovered ? 0.6 : 1}
				Size={new UDim2(1, 0, 0, 25)}
			>
				<Corner Radius={6} />
				<Div key={"Display"}>
					<Padding PaddingX={2} />
					<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 2)} />
					<imagelabel
						Size={UDim2.fromOffset(16, 16)}
						ImageColor3={theme.Text.Color}
						BackgroundTransparency={1}
						Image={expanded ? "rbxassetid://80464345551642" : "rbxassetid://98515959792894"}
					/>
					<Sprite
						key="Icon"
						Sprite={props.Sprite}
						ImageProps={{
							ImageColor3: props.SpriteColor,
							Size: new UDim2(0, 16, 0, 16)
						}}
					/>
					<Text
						Size={new UDim2(1, -19, 1, 0)}
						TextXAlignment={Enum.TextXAlignment.Left}
						Text={name}
						AutomaticSize={Enum.AutomaticSize.X}
					>
						<Padding PaddingX={4} />
					</Text>
				</Div>
				<Divisor
					Visible={!!props.IsChild}
					Anchor={0}
					Position={new UDim2(0, -6, 0.5, 0)}
					Size={new UDim(0, 6)}
					Direction="X"
					Transparency={0.8}
				/>
				<Detector
					ZIndex={4}
					Event={{
						MouseEnter: hoverApi.enable,
						MouseLeave: hoverApi.disable,
						MouseButton1Click: OnExpand
					}}
				/>
			</frame>
			<Div
				key={"ChildrenHolder"}
				ClipsDescendants={true}
				LayoutOrder={2}
				Size={UDim2.fromScale(1, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
			>
				<Divisor Direction="Y" Position={new UDim2(0, 9, 0, 0)} Size={new UDim(1, -13)} Anchor={0} Transparency={0.8} />
				<Div key={"Children"} Size={UDim2.fromScale(1, 0)} LayoutOrder={2} AutomaticSize={Enum.AutomaticSize.Y}>
					<TopList Padding={new UDim(0, 1)} />
					<Padding Left={16} />
					{expanded ? props.Children : []}
				</Div>
			</Div>
		</Div>
	);
}

export default ChildrenHolder;
