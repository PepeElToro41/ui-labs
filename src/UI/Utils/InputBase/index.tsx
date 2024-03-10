import React, { PropsWithChildren, useBinding, useCallback, useMemo, useState } from "@rbxts/react";
import Corner from "UI/Styles/Corner";
import Sprite from "../Sprite";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import StrokeEffect from "./StrokeEffect";
import Padding from "UI/Styles/Padding";

interface InputProps extends PropsWithChildren {
	TextboxProps?: React.InstanceAttributes<TextBox>;
	HolderProps?: React.InstanceAttributes<Frame>;
	Text?: string;
	CornerRadius?: number;

	Sprite?: SpriteName;

	Reference?: React.Ref<TextBox>;

	OnTextChanged?: (textbox: TextBox) => void;
	OnFocused?: (textbox: TextBox) => void;
	OnFocusLost?: (textbox: TextBox, enter: boolean) => void;
}

function Input(props: InputProps) {
	const theme = useTheme();
	const [frameSize, setFrameSize] = useBinding(new Vector2(0, 0));
	const [focused, setFocused] = useState(false);
	const hasSprite = props.Sprite !== undefined;

	const OnTextChanged = useMemo(() => {
		return props.OnTextChanged ?? (() => {});
	}, [props.OnTextChanged]);

	const OnFocused = useCallback(
		(textbox: TextBox) => {
			setFocused(true);
			if (props.OnFocused) props.OnFocused(textbox);
		},
		[props.OnFocused],
	);
	const OnFocusLost = useCallback(
		(textbox: TextBox, enter: boolean) => {
			setFocused(false);
			if (props.OnFocusLost) props.OnFocusLost(textbox, enter);
		},
		[props.OnFocusLost],
	);
	const OnSizeChanged = useCallback((frame: Frame) => {
		setFrameSize(frame.AbsoluteSize);
	}, []);

	return (
		<frame
			key="SearchFrame"
			LayoutOrder={1}
			AnchorPoint={new Vector2(0, 0)}
			Position={UDim2.fromScale(0, 0)}
			Size={UDim2.fromScale(1, 1)}
			{...props.HolderProps}
			BackgroundColor3={theme.Search.Color}
			Change={{
				AbsoluteSize: OnSizeChanged,
			}}
		>
			<StrokeEffect Active={focused} FrameSize={frameSize} CornerRadius={props.CornerRadius} />
			<Corner Radius={props.CornerRadius ?? 8} />
			{hasSprite && (
				<Sprite
					key="SpriteIcon"
					Sprite={props.Sprite!}
					ImageProps={{
						ImageColor3: theme.Icon.Disabled,
						AnchorPoint: new Vector2(0, 0.5),
						Position: new UDim2(0, 6, 0.5, 0),
						Size: new UDim2(0, 19, 0, 19),
					}}
				/>
			)}
			<textbox
				key="Input"
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Medium)}
				PlaceholderColor3={theme.Search.Placeholder}
				PlaceholderText={""}
				Position={UDim2.fromScale(0, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Text={props.Text ?? ""}
				TextColor3={theme.Text.Color}
				TextSize={13}
				ClearTextOnFocus={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				{...props.TextboxProps}
				Event={{
					Focused: OnFocused,
					FocusLost: OnFocusLost,
				}}
				Change={{
					Text: OnTextChanged,
				}}
				ref={props.Reference}
			>
				<Padding PaddingX={hasSprite ? 28 : 10} />
				{props["children"] ?? []}
			</textbox>
		</frame>
	);
}

export default Input;
