import { useEventListener, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { Binding, useBinding, useEffect } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { RunService } from "@rbxts/services";
import { useInputBegan, useInputEnded } from "Hooks/Context/UserInput";
import { CreateTuple } from "Utils/MiscUtils";

export function useStoryLockAction(actionName: string, inside: boolean) {
	const { lockStoryFrame, unlockStoryFrame } = useProducer<RootProducer>();
	const inputBegan = useInputBegan();
	const inputEnded = useInputEnded();

	useEventListener(inputBegan, (input) => {
		if (input.KeyCode !== Enum.KeyCode.LeftAlt) return;
		if (!inside) return;
		lockStoryFrame(actionName);
	});
	useEventListener(inputEnded, (input) => {
		if (input.KeyCode !== Enum.KeyCode.LeftAlt) return;
		unlockStoryFrame(actionName);
	});

	useUpdateEffect(() => {
		unlockStoryFrame(actionName);
	}, [actionName]);
}

export function VectorToUDim2(vector: Vector2 | Binding<Vector2>) {
	if (typeIs(vector, "Vector2")) {
		return UDim2.fromOffset(vector.X, vector.Y);
	} else {
		return vector.map((v) => UDim2.fromOffset(v.X, v.Y));
	}
}

export function useShapeInfo(component: GuiObject) {
	const [position, setPosition] = useBinding(component.AbsolutePosition);
	const [size, setSize] = useBinding(component.AbsoluteSize);

	useEffect(() => {
		const updater = RunService.RenderStepped.Connect(() => {
			const position = component.AbsolutePosition;
			setPosition(new Vector2(math.ceil(position.X), math.ceil(position.Y)));
			setSize(component.AbsoluteSize);
		});
		return () => updater.Disconnect();
	}, [component]);

	return CreateTuple(position, size);
}
