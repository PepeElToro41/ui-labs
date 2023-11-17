import Roact from "@rbxts/roact";
import { useCallback, withHooks } from "@rbxts/roact-hooked";
import Dropdown from ".";
import DropdownEntry from "./DropdownEntry";
import { Counter } from "Utils/NumberUtils";
import { Selection } from "@rbxts/services";
import { useProducer, useSelector } from "@rbxts/roact-reflex";
import Divisor from "UI/Utils/Divisor";
import Padding from "UI/Styles/Padding";
import { selectMountAmount } from "Reflex/StoryPreview/StoryMount";
import { useOverlayAction } from "../Utils";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";

interface StoryDropdownProps {
	Position: UDim2 | Roact.Binding<UDim2>;
	Node: StoryNode;
}

function StoryDropdownCreate(props: StoryDropdownProps) {
	const { mountOnViewport, mountStory, mountOnTop, unmountByModule } = useProducer<RootProducer>();
	const mountAmount = useSelector(selectMountAmount(props.Node.Module));
	const count = Counter();
	const plugin = usePlugin();

	const deps = [props.Node];
	const module = props.Node.Module;

	const OnViewStory = useOverlayAction(() => mountStory(module), deps);
	const OnMountOnTop = useOverlayAction(() => mountOnTop(module), deps);
	const OnMountInWidget = useOverlayAction(() => mountOnViewport(module), deps);

	const OnSelectModule = useOverlayAction(() => Selection.Set([module]), deps);
	const OnUnmountAll = useOverlayAction(() => unmountByModule(module), deps);

	return (
		<Dropdown Key={"StoryDropdown"} Position={props.Position}>
			<DropdownEntry Text="Mount Story" OnClick={OnViewStory} LayoutOrder={count()} />
			<DropdownEntry Text="Mount On Top" OnClick={OnMountOnTop} LayoutOrder={count()} />
			<DropdownEntry Text="Mount In Widget" Disabled={!plugin} OnClick={OnMountInWidget} LayoutOrder={count()} />
			<Divisor Order={count()} />
			<DropdownEntry Text="Ummount All" Disabled={!(mountAmount > 0)} OnClick={OnUnmountAll} LayoutOrder={count()} />
			<DropdownEntry Text="Select Module" OnClick={OnSelectModule} LayoutOrder={count()} />
		</Dropdown>
	);
}
const StoryDropdown = withHooks(StoryDropdownCreate);

export = StoryDropdown;
