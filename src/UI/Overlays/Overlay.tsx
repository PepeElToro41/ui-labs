import { useEventListener } from "@rbxts/pretty-roact-hooks";
import Roact, { PropsWithChildren } from "@rbxts/roact";
import { useState, withHooks } from "@rbxts/roact-hooked";
import { Dictionary } from "@rbxts/sift";
import { useInputBegan } from "Hooks/Context/UserInput";
import { useConnection } from "Hooks/Utils/Connection";
import { useToggler } from "Hooks/Utils/Toggler";

interface OverlayProps extends JSX.IntrinsicElement<Frame> {
	OnClickClose: () => void;
}

function OverlayCreate(props: OverlayProps) {
	const [inside, insideApi] = useToggler(false);
	const inputBegan = useInputBegan();
	const OnClickClose = props.OnClickClose;

	useConnection(
		inputBegan,
		(input) => {
			if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;
			if (!inside) OnClickClose();
		},
		[inside, OnClickClose],
	);

	return (
		<frame
			Key={"Overlay"}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 1)}
			Position={UDim2.fromScale(0, 0)}
			{...Dictionary.removeKey(props, "OnClickClose")}
			Event={{
				MouseEnter: insideApi.enable,
				MouseLeave: insideApi.disable,
			}}
		></frame>
	);
}
const Overlay = withHooks(OverlayCreate);

export = Overlay;
