import { useDebounceEffect, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "@rbxts/react";
import { Array } from "@rbxts/sift";

interface DescriptionInfo {
	Identifier: unknown;
	Description: string;
}

interface DescriptionContext {
	ActiveDescription: string | undefined;
	SetDescription: (identifier: unknown, description: string) => void;
	RemoveDescription: (identifier: unknown) => void;
}

const DescriptionContext = React.createContext({} as DescriptionContext);

interface DescriptionProviderProps extends PropsWithChildren {}

export function DescriptionProvider(props: DescriptionProviderProps) {
	const [descriptionArray, setDescriptionArray] = useState<DescriptionInfo[]>([]);
	const [currentDescription, setCurrentDescription] = useState<DescriptionInfo>();
	const [descriptionVisible, setDescriptionVisible] = useState(false);

	const descriptionName = currentDescription && currentDescription.Identifier;

	const SetDescription = useCallback((identifier: unknown, description: string) => {
		setDescriptionArray((oldArray) => {
			const found = oldArray.find((entry) => entry.Identifier === identifier) !== undefined;
			if (found) {
				//editing existing entry
				return Array.map(oldArray, (entry) => {
					if (entry.Identifier === identifier) {
						return { Identifier: identifier, Description: description };
					} else {
						return entry;
					}
				});
			} else {
				//adding new entry
				return Array.insert(oldArray, 1, { Identifier: identifier, Description: description });
			}
		});
	}, []);
	const RemoveDescription = useCallback((identifier: unknown) => {
		setDescriptionArray((oldArray) => {
			const found = oldArray.find((entry) => entry.Identifier === identifier) !== undefined;
			if (!found) return oldArray;

			return Array.filter(oldArray, (entry) => {
				return entry.Identifier !== identifier;
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
		{ wait: 0.7 },
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

export function useDescriptionDisplay(identifier: unknown) {
	const context = useContext(DescriptionContext);

	const DisplayDescription = useCallback((description: string) => context.SetDescription(identifier, description), [identifier]);
	const RemoveDescription = useCallback(() => context.RemoveDescription(identifier), [identifier]);

	const values = useMemo(() => {
		return { DisplayDescription, RemoveDescription };
	}, []);

	useUnmountEffect(() => context.RemoveDescription(identifier));

	return values;
}
