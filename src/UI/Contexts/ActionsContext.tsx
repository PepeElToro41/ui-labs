import Roact from "@rbxts/roact";
import { useState, useMemo, useContext } from "@rbxts/roact-hooked";
import { SetControls } from "Declarations/StoryPreview";

declare global {
	interface ActionContextType {
		ActionsData: ActionsData;
		ActionsAPI: ActionsAPI;
	}
	interface ActionsData {
		Sumary: SummaryType | undefined;
	}
	interface ActionsAPI {
		SetSummary: (newSummary: SummaryType | undefined) => void;
	}
	type SummaryType = { StoryName: string; Summary: string };
}

export const useActions = () => {
	const [summary, _setSummary] = useState<SummaryType | undefined>(undefined);
   const [controls, setControls] = useState<SetControls | undefined>(undefined);
	//--------DATA--------//
	const actionsData = useMemo<ActionsData>(() => {
		return {
			Sumary: summary,
		};
	}, [summary]);
	//--------API--------//
	//Declaration
	const SetSummary = (newSummary: SummaryType | undefined) => {
		_setSummary(newSummary);
	};
   const SetControls = (newControls: SetControls | undefined) => {

   }
	//Api consolidation
	const API = useMemo<ActionsAPI>(() => {
		return {
			SetSummary: SetSummary,
		};
	}, []);
	//Return consolidation
	const setReturn = useMemo(() => {
		return {
			ActionsData: actionsData,
			ActionsAPI: API,
		};
	}, [actionsData, API]);
	return setReturn;
};

export const ActionsContext = Roact.createContext<ActionContextType>(undefined as unknown as ActionContextType);
