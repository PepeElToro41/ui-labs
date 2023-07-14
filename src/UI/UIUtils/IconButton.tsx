import Roact from "@rbxts/roact";
import { useContext, useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { Players, RunService, UserInputService } from "@rbxts/services";
import Configs from "Plugin/Configs";
import { MouseContext } from "UI/Contexts/MouseContext";
import { DescriptorContext } from "UI/Contexts/Mouse/DescriptorContext";
import ThemeContext from "UI/Contexts/ThemeContext";
import { PluginContext } from "UI/Contexts/PluginContext";
import { Sprite } from "./Sprite";
import { Detector } from "./Styles/Detector";

interface IconButtonProps {
	Size: UDim2;
	Position?: UDim2;
	Icon: {
		Pos?: UDim2;
		Size?: UDim2;
		RectOffset: Vector2;
		RectSize?: Vector2;
	};
	IconColor?: {
		Default?: Color3;
		Hovered?: Color3;
		Active?: Color3;
	};
	ButtonName: string;
	Description?: string;
	Dependencies?: unknown[];
	SizeConstraint?: Enum.SizeConstraint;
	CornerRadius?: UDim;
	AnchorPoint?: Vector2;
	LayoutOrder?: number;
	Toggeable?: boolean;
	OnClick: (active?: boolean) => void;
}

function setProps(props: IconButtonProps, theme: Theme) {
	props.Icon = props.Icon ?? {};
	props.IconColor = props.IconColor ?? {};
	props.IconColor.Active = props.IconColor.Active ?? theme.ToolIconActive;
	props.Toggeable = props.Toggeable ?? false;
	return props;
}

function IconButtonCreate(setprops: IconButtonProps) {
	const theme = useContext(ThemeContext).Theme;
	const descriptorContext = useContext(DescriptorContext);
	const props = identity<Required<IconButtonProps>>(setProps(setprops, theme) as Required<IconButtonProps>);
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
	useEffect(() => {
		if (hovered && props.Description) {
			descriptorContext.setMouseDesc(props.ButtonName, props.Description);
		} else {
			descriptorContext.removeMouseDesc(props.ButtonName);
		}
	}, [hovered, props.Description, ...(props.Dependencies ?? [])]);
	return (
		<Detector
			Key={props.ButtonName}
			BackgroundTransparency={hovered ? 0.5 : 1}
			BackgroundColor3={theme.ButtonColor}
			LayoutOrder={props.LayoutOrder ?? 0}
			Position={props.Position ?? UDim2.fromOffset(0, 0)}
			Size={props.Size ?? UDim2.fromOffset(35, 35)}
			AnchorPoint={props.AnchorPoint ?? new Vector2(0, 0)}
			SizeConstraint={props.SizeConstraint ?? Enum.SizeConstraint.RelativeXY}
			Event={{
				MouseEnter: () => setHover(true),
				MouseLeave: () => setHover(false),
				MouseButton1Click: () => {
					if (props.Toggeable) {
						setActive(!active);
					}
					props.OnClick(!active);
				},
			}}
		>
			<uicorner CornerRadius={props.CornerRadius ?? new UDim(0, 6)} />
			<Sprite
				Key="Icon"
				AnchorPoint={new Vector2(0.5, 0.5)}
				ImageColor3={
					active
						? props.IconColor.Active ?? theme.ToolIconActive
						: hovered
						? props.IconColor.Hovered ?? theme.ButtonIconHover
						: props.IconColor.Default ?? theme.ButtonIcon
				}
				ImageRectSize={props.Icon.RectSize ?? new Vector2(64, 64)}
				ImageRectOffset={props.Icon.RectOffset}
				Position={props.Icon.Pos ?? UDim2.fromScale(0.5, 0.5)}
				ScaleType={Enum.ScaleType.Stretch}
				Size={props.Icon.Size ?? UDim2.fromScale(0.85, 0.85)}
			/>
		</Detector>
	);
}
const IconButton = withHooks(IconButtonCreate);

export = IconButton;
