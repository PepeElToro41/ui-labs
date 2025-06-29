import React from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import {
	selectClearOutputOnReload,
	selectKeepViewOnViewport,
	selectShortcutsEnabled,
	selectStudioMode
} from "Reflex/PluginSettings";
import { selectStoryPreviews } from "Reflex/StoryPreview";
import Divisor from "UI/Utils/Divisor";
import Dropdown from ".";
import { useOverlayAction } from "../Utils";
import DropdownEntry from "./DropdownEntry";

interface OptionsDropdownProps {
	Position: UDim2 | React.Binding<UDim2>;
}

function OptionsDropdown(props: OptionsDropdownProps) {
	const themeName = useTheme().ThemeName;

	const shortcutsEnabled = useSelector(selectShortcutsEnabled);
	const keepViewOnViewport = useSelector(selectKeepViewOnViewport);
	const clearOutputOnReload = useSelector(selectClearOutputOnReload);
	const studioMode = useSelector(selectStudioMode);
	const previews = useSelector(selectStoryPreviews);

	const {
		toggleShortcutsEnabled,
		toggleKeepViewOnViewport,
		toggleClearOutputOnReload,
		toggleStudioMode,
		recomputeStorybooks,
		setThemeIndex
	} = useProducer<RootProducer>();

	const RegenerateExplorer = useOverlayAction(() => {
		recomputeStorybooks();
	}, [previews]);
	const ReloadAllStories = useOverlayAction(() => {
		previews.forEach((entry) => {
			if (!entry.HotReloader) return;
			entry.HotReloader.Reload();
		});
	}, [previews]);

	const OnSetShortcutsEnabled = useOverlayAction(toggleShortcutsEnabled, []);
	const OnSetKeepViewOnViewport = useOverlayAction(
		toggleKeepViewOnViewport,
		[]
	);
	const OnSetClearOutputOnReload = useOverlayAction(
		toggleClearOutputOnReload,
		[]
	);
	const OnSetStudioMode = useOverlayAction(toggleStudioMode, []);

	const SetDarkTheme = useOverlayAction(() => setThemeIndex("Dark"), []);
	const SetCatppuchineMacchiatoTheme = useOverlayAction(
		() => setThemeIndex("CatppuchineMacchiato"),
		[]
	);
	const SetCatppuchineMochaTheme = useOverlayAction(
		() => setThemeIndex("CatppuchineMocha"),
		[]
	);
	const SetCatppuchineLatteTheme = useOverlayAction(
		() => setThemeIndex("CatppuchineLatte"),
		[]
	);
	const SetSourTheme = useOverlayAction(() => setThemeIndex("Sour"), []);

	return (
		<Dropdown Position={props.Position} Width={230}>
			<DropdownEntry
				Text="Regenerate Storybooks"
				OnClick={RegenerateExplorer}
			/>
			<DropdownEntry Text="Reload All Stories" OnClick={ReloadAllStories} />
			<Divisor Direction="X" />
			<DropdownEntry
				Text="Keep: View In Viewport"
				Active={keepViewOnViewport}
				OnClick={OnSetKeepViewOnViewport}
			/>
			<DropdownEntry
				Text="Shortcuts Enabled"
				Active={shortcutsEnabled}
				OnClick={OnSetShortcutsEnabled}
			/>
			<DropdownEntry
				Text="Clear Output On Reload"
				Active={clearOutputOnReload}
				OnClick={OnSetClearOutputOnReload}
			/>
			<DropdownEntry
				Text="Studio Mode"
				Active={studioMode}
				OnClick={OnSetStudioMode}
			/>
			<Divisor Direction="X" />
			<DropdownEntry
				Text="Theme: Dark"
				Active={themeName === "Dark"}
				OnClick={SetDarkTheme}
			/>
			<DropdownEntry
				Text="Theme: Macchiato"
				Active={themeName === "CatppuchineMacchiato"}
				OnClick={SetCatppuchineMacchiatoTheme}
			/>
			<DropdownEntry
				Text="Theme: Mocha"
				Active={themeName === "CatppuchineMocha"}
				OnClick={SetCatppuchineMochaTheme}
			/>
			<DropdownEntry
				Text="Theme: Latte"
				Active={themeName === "CatppuchineLatte"}
				OnClick={SetCatppuchineLatteTheme}
			/>
			<DropdownEntry
				Text="Theme: Sour"
				Active={themeName === "Sour"}
				OnClick={SetSourTheme}
			/>
		</Dropdown>
	);
}

export default OptionsDropdown;
