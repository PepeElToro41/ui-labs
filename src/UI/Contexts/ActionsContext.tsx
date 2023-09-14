import Roact from "@rbxts/roact";
import { useState, useMemo, useContext, useEffect, useCallback } from "@rbxts/roact-hooked";
import { __ControlBinder } from "@rbxts/ui-labs/out/ControlsUtil";
import { _UILabsInternal as UL, _UILabsControls as ULC } from "@rbxts/ui-labs/out/Internal";
import Signal from "Utils/Signal";

declare global {
	interface ActionContextType {
		ActionsData: ActionsData;
		ActionsAPI: ActionsAPI;
	}
	interface ActionsData {
		Sumary: SummaryType | undefined;
		Controls: ULC.RuntimeControls | undefined;
	}
	interface ActionsAPI {
		SetSummary: (newSummary: SummaryType | undefined) => void;
		SetControls: (newControls: ULC.CreatedControls | undefined) => ULC.RuntimeControls | undefined;
		ReloadControls: Signal<() => void>;
	}
	type SummaryType = { StoryName: string; Summary: string };
}

export function AddControlBindings(controls: ULC.CreatedControls): ULC.RuntimeControls {
	const newControls: ULC.RuntimeControls = {};
	for (const [key, control] of pairs(controls)) {
		const newControl = AddControlBinding(control);
		newControls[key] = newControl;
	}
	return newControls;
}

export function AddControlBinding(control: ULC.IsAllControls) {
	const newBinder = new __ControlBinder(control);
	const newControl = {
		...control,
		Bind: newBinder,
	} as ULC.IsRuntimeControl;
	return newControl;
}

export function DestroyControlBindings(controls: ULC.RuntimeControls) {
	for (const [, control] of pairs(controls)) {
		control.Bind.Destroy();
	}
}

export const useActions = () => {
	const [summary, _setSummary] = useState<SummaryType | undefined>(undefined);
	const [controls, _setControls] = useState<ULC.RuntimeControls | undefined>(undefined);
	const reloadControls = useMemo(() => {
		return new Signal<() => void>();
	}, []);
	//--------------------//
	//--------DATA--------//
	const actionsData = useMemo<ActionsData>(() => {
		return {
			Sumary: summary,
			Controls: controls,
		};
	}, [summary, controls]);
	//--------API--------//
	//Declaration
	const SetSummary = useCallback((newSummary: SummaryType | undefined) => {
		_setSummary(newSummary);
	}, []);
	const SetControls = useCallback((newControls: ULC.CreatedControls | undefined) => {
		const setControls = newControls ? AddControlBindings(newControls) : undefined;
		_setControls((oldControls) => {
			if (oldControls) DestroyControlBindings(oldControls);
			return setControls;
		});
		return setControls;
	}, []);
	//Api consolidation
	const API = useMemo<ActionsAPI>(() => {
		return {
			SetSummary: SetSummary,
			SetControls: SetControls,
			ReloadControls: reloadControls,
		};
	}, []);
	//Return consolidation
	const setReturn = useMemo<ActionContextType>(() => {
		return {
			ActionsData: actionsData,
			ActionsAPI: API,
		};
	}, [actionsData, API]);
	return setReturn;
};

export const ActionsContext = Roact.createContext<ActionContextType>(undefined as unknown as ActionContextType);
