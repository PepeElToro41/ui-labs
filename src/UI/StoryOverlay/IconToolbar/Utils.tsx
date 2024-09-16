import React, { useMemo } from "@rbxts/react";
import { useMouseOffset } from "Hooks/Context/UserInput";
import { ToolButtonType, ToolButtonsList } from "./ToolButtonsList";
import { useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import ToolbarButtonDropdown from "UI/Overlays/Dropdown/Toolbar/ToolbarButtonDropdown";
import { ToolsButtonActive, useToolsContext } from "Context/ToolsContext";
import EmptyFiller from "./EmptyFiller";

export function useButtonDropdown() {
	const mouseOffset = useMouseOffset();
	const { setPopup } = useProducer<RootProducer>();

	const ShowDropdown = useCallback(
		(buttonType: ToolButtonType) => {
			const offset = mouseOffset.getValue();
			setPopup(buttonType + "Dropdown", <ToolbarButtonDropdown Position={offset} ButtonName={buttonType} />, "ButtonDropdown");
		},
		[mouseOffset],
	);

	return ShowDropdown;
}

function GetTotalButtons(buttonsActive: ToolsButtonActive) {
	let total = 0;
	ToolButtonsList.forEach((buttonInfo) => {
		if (buttonsActive[buttonInfo.Name]) {
			total += 1;
		}
	});
	return total;
}

export function useButtonElements(PreviewEntry: PreviewEntry) {
	const setButtonDropdown = useButtonDropdown();
	const context = useToolsContext();
	const buttonsActive = context.ToolButtonsActive;

	const buttonElements = useMemo(() => {
		const elements = new Map<string, JSX.Element>();
		const total = GetTotalButtons(buttonsActive);

		if (total <= 0) {
			elements.set("EmptyFiller", <EmptyFiller LayoutOrder={ToolButtonsList.size()} />);
		}

		ToolButtonsList.forEach((buttonInfo, index) => {
			const active = buttonsActive[buttonInfo.Name];
			if (!active) return;

			const Render = buttonInfo.Render;
			const element = (
				<Render
					ButtonName={buttonInfo.Name}
					PreviewEntry={PreviewEntry}
					Order={index * 2}
					OnRightClick={() => setButtonDropdown(buttonInfo.Name)}
				/>
			);
			elements.set(buttonInfo.Name, element);
		});

		return elements;
	}, [PreviewEntry, buttonsActive]);

	return buttonElements;
}
