import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { useOverlayAction } from "../Utils";
import { useProducer } from "@rbxts/roact-reflex";
import { Counter } from "Utils/NumberUtils";
import Dropdown from ".";
import DropdownEntry from "./DropdownEntry";
import Divisor from "UI/Utils/Divisor";
import { Selection } from "@rbxts/services";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";

interface PreviewDropdownProps {
	Position: UDim2 | Roact.Binding<UDim2>;
	PreviewEntry: PreviewEntry;
}

function PreviewDropdownCreate(props: PreviewDropdownProps) {
	const { unmountStory } = useProducer<RootProducer>();
	const count = Counter();
	const deps = [props.PreviewEntry];
	const module = props.PreviewEntry.Module;
	const plugin = usePlugin();

	const OnUnmount = useOverlayAction(() => unmountStory(props.PreviewEntry.UID), deps);
	const OnReload = useOverlayAction(() => {}, []);
	const OnSelectModule = useOverlayAction(() => Selection.Set([module]), deps);

	return (
		<Dropdown Key={"StoryDropdown"} Position={props.Position}>
			<DropdownEntry Text="Unmount" OnClick={OnUnmount} LayoutOrder={count()} />
			<DropdownEntry Text="Mount In Widget" Disabled={!plugin} OnClick={() => {}} LayoutOrder={count()} />
			<Divisor Order={count()} />
			<DropdownEntry Text="Reload" OnClick={OnReload} LayoutOrder={count()} />
			<DropdownEntry Text="Select Module" OnClick={OnSelectModule} LayoutOrder={count()} />
			<Divisor Order={count()} />
			<DropdownEntry Text="Reset Position" OnClick={OnReload} LayoutOrder={count()} />
			<DropdownEntry Text="Reset Zoom" OnClick={OnSelectModule} LayoutOrder={count()} />
		</Dropdown>
	);
}
const PreviewDropdown = withHooks(PreviewDropdownCreate);

export = PreviewDropdown;
