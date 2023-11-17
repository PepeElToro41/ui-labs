import { Frappe, Latte, Macchiato, Mocha } from "@rbxts/catppuccin";
import { Darken } from "@rbxts/colour-utils";
import { Divisor } from "Themes/DarkThemes/Dark";

type CatppuchinePalette = typeof Frappe;

function CatppuchineTheme(palette: CatppuchinePalette) {
	const ReturnTheme: Theme = {
		PureColor: {
			Color: new Color3(1, 1, 1),
			Inverse: palette.Base,
		},
		Text: {
			Color: palette.Text,
			Disabled: palette.Subtext0,
			Inverted: palette.Crust,
		},
		Icon: {
			Color: palette.Text,
			Disabled: palette.Subtext0,
		},
		Divisor: {
			Color: palette.Subtext0,
			Transparency: 0.7,
		},
		Topbar: {
			Color: palette.Crust,
			Logo: palette.Mauve,
		},
		Search: {
			Color: palette.Surface0,
			Placeholder: palette.Subtext0,
			Stroke: palette.Text,
			StrokeTransparency: 0.3,
		},
		SidePanel: palette.Mantle,
		StoryPanel: {
			Color: palette.Base,
			PatternColor: palette.Lavender,
			PatternTransparency: 0.95,
		},
		ActionsPanel: {
			Color: palette.Crust,
			TabsBackground: palette.Base,
			TabHover: palette.Surface0,
		},
		StoryPreview: {
			Color: Color3.fromRGB(31, 41, 64),
			Selected: palette.Sapphire,
			TextSelected: palette.Crust,
		},
		StoryTitle: {
			Color: Color3.fromRGB(39, 39, 39),
			Path: {
				Underline: Color3.fromRGB(120, 190, 120),
				PathText: Color3.fromRGB(120, 190, 120),
				ButtonColor: Color3.fromRGB(89, 89, 99),
			},
		},
		Nodes: {
			Normal: {
				Color: Color3.fromRGB(82, 82, 92),
				Disabled: Color3.fromRGB(54, 54, 59),
				StoryIcon: {
					Color: palette.Sapphire,
					Disabled: Darken(palette.Sapphire, 0.35),
				},
				FolderIcon: {
					Color: palette.Pink,
					Disabled: Darken(palette.Pink, 0.35),
				},
				Book: palette.Green,
			},
			StorySelected: {
				Color: palette.Sapphire,
				Disabled: Darken(palette.Sapphire, 0.35),
				StoryIcon: {
					Color: palette.Crust,
					Disabled: palette.Base,
				},
				Text: {
					Color: palette.Crust,
					Disabled: palette.Base,
				},
			},
		},
		Dropdown: {
			Color: palette.Crust,
			TextHover: palette.Text,
		},
	};
	return ReturnTheme;
}

export const CatppuchineLatte = CatppuchineTheme(Latte);
export const CatppuchineFrappe = CatppuchineTheme(Frappe);
export const CatppuchineMacchiato = CatppuchineTheme(Macchiato);
export const CatppuchineMocha = CatppuchineTheme(Mocha);
