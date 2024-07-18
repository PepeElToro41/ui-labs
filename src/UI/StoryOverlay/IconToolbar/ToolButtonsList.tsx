import Reload from "./Buttons.tsx/Reload";
import ZoomIn from "./Buttons.tsx/ZoomIn";
import ZoomOut from "./Buttons.tsx/ZoomOut";
import Viewport from "./Buttons.tsx/Viewport";
import Explorer from "./Buttons.tsx/Explorer";

type ToolButtonsList = typeof ToolButtonsList;
export type ToolButtonType = ToolButtonsList[number]["Name"];

export interface ToolButtonProps {
	OnRightClick: () => void;

	PreviewEntry: PreviewEntry;
	ButtonName: ToolButtonType;
	Order: number;
}

interface ButtonListEntry {
	Name: ToolButtonType;
	DisplayName: string;
	Render: (props: ToolButtonProps) => JSX.Element;
}

export const ToolButtonsList = [
	{ Name: "Reload", Render: Reload, DisplayName: "Reload" },
	{ Name: "ZoomIn", Render: ZoomIn, DisplayName: "Zoom In" },
	{ Name: "ZoomOut", Render: ZoomOut, DisplayName: "Zoom Out" },
	{ Name: "ViewOnViewport", Render: Viewport, DisplayName: "View On Viewport" },
	{ Name: "ViewOnExplorer", Render: Explorer, DisplayName: "View On Explorer" },
] as const;

export const ToolButtonNames = ToolButtonsList.reduce(
	(old, button) => {
		old[button.Name] = button;
		return old;
	},
	{} as Record<ToolButtonType, ButtonListEntry>,
);
