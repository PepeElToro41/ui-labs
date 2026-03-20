import { useCallback, useState } from "@rbxts/react";
import { CreateTuple } from "Utils/MiscUtils";

export function useRerender() {
	const [id, setId] = useState({});

	const ReRender = useCallback(() => {
		setId({});
	}, []);

	return CreateTuple(id, ReRender);
}
