import { useAsyncEffect, useDebounceEffect } from "@rbxts/pretty-roact-hooks";
import { useCallback, useEffect, useState } from "@rbxts/roact-hooked";
import { Copy, Filter } from "Utils/TableUtil";

export const useDescriptor = () => {
	const [descTable, setDescTable] = useState<string[][]>([]);
	//descTable is a table of [index (Button name who activated desc), desct (Desc text, this one can change, even if the button is the same)]
	const [mouseDesc, setMouseDesc] = useState<string | undefined>(undefined);
	const [descVisible, setVisible] = useState(false);
	//Getters
	const GetMouseDesc = useCallback(() => {
		return mouseDesc;
	}, []);
	//Setters
	const SetMouseDesc = useCallback((index: string, desc: string) => {
		const found = descTable.find((v) => v[0] === index);
		if (found) {
			const newTable = descTable.mapFiltered((descTable) => {
				if (descTable[0] === index) {
					return [index, desc];
				} else {
					return [descTable[0], descTable[1]];
				}
			});
			setDescTable(newTable);
		} else {
			const newTable = Copy(descTable);
			newTable.insert(0, [index, desc]);
			setDescTable(newTable);
		}
	}, []);
	const RemoveMouseDesc = useCallback(
		(index: string) => {
			const found = descTable.find((v) => v[0] === index);
			if (found) {
				const newTable = Filter(descTable, (descTable) => descTable[0] !== index);
				setDescTable(newTable);
			}
		},
		[descTable],
	);
	useEffect(() => {
		setVisible(false);
	}, [descTable[0] && descTable[0][0]]);
	useDebounceEffect(
		() => {
			if (mouseDesc === undefined) return;
			setVisible(true);
		},
		[descTable[0] && descTable[0][0]],
		{ wait: 0.5 },
	);

	useEffect(() => {
		setMouseDesc(descTable[0] && descTable[0][1]);
	}, [descTable]);
	return $tuple(mouseDesc, descVisible, GetMouseDesc, SetMouseDesc, RemoveMouseDesc);
};
