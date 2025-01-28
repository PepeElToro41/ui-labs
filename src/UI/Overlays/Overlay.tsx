import React from "@rbxts/react";
import { Dictionary } from "@rbxts/sift";
import { useInputBegan } from "Hooks/Context/UserInput";
import { useConnection } from "Hooks/Utils/Connection";
import { useToggler } from "Hooks/Utils/Toggler";
import { Div } from "UI/Styles/Div";

interface OverlayProps extends React.InstanceProps<Frame> {
	OnClickClose: () => void;
}

function Overlay(props: OverlayProps) {
	const [inside, insideApi] = useToggler(false);
	const inputBegan = useInputBegan();
	const OnClickClose = props.OnClickClose;

	useConnection(
		inputBegan,
		(input) => {
			const isMouse1 = input.UserInputType === Enum.UserInputType.MouseButton1;
			const isMouse2 = input.UserInputType === Enum.UserInputType.MouseButton2;

			if (!isMouse1 && !isMouse2) return;
			if (!inside) OnClickClose();
		},
		[inside, OnClickClose],
	);

	return (
		<Div
			key={"Overlay"}
			Size={UDim2.fromScale(1, 1)}
			Position={UDim2.fromScale(0, 0)}
			{...Dictionary.removeKey(props, "OnClickClose")}
			Event={{
				MouseEnter: insideApi.enable,
				MouseLeave: insideApi.disable,
			}}
		>
			{props["children"]}
		</Div>
	);
}
export default Overlay;
