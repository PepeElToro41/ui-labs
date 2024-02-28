import { useContext, useMemo } from "@rbxts/roact";
import { UserInputContext } from "Context/UserInputContext";
import { usePosition } from "Hooks/Utils/AppHolder";

export function useMousePos() {
	const userInput = useContext(UserInputContext);
	return userInput.MousePosition;
}
export function useRelativeMousePos() {
	const mousePos = useContext(UserInputContext).MousePosition;
	const getPosition = usePosition();

	const mappedRelative = useMemo(() => {
		return mousePos.map(getPosition);
	}, [mousePos, getPosition]);

	return mappedRelative;
}
export function useMouseOffset() {
	const mousePos = useContext(UserInputContext).MousePosition;
	const getPosition = usePosition();

	const mappedOffset = useMemo(() => {
		return mousePos.map((pos) => {
			const relative = getPosition(pos);
			return UDim2.fromOffset(relative.X, relative.Y);
		});
	}, [mousePos, getPosition]);

	return mappedOffset;
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
