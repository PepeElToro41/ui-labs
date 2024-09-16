import React from "@rbxts/react";
import { Counter } from "Utils/NumberUtils";
import DropdownEntry from "../DropdownEntry";
import { useToolsContext } from "Context/ToolsContext";
import { useOverlayAction } from "UI/Overlays/Utils";
import { ToolButtonsList, ToolButtonType } from "UI/StoryOverlay/IconToolbar/ToolButtonsList";
import Divisor from "UI/Utils/Divisor";

interface ToolbarDropdownItemsProps {
	OrderStart: number;
}

function ToolbarDropdownItems(props: ToolbarDropdownItemsProps) {
	const toolbar = useToolsContext();
	const buttonsActive = toolbar.ToolButtonsActive;
	const anchored = toolbar.ToolbarPosition === "Anchored";
	const count = Counter(props.OrderStart);

	const OnAnchorToolbar = useOverlayAction(() => {
		toolbar.SetToolbarPosition(toolbar.ToolbarPosition === "Anchored" ? "Floating" : "Anchored");
	}, [toolbar.ToolbarPosition]);

	const OnHideButtonType = useOverlayAction(
		(buttonType: ToolButtonType) => {
			toolbar.SetToolButtonsActive({
				...buttonsActive,
				[buttonType]: !buttonsActive[buttonType],
			});
		},
		[toolbar],
	);

	const GenerateButtons = () => {
		const elements: React.Element[] = [];
		ToolButtonsList.forEach((buttonInfo, index) => {
			const buttonName = buttonInfo.DisplayName;
			const active = buttonsActive[buttonInfo.Name];
			elements.push(
				<DropdownEntry LayoutOrder={count()} Text={buttonName} Active={active} OnClick={() => OnHideButtonType(buttonInfo.Name)} />,
			);
		});
		return elements;
	};

	return (
		<React.Fragment>
			{GenerateButtons()}
			<Divisor Direction="X" Order={count()} />
			<DropdownEntry LayoutOrder={count()} Text={"Toolbar Anchored"} OnClick={OnAnchorToolbar} Active={anchored} />
			<DropdownEntry LayoutOrder={count()} Text={"Shortcuts Enabled"} OnClick={OnAnchorToolbar} Active={anchored} />
		</React.Fragment>
	);
}

export default ToolbarDropdownItems;
