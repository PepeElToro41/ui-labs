import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useEffect, useState } from "@rbxts/react";
import { UserInputService } from "@rbxts/services";
import { set } from "@rbxts/sift/out/Array";

interface TogglerProps {
	FrameProps?: React.InstanceAttributes<TextButton>;
	ZIndex?: number;
	OnToggle: (active: boolean) => void;
}

function Toggler(props: TogglerProps) {
	const [inputed, setInput] = useBinding<InputObject | undefined>(undefined);
	const [active, setActive] = useState(false);
	const [startPos, setStartPos] = useBinding<Vector2>(new Vector2(0, 0));

	useEffect(() => {
		props.OnToggle(active);
	}, [active]);

	useEventListener(UserInputService.InputBegan, (input) => {
		if (!active) return;
		const oldInput = inputed.getValue();
		if (oldInput) return;
		if (input.UserInputType === Enum.UserInputType.Touch) {
			setActive(false);
		}
	});
	useEventListener(UserInputService.InputEnded, (input) => {
		setInput(undefined);
	});

	return (
		<textbutton
			key={"Toggler"}
			BackgroundTransparency={1}
			TextTransparency={1}
			Text={""}
			Size={new UDim2(1, 0, 1, 0)}
			AutoButtonColor={false}
			Active={false}
			ZIndex={props.ZIndex ?? 1}
			{...(props.FrameProps ?? {})}
			Event={{
				InputBegan: (_, input) => {
					if (input.UserInputType === Enum.UserInputType.Touch && input.UserInputState === Enum.UserInputState.Begin) {
						if (active) {
							setInput(input);
							setActive(true);
							return;
						}
						setStartPos(new Vector2(input.Position.X, input.Position.Y));
						setInput(input);
					}
				},
				InputEnded: (_, input) => {
					if (input.UserInputType === Enum.UserInputType.Touch && input.UserInputState === Enum.UserInputState.End) {
						if (inputed.getValue() !== input) return;
						const moved = new Vector2(input.Position.X, input.Position.Y).sub(startPos.getValue());
						if (moved.Magnitude > 10) return;
						setActive(true);
						setInput(undefined);
					}
				},
			}}
		></textbutton>
	);
}

export default Toggler;
