import { useContext } from "@rbxts/roact-hooked";
import { UserInputContext } from "Context/UserInputContext";

export function useMousePos() {
	const userInput = useContext(UserInputContext);

	return userInput.MousePosition;
}

export function useInputChanged() {
	const userInput = useContext(UserInputContext);

	return userInput.InputChanged;
}
export function useInputBegan() {
	const userInput = useContext(UserInputContext);

	return userInput.InputBegan;
}
export function useInputEnded() {
	const userInput = useContext(UserInputContext);

	return userInput.InputEnded;
}
