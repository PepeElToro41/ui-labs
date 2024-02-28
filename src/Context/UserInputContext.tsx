import { useBindingListener, useEventListener } from "@rbxts/pretty-react-hooks";
import Roact, { PropsWithChildren, useBinding, useCallback, useContext, useMemo } from "@rbxts/roact";
import { UserInputService } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { InputSignals } from "@rbxts/ui-labs/src/Typing";
import { useSignal } from "Hooks/Utils/Signal";
import { Div } from "UI/Styles/Div";

type InputSignature = (input: InputObject, gameProcessed: boolean) => void;

interface UserInputContext {
	MousePosition: Roact.Binding<Vector2>;
	InputChanged: Signal<InputSignature>;
	InputBegan: Signal<InputSignature>;
	InputEnded: Signal<InputSignature>;
}

export const UserInputContext = Roact.createContext({} as UserInputContext);

interface UserInputProps extends PropsWithChildren {}

export function UserInputProvider(props: UserInputProps) {
	const [mousePos, setMousePos] = useBinding(Vector2.zero);

	const inputChanged = useSignal<InputSignature>();
	const inputBegan = useSignal<InputSignature>();
	const inputEnded = useSignal<InputSignature>();

	const OnInputChanged = useCallback((_, input: InputObject) => {
		if (input.UserInputType === Enum.UserInputType.MouseMovement) {
			setMousePos(new Vector2(input.Position.X, input.Position.Y));
		}
		inputChanged.Fire(input, false);
	}, []);
	const OnInputBegan = useCallback((_, input: InputObject) => {
		inputBegan.Fire(input, false);
	}, []);
	const OnInputEnded = useCallback((_, input: InputObject) => {
		inputEnded.Fire(input, false);
	}, []);

	const contextValue = useMemo<UserInputContext>(() => {
		return {
			MousePosition: mousePos,

			InputChanged: inputChanged,
			InputBegan: inputBegan,
			InputEnded: inputEnded,
		};
	}, []);

	return (
		<UserInputContext.Provider value={contextValue}>
			<Div
				Key="InputListener"
				ZIndex={5}
				Event={{ InputChanged: OnInputChanged, InputBegan: OnInputBegan, InputEnded: OnInputEnded }}
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
	const onMouseMoved = useSignal<(vector: Vector2) => void>();

	useBindingListener(inputs.MousePosition, (position) => {
		onMouseMoved.Fire(position);
	});
	print("USING SIGNALS");

	useEventListener(inputs.InputBegan, (input, processed) => onInputBegan.Fire(input, processed));
	useEventListener(inputs.InputEnded, (input, processed) => onInputEnded.Fire(input, processed));
	useEventListener(inputs.InputChanged, (input, processed) => onInputChanged.Fire(input, processed));

	useEventListener(UserInputService.InputBegan, (input, processed) => onInputBegan.Fire(input, processed));
	useEventListener(UserInputService.InputEnded, (input, processed) => onInputEnded.Fire(input, processed));
	useEventListener(UserInputService.InputChanged, (input, processed) => onInputChanged.Fire(input, processed));

	const signals = useMemo(() => {
		const value: InputSignals = {
			InputBegan: onInputBegan,
			InputEnded: onInputEnded,
			InputChanged: onInputChanged,
			MouseMoved: onMouseMoved,
		};
		return value;
	}, []);

	return signals;
}
