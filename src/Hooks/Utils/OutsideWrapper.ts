import { Binding, useBinding, useCallback, useEffect, useState } from "@rbxts/react";
import { useAppHolder } from "./AppHolder";
import { Lerp } from "Utils/NumberUtils";
import { RunService } from "@rbxts/services";
import { CreateTuple } from "Utils/MiscUtils";

type PropertySet<T> = T | Binding<T>;
type VectorLike = PropertySet<Vector2> | PropertySet<UDim2>;

type CheckDirection = "X" | "Y" | "XY";

export function GetVector(vector: VectorLike) {
	if (typeIs(vector, "Vector2")) {
		return vector;
	} else if (typeIs(vector, "UDim2")) {
		return new Vector2(vector.X.Offset, vector.Y.Offset);
	} else {
		const val = vector.getValue();
		return GetVector(val);
	}
}
//Checks if something is outside of the bounds of the app (usefull for flipping guis)
export function useOutsideCheck(position: VectorLike, size: VectorLike) {
	const holder = useAppHolder();

	const OutsideCheck = useCallback(
		(anchor: Vector2, check: CheckDirection = "XY") => {
			if (!holder) return false;
			const holderSize = holder.AbsoluteSize;

			const direction = new Vector2(Lerp(1, -1, anchor.X), Lerp(1, -1, anchor.Y));
			const extend = GetVector(size).mul(direction);
			const corner = GetVector(position).add(extend);

			if (check !== "Y") {
				if (corner.X > holderSize.X && direction.X > 0) return true;
				if (corner.X < 0 && direction.X < 0) return true;
			}
			if (check !== "X") {
				if (corner.Y > holderSize.Y && direction.Y > 0) return true;
				if (corner.Y < 0 && direction.Y < 0) return true;
			}
			return false;
		},
		[holder, position, size]
	);

	return OutsideCheck;
}

export function useOverlayWrap(position: VectorLike, anchor: Vector2, direction?: CheckDirection) {
	const [size, setSize] = useBinding(Vector2.zero);
	const [wrapped, setWrapped] = useState(false);
	const OutsideCheck = useOutsideCheck(position, size);

	const OnAbsoluteSizeChanged = useCallback((item: GuiBase2d) => {
		setSize(item.AbsoluteSize);
	}, []);

	useEffect(() => {
		const connection = RunService.PreRender.Connect(() => {
			const isOutside = OutsideCheck(anchor, direction);
			setWrapped(isOutside);
		});
		return () => connection.Disconnect();
	}, [OutsideCheck, direction, anchor]);

	return CreateTuple(wrapped, OnAbsoluteSizeChanged);
}
export function useOverlayWrapXY(position: VectorLike, anchor: Vector2) {
	const [wrappedX, OnAbsoluteSizeChangedX] = useOverlayWrap(position, anchor, "X");
	const [wrappedY, OnAbsoluteSizeChangedY] = useOverlayWrap(position, anchor, "Y");

	const OnAbsoluteSizeChanged = useCallback((item: GuiBase2d) => {
		OnAbsoluteSizeChangedX(item);
		OnAbsoluteSizeChangedY(item);
	}, []);

	return CreateTuple(wrappedX, wrappedY, OnAbsoluteSizeChanged);
}
