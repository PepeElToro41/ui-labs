import React from "@rbxts/react";
import {
	useProducer,
	useSelector,
	useSelectorCreator
} from "@rbxts/react-reflex";
import { Selection } from "@rbxts/services";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";
import Configs from "Plugin/Configs";
import { selectKeepViewOnViewport } from "Reflex/PluginSettings";
import { selectMountAmount, selectPreview } from "Reflex/StoryPreview";
import Divisor from "UI/Utils/Divisor";
import { Counter } from "Utils/NumberUtils";
import Dropdown from ".";
import { useOverlayAction } from "../Utils";
import DropdownEntry from "./DropdownEntry";

interface StoryDropdownProps {
	Position: UDim2 | React.Binding<UDim2>;
	Node: StoryNode;
}

function StoryDropdown(props: StoryDropdownProps) {
	const { mountOnWidget, mountStory, mountOnTop, unmountByModule } =
		useProducer<RootProducer>();
	const keepViewOnViewport = useSelector(selectKeepViewOnViewport);
	const mountAmount = useSelectorCreator(selectMountAmount, props.Node.Module);
	const rootEntry = useSelectorCreator(selectPreview, Configs.RootPreviewKey);

	const count = Counter();
	const plugin = usePlugin();
	const isAlreadyMounted = rootEntry
		? rootEntry.Module === props.Node.Module
		: false;

	const deps = [props.Node, keepViewOnViewport];
	const module = props.Node.Module;

	const OnViewStory = useOverlayAction(
		() => mountStory(module, keepViewOnViewport),
		deps
	);
	const OnMountOnTop = useOverlayAction(() => mountOnTop(module), deps);
	const OnMountOnWidget = useOverlayAction(() => mountOnWidget(module), deps);

	const OnSelectModule = useOverlayAction(() => Selection.Set([module]), deps);
	const OnUnmountAll = useOverlayAction(() => unmountByModule(module), deps);

	return (
		<Dropdown key={"StoryDropdown"} Position={props.Position}>
			<DropdownEntry
				Text="Mount Story"
				Disabled={isAlreadyMounted}
				OnClick={OnViewStory}
				LayoutOrder={count()}
			/>
			<DropdownEntry
				Text="Mount On Top"
				OnClick={OnMountOnTop}
				LayoutOrder={count()}
			/>
			<DropdownEntry
				Text="Mount In Widget"
				Disabled={plugin === undefined}
				OnClick={OnMountOnWidget}
				LayoutOrder={count()}
			/>
			<Divisor Order={count()} />
			<DropdownEntry
				Text="Unmount All"
				Disabled={!(mountAmount > 0)}
				OnClick={OnUnmountAll}
				LayoutOrder={count()}
			/>
			<DropdownEntry
				Text="Select Module"
				OnClick={OnSelectModule}
				LayoutOrder={count()}
			/>
		</Dropdown>
	);
}

export default StoryDropdown;
