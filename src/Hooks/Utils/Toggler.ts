import { useState, useCallback, useMemo } from "@rbxts/react";

export function useToggler(initial: boolean) {
	const [enabled, setEnabled] = useState(initial);

	const Enable = useCallback(() => {
		setEnabled(true);
	}, []);
	const Disable = useCallback(() => {
		setEnabled(false);
	}, []);
	const Toggle = useCallback(() => {
		setEnabled((v) => !v);
	}, []);

	const api = useMemo(() => {
		return {
			enable: Enable,
			disable: Disable,
			toggle: Toggle,
			set: setEnabled,
		};
	}, []);
	return $tuple(enabled, api);
}
