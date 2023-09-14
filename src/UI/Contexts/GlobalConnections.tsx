import Roact, { PropsWithChildren } from "@rbxts/roact";
import { useContext, useMemo, withHooks } from "@rbxts/roact-hooked";
import Signal from "Utils/Signal";

export interface GlobalConnectionsType {
	MouseMoved: Signal<(position: Vector2) => void>;
	Toolbar: {
		Reload: Signal<() => void>;
		ZoomIn: Signal<() => void>;
		ZoomOut: Signal<() => void>;
		InViewport: Signal<(enabled: boolean) => void>;
		Explore: Signal<() => void>;
		Measure: Signal<(enabled: boolean) => void>;
	};
}

const useGlobalConnections = () => {
	const GlobalConnections = useMemo<GlobalConnectionsType>(() => {
		return {
			MouseMoved: new Signal<(position: Vector2) => void>(),
			Toolbar: {
				Reload: new Signal(),
				ZoomIn: new Signal(),
				ZoomOut: new Signal(),
				InViewport: new Signal<(enabled: boolean) => void>(),
				Explore: new Signal(),
				Measure: new Signal(),
			},
		};
	}, []);
	return GlobalConnections;
};
const GlobalConnectionsContext = Roact.createContext<GlobalConnectionsType | undefined>(undefined);

interface GlobalConnectionsProps extends PropsWithChildren {}

const GlobalConnectionsCreate = (props: GlobalConnectionsProps) => {
	const GlobalConnections = useGlobalConnections();
	return (
		<GlobalConnectionsContext.Provider value={GlobalConnections}>{props[Roact.Children]}</GlobalConnectionsContext.Provider>
	);
};

export const GlobalConnections = withHooks(GlobalConnectionsCreate);
export const useConnections = () => {
	return useContext(GlobalConnectionsContext)!;
};
