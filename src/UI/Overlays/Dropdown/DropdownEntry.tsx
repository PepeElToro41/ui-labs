import React, { useCallback, useEffect } from "@rbxts/react";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";

interface DropdownEntryProps {
	LayoutOrder?: number;
	Text: string;
	Disabled?: boolean;
	Active?: boolean;
	OnClick: () => void;
}

function setProps(props: DropdownEntryProps) {
	return props as Required<DropdownEntryProps>;
}

function DropdownEntry(setprops: DropdownEntryProps) {
	const props = setProps(setprops);
	const [hovered, hoverApi] = useToggler(false);
	const theme = useTheme();

	useEffect(() => {
		if (props.Disabled) {
			hoverApi.set(false);
		}
	}, [props.Disabled]);
	const OnEnter = useCallback(() => {
		if (props.Disabled) return;
		hoverApi.enable();
	}, [props.Disabled]);

	const OnClick = useCallback(() => {
		if (props.Disabled) return;
		props.OnClick();
	}, [props.OnClick, props.Disabled]);

	return (
		<frame
			key={"Frame"}
			BackgroundColor3={theme.StorySelected.Color}
			BackgroundTransparency={hovered ? 0 : 1}
			BorderSizePixel={0}
			LayoutOrder={props.LayoutOrder ?? 0}
			Size={new UDim2(1, 0, 0, 25)}
		>
			<Corner Radius={4} />
			{props.Active !== undefined && (
				<imagelabel
					Image={"rbxassetid://14441008250"}
					Size={UDim2.fromOffset(13, 13)}
					BackgroundTransparency={1}
					Position={new UDim2(1, -8, 0.5, 0)}
					AnchorPoint={new Vector2(1, 0.5)}
					ImageTransparency={props.Active ? 0 : 0.8}
				></imagelabel>
			)}
			<Text
				key={"Text"}
				Text={props.Text}
				TextColor3={props.Disabled ? theme.Text.Disabled : hovered ? theme.Text.Inverted : theme.Text.Color}
				TextSize={14}
				TextXAlignment={Enum.TextXAlignment.Left}
				Size={UDim2.fromScale(1, 1)}
			>
				<Padding Left={10} />
			</Text>
			<Detector
				ZIndex={3}
				Event={{
					MouseEnter: OnEnter,
					MouseLeave: hoverApi.disable,
					MouseButton1Click: OnClick,
				}}
			/>
		</frame>
	);
}

export default DropdownEntry;
