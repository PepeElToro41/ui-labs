import Roact from "@rbxts/roact";
import Dropdown from ".";
import DropdownEntry from "./DropdownEntry";
import { Counter } from "Utils/NumberUtils";
import { Selection } from "@rbxts/services";
import { useProducer, useSelectorCreator } from "@rbxts/react-reflex";
import Divisor from "UI/Utils/Divisor";
import { selectMountAmount, selectPreview } from "Reflex/StoryPreview/StoryMount";
import { useOverlayAction } from "../Utils";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";
import Configs from "Plugin/Configs";

interface StoryDropdownProps {
	Position: UDim2 | Roact.Binding<UDim2>;
	Node: StoryNode;
}

function StoryDropdown(props: StoryDropdownProps) {
	const { mountOnWidget, mountStory, mountOnTop, unmountByModule } = useProducer<RootProducer>();
	const mountAmount = useSelectorCreator(selectMountAmount, props.Node.Module);
	const rootEntry = useSelectorCreator(selectPreview, Configs.RootPreviewKey);

	const count = Counter();
	const plugin = usePlugin();
	const isAlreadyMounted = rootEntry ? rootEntry.Module === props.Node.Module : false;

	const deps = [props.Node];
	const module = props.Node.Module;

	const OnViewStory = useOverlayAction(() => mountStory(module), deps);
	const OnMountOnTop = useOverlayAction(() => mountOnTop(module), deps);
	const OnMountOnWidget = useOverlayAction(() => mountOnWidget(module), deps);

	const OnSelectModule = useOverlayAction(() => Selection.Set([module]), deps);
	const OnUnmountAll = useOverlayAction(() => unmountByModule(module), deps);

	return (
		<Dropdown Key={"StoryDropdown"} Position={props.Position}>
			<DropdownEntry Text="Mount Story" Disabled={isAlreadyMounted} OnClick={OnViewStory} LayoutOrder={count()} />
			<DropdownEntry Text="Mount On Top" OnClick={OnMountOnTop} LayoutOrder={count()} />
			<DropdownEntry Text="Mount In Widget" Disabled={plugin === undefined} OnClick={OnMountOnWidget} LayoutOrder={count()} />
			<Divisor Order={count()} />
			<DropdownEntry Text="Ummount All" Disabled={!(mountAmount > 0)} OnClick={OnUnmountAll} LayoutOrder={count()} />
			<DropdownEntry Text="Select Module" OnClick={OnSelectModule} LayoutOrder={count()} />
		</Dropdown>
	);
}

export default StoryDropdown;
