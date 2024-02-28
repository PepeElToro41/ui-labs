import { useUpdate } from "@rbxts/pretty-react-hooks";
import Roact, { PropsWithChildren, useMemo } from "@rbxts/roact";
import { LifetimeController } from "./LifetimeController";

interface LifetimeComponentProps extends PropsWithChildren {}

function LifetimeComponent(props: LifetimeComponentProps) {
	const rerender = useUpdate();
	const controller = useMemo(() => new LifetimeController(), []);
	controller.SetUpdater(rerender);

	const children = props["children"] ?? new Map();
	controller.ProcessChildren(children);
	const comps = controller.RenderComponents();
	return <Roact.Fragment>{comps}</Roact.Fragment>;
}

export default LifetimeComponent;
