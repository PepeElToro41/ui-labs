import Roact from "@rbxts/roact";
import { useState, useMemo, useContext, useEffect, useCallback } from "@rbxts/roact-hooked";
import { _UILabsInternal as UL } from "@rbxts/ui-labs/out/Internal";
import { ControlBinder } from "Utils/ControlsUtil";
import Signal from "Utils/Signal";

declare global {
	interface ActionContextType {
		ActionsData: ActionsData;
		ActionsAPI: ActionsAPI;
	}
	interface ActionsData {
		Sumary: SummaryType | undefined;
		Controls: UL.SetRuntimeControls | undefined;
	}
	interface ActionsAPI {
		SetSummary: (newSummary: SummaryType | undefined) => void;
		SetControls: (newControls: UL.SetControls | undefined) => UL.SetRuntimeControls | undefined;
		ReloadControls: Signal<() => void>;
	}
	type SummaryType = { StoryName: string; Summary: string };
}

function AddControlBindings(controls: UL.SetControls): UL.SetRuntimeControls {
	const newControls: UL.SetRuntimeControls = {};
	for (const [key, control] of pairs(controls)) {
		const newBinder = new ControlBinder(control);
		const newControl = {
			...control,
			Bind: newBinder,
		} as UL.RuntimeControls;
		newControls[key] = newControl;
	}
	return newControls;
}
function DestroyControlBindings(controls: UL.SetRuntimeControls) {
	for (const [, control] of pairs(controls)) {
		control.Bind.Destroy();
	}
}

export const useActions = () => {
	const [summary, _setSummary] = useState<SummaryType | undefined>(undefined);
	const [controls, _setControls] = useState<UL.SetRuntimeControls | undefined>(undefined);
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
	const SetControls = useCallback((newControls: UL.SetControls | undefined) => {
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
