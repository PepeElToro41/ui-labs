import { useDebounceEffect, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "@rbxts/roact";
import { Array } from "@rbxts/sift";

interface DescriptionInfo {
	Name: string;
	Description: string;
}

interface DescriptionContext {
	ActiveDescription: string | undefined;
	SetDescription: (name: string, description: string) => void;
	RemoveDescription: (name: string) => void;
}

const DescriptionContext = Roact.createContext({} as DescriptionContext);

interface DescriptionProviderProps extends PropsWithChildren {}

export function DescriptionProvider(props: DescriptionProviderProps) {
	const [descriptionArray, setDescriptionArray] = useState<DescriptionInfo[]>([]);
	const [currentDescription, setCurrentDescription] = useState<DescriptionInfo>();
	const [descriptionVisible, setDescriptionVisible] = useState(false);

	const descriptionName = currentDescription && currentDescription.Name;

	const SetDescription = useCallback((name: string, description: string) => {
		setDescriptionArray((oldArray) => {
			const found = oldArray.find((entry) => entry.Name === name) !== undefined;
			if (found) {
				//editing existing entry
				return Array.map(oldArray, (entry) => {
					if (entry.Name === name) {
						return { Name: name, Description: description };
					} else {
						return entry;
					}
				});
			} else {
				//adding new entry
				return Array.insert(oldArray, 1, { Name: name, Description: description });
			}
		});
	}, []);
	const RemoveDescription = useCallback((name: string) => {
		setDescriptionArray((oldArray) => {
			const found = oldArray.find((entry) => entry.Name === name) !== undefined;
			if (!found) return oldArray;

			return Array.filter(oldArray, (entry) => {
				return entry.Name !== name;
			});
		});
	}, []);

	useEffect(() => {
		const first = descriptionArray[0];
		if (!first) setCurrentDescription(undefined);
		setCurrentDescription(first);
	}, [descriptionArray]);

	useEffect(() => {
		setDescriptionVisible(false);
	}, [descriptionName]);
	useDebounceEffect(
		() => {
			if (descriptionName === undefined) return;
			setDescriptionVisible(true);
		},
		[descriptionName],
		{ wait: 0.5 },
	);

	const contextValue = useMemo(() => {
		const isActive = descriptionVisible && currentDescription !== undefined;
		const value: DescriptionContext = {
			ActiveDescription: isActive ? currentDescription.Description : undefined,
			SetDescription: SetDescription,
			RemoveDescription: RemoveDescription,
		};

		return value;
	}, [currentDescription, descriptionVisible]);

	return <DescriptionContext.Provider value={contextValue}>{props["children"]}</DescriptionContext.Provider>;
}

export function useDescriptionInfo() {
	const context = useContext(DescriptionContext);

	return context.ActiveDescription;
}

export function useDescriptionControl() {
	const context = useContext(DescriptionContext);

	const controls = useMemo(() => {
		return { SetDescription: context.SetDescription, RemoveDescription: context.RemoveDescription };
	}, []);

	return controls;
}

export function useDescriptionDisplay(uid: string) {
	const context = useContext(DescriptionContext);

	const DisplayDescription = useCallback((description: string) => context.SetDescription(uid, description), [uid]);
	const RemoveDescription = useCallback(() => context.RemoveDescription(uid), [uid]);

	const values = useMemo(() => {
		return { DisplayDescription, RemoveDescription };
	}, []);

	useUnmountEffect(() => context.RemoveDescription(uid));

	return values;
}
