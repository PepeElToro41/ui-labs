import { useCallback, useState } from "@rbxts/roact-hooked";

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
	const Set = useCallback((enabled) => {
		setEnabled(enabled);
	}, []);

	const api = {
		enable: Enable,
		disable: Disable,
		toggle: Toggle,
		set: Set,
	};
	return $tuple(enabled, api);
}
