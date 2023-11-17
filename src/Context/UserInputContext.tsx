import Roact, { PropsWithChildren } from "@rbxts/roact";
import { useBinding, useCallback, useMemo, withHooks } from "@rbxts/roact-hooked";
import Signal from "@rbxts/signal";
import { useSignal } from "Hooks/Utils/Signal";
import { Div } from "UI/Styles/Div";

type InputSignature = (input: InputObject) => void;

interface UserInputContext {
	MousePosition: Roact.Binding<Vector2>;
	InputChanged: Signal<InputSignature>;
	InputBegan: Signal<InputSignature>;
	InputEnded: Signal<InputSignature>;
}

export const UserInputContext = Roact.createContext({} as UserInputContext);

interface UserInputProps extends PropsWithChildren {}

function UserInputProviderCreate(props: UserInputProps) {
	const [mousePos, setMousePos] = useBinding(Vector2.zero);

	const inputChanged = useSignal<InputSignature>();
	const inputBegan = useSignal<InputSignature>();
	const inputEnded = useSignal<InputSignature>();

	const OnInputChanged = useCallback((_, input: InputObject) => {
		if (input.UserInputType === Enum.UserInputType.MouseMovement) {
			setMousePos(new Vector2(input.Position.X, input.Position.Y));
		}
		inputChanged.Fire(input);
	}, []);
	const OnInputBegan = useCallback((_, input: InputObject) => {
		inputBegan.Fire(input);
	}, []);
	const OnInputEnded = useCallback((_, input: InputObject) => {
		inputEnded.Fire(input);
	}, []);

	const ContextValue = useMemo(() => {
		return {
			MousePosition: mousePos,

			InputChanged: inputChanged,
			InputBegan: inputBegan,
			InputEnded: inputEnded,
		};
	}, []);

	return (
		<UserInputContext.Provider value={ContextValue}>
			<Div
				Key="InputListener"
				ZIndex={5}
				Event={{ InputChanged: OnInputChanged, InputBegan: OnInputBegan, InputEnded: OnInputEnded }}
			/>
			{props[Roact.Children]}
		</UserInputContext.Provider>
	);
}

export const UserInputProvider = withHooks(UserInputProviderCreate);
