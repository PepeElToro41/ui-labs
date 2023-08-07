import { useUpdateEffect } from "@rbxts/pretty-roact-hooks";
import { useBinding, useCallback, useEffect, useMemo, useState } from "@rbxts/roact-hooked";
import { RunService, TweenService } from "@rbxts/services";

type TweeneableArray = [number, CFrame, Color3, UDim2, UDim, Vector2int16, Vector2, Vector3, Rect];
type Tweeneable = TweeneableArray[number];
type Widen<T> = T extends number ? number : T;

interface TweenOptions {
	bind?: RunService["Heartbeat"] | RunService["Stepped"] | RunService["RenderStepped"];
}
const defaultTweenOptions: TweenOptions = {
	bind: RunService.Heartbeat,
};
function LerpNumber(alpha: number, startV: number, endV: number) {
	return startV + (endV - startV) * alpha;
}

const tweeners = {
	number: LerpNumber,
	CFrame: (alpha: number, startV: CFrame, endV: CFrame) => startV.Lerp(endV, alpha),
	Color3: (alpha: number, startV: Color3, endV: Color3) => startV.Lerp(endV, alpha),
	UDim2: (alpha: number, startV: UDim2, endV: UDim2) => startV.Lerp(endV, alpha),
	UDim: (alpha: number, startV: UDim, endV: UDim) => {
		return new UDim(LerpNumber(alpha, startV.Scale, endV.Scale), LerpNumber(alpha, startV.Offset, endV.Offset));
	},
	Vector2int16: (alpha: number, startV: Vector2int16, endV: Vector2int16) => {
		return new Vector2int16(LerpNumber(alpha, startV.X, endV.X), LerpNumber(alpha, startV.Y, endV.Y));
	},
	Vector2: (alpha: number, startV: Vector2, endV: Vector2) => startV.Lerp(endV, alpha),
	Vector3: (alpha: number, startV: Vector3, endV: Vector3) => startV.Lerp(endV, alpha),
	Rect: (alpha: number, startV: Rect, endV: Rect) => {
		return new Rect(startV.Min.Lerp(endV.Min, alpha), startV.Max.Lerp(endV.Max, alpha));
	},
};

export function useTween<T extends Tweeneable>(info: TweenInfo, initialValue: Widen<T>, options: TweenOptions = defaultTweenOptions) {
	const [instance] = useState<NumberValue>(new Instance("NumberValue"));
	useEffect(() => {
		return () => {
			if (instance) {
				instance.Destroy();
			}
		};
	}, []);

	const valueType = useMemo(() => typeOf(initialValue), []);
	const [valueBind, setValueBind] = useBinding(initialValue);
	const [goal, setGoal] = useState<[Widen<T>, Widen<T>]>([initialValue, initialValue]);
	useUpdateEffect(() => {
		let connection: RBXScriptConnection | undefined = (options.bind ?? RunService.Heartbeat).Connect(() => {
			const currentAlpha = instance.Value;
			const [startV, endV] = goal;
			if (!(valueType in tweeners)) return;
			const tweener = tweeners[valueType as keyof typeof tweeners];
			const tweenedValue = tweener(currentAlpha, startV as never, endV as never);
			setValueBind(tweenedValue as Widen<T>);
		});
		return () => {
			if (!connection) return;
			connection.Disconnect();
			connection = undefined;
		};
	}, [goal]);

	const tween = useCallback(
		(goal: Widen<T>, animateInfo?: TweenInfo) => {
			setGoal([valueBind.getValue(), goal]);
			instance.Value = 0;
			const newTween = TweenService.Create(instance, animateInfo ?? info, {
				Value: 1,
			});
			newTween.Play();
			return newTween;
		},
		[instance, valueBind],
	);
	const set = useCallback(
		(value: Widen<T>) => {
			instance.Value = 1;
			setValueBind(value);
		},
		[instance, valueBind],
	);

	return $tuple(valueBind, tween, set);
}
