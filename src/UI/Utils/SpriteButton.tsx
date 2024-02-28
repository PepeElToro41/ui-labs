import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useCallback, useEffect, useState } from "@rbxts/roact";
import { useDescriptionDisplay } from "Context/DescriptionContext";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import Sprite from "UI/Utils/Sprite";

interface SpriteButtonProps {
	ButtonName: string;
	Size?: UDim2;
	Anchor?: Vector2;
	Position?: UDim2;
	Order?: number;
	Radius?: number;

	Sprite: SpriteName;
	Transparency?: number;
	Description?: string;
	Active?: boolean;
	OnClick?: () => void;
}

function SpriteButton(props: SpriteButtonProps) {
	const [hovered, hoverApi] = useToggler(false);
	const theme = useTheme();
	const { DisplayDescription, RemoveDescription } = useDescriptionDisplay(props.ButtonName);

	const active = props.Active ?? false;

	useEffect(() => {
		if (hovered) {
			if (props.Description !== undefined) {
				DisplayDescription(props.Description);
			}
		} else {
			if (props.Description !== undefined) {
				RemoveDescription();
			}
		}
	}, [props.Description, hovered, DisplayDescription, RemoveDescription]);

	return (
		<frame
			key={props.ButtonName}
			LayoutOrder={props.Order ?? 0}
			Position={props.Position ?? UDim2.fromOffset(0, 0)}
			Size={props.Size ?? UDim2.fromOffset(35, 35)}
			AnchorPoint={props.Anchor ?? new Vector2(0, 0)}
			BackgroundTransparency={hovered ? 0.8 : 1}
		>
			<Corner Radius={props.Radius ?? 6} />
			<Detector
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
					MouseButton1Click: props.OnClick,
				}}
			/>
			<Sprite
				Sprite={props.Sprite}
				ImageProps={{
					Position: UDim2.fromScale(0.5, 0.5),
					AnchorPoint: new Vector2(0.5, 0.5),
					Size: UDim2.fromOffset(29, 29),
					ImageTransparency: props.Transparency ?? 0,
					ImageColor3: active ? theme.Icon.Active : theme.Icon.Disabled,
				}}
			/>
		</frame>
	);
}

export default SpriteButton;
