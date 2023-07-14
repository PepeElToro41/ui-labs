import { useMemo } from "@rbxts/roact-hooked";

const Dropdowns: Record<string, Dropdown.IsTopGroup[]> = {};

Dropdowns.Actions = [
	{
		GroupName: "Main",
		Actions: [
			{
				ActionName: "CreateStorybook",
				ActionLabel: "Storybook from Selected",
				ActionHandler: () => {
					print("TRYING TO");
				},
			},
		],
	},
];

export = Dropdowns;
