import { Signal } from "@rbxts/lemon-signal";
import { useBindingListener, useEventListener } from "@rbxts/pretty-react-hooks";
import React, { PropsWithChildren, useBinding, useCallback, useEffect, useMemo, useState } from "@rbxts/react";
import { InputSignals } from "@rbxts/ui-labs";
import { useSignal } from "Hooks/Utils/Signal";
import { useToggler } from "Hooks/Utils/Toggler";
import { Div } from "UI/Styles/Div";

type InputSignature = [input: InputObject, gameProcessed: boolean];

interface UserInputContext {
	MousePosition: React.Binding<Vector2>;
	InputChanged: Signal<InputSignature>;
	InputBegan: Signal<InputSignature>;
	InputEnded: Signal<InputSignature>;
}

export const UserInputContext = React.createContext({} as UserInputContext);

interface UserInputProps extends PropsWithChildren {}

export function UserInputProvider(props: UserInputProps) {
	const [listener, setListener] = useState<Frame>();
	const contextValue = useGetInputSignalsFromFrame(listener);

	return (
		<UserInputContext.Provider value={contextValue}>
			<Div key="InputListener" ZIndex={5} ref={setListener} />
			{props["children"]}
		</UserInputContext.Provider>
	);
}

export function useGetInputSignalsFromFrame(frame?: Frame) {
	const [mousePos, setMousePos] = useBinding(Vector2.zero);
	const inputChanged = useSignal<InputSignature>();
	const inputBegan = useSignal<InputSignature>();
	const inputEnded = useSignal<InputSignature>();
	const [hovered, hoverApi] = useToggler(true);

	useEffect(() => {
		if (frame === undefined) return;

		const changed = frame.InputChanged.Connect((input) => {
			if (input.UserInputType === Enum.UserInputType.MouseMovement) {
				setMousePos(new Vector2(input.Position.X, input.Position.Y));
			}
			inputChanged.Fire(input, false);
		});
		const began = frame.InputBegan.Connect((input) => {
			if (!hovered) return;
			inputBegan.Fire(input, false);
		});
		const ended = frame.InputEnded.Connect((input) => inputEnded.Fire(input, false));

		const onHover = frame.MouseEnter.Connect(hoverApi.enable);
		const onUnhovered = frame.MouseLeave.Connect(hoverApi.disable);

		return () => {
			changed.Disconnect();
			began.Disconnect();
			ended.Disconnect();
			onHover.Disconnect();
			onUnhovered.Disconnect();
		};
	}, [frame]);

	const userInput = useMemo(() => {
		const value: UserInputContext = {
			MousePosition: mousePos,

			InputChanged: inputChanged,
			InputBegan: inputBegan,
			InputEnded: inputEnded
		};
		return value;
	}, []);

	return userInput;
}

export function useInputSignals(inputs: UserInputContext) {
	const onInputBegan = useSignal<InputSignature>();
	const onInputEnded = useSignal<InputSignature>();
	const onInputChanged = useSignal<InputSignature>();
	const onMouseMoved = useSignal<[vector: Vector2]>();

	useBindingListener(inputs.MousePosition, (position) => {
		onMouseMoved.Fire(position);
	});

	useEventListener(inputs.InputBegan, (input, processed) => {
		onInputBegan.Fire(input, processed);
	});
	useEventListener(inputs.InputEnded, (input, processed) => onInputEnded.Fire(input, processed));
	useEventListener(inputs.InputChanged, (input, processed) => onInputChanged.Fire(input, processed));

	const GetMouseLocation = useCallback(() => {
		return inputs.MousePosition.getValue();
	}, []);

	const signals = useMemo(() => {
		const value = {
			InputBegan: onInputBegan,
			InputEnded: onInputEnded,
			InputChanged: onInputChanged,
			MouseMoved: onMouseMoved,
			GetMouseLocation() {
				return GetMouseLocation();
			}
		} as InputSignals;
		return value;
	}, []);

	return signals;
}
