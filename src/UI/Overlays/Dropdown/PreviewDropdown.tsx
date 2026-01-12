import React from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";
import Configs from "Plugin/Configs";
import { selectStoryPreviews } from "Reflex/StoryPreview";
import { CreateEntrySnapshot, ReloadEntry } from "UI/StoryPreview/Utils";
import Divisor from "UI/Utils/Divisor";
import { Counter } from "Utils/NumberUtils";

import Dropdown from ".";
import { useOverlayAction } from "../Utils";
import DropdownEntry from "./DropdownEntry";

interface PreviewDropdownProps {
	Position: UDim2 | React.Binding<UDim2>;
	PreviewEntry: PreviewEntry;
}

function PreviewDropdown(props: PreviewDropdownProps) {
	const { unmountStory, setMountData, shiftOrderBefore, shiftOrderAfter } = useProducer<RootProducer>();
	const count = Counter();
	const previews = useSelector(selectStoryPreviews);

	const entry = props.PreviewEntry;
	const key = entry.Key;
	const deps = [entry];
	const module = entry.Module;
	const plugin = usePlugin();

	const OnUnmount = useOverlayAction(() => unmountStory(key), deps);
	const OnMountOnWidget = useOverlayAction(() => setMountData(key, { OnWidget: true }), deps);
	const OnMountOnEditor = useOverlayAction(() => setMountData(key, { OnWidget: false }), deps);
	const OnToggleVisible = useOverlayAction(() => setMountData(key, { Visible: !entry.Visible }), deps);
	const OnToggleAutoReload = useOverlayAction(() => setMountData(key, { AutoReload: !entry.AutoReload }), deps);
	const OnOrderBefore = useOverlayAction(() => shiftOrderBefore(key), deps);
	const OnOrderAfter = useOverlayAction(() => shiftOrderAfter(key), deps);

	const OnReload = useOverlayAction(() => ReloadEntry(entry), deps);
	const OnCreateSnapshot = useOverlayAction(() => CreateEntrySnapshot(entry), deps);

	const OnResetZoom = useOverlayAction(() => setMountData(key, { Zoom: 100 }), deps);
	const OnResetPosition = useOverlayAction(() => setMountData(key, { Offset: Vector2.zero }), deps);

	const isRootPreview = key === Configs.RootPreviewKey;
	const isPlugin = plugin !== undefined;

	return (
		<Dropdown key={"StoryDropdown"} Position={props.Position}>
			<DropdownEntry Text="Unmount" OnClick={OnUnmount} LayoutOrder={count()} />
			{entry.OnWidget ? (
				<DropdownEntry Text="Mount In Editor" OnClick={OnMountOnEditor} LayoutOrder={count()} />
			) : (
				<DropdownEntry Text="Mount In Widget" Disabled={!isPlugin} OnClick={OnMountOnWidget} LayoutOrder={count()} />
			)}
			<DropdownEntry Text={entry.Visible ? "Hide" : "Un-hide"} OnClick={OnToggleVisible} LayoutOrder={count()} />
			<Divisor Order={count()} />
			<DropdownEntry Text="Reload" OnClick={OnReload} LayoutOrder={count()} />
			<DropdownEntry Text="Auto Reload" OnClick={OnToggleAutoReload} Active={entry.AutoReload} LayoutOrder={count()} />
			<DropdownEntry Text="Create Snapshot" OnClick={OnCreateSnapshot} LayoutOrder={count()} />
			<Divisor Order={count()} />
			<DropdownEntry Text="Reset Position" OnClick={OnResetPosition} LayoutOrder={count()} />
			<DropdownEntry Text="Reset Zoom" OnClick={OnResetZoom} LayoutOrder={count()} />
			<Divisor Order={count()} />
			<DropdownEntry Text="Move Before" Disabled={entry.Order <= 0} OnClick={OnOrderBefore} LayoutOrder={count()} />
			<DropdownEntry
				Text="Move After"
				Disabled={entry.Order >= previews.size() - 1}
				OnClick={OnOrderAfter}
				LayoutOrder={count()}
			/>
		</Dropdown>
	);
}

export default PreviewDropdown;
