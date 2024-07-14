import React, { useMemo } from "@rbxts/react";
import { useMouseOffset } from "Hooks/Context/UserInput";
import { ToolButtonType, ToolButtonsList } from "./ToolButtonsList";
import { useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import ToolbarButtonDropdown from "UI/Overlays/Dropdown/Toolbar/ToolbarButtonDropdown";

export function useButtonDropdown() {
	const mouseOffset = useMouseOffset();
	const { setOverlay } = useProducer<RootProducer>();

	const ShowDropdown = useCallback(
		(buttonType: ToolButtonType) => {
			const offset = mouseOffset.getValue();
			setOverlay(buttonType + "Dropdown", <ToolbarButtonDropdown Position={offset} ButtonName={buttonType} />, "ButtonDropdown");
		},
		[mouseOffset],
	);

	return ShowDropdown;
}

export function useButtonElements(PreviewEntry: PreviewEntry) {
	const setButtonDropdown = useButtonDropdown();

	const buttonElements = useMemo(() => {
		const elements = new Map<string, JSX.Element>();

		ToolButtonsList.forEach((buttonInfo, index) => {
			const Render = buttonInfo.Render;
			const element = (
				<Render
					ButtonName={buttonInfo.Name}
					PreviewEntry={PreviewEntry}
					Order={index}
					OnRightClick={() => setButtonDropdown(buttonInfo.Name)}
				/>
			);
			elements.set(buttonInfo.Name, element);
		});
		return elements;
	}, [PreviewEntry]);

	return buttonElements;
}
