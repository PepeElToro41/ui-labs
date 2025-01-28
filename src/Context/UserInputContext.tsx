import { Signal } from "@rbxts/lemon-signal";
import { useBindingListener, useEventListener } from "@rbxts/pretty-react-hooks";
import React, { PropsWithChildren, useBinding, useCallback, useContext, useMemo } from "@rbxts/react";
import { UserInputService } from "@rbxts/services";
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
	const [mousePos, setMousePos] = useBinding(Vector2.zero);
	const [hovered, hoverApi] = useToggler(false);

	const inputChanged = useSignal<InputSignature>();
	const inputBegan = useSignal<InputSignature>();
	const inputEnded = useSignal<InputSignature>();

	const OnInputChanged = useCallback(
		(_, input: InputObject) => {
			if (input.UserInputType === Enum.UserInputType.MouseMovement) {
				setMousePos(new Vector2(input.Position.X, input.Position.Y));
			}
			inputChanged.Fire(input, false);
		},
		[hovered],
	);
	const OnInputBegan = useCallback(
		(_, input: InputObject) => {
			if (!hovered) return;
			inputBegan.Fire(input, false);
		},
		[hovered],
	);
	const OnInputEnded = useCallback(
		(_, input: InputObject) => {
			inputEnded.Fire(input, false);
		},
		[hovered],
	);

	const contextValue = useMemo(() => {
		const context: UserInputContext = {
			MousePosition: mousePos,

			InputChanged: inputChanged,
			InputBegan: inputBegan,
			InputEnded: inputEnded,
		};
		return context;
	}, []);

	return (
		<UserInputContext.Provider value={contextValue}>
			<Div
				key="InputListener"
				ZIndex={5}
				Event={{
					InputChanged: OnInputChanged,
					InputBegan: OnInputBegan,
					InputEnded: OnInputEnded,
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
				}}
			/>
			{props["children"]}
		</UserInputContext.Provider>
	);
}

export function useInputSignals() {
	const inputs = useContext(UserInputContext);

	const onInputBegan = useSignal<InputSignature>();
	const onInputEnded = useSignal<InputSignature>();
	const onInputChanged = useSignal<InputSignature>();
	const onMouseMoved = useSignal<[vector: Vector2]>();

	useBindingListener(inputs.MousePosition, (position) => {
		onMouseMoved.Fire(position);
	});

	useEventListener(inputs.InputBegan, (input, processed) => onInputBegan.Fire(input, processed));
	useEventListener(inputs.InputEnded, (input, processed) => onInputEnded.Fire(input, processed));
	useEventListener(inputs.InputChanged, (input, processed) => onInputChanged.Fire(input, processed));

	useEventListener(UserInputService.InputBegan, (input, processed) => onInputBegan.Fire(input, processed));
	useEventListener(UserInputService.InputEnded, (input, processed) => onInputEnded.Fire(input, processed));
	useEventListener(UserInputService.InputChanged, (input, processed) => onInputChanged.Fire(input, processed));

	const signals = useMemo(() => {
		const value = {
			InputBegan: onInputBegan,
			InputEnded: onInputEnded,
			InputChanged: onInputChanged,
			MouseMoved: onMouseMoved,
		} as InputSignals;
		return value;
	}, []);

	return signals;
}
