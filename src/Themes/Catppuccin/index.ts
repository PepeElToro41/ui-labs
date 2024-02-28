import { Frappe, Latte, Macchiato, Mocha } from "@rbxts/catppuccin";
import { Darken } from "@rbxts/colour-utils";

type CatppuchinePalette = typeof Frappe;

function CatppuchineTheme(palette: CatppuchinePalette) {
	const theme: Theme = {
		PureColor: {
			Color: new Color3(1, 1, 1),
			Inverse: palette.Base,
		},
		Text: {
			Color: palette.Text,
			Disabled: palette.Overlay0,
			Inverted: palette.Crust,
		},
		Icon: {
			Color: palette.Text,
			Active: palette.Sapphire,
			Disabled: palette.Subtext0,
		},
		Divisor: {
			Color: palette.Subtext1,
			Transparency: 0.7,
		},
		Topbar: {
			Color: palette.Crust,
			Logo: palette.Mauve,
		},
		Search: {
			Color: palette.Surface0,
			Placeholder: palette.Overlay2,
		},
		SidePanel: palette.Mantle,
		StoryPanel: {
			Color: palette.Base,
			PatternColor: palette.Lavender,
			PatternTransparency: 0.95,
		},
		ActionsPanel: {
			Color: palette.Base,
			TabsBackground: palette.Crust,
			TabHover: palette.Mantle,
		},
		StoryPreview: {
			Background: palette.Base,
			Color: palette.Surface1,
			Selected: palette.Sapphire,
			TextSelected: palette.Crust,
			CloseButton: palette.Red,
		},
		Nodes: {
			Normal: {
				Color: palette.Surface0,
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
					Color: palette.Base,
					Disabled: palette.Surface1,
				},
			},
		},
		Dropdown: {
			Color: palette.Crust,
			TextHover: palette.Base,
		},
		Controls: {
			Boolean: {
				SwitchBackOn: palette.Surface1,
				SwitchBackOff: palette.Surface1,
				SwitchOff: palette.Base,
				SwitchOn: palette.Green,
			},
			List: {
				Frame: palette.Crust,
				FrameHovered: palette.Surface0,
			},
		},
	};
	return theme;
}

export const CatppuchineLatte = CatppuchineTheme(Latte);
export const CatppuchineFrappe = CatppuchineTheme(Frappe);
export const CatppuchineMacchiato = CatppuchineTheme(Macchiato);
export const CatppuchineMocha = CatppuchineTheme(Mocha);
