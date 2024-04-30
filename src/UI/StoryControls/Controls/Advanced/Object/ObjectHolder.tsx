import React, { useCallback, useEffect, useMemo, useState } from "@rbxts/react";
import { Selection, StudioService } from "@rbxts/services";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import DescriptiveImage from "UI/StoryPanel/StoryTitle/DescriptiveImage";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Rounder from "UI/Styles/Rounder";
import Text from "UI/Styles/Text";
import Divisor from "UI/Utils/Divisor";
import Sprite from "UI/Utils/Sprite";
import ClearObject from "./ClearObject";
import ObjectName from "./ObjectName";

interface ObjectHolderProps {
	Object?: Instance;
	OnClearObject?: () => void;
}

function ObjectHolder(props: ObjectHolderProps) {
	const theme = useTheme();
	const [hovered, hoverApi] = useToggler(false);
	const object = props.Object;
	const active = object !== undefined;

	const OnInstanceSelect = useCallback(() => {
		if (!props.Object) return;
		Selection.Set([props.Object]);
	}, [props.Object]);

	const classIcon = useMemo(() => {
		if (!props.Object) return;

		const iconInfo = StudioService.GetClassIcon(props.Object.ClassName) as ClassIconInfo;
		return iconInfo ?? {};
	}, [props.Object]);

	return (
		<frame
			Size={UDim2.fromScale(0, 1)}
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundColor3={theme.List[hovered && active ? "FrameHovered" : "Frame"]}
		>
			<Rounder />
			<Div key={"Info"} Size={UDim2.fromScale(0, 1)} AutomaticSize={Enum.AutomaticSize.X} ZIndex={2}>
				<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 6)} />
				<Padding PaddingX={8} />
				{object ? (
					<React.Fragment>
						<DescriptiveImage
							ImageName={"ImageClassName"}
							Description={`Class: ${object.ClassName}`}
							LayoutOrder={1}
							Size={UDim2.fromOffset(17, 17)}
							{...classIcon}
						/>
						<ObjectName
							Object={object}
							Size={UDim2.fromScale(0, 1)}
							TextSize={12}
							LayoutOrder={2}
							AutomaticSize={Enum.AutomaticSize.X}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextTruncate={Enum.TextTruncate.AtEnd}
						>
							<Padding Right={4} />
							<uisizeconstraint MinSize={new Vector2(60, 0)} MaxSize={new Vector2(230, math.huge)} />
						</ObjectName>
						{props.OnClearObject && (
							<React.Fragment>
								<Divisor Order={3} Size={new UDim(1, -10)} Direction="Y" />
								<ClearObject OnClick={props.OnClearObject} />
							</React.Fragment>
						)}
					</React.Fragment>
				) : (
					<React.Fragment>
						<Text
							Size={UDim2.fromScale(0, 1)}
							TextSize={12}
							LayoutOrder={2}
							Text={"Nothing Assigned"}
							AutomaticSize={Enum.AutomaticSize.X}
						>
							<Padding PaddingX={6} />
						</Text>
					</React.Fragment>
				)}
			</Div>
			<frame
				key={"Cover"}
				Size={UDim2.fromScale(1, 1)}
				BackgroundColor3={theme.ActionsPanel.Color}
				BackgroundTransparency={0.5}
				Visible={!active}
				ZIndex={3}
			>
				<Rounder />
			</frame>
			<Detector
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
					MouseButton1Click: OnInstanceSelect,
				}}
			/>
		</frame>
	);
}

export default ObjectHolder;
