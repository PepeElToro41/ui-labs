import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { useDescriptionDisplay } from "Context/DescriptionContext";
import { useInputBegan } from "Hooks/Context/UserInput";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import { selectShortcutsEnabled } from "Reflex/Interface";
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
	Shortcut?: Enum.KeyCode;

	Sprite: SpriteName;
	Transparency?: number;
	Description?: string;
	Active?: boolean;
	OnClick: () => void;
	OnRightClick?: () => void;
}

type KeycodeMaps = Partial<Record<Enum.KeyCode["Name"], string>>;
const KeycodeMaps: KeycodeMaps = {};

function SpriteButton(props: SpriteButtonProps) {
	const [hovered, hoverApi] = useToggler(false);
	const theme = useTheme();
	const { DisplayDescription, RemoveDescription } = useDescriptionDisplay(props.ButtonName);
	const shortcutsEnabled = useSelector(selectShortcutsEnabled);
	const shortcut = shortcutsEnabled ? props.Shortcut : undefined;
	const inputBegan = useInputBegan();

	const active = props.Active ?? false;

	useEffect(() => {
		if (hovered) {
			if (props.Description !== undefined) {
				if (shortcut) {
					const shortcutName = KeycodeMaps[shortcut.Name] ?? shortcut.Name;
					DisplayDescription(props.Description + ` (${shortcutName})`);
				} else {
					DisplayDescription(props.Description);
				}
			}
		} else {
			if (props.Description !== undefined) {
				RemoveDescription();
			}
		}
	}, [props.Description, shortcut, hovered, DisplayDescription, RemoveDescription]);

	useEffect(() => {
		if (!shortcut) return;

		const connection = inputBegan.Connect((input) => {
			if (input.KeyCode !== shortcut) return;
			props.OnClick();
		});

		return () => connection.Disconnect();
	}, [shortcut, props.OnClick]);

	return (
		<frame
			key={props.ButtonName}
			LayoutOrder={props.Order ?? 0}
			Position={props.Position ?? UDim2.fromOffset(0, 0)}
			Size={props.Size ?? UDim2.fromOffset(33, 33)}
			AnchorPoint={props.Anchor ?? new Vector2(0, 0)}
			BackgroundTransparency={hovered ? 0.8 : 1}
		>
			<Corner Radius={props.Radius ?? 6} />
			<Detector
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
					MouseButton1Click: props.OnClick,
					MouseButton2Click: props.OnRightClick,
				}}
			/>
			<Sprite
				Sprite={props.Sprite}
				ImageProps={{
					Position: UDim2.fromScale(0.5, 0.5),
					AnchorPoint: new Vector2(0.5, 0.5),
					Size: UDim2.fromOffset(27, 27),
					ImageTransparency: props.Transparency ?? 0,
					ImageColor3: active ? theme.Icon.Active : theme.Icon.Color,
				}}
			/>
		</frame>
	);
}

export default SpriteButton;
