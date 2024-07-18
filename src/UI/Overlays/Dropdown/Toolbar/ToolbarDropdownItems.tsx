import React from "@rbxts/react";
import { Counter } from "Utils/NumberUtils";
import DropdownEntry from "../DropdownEntry";
import { useToolsContext } from "Context/ToolsContext";
import { useOverlayAction } from "UI/Overlays/Utils";

interface ToolbarDropdownItemsProps {
	OrderStart: number;
}

function ToolbarDropdownItems(props: ToolbarDropdownItemsProps) {
	const toolbar = useToolsContext();
	const anchored = toolbar.ToolbarPosition === "Anchored";
	const count = Counter(props.OrderStart);

	const OnAnchorToolbar = useOverlayAction(() => {
		toolbar.SetToolbarPosition(toolbar.ToolbarPosition === "Anchored" ? "Floating" : "Anchored");
	}, [toolbar.ToolbarPosition]);

	return (
		<React.Fragment>
			<DropdownEntry LayoutOrder={count()} Text={"Toolbar Anchored"} OnClick={OnAnchorToolbar} Active={anchored} />
		</React.Fragment>
	);
}

export default ToolbarDropdownItems;
