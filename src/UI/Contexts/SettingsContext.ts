import Roact from "@rbxts/roact";
import { useContext } from "@rbxts/roact-hooked";

export const SettingsContext = Roact.createContext<UILabsSettings | undefined>(undefined);

export const useSettingsContext = () => {
	return useContext(SettingsContext)!;
};
