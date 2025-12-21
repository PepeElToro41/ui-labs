import { useBindingListener } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useCallback, useEffect, useState } from "@rbxts/react";
import { useDescriptionDisplay } from "Context/DescriptionContext";
import { useToggler } from "Hooks/Utils/Toggler";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";

interface ImageButtonProps {
	ButtonName: string;
	Position?: UDim2;
	Size?: UDim2;
	Anchor?: Vector2;
	Order?: number;

	Icon: string;

	IconColor?: Color3;
	Description?: string;
	IconTransparency?: number;
	IconScale?: number;
	IconPosition?: UDim2;

	OnClick: () => void;
}

function ImageButton(props: ImageButtonProps) {
	const [hovered, hoverApi] = useToggler(false);
	const { DisplayDescription, RemoveDescription } = useDescriptionDisplay(props.ButtonName);

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
			Size={props.Size ?? UDim2.fromOffset(25, 25)}
			Position={props.Position ?? UDim2.fromScale(0, 0)}
			AnchorPoint={props.Anchor ?? new Vector2(0, 0)}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={hovered ? 0.8 : 1}
		>
			<Corner Radius={6} />
			<Detector
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
					MouseButton1Click: props.OnClick
				}}
			/>
			<imagelabel
				Image={props.Icon}
				ImageColor3={props.IconColor ?? new Color3(1, 1, 1)}
				ImageTransparency={props.IconTransparency ?? 0}
				Position={props.IconPosition ?? UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={UDim2.fromScale(props.IconScale ?? 0.6, props.IconScale ?? 0.6)}
				BackgroundTransparency={1}
			/>
		</frame>
	);
}

export default ImageButton;
